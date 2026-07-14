import { eq, and, isNull, desc, asc, inArray } from 'drizzle-orm';
import { db } from '../../lib/db.js';
import {
  readingLists,
  readingListArticles,
  articles,
  issues,
  volumes,
  journals,
  articleAuthors,
  authors,
} from '../../db/schema/index.js';

export type DbReadingList = typeof readingLists.$inferSelect;
export type DbReadingListArticle = typeof readingListArticles.$inferSelect;

export class ReadingListsRepository {
  /**
   * Find all active reading lists for a specific user.
   */
  async findReadingListsByUserId(userId: string): Promise<DbReadingList[]> {
    return db
      .select()
      .from(readingLists)
      .where(and(eq(readingLists.userId, userId), isNull(readingLists.deletedAt)))
      .orderBy(desc(readingLists.createdAt));
  }

  /**
   * Find a specific active reading list by its ID.
   */
  async findReadingListById(id: string): Promise<DbReadingList | null> {
    const result = await db
      .select()
      .from(readingLists)
      .where(and(eq(readingLists.id, id), isNull(readingLists.deletedAt)))
      .limit(1);

    return result[0] || null;
  }

  /**
   * Insert a new reading list.
   */
  async createReadingList(
    userId: string,
    data: { name: string; description?: string }
  ): Promise<DbReadingList> {
    const result = await db
      .insert(readingLists)
      .values({
        userId,
        name: data.name,
        description: data.description || null,
      })
      .returning();

    return result[0];
  }

  /**
   * Update reading list name and description.
   */
  async updateReadingList(
    id: string,
    data: { name?: string; description?: string }
  ): Promise<DbReadingList> {
    const result = await db
      .update(readingLists)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(readingLists.id, id))
      .returning();

    return result[0];
  }

  /**
   * Soft-delete a reading list.
   */
  async deleteReadingList(id: string): Promise<DbReadingList | null> {
    const result = await db
      .update(readingLists)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(readingLists.id, id))
      .returning();

    return result[0] || null;
  }

  /**
   * Verify an article exists and is active.
   */
  async findArticleById(articleId: string) {
    const result = await db
      .select({ id: articles.id })
      .from(articles)
      .where(and(eq(articles.id, articleId), eq(articles.status, 'PUBLISHED'), isNull(articles.deletedAt)))
      .limit(1);

    return result[0] || null;
  }

  /**
   * Verify if an article is already linked to the reading list.
   */
  async findArticleInList(
    readingListId: string,
    articleId: string
  ): Promise<DbReadingListArticle | null> {
    const result = await db
      .select()
      .from(readingListArticles)
      .where(
        and(
          eq(readingListArticles.readingListId, readingListId),
          eq(readingListArticles.articleId, articleId)
        )
      )
      .limit(1);

    return result[0] || null;
  }

  /**
   * Link an article to the reading list.
   */
  async addArticleToList(readingListId: string, articleId: string): Promise<DbReadingListArticle> {
    const result = await db
      .insert(readingListArticles)
      .values({ readingListId, articleId })
      .returning();

    return result[0];
  }

  /**
   * Unlink an article from the reading list (hard delete junction).
   */
  async removeArticleFromList(
    readingListId: string,
    articleId: string
  ): Promise<DbReadingListArticle | null> {
    const result = await db
      .delete(readingListArticles)
      .where(
        and(
          eq(readingListArticles.readingListId, readingListId),
          eq(readingListArticles.articleId, articleId)
        )
      )
      .returning();

    return result[0] || null;
  }

  /**
   * Retrieve all active articles in a reading list, including issue/journal headers and author list.
   */
  async findArticlesInReadingList(readingListId: string): Promise<any[]> {
    const list = await db
      .select({
        id: articles.id,
        title: articles.title,
        abstract: articles.abstract,
        pdfUrl: articles.pdfUrl,
        doi: articles.doi,
        publishedAt: articles.publishedAt,
        views: articles.views,
        downloads: articles.downloads,
        issueNumber: issues.issueNumber,
        volumeNumber: volumes.volumeNumber,
        journalTitle: journals.title,
        journalId: journals.id,
      })
      .from(readingListArticles)
      .innerJoin(articles, eq(readingListArticles.articleId, articles.id))
      .leftJoin(volumes, eq(articles.volumeId, volumes.id))
      .leftJoin(journals, eq(volumes.journalId, journals.id))
      .leftJoin(issues, eq(articles.issueId, issues.id))
      .where(and(eq(readingListArticles.readingListId, readingListId), eq(articles.status, 'PUBLISHED'), isNull(articles.deletedAt)))
      .orderBy(desc(articles.publishedAt));

    return this.attachAuthorsToArticles(list);
  }

  /**
   * Helper to attach authors to list of articles in a single query.
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
}
