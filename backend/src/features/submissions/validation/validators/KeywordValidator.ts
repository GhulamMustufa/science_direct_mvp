import { z } from 'zod';
import { Validator } from '../Validator.js';
import { ValidationResult } from '../ValidationResult.js';

const keywordSchema = z.array(z.string())
  .min(3, "At least 3 keywords are required")
  .max(10, "No more than 10 keywords are allowed");

export class KeywordValidator implements Validator<string[] | undefined> {
  validate(keywords: string[] | undefined): ValidationResult {
    if (!keywords) {
      return {
        isValid: false,
        errors: [{ field: 'keywords', message: 'Keywords are required' }]
      };
    }

    const result = keywordSchema.safeParse(keywords);
    if (!result.success) {
      return {
        isValid: false,
        errors: result.error.errors.map(e => ({ field: 'keywords', message: e.message }))
      };
    }
    return { isValid: true, errors: [] };
  }
}
