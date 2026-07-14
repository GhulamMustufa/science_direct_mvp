import { z } from 'zod';
import { Validator } from '../Validator.js';
import { ValidationResult } from '../ValidationResult.js';

const titleSchema = z.string().min(5, "Title must be at least 5 characters").max(500, "Title cannot exceed 500 characters");

export class TitleValidator implements Validator<string | undefined> {
  validate(title: string | undefined): ValidationResult {
    const result = titleSchema.safeParse(title);
    if (!result.success) {
      return {
        isValid: false,
        errors: result.error.errors.map(e => ({ field: 'title', message: e.message }))
      };
    }
    return { isValid: true, errors: [] };
  }
}
