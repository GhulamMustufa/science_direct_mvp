import { z } from 'zod';

export const getNotificationsQuerySchema = z.object({
  unreadOnly: z.preprocess(
    (val) => (val === 'true' ? true : val === 'false' ? false : undefined),
    z.boolean().optional()
  ),
});

export const readNotificationParamSchema = z.object({
  id: z.string().uuid({ message: 'Invalid notification ID format (must be a UUID)' }),
});

export type GetNotificationsQuery = z.infer<typeof getNotificationsQuerySchema>;
export type ReadNotificationParam = z.infer<typeof readNotificationParamSchema>;
