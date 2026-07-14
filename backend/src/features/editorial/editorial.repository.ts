import { db } from '../../lib/db.js';
import { articles, volumes } from '../../db/schema/index.js';
import { eq, desc } from 'drizzle-orm';

export class EditorialRepository {
  async getPendingSubmissions() {
    return await db.select()
      .from(articles)
      .where(eq(articles.status, 'SUBMITTED'))
      .orderBy(desc(articles.updatedAt));
  }

  async getAllSubmissions() {
    return await db.select()
      .from(articles)
      .orderBy(desc(articles.updatedAt));
  }

  async updateSubmissionStatus(articleId: string, status: "DRAFT" | "SUBMITTED" | "REVISIONS_REQUIRED" | "ACCEPTED" | "REJECTED" | "PUBLISHED") {
    const [updated] = await db.update(articles)
      .set({ status, updatedAt: new Date() })
      .where(eq(articles.id, articleId))
      .returning();
    return updated;
  }

  async publishArticle(articleId: string, volumeId: string) {
    const [published] = await db.update(articles)
      .set({ 
        status: 'PUBLISHED', 
        volumeId, 
        publishedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(articles.id, articleId))
      .returning();
    return published;
  }

  async publishArticleWithNewVolume(articleId: string, journalId: string, volumeNumber: string, year: string) {
    return await db.transaction(async (tx) => {
      // 1. Create the new volume
      const [newVolume] = await tx.insert(volumes).values({
        journalId,
        volumeNumber,
        year,
      }).returning();

      // 2. Publish the article using the new volume id
      const [published] = await tx.update(articles)
        .set({
          status: 'PUBLISHED',
          volumeId: newVolume.id,
          publishedAt: new Date(),
          updatedAt: new Date()
        })
        .where(eq(articles.id, articleId))
        .returning();

      return published;
    });
  }
}

export const editorialRepository = new EditorialRepository();
