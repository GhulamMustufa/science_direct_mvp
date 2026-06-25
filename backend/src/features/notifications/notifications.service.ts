import { NotificationsRepository, DbNotification } from './notifications.repository.js';
import { AppError } from '../../middleware/error.js';

export class NotificationsService {
  constructor(private notificationsRepository: NotificationsRepository) {}

  /**
   * Get all active notifications for the user.
   */
  async getNotifications(userId: string, unreadOnly?: boolean): Promise<DbNotification[]> {
    return this.notificationsRepository.findNotificationsByUserId(userId, unreadOnly);
  }

  /**
   * Mark a specific notification as read.
   * Validates user ownership.
   */
  async markAsRead(userId: string, id: string): Promise<DbNotification> {
    const notification = await this.notificationsRepository.findNotificationById(id);
    if (!notification || notification.userId !== userId) {
      throw new AppError(404, 'Notification not found', 'NOTIFICATION_NOT_FOUND');
    }

    return this.notificationsRepository.updateNotificationReadStatus(id, new Date());
  }

  /**
   * Mark all unread notifications of the user as read.
   */
  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationsRepository.markAllNotificationsAsRead(userId);
  }
}
