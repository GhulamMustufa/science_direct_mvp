import { z } from 'zod';
import { Validator } from '../Validator.js';
import { ValidationResult } from '../ValidationResult.js';

const pageCountSchema = z.number()
  .min(1, "The manuscript must have at least 1 page")
  .max(50, "The manuscript cannot exceed 50 pages");

export class PageCountValidator implements Validator<number | undefined> {
  validate(pageCount: number | undefined): ValidationResult {
    const result = pageCountSchema.safeParse(pageCount || 0);
    if (!result.success) {
      return {
        isValid: false,
        errors: result.error.errors.map(e => ({ field: 'pageCount', message: e.message }))
      };
    }
    return { isValid: true, errors: [] };
  }
}
