import { z } from 'zod';
import { Validator } from '../Validator.js';
import { ValidationResult } from '../ValidationResult.js';

const figuresSchema = z.array(z.string())
  .max(15, "The document cannot contain more than 15 figures");

export class FiguresValidator implements Validator<string[] | undefined> {
  validate(figures: string[] | undefined): ValidationResult {
    const result = figuresSchema.safeParse(figures || []);
    if (!result.success) {
      return {
        isValid: false,
        errors: result.error.errors.map(e => ({ field: 'figures', message: e.message }))
      };
    }
    return { isValid: true, errors: [] };
  }
}
