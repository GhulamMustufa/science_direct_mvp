import { z } from 'zod';

export const bookmarkInputSchema = z.object({
  articleId: z.string().uuid({ message: 'Invalid article ID format (must be a UUID)' }),
});

export type BookmarkInput = z.infer<typeof bookmarkInputSchema>;
