import { z } from 'zod';
import { Validator } from '../Validator.js';
import { ValidationResult } from '../ValidationResult.js';

const headingsSchema = z.array(z.string().min(2, "Heading must be at least 2 characters"))
  .min(3, "The document must contain at least 3 headings/sections");

export class HeadingsValidator implements Validator<string[] | undefined> {
  validate(headings: string[] | undefined): ValidationResult {
    const result = headingsSchema.safeParse(headings || []);
    if (!result.success) {
      return {
        isValid: false,
        errors: result.error.errors.map(e => ({ field: 'headings', message: e.message }))
      };
    }
    return { isValid: true, errors: [] };
  }
}
