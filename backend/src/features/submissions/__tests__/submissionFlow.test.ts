import dotenv from 'dotenv';
dotenv.config();

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { db } from '../../../lib/db.js';
import { users, journals, volumes, articles } from '../../../db/schema/index.js';
import { submissionsRepository } from '../submissions.repository.js';
import { editorialRepository } from '../../editorial/editorial.repository.js';
import { eq } from 'drizzle-orm';

describe('Submission & Publication Flow Integration Test', () => {
  let userId: string;
  let journalId: string;
  let volumeId: string;
  let articleId: string;

  beforeAll(async () => {
    // 1. Setup mock user
    const [user] = await db.insert(users).values({
      email: `test-author-${Date.now()}@example.com`,
      role: 'author',
      firstName: 'Test',
      lastName: 'Author'
    }).returning();
    userId = user.id;

    // 2. Setup mock journal
    const [journal] = await db.insert(journals).values({
      title: 'Journal of Testing',
      issn: '1234-5678'
    }).returning();
    journalId = journal.id;

    // 3. Setup mock volume
    const [volume] = await db.insert(volumes).values({
      journalId: journalId,
      volumeNumber: '1',
      year: '2026'
    }).returning();
    volumeId = volume.id;
  });

  afterAll(async () => {
    // Clean up created records in reverse order
    if (articleId) {
      await db.delete(articles).where(eq(articles.id, articleId));
    }
    if (volumeId) {
      await db.delete(volumes).where(eq(volumes.id, volumeId));
    }
    if (journalId) {
      await db.delete(journals).where(eq(journals.id, journalId));
    }
    if (userId) {
      await db.delete(users).where(eq(users.id, userId));
    }
  });

  it('should successfully submit, accept, and publish an article in the DB', async () => {
    // 1. Submit Article (using submissionsRepository)
    const newArticle = await submissionsRepository.createSubmission(
      userId,
      'Integration Twist Magic Superconductivity',
      'This abstract explains Twisted Graphene magic superconductivity results in magic twisted bilayers.',
      journalId,
      [], // authorIds
      '/uploads/test.pdf',
      'test.pdf'
    );

    expect(newArticle).toBeDefined();
    expect(newArticle.id).toBeDefined();
    articleId = newArticle.id;
    expect(newArticle.title).toBe('Integration Twist Magic Superconductivity');
    expect(newArticle.status).toBe('SUBMITTED');

    // 2. Accept Article (using editorialRepository)
    const acceptedArticle = await editorialRepository.updateSubmissionStatus(articleId, 'ACCEPTED');
    expect(acceptedArticle).toBeDefined();
    expect(acceptedArticle.status).toBe('ACCEPTED');

    // 3. Publish Article into the Volume (using editorialRepository)
    const publishedArticle = await editorialRepository.publishArticle(articleId, volumeId);
    expect(publishedArticle).toBeDefined();
    expect(publishedArticle.status).toBe('PUBLISHED');
    expect(publishedArticle.volumeId).toBe(volumeId);
    expect(publishedArticle.publishedAt).toBeInstanceOf(Date);
  });
});
