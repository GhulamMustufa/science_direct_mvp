import { db } from '../../lib/db.js';
import { articles, articleFiles, articleAuthors } from '../../db/schema/index.js';
import { eq, desc } from 'drizzle-orm';

export class SubmissionsRepository {
  async createSubmission(
    submitterId: string,
    title: string,
    abstract: string,
    journalId: string | undefined, // Not in articles directly, maybe we don't strictly need it at submission
    authorIds: string[],
    pdfUrl: string,
    originalName: string,
    additionalAuthors?: string,
    coverImageUrl?: string
  ) {
    return await db.transaction(async (tx) => {
      // 1. Create Article (Draft/Submitted status)
      const [newArticle] = await tx.insert(articles).values({
        submitterId,
        journalId,
        title,
        abstract,
        status: 'SUBMITTED',
        pdfUrl: pdfUrl, // Initial PDF URL
        additionalAuthors,
        coverImageUrl,
      }).returning();

      // 2. Link Authors
      if (authorIds && authorIds.length > 0) {
        await tx.insert(articleAuthors).values(
          authorIds.map((authorId, index) => ({
            articleId: newArticle.id,
            authorId,
            authorOrder: index + 1
          }))
        );
      }

      // 3. Add to article_files
      await tx.insert(articleFiles).values({
        articleId: newArticle.id,
        version: 1,
        fileUrl: pdfUrl,
        originalName: originalName,
      });

      return newArticle;
    });
  }

  async getSubmissionsBySubmitter(submitterId: string) {
    return await db.select()
      .from(articles)
      .where(eq(articles.submitterId, submitterId))
      .orderBy(desc(articles.createdAt));
  }

  async getSubmissionById(articleId: string) {
    const [article] = await db.select().from(articles).where(eq(articles.id, articleId));
    return article;
  }

  async addRevision(articleId: string, pdfUrl: string, originalName: string) {
    return await db.transaction(async (tx) => {
      // Find latest version
      const files = await tx.select().from(articleFiles).where(eq(articleFiles.articleId, articleId)).orderBy(desc(articleFiles.version));
      const nextVersion = files.length > 0 ? files[0].version + 1 : 1;

      // Insert new file
      await tx.insert(articleFiles).values({
        articleId,
        version: nextVersion,
        fileUrl: pdfUrl,
        originalName
      });

      // Update article status and pdfUrl
      const [updated] = await tx.update(articles)
        .set({ status: 'SUBMITTED', pdfUrl, updatedAt: new Date() })
        .where(eq(articles.id, articleId))
        .returning();
        
      return updated;
    });
  }
}

export const submissionsRepository = new SubmissionsRepository();
