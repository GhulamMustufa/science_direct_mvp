import { eq, and, isNull } from 'drizzle-orm';
import { db } from '../../lib/db.js';
import { users } from '../../db/schema/index.js';

export interface CreateUserInput {
  email: string;
  passwordHash: string;
  firstName?: string;
  lastName?: string;
  role?: 'reader' | 'author' | 'editor' | 'admin';
}

export type DbUser = typeof users.$inferSelect;

export class AuthRepository {
  /**
   * Find a user by their email address.
   * Excludes soft-deleted users.
   */
  async findByEmail(email: string): Promise<DbUser | null> {
    const result = await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.email, email.toLowerCase().trim()),
          isNull(users.deletedAt)
        )
      )
      .limit(1);

    return result[0] || null;
  }

  /**
   * Insert a new user record.
   */
  async createUser(data: CreateUserInput): Promise<DbUser> {
    const result = await db
      .insert(users)
      .values({
        email: data.email.toLowerCase().trim(),
        passwordHash: data.passwordHash,
        firstName: data.firstName || null,
        lastName: data.lastName || null,
        role: data.role || 'reader',
      })
      .returning();

    return result[0];
  }
}
