import { z } from 'zod';
import { Validator } from '../Validator.js';
import { ValidationResult } from '../ValidationResult.js';

const referencesSchema = z.array(z.string())
  .min(5, "The document must contain at least 5 references");

export class ReferencesValidator implements Validator<string[] | undefined> {
  validate(references: string[] | undefined): ValidationResult {
    const result = referencesSchema.safeParse(references || []);
    if (!result.success) {
      return {
        isValid: false,
        errors: result.error.errors.map(e => ({ field: 'references', message: e.message, severity: 'error' }))
      };
    }

    const refList = references || [];
    const errors = [];
    if (refList.length < 10) {
      errors.push({
        field: 'references',
        message: 'Fewer than 10 references detected. Ensure all sources are cited.',
        severity: 'warning' as const
      });
    }

    return {
      isValid: true,
      errors
    };
  }
}
