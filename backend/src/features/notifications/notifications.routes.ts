import { Router } from 'express';
import { NotificationsRepository } from './notifications.repository.js';
import { NotificationsService } from './notifications.service.js';
import { NotificationsController } from './notifications.controller.js';
import { authenticate } from '../../middleware/authenticate.js';

const router = Router();

const notificationsRepository = new NotificationsRepository();
const notificationsService = new NotificationsService(notificationsRepository);
const notificationsController = new NotificationsController(notificationsService);

router.get('/notifications', authenticate, notificationsController.getNotifications);
router.put('/notifications/read-all', authenticate, notificationsController.markAllAsRead);
router.put('/notifications/:id/read', authenticate, notificationsController.markAsRead);

export default router;
