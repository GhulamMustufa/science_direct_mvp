import { eq, and, isNull } from 'drizzle-orm';
import { db } from '../../lib/db.js';
import { users, authors } from '../../db/schema/index.js';

export type DbUser = typeof users.$inferSelect;
export type DbAuthor = typeof authors.$inferSelect;

export class ProfileRepository {
  /**
   * Find user details by ID. Excludes soft-deleted users.
   */
  async findUserById(id: string): Promise<DbUser | null> {
    const result = await db
      .select()
      .from(users)
      .where(and(eq(users.id, id), isNull(users.deletedAt)))
      .limit(1);

    return result[0] || null;
  }

  /**
   * Find linked author profile by userId. Excludes soft-deleted author profiles.
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
   * Update core user profile fields.
   */
  async updateUser(
    userId: string,
    data: { firstName: string; lastName: string }
  ): Promise<DbUser> {
    const result = await db
      .update(users)
      .set({
        firstName: data.firstName,
        lastName: data.lastName,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    return result[0];
  }

  /**
   * Update linked author details.
   */
  async updateAuthor(
    authorId: string,
    data: {
      firstName: string;
      lastName: string;
      institution?: string | null;
      orcid?: string | null;
    }
  ): Promise<DbAuthor> {
    const result = await db
      .update(authors)
      .set({
        firstName: data.firstName,
        lastName: data.lastName,
        institution: data.institution || null,
        orcid: data.orcid || null,
        updatedAt: new Date(),
      })
      .where(eq(authors.id, authorId))
      .returning();

    return result[0];
  }

  /**
   * Create a new author profile.
   */
  async createAuthor(data: {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    institution?: string | null;
    orcid?: string | null;
  }): Promise<DbAuthor> {
    const result = await db
      .insert(authors)
      .values({
        userId: data.userId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        institution: data.institution || null,
        orcid: data.orcid || null,
      })
      .returning();

    return result[0];
  }
}
