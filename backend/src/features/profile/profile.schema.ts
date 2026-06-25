import { z } from 'zod';

export const updateProfileSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required').max(100, 'First name must be under 100 characters'),
  lastName: z.string().trim().min(1, 'Last name is required').max(100, 'Last name must be under 100 characters'),
  institution: z.string().trim().max(255, 'Institution must be under 255 characters').optional().nullable(),
  orcid: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/, 'Invalid ORCID format (must be e.g. 0000-0002-1825-0097)')
    .optional()
    .nullable()
    .or(z.literal('')),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
