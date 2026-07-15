import { eq, and, isNull, desc, asc, sql, inArray } from 'drizzle-orm';
import { db } from '../../lib/db.js';
import {
  articles,
  issues,
  volumes,
  journals,
  articleAuthors,
  authors,
  articleCategories,
  categories,
  articleKeywords,
  keywords,
} from '../../db/schema/index.js';

export type DbArticle = typeof articles.$inferSelect;

export interface SearchOptions {
  query?: string;
  journalId?: string;
  volumeId?: string;
  categoryId?: string;
  keyword?: string;
  limit: number;
  offset: number;
}

export class ArticlesRepository {
  /**
   * Find articles using PostgreSQL full-text search with filtering and pagination.
   */
  async findArticles(options: SearchOptions) {
    const conditions: any[] = [isNull(articles.deletedAt), eq(articles.status, 'PUBLISHED')];
    let searchRank: any = null;

    if (options.query && options.query.trim()) {
      const q = options.query.trim();
      conditions.push(sql`to_tsvector('english', coalesce(${articles.title}, '') || ' ' || coalesce(${articles.abstract}, '')) @@ plainto_tsquery('english', ${q})`);
      searchRank = sql`ts_rank(to_tsvector('english', coalesce(${articles.title}, '') || ' ' || coalesce(${articles.abstract}, '')), plainto_tsquery('english', ${q}))`;
    }

    if (options.journalId) {
      conditions.push(eq(articles.journalId, options.journalId));
    }

    if (options.volumeId) {
      conditions.push(eq(articles.volumeId, options.volumeId));
    }

    this.applyRelationshipFilters(conditions, options);

    const selectFields: any = {
      id: articles.id,
      title: articles.title,
      abstract: articles.abstract,
      pdfUrl: articles.pdfUrl,
      coverImageUrl: articles.coverImageUrl,
      doi: articles.doi,
      publishedAt: articles.publishedAt,
      views: articles.views,
      downloads: articles.downloads,
      issueId: articles.issueId,
      issueNumber: issues.issueNumber,
      volumeNumber: volumes.volumeNumber,
      journalTitle: journals.title,
      journalCoverImageUrl: journals.coverImageUrl,
      journalId: journals.id,
    };
    if (searchRank) selectFields.rank = searchRank;

    const whereAnd = and(...conditions);
    const baseQuery = db
      .select(selectFields)
      .from(articles)
      .leftJoin(volumes, eq(articles.volumeId, volumes.id))
      .leftJoin(journals, eq(articles.journalId, journals.id))
      .leftJoin(issues, eq(articles.issueId, issues.id))
      .where(whereAnd);

    const list = searchRank
      ? await baseQuery
          .orderBy(desc(searchRank), desc(articles.publishedAt))
          .limit(options.limit)
          .offset(options.offset)
      : await baseQuery
          .orderBy(desc(articles.publishedAt))
          .limit(options.limit)
          .offset(options.offset);
    const total = await this.countArticles(whereAnd);
    const articlesWithAuthors = await this.attachAuthorsToArticles(list);

    return { articles: articlesWithAuthors, total };
  }

  /**
   * Helper to count articles matching the search criteria.
   */
  private async countArticles(whereClause: any): Promise<number> {
    const countResult = await db
      .select({ count: sql<number>`count(distinct ${articles.id})` })
      .from(articles)
      .leftJoin(volumes, eq(articles.volumeId, volumes.id))
      .leftJoin(journals, eq(articles.journalId, journals.id))
      .leftJoin(issues, eq(articles.issueId, issues.id))
      .where(whereClause);

    return Number(countResult[0]?.count || 0);
  }

  /**
   * Helper to apply category and keyword filters.
   */
  private applyRelationshipFilters(conditions: any[], options: SearchOptions): void {
    if (options.categoryId) {
      conditions.push(
        inArray(
          articles.id,
          db
            .select({ articleId: articleCategories.articleId })
            .from(articleCategories)
            .where(eq(articleCategories.categoryId, options.categoryId))
        )
      );
    }

    if (options.keyword) {
      conditions.push(
        inArray(
          articles.id,
          db
            .select({ articleId: articleKeywords.articleId })
            .from(articleKeywords)
            .innerJoin(keywords, eq(articleKeywords.keywordId, keywords.id))
            .where(eq(keywords.name, options.keyword.trim()))
        )
      );
    }
  }

  /**
   * Helper to attach authors to a list of articles using a batch query.
   */
  private async attachAuthorsToArticles(articleList: any[]): Promise<any[]> {
    if (articleList.length === 0) return [];
    const articleIds = articleList.map((a) => a.id);

    const authorsList = await db
      .select({
        articleId: articleAuthors.articleId,
        authorOrder: articleAuthors.authorOrder,
        author: {
          id: authors.id,
          firstName: authors.firstName,
          lastName: authors.lastName,
        },
      })
      .from(articleAuthors)
      .innerJoin(authors, eq(articleAuthors.authorId, authors.id))
      .where(and(inArray(articleAuthors.articleId, articleIds), isNull(authors.deletedAt)))
      .orderBy(asc(articleAuthors.authorOrder));

    return articleList.map((art) => ({
      ...art,
      authors: authorsList
        .filter((auth) => auth.articleId === art.id)
        .map((auth) => ({
          authorOrder: auth.authorOrder,
          details: auth.author,
        })),
    }));
  }

  /**
   * Find full metadata of an article by its ID.
   */
  async findArticleById(id: string) {
    const result = await db
      .select({
        id: articles.id,
        title: articles.title,
        abstract: articles.abstract,
        pdfUrl: articles.pdfUrl,
      coverImageUrl: articles.coverImageUrl,
        doi: articles.doi,
        publishedAt: articles.publishedAt,
        views: articles.views,
        downloads: articles.downloads,
        issueId: articles.issueId,
        issueNumber: issues.issueNumber,
        volumeNumber: volumes.volumeNumber,
        volumeYear: volumes.year,
        journalId: journals.id,
        journalTitle: journals.title,
      journalCoverImageUrl: journals.coverImageUrl,
      })
      .from(articles)
      .leftJoin(volumes, eq(articles.volumeId, volumes.id))
      .leftJoin(journals, eq(articles.journalId, journals.id))
      .leftJoin(issues, eq(articles.issueId, issues.id))
      .where(and(eq(articles.id, id), eq(articles.status, 'PUBLISHED'), isNull(articles.deletedAt)))
      .limit(1);

    return result[0] || null;
  }

  /**
   * Find authors linked to an article.
   */
  async findAuthorsByArticleId(articleId: string) {
    return db
      .select({
        authorOrder: articleAuthors.authorOrder,
        details: {
          id: authors.id,
          firstName: authors.firstName,
          lastName: authors.lastName,
          institution: authors.institution,
          orcid: authors.orcid,
        },
      })
      .from(articleAuthors)
      .innerJoin(authors, eq(articleAuthors.authorId, authors.id))
      .where(and(eq(articleAuthors.articleId, articleId), isNull(authors.deletedAt)))
      .orderBy(asc(articleAuthors.authorOrder));
  }

  /**
   * Find categories linked to an article.
   */
  async findCategoriesByArticleId(articleId: string) {
    return db
      .select({
        id: categories.id,
        name: categories.name,
      })
      .from(articleCategories)
      .innerJoin(categories, eq(articleCategories.categoryId, categories.id))
      .where(and(eq(articleCategories.articleId, articleId), isNull(categories.deletedAt)));
  }

  /**
   * Find keywords linked to an article.
   */
  async findKeywordsByArticleId(articleId: string) {
    return db
      .select({
        id: keywords.id,
        name: keywords.name,
      })
      .from(articleKeywords)
      .innerJoin(keywords, eq(articleKeywords.keywordId, keywords.id))
      .where(and(eq(articleKeywords.articleId, articleId), isNull(keywords.deletedAt)));
  }

  /**
   * Atomically increment abstract views counter.
   */
  async incrementViews(id: string): Promise<void> {
    await db
      .update(articles)
      .set({ views: sql`articles.views + 1` })
      .where(eq(articles.id, id));
  }

  /**
   * Atomically increment PDF downloads counter.
   */
  async incrementDownloads(id: string): Promise<void> {
    await db
      .update(articles)
      .set({ downloads: sql`articles.downloads + 1` })
      .where(eq(articles.id, id));
  }
}
