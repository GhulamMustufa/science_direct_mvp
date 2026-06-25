import { z } from 'zod';

export const changeRoleSchema = z.object({
  role: z.enum(['reader', 'author', 'editor', 'admin'], {
    errorMap: () => ({ message: "Role must be 'reader', 'author', 'editor', or 'admin'" }),
  }),
});

export const userIdParamSchema = z.object({
  id: z.string().uuid({ message: 'Invalid user ID format (must be a UUID)' }),
});

export type ChangeRoleInput = z.infer<typeof changeRoleSchema>;
export type UserIdParam = z.infer<typeof userIdParamSchema>;
