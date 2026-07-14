import { z } from 'zod';
import { Validator } from '../Validator.js';
import { ValidationResult } from '../ValidationResult.js';

const wordCountSchema = z.number()
  .min(100, "The manuscript must contain at least 100 words")
  .max(10000, "The manuscript cannot exceed 10000 words");

export class WordCountValidator implements Validator<number | undefined> {
  validate(wordCount: number | undefined): ValidationResult {
    const result = wordCountSchema.safeParse(wordCount || 0);
    if (!result.success) {
      return {
        isValid: false,
        errors: result.error.errors.map(e => ({ field: 'wordCount', message: e.message }))
      };
    }
    return { isValid: true, errors: [] };
  }
}
