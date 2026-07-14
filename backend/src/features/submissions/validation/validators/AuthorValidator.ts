import { z } from 'zod';
import { Validator } from '../Validator.js';
import { ValidationResult } from '../ValidationResult.js';

const authorSchema = z.string().max(1000, "Additional authors text is too long").optional();

export class AuthorValidator implements Validator<string | undefined> {
  validate(additionalAuthors: string | undefined): ValidationResult {
    const result = authorSchema.safeParse(additionalAuthors);
    if (!result.success) {
      return {
        isValid: false,
        errors: result.error.errors.map(e => ({ field: 'additionalAuthors', message: e.message }))
      };
    }
    return { isValid: true, errors: [] };
  }
}
