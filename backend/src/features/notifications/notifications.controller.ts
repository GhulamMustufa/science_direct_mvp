import { Request, Response, NextFunction } from 'express';
import { NotificationsService } from './notifications.service.js';
import {
  getNotificationsQuerySchema,
  readNotificationParamSchema,
} from './notifications.schema.js';
import { AppError } from '../../middleware/error.js';

export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  /**
   * Fetch all notifications belonging to the logged-in user.
   */
  getNotifications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError(401, 'Authentication required', 'UNAUTHORIZED');
      }

      const { unreadOnly } = getNotificationsQuerySchema.parse(req.query);
      const notifications = await this.notificationsService.getNotifications(
        req.user.id,
        unreadOnly
      );

      res.status(200).json({
        success: true,
        data: notifications,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Mark a specific notification as read.
   */
  markAsRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError(401, 'Authentication required', 'UNAUTHORIZED');
      }

      const { id } = readNotificationParamSchema.parse(req.params);
      const updated = await this.notificationsService.markAsRead(req.user.id, id);

      res.status(200).json({
        success: true,
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Mark all unread notifications of the user as read.
   */
  markAllAsRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError(401, 'Authentication required', 'UNAUTHORIZED');
      }

      await this.notificationsService.markAllAsRead(req.user.id);

      res.status(200).json({
        success: true,
        data: null,
      });
    } catch (error) {
      next(error);
    }
  };
}
