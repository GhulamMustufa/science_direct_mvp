import { eq, and, isNull, desc } from 'drizzle-orm';
import { db } from '../../lib/db.js';
import { notifications } from '../../db/schema/index.js';

export type DbNotification = typeof notifications.$inferSelect;

export class NotificationsRepository {
  /**
   * Find all active notifications for a specific user, sorted by createdAt descending.
   * If unreadOnly is true, only returns notifications where readAt is null.
   */
  async findNotificationsByUserId(userId: string, unreadOnly?: boolean): Promise<DbNotification[]> {
    const conditions = [
      eq(notifications.userId, userId),
      isNull(notifications.deletedAt),
    ];

    if (unreadOnly) {
      conditions.push(isNull(notifications.readAt));
    }

    return db
      .select()
      .from(notifications)
      .where(and(...conditions))
      .orderBy(desc(notifications.createdAt));
  }

  /**
   * Find a specific active notification by its ID.
   */
  async findNotificationById(id: string): Promise<DbNotification | null> {
    const result = await db
      .select()
      .from(notifications)
      .where(and(eq(notifications.id, id), isNull(notifications.deletedAt)))
      .limit(1);

    return result[0] || null;
  }

  /**
   * Update the read status of a notification.
   */
  async updateNotificationReadStatus(id: string, readAt: Date | null): Promise<DbNotification> {
    const result = await db
      .update(notifications)
      .set({
        readAt,
        updatedAt: new Date(),
      })
      .where(eq(notifications.id, id))
      .returning();

    return result[0];
  }

  /**
   * Mark all unread notifications of a user as read.
   */
  async markAllNotificationsAsRead(userId: string): Promise<void> {
    await db
      .update(notifications)
      .set({
        readAt: new Date(),
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(notifications.userId, userId),
          isNull(notifications.readAt),
          isNull(notifications.deletedAt)
        )
      );
  }
}
