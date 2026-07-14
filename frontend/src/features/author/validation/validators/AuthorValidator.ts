import { z } from 'zod';
import { Validator } from '../Validator';
import { ValidationResult } from '../ValidationResult';

export interface AuthorData {
  firstName: string;
  lastName: string;
  email: string;
  affiliation: string;
  isCorresponding: boolean;
}

const authorDataSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required for all authors"),
  affiliation: z.string().min(1, "Affiliation is required for all authors"),
  isCorresponding: z.boolean(),
});

const authorsArraySchema = z.array(authorDataSchema).min(1, "At least one author is required");

export class AuthorValidator implements Validator<AuthorData[] | undefined> {
  validate(authors: AuthorData[] | undefined): ValidationResult {
    if (!authors) {
      return {
        isValid: false,
        errors: [{ field: 'authors', message: 'Author information is required' }]
      };
    }

    const result = authorsArraySchema.safeParse(authors);
    if (!result.success) {
      return {
        isValid: false,
        errors: result.error.issues.map(e => ({ field: 'authors', message: e.message }))
      };
    }

    // Custom check: At least one corresponding author
    const hasCorresponding = authors.some(a => a.isCorresponding);
    if (!hasCorresponding) {
      return {
        isValid: false,
        errors: [{ field: 'authors', message: 'At least one corresponding author must be selected' }]
      };
    }

    return { isValid: true, errors: [] };
  }
}
