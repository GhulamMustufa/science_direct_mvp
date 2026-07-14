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
        errors: result.error.errors.map(e => ({ field: 'wordCount', message: e.message, severity: 'error' }))
      };
    }

    const count = wordCount || 0;
    const errors = [];
    if (count < 1000) {
      errors.push({
        field: 'wordCount',
        message: 'Document is relatively short (< 1000 words).',
        severity: 'warning' as const
      });
    }

    return {
      isValid: true,
      errors
    };
  }
}
