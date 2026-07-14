import { eq, and, isNull, desc, asc, sql, inArray } from 'drizzle-orm';
import { db } from '../../lib/db.js';
import {
  journals,
  volumes,
  issues,
  articles,
  articleAuthors,
  authors,
} from '../../db/schema/index.js';

export type DbJournal = typeof journals.$inferSelect;
export type DbVolume = typeof volumes.$inferSelect;
export type DbIssue = typeof issues.$inferSelect;
export type DbArticle = typeof articles.$inferSelect;

export interface AuthorDetails {
  id: string;
  firstName: string;
  lastName: string;
  institution: string | null;
  orcid: string | null;
}

export interface ArticleWithAuthors extends DbArticle {
  authors: {
    authorOrder: number;
    details: AuthorDetails;
  }[];
}

export class JournalsRepository {
  /**
   * Fetch a paginated list of active journals.
   */
  async findJournals(limit: number, offset: number): Promise<{ journals: DbJournal[]; total: number }> {
    const list = await db
      .select()
      .from(journals)
      .where(isNull(journals.deletedAt))
      .limit(limit)
      .offset(offset)
      .orderBy(journals.title);

    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(journals)
      .where(isNull(journals.deletedAt));

    return {
      journals: list,
      total: Number(countResult[0]?.count || 0),
    };
  }

  /**
   * Find a single active journal by its ID.
   */
  async findJournalById(id: string): Promise<DbJournal | null> {
    const result = await db
      .select()
      .from(journals)
      .where(and(eq(journals.id, id), isNull(journals.deletedAt)))
      .limit(1);

    return result[0] || null;
  }

  /**
   * Find all active volumes for a specific journal.
   */
  async findVolumesByJournalId(journalId: string): Promise<DbVolume[]> {
    return db
      .select()
      .from(volumes)
      .where(and(eq(volumes.journalId, journalId), isNull(volumes.deletedAt)))
      .orderBy(desc(volumes.year), desc(volumes.volumeNumber));
  }

  /**
   * Find a paginated list of active issues belonging to a journal.
   */
  async findIssuesByJournalId(
    journalId: string,
    limit: number,
    offset: number
  ): Promise<{ issues: (DbIssue & { volumeNumber: string })[]; total: number }> {
    const baseWhere = and(
      eq(volumes.journalId, journalId),
      isNull(issues.deletedAt),
      isNull(volumes.deletedAt)
    );

    const list = await db
      .select({
        id: issues.id,
        volumeId: issues.volumeId,
        issueNumber: issues.issueNumber,
        title: issues.title,
        year: issues.year,
        createdAt: issues.createdAt,
        updatedAt: issues.updatedAt,
        deletedAt: issues.deletedAt,
        volumeNumber: volumes.volumeNumber,
      })
      .from(issues)
      .innerJoin(volumes, eq(issues.volumeId, volumes.id))
      .where(baseWhere)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(issues.year), desc(issues.issueNumber));

    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(issues)
      .innerJoin(volumes, eq(issues.volumeId, volumes.id))
      .where(baseWhere);

    return {
      issues: list,
      total: Number(countResult[0]?.count || 0),
    };
  }

  /**
   * Find a single active issue by its ID with volume and journal metadata.
   */
  async findIssueById(id: string) {
    const result = await db
      .select({
        id: issues.id,
        volumeId: issues.volumeId,
        issueNumber: issues.issueNumber,
        title: issues.title,
        year: issues.year,
        createdAt: issues.createdAt,
        updatedAt: issues.updatedAt,
        volumeNumber: volumes.volumeNumber,
        volumeYear: volumes.year,
        journalId: volumes.journalId,
        journalTitle: journals.title,
      })
      .from(issues)
      .innerJoin(volumes, eq(issues.volumeId, volumes.id))
      .innerJoin(journals, eq(volumes.journalId, journals.id))
      .where(
        and(
          eq(issues.id, id),
          isNull(issues.deletedAt),
          isNull(volumes.deletedAt),
          isNull(journals.deletedAt)
        )
      )
      .limit(1);

    return result[0] || null;
  }

  /**
   * Find all active articles in an issue, including mapped authors.
   * Uses a batch query to retrieve authors in order to avoid N+1 queries.
   */
  async findArticlesByIssueId(issueId: string): Promise<ArticleWithAuthors[]> {
    const articleList = await db
      .select()
      .from(articles)
      .where(and(eq(articles.issueId, issueId), isNull(articles.deletedAt)))
      .orderBy(articles.publishedAt);

    if (articleList.length === 0) {
      return [];
    }

    const articleIds = articleList.map((a) => a.id);
    const authorsList = await db
      .select({
        articleId: articleAuthors.articleId,
        authorOrder: articleAuthors.authorOrder,
        author: {
          id: authors.id,
          firstName: authors.firstName,
          lastName: authors.lastName,
          institution: authors.institution,
          orcid: authors.orcid,
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
   * Create a new journal
   */
  async createJournal(data: { title: string; description?: string; issn?: string; ojsJournalId?: string }): Promise<DbJournal> {
    const result = await db
      .insert(journals)
      .values({
        title: data.title,
        description: data.description || null,
        issn: data.issn || null,
        ojsJournalId: data.ojsJournalId || null,
      })
      .returning();
      
    return result[0];
  }

  /**
   * Update an existing journal
   */
  async updateJournal(id: string, data: { title?: string; description?: string; issn?: string }): Promise<DbJournal | null> {
    const result = await db
      .update(journals)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(and(eq(journals.id, id), isNull(journals.deletedAt)))
      .returning();
      
    return result[0] || null;
  }
}
