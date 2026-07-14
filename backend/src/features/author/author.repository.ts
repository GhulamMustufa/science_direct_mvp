import { eq, and, or, isNull, desc, inArray, asc } from 'drizzle-orm';
import { db } from '../../lib/db.js';
import {
  articles,
  authors,
  articleAuthors,
  issues,
  volumes,
  journals,
} from '../../db/schema/index.js';

export type DbAuthor = typeof authors.$inferSelect;
export type DbSubmission = typeof articles.$inferSelect;

export class AuthorRepository {
  /**
   * Find an active author profile linked to a userId.
   */
  async findAuthorByUserId(userId: string): Promise<DbAuthor | null> {
    const result = await db
      .select()
      .from(authors)
      .where(and(eq(authors.userId, userId), isNull(authors.deletedAt)))
      .limit(1);

    return result[0] || null;
  }

  /**
   * Find publications (articles) associated with an author, including co-authors.
   */
  async findPublicationsByAuthorId(authorId: string, userId: string): Promise<any[]> {
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
      .from(articles)
      .leftJoin(articleAuthors, eq(articleAuthors.articleId, articles.id))
      .leftJoin(volumes, eq(articles.volumeId, volumes.id))
      .leftJoin(journals, eq(volumes.journalId, journals.id))
      .leftJoin(issues, eq(articles.issueId, issues.id))
      .where(
        and(
          eq(articles.status, 'PUBLISHED'),
          isNull(articles.deletedAt),
          or(
            eq(articleAuthors.authorId, authorId),
            eq(articles.submitterId, userId)
          )
        )
      )
      .orderBy(desc(articles.publishedAt));

    return this.attachAuthorsToArticles(list);
  }

  /**
   * Batch-loads co-authors for each publication to prevent N+1 queries.
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

  async findSubmissionsByAuthorId(userId: string): Promise<DbSubmission[]> {
    return db
      .select()
      .from(articles)
      .where(and(eq(articles.submitterId, userId), isNull(articles.deletedAt)))
      .orderBy(desc(articles.createdAt));
  }
}

