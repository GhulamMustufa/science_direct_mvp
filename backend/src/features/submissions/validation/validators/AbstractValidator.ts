import { z } from 'zod';
import { Validator } from '../Validator.js';
import { ValidationResult } from '../ValidationResult.js';

const abstractSchema = z.string()
  .min(10, "Abstract must be at least 10 characters")
  .refine(val => val.trim().split(/\\s+/).length <= 250, {
    message: "Abstract cannot exceed 250 words",
  });

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
