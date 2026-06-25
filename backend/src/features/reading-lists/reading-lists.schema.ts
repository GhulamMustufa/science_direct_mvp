import { z } from 'zod';

export const createListSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name must be under 100 characters'),
  description: z.string().trim().max(500, 'Description must be under 500 characters').optional(),
});

export const updateListSchema = z.object({
  name: z.string().trim().min(1, 'Name cannot be empty').max(100, 'Name must be under 100 characters').optional(),
  description: z.string().trim().max(500, 'Description must be under 500 characters').optional(),
});

export const addArticleSchema = z.object({
  articleId: z.string().uuid('Invalid article ID format (must be a UUID)'),
});

export type CreateListInput = z.infer<typeof createListSchema>;
export type UpdateListInput = z.infer<typeof updateListSchema>;
export type AddArticleInput = z.infer<typeof addArticleSchema>;
