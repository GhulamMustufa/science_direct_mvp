import { z } from 'zod';
import { Validator } from '../Validator.js';
import { ValidationResult } from '../ValidationResult.js';

const abstractSchema = z.string().min(10, "Abstract must be at least 10 characters").max(4000, "Abstract cannot exceed 4000 characters");

export class AbstractValidator implements Validator<string | undefined> {
  validate(abstract: string | undefined): ValidationResult {
    const result = abstractSchema.safeParse(abstract);
    if (!result.success) {
      return {
        isValid: false,
        errors: result.error.errors.map(e => ({ field: 'abstract', message: e.message }))
      };
    }
    return { isValid: true, errors: [] };
  }
}
