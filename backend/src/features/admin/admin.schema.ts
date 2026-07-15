import { z } from 'zod';

export const changeRoleSchema = z.object({
  role: z.enum(['reader', 'author', 'admin'], {
    errorMap: () => ({ message: "Role must be 'reader', 'author', or 'admin'" }),
  }),
});

export const userIdParamSchema = z.object({
  id: z.string().uuid({ message: 'Invalid user ID format (must be a UUID)' }),
});

export type ChangeRoleInput = z.infer<typeof changeRoleSchema>;
export type UserIdParam = z.infer<typeof userIdParamSchema>;

export const updateUserSchema = z.object({
  firstName: z.string().min(1, "First name must not be empty").optional(),
  lastName: z.string().min(1, "Last name must not be empty").optional(),
  role: z.enum(['reader', 'author', 'admin']).optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
