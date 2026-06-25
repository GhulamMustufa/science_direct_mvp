import { eq, and, isNull, desc, asc, sql, inArray } from 'drizzle-orm';
import { db } from '../../lib/db.js';
import {
  bookmarks,
  articles,
  issues,
  volumes,
  journals,
  articleAuthors,
  authors,
} from '../../db/schema/index.js';

export type DbBookmark = typeof bookmarks.$inferSelect;

export class BookmarksRepository {
  /**
   * Find paginated bookmarks for a specific user, including article/journal details.
   */
  async findBookmarks(userId: string, limit: number, offset: number) {
    const baseWhere = and(
      eq(bookmarks.userId, userId),
      isNull(bookmarks.deletedAt),
      isNull(articles.deletedAt)
    );

    const list = await db
      .select({
        id: bookmarks.id,
        createdAt: bookmarks.createdAt,
        article: {
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
        },
      })
      .from(bookmarks)
      .innerJoin(articles, eq(bookmarks.articleId, articles.id))
      .innerJoin(issues, eq(articles.issueId, issues.id))
      .innerJoin(volumes, eq(issues.volumeId, volumes.id))
      .innerJoin(journals, eq(volumes.journalId, journals.id))
      .where(baseWhere)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(bookmarks.createdAt));

    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(bookmarks)
      .innerJoin(articles, eq(bookmarks.articleId, articles.id))
      .where(baseWhere);

    const total = Number(countResult[0]?.count || 0);
    const bookmarksWithAuthors = await this.attachAuthorsToBookmarks(list);

    return { bookmarks: bookmarksWithAuthors, total };
  }

  /**
   * Helper to attach authors to bookmarked articles in a single query.
   */
  private async attachAuthorsToBookmarks(bookmarkList: any[]): Promise<any[]> {
    if (bookmarkList.length === 0) return [];
    const articleIds = bookmarkList.map((b) => b.article.id);

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

    return bookmarkList.map((b) => ({
      ...b,
      article: {
        ...b.article,
        authors: authorsList
          .filter((auth) => auth.articleId === b.article.id)
          .map((auth) => ({
            authorOrder: auth.authorOrder,
            details: auth.author,
          })),
      },
    }));
  }

  /**
   * Verify an article exists and is active.
   */
  async findArticleById(articleId: string) {
    const result = await db
      .select({ id: articles.id })
      .from(articles)
      .where(and(eq(articles.id, articleId), isNull(articles.deletedAt)))
      .limit(1);

    return result[0] || null;
  }

  /**
   * Find a bookmark by user and article.
   * Includes soft-deleted bookmarks.
   */
  async findBookmark(userId: string, articleId: string): Promise<DbBookmark | null> {
    const result = await db
      .select()
      .from(bookmarks)
      .where(and(eq(bookmarks.userId, userId), eq(bookmarks.articleId, articleId)))
      .limit(1);

    return result[0] || null;
  }

  /**
   * Create a new bookmark.
   */
  async createBookmark(userId: string, articleId: string): Promise<DbBookmark> {
    const result = await db
      .insert(bookmarks)
      .values({ userId, articleId })
      .returning();

    return result[0];
  }

  /**
   * Restore a previously soft-deleted bookmark.
   */
  async restoreBookmark(bookmarkId: string): Promise<DbBookmark> {
    const result = await db
      .update(bookmarks)
      .set({ deletedAt: null, updatedAt: new Date() })
      .where(eq(bookmarks.id, bookmarkId))
      .returning();

    return result[0];
  }

  /**
   * Soft-delete an active bookmark.
   */
  async deleteBookmark(userId: string, articleId: string): Promise<DbBookmark | null> {
    const result = await db
      .update(bookmarks)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(and(eq(bookmarks.userId, userId), eq(bookmarks.articleId, articleId), isNull(bookmarks.deletedAt)))
      .returning();

    return result[0] || null;
  }
}
