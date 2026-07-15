import { eq, and, isNull, sql, desc } from 'drizzle-orm';
import { db } from '../../lib/db.js';
import { users, authors } from '../../db/schema/index.js';

export type DbUser = typeof users.$inferSelect;
export type DbAuthor = typeof authors.$inferSelect;

export class AdminRepository {
  /**
   * Fetch active users with limit and offset. Excludes passwordHash.
   */
  async findUsers(
    limit: number,
    offset: number
  ): Promise<{ users: Omit<DbUser, 'passwordHash'>[]; total: number }> {
    const list = await db
      .select({
        id: users.id,
        email: users.email,
        role: users.role,
        firstName: users.firstName,
        lastName: users.lastName,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        deletedAt: users.deletedAt,
      })
      .from(users)
      .where(isNull(users.deletedAt))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(users.createdAt));

    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(isNull(users.deletedAt));

    const total = Number(countResult[0]?.count || 0);

    return { users: list, total };
  }

  /**
   * Find a specific user by ID. Excludes soft-deleted users.
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
   * Update a user's access role.
   */
  async updateUserRole(
    id: string,
    role: 'reader' | 'author' | 'admin'
  ): Promise<Omit<DbUser, 'passwordHash'>> {
    const result = await db
      .update(users)
      .set({
        role,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        email: users.email,
        role: users.role,
        firstName: users.firstName,
        lastName: users.lastName,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        deletedAt: users.deletedAt,
      });

    return result[0];
  }

  /**
   * Find active author profile linked to a userId.
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
   * Create a new author profile for a user.
   */
  async createAuthor(data: {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
  }): Promise<DbAuthor> {
    const result = await db
      .insert(authors)
      .values({
        userId: data.userId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
      })
      .returning();

    return result[0];
  }

  /**
   * Update a user's basic info.
   */
  async updateUser(
    id: string,
    data: { firstName?: string; lastName?: string; role?: 'reader' | 'author' | 'admin' }
  ): Promise<Omit<DbUser, 'passwordHash'>> {
    const result = await db
      .update(users)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        email: users.email,
        role: users.role,
        firstName: users.firstName,
        lastName: users.lastName,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        deletedAt: users.deletedAt,
      });

    return result[0];
  }

  /**
   * Soft delete (block) a user.
   */
  async blockUser(id: string): Promise<void> {
    await db
      .update(users)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(users.id, id));
  }
}
