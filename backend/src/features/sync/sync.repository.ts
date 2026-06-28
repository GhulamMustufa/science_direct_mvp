import { eq, and, isNull, desc } from 'drizzle-orm';
import { db } from '../../lib/db.js';
import {
  journals,
  volumes,
  issues,
  articles,
  authors,
  articleAuthors,
  users,
  submissions,
} from '../../db/schema/index.js';

export type DbJournal = typeof journals.$inferSelect;
export type DbVolume = typeof volumes.$inferSelect;
export type DbIssue = typeof issues.$inferSelect;
export type DbArticle = typeof articles.$inferSelect;
export type DbAuthor = typeof authors.$inferSelect;
export type DbSubmission = typeof submissions.$inferSelect;

export class SyncRepository {
  /**
   * Upsert a journal record by its OJS ID.
   */
  async upsertJournal(data: {
    ojsJournalId: string;
    title: string;
    description: string | null;
    issn: string | null;
  }): Promise<DbJournal> {
    const result = await db
      .insert(journals)
      .values({
        ojsJournalId: data.ojsJournalId,
        title: data.title,
        description: data.description,
        issn: data.issn,
      })
      .onConflictDoUpdate({
        target: journals.ojsJournalId,
        set: {
          title: data.title,
          description: data.description,
          issn: data.issn,
          updatedAt: new Date(),
        },
      })
      .returning();

    return result[0];
  }

  /**
   * Find or create a volume by journalId, volumeNumber, and year.
   */
  async findOrCreateVolume(
    journalId: string,
    volumeNumber: string,
    year: string
  ): Promise<DbVolume> {
    const existing = await db
      .select()
      .from(volumes)
      .where(
        and(
          eq(volumes.journalId, journalId),
          eq(volumes.volumeNumber, volumeNumber),
          eq(volumes.year, year),
          isNull(volumes.deletedAt)
        )
      )
      .limit(1);

    if (existing[0]) return existing[0];

    const result = await db
      .insert(volumes)
      .values({ journalId, volumeNumber, year })
      .returning();

    return result[0];
  }

  /**
   * Find or create an issue by volumeId, issueNumber, and year.
   */
  async findOrCreateIssue(
    volumeId: string,
    issueNumber: string,
    year: string,
    title: string | null
  ): Promise<DbIssue> {
    const existing = await db
      .select()
      .from(issues)
      .where(
        and(
          eq(issues.volumeId, volumeId),
          eq(issues.issueNumber, issueNumber),
          eq(issues.year, year),
          isNull(issues.deletedAt)
        )
      )
      .limit(1);

    if (existing[0]) {
      if (title && existing[0].title !== title) {
        const updated = await db
          .update(issues)
          .set({ title, updatedAt: new Date() })
          .where(eq(issues.id, existing[0].id))
          .returning();
        return updated[0];
      }
      return existing[0];
    }

    const result = await db
      .insert(issues)
      .values({ volumeId, issueNumber, year, title })
      .returning();

    return result[0];
  }

  /**
   * Upsert an article by its OJS ID.
   */
  async upsertArticle(data: {
    issueId: string;
    ojsArticleId: string;
    title: string;
    abstract: string;
    pdfUrl: string | null;
    doi: string | null;
    publishedAt: Date;
  }): Promise<DbArticle> {
    const result = await db
      .insert(articles)
      .values({
        issueId: data.issueId,
        ojsArticleId: data.ojsArticleId,
        title: data.title,
        abstract: data.abstract,
        pdfUrl: data.pdfUrl,
        doi: data.doi,
        publishedAt: data.publishedAt,
      })
      .onConflictDoUpdate({
        target: articles.ojsArticleId,
        set: {
          issueId: data.issueId,
          title: data.title,
          abstract: data.abstract,
          pdfUrl: data.pdfUrl,
          doi: data.doi,
          publishedAt: data.publishedAt,
          updatedAt: new Date(),
        },
      })
      .returning();

    return result[0];
  }

  /**
   * Helper to check for existing author by orcid, email, or name.
   */
  private async findExistingAuthor(data: {
    firstName: string;
    lastName: string;
    email: string | null;
    orcid: string | null;
  }): Promise<DbAuthor | null> {
    if (data.orcid) {
      const res = await db
        .select()
        .from(authors)
        .where(and(eq(authors.orcid, data.orcid), isNull(authors.deletedAt)))
        .limit(1);
      if (res[0]) return res[0];
    }

    if (data.email) {
      const res = await db
        .select()
        .from(authors)
        .where(and(eq(authors.email, data.email.toLowerCase().trim()), isNull(authors.deletedAt)))
        .limit(1);
      if (res[0]) return res[0];
    }

    const res = await db
      .select()
      .from(authors)
      .where(
        and(
          eq(authors.firstName, data.firstName),
          eq(authors.lastName, data.lastName),
          isNull(authors.deletedAt)
        )
      )
      .limit(1);
    return res[0] || null;
  }

  /**
   * Find or create author, linking them to an existing user account if email matches.
   */
  async findOrCreateAuthor(data: {
    firstName: string;
    lastName: string;
    email: string | null;
    institution: string | null;
    orcid: string | null;
  }): Promise<DbAuthor> {
    const existing = await this.findExistingAuthor(data);

    if (existing) {
      const updated = await db
        .update(authors)
        .set({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email ? data.email.toLowerCase().trim() : existing.email,
          institution: data.institution || existing.institution,
          orcid: data.orcid || existing.orcid,
          updatedAt: new Date(),
        })
        .where(eq(authors.id, existing.id))
        .returning();
      return updated[0];
    }

    let linkedUserId: string | null = null;
    if (data.email) {
      const userRes = await db
        .select({ id: users.id })
        .from(users)
        .where(and(eq(users.email, data.email.toLowerCase().trim()), isNull(users.deletedAt)))
        .limit(1);
      linkedUserId = userRes[0]?.id || null;
    }

    const result = await db
      .insert(authors)
      .values({
        userId: linkedUserId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email ? data.email.toLowerCase().trim() : null,
        institution: data.institution,
        orcid: data.orcid,
      })
      .returning();

    return result[0];
  }

  /**
   * Link authors to article in defined display order.
   */
  async syncArticleAuthors(
    articleId: string,
    authorOrderIds: { authorId: string; authorOrder: number }[]
  ): Promise<void> {
    await db.delete(articleAuthors).where(eq(articleAuthors.articleId, articleId));

    if (authorOrderIds.length > 0) {
      await db.insert(articleAuthors).values(
        authorOrderIds.map((ao) => ({
          articleId,
          authorId: ao.authorId,
          authorOrder: ao.authorOrder,
        }))
      );
    }
  }

  async findAuthorByEmail(email: string): Promise<DbAuthor | null> {
    const result = await db
      .select()
      .from(authors)
      .where(and(eq(authors.email, email.toLowerCase().trim()), isNull(authors.deletedAt)))
      .limit(1);
    return result[0] || null;
  }

  async upsertSubmission(
    authorId: string,
    data: {
      ojsSubmissionId: string;
      title: string;
      journalTitle: string;
      status: string;
      submittedAt: Date;
      lastStatusUpdate: Date;
      ojsUrl: string;
    }
  ): Promise<DbSubmission> {
    const result = await db
      .insert(submissions)
      .values({
        authorId,
        ojsSubmissionId: data.ojsSubmissionId,
        title: data.title,
        journalTitle: data.journalTitle,
        status: data.status,
        submittedAt: data.submittedAt,
        lastStatusUpdate: data.lastStatusUpdate,
        ojsUrl: data.ojsUrl,
      })
      .onConflictDoUpdate({
        target: submissions.ojsSubmissionId,
        set: {
          title: data.title,
          journalTitle: data.journalTitle,
          status: data.status,
          lastStatusUpdate: data.lastStatusUpdate,
          ojsUrl: data.ojsUrl,
          updatedAt: new Date(),
        },
      })
      .returning();
    return result[0];
  }

  async findSubmissionsByAuthorId(authorId: string): Promise<DbSubmission[]> {
    return db
      .select()
      .from(submissions)
      .where(and(eq(submissions.authorId, authorId), isNull(submissions.deletedAt)))
      .orderBy(desc(submissions.submittedAt));
  }
}
