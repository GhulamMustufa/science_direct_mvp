import { z } from 'zod';
import { Validator } from '../Validator.js';
import { ValidationResult } from '../ValidationResult.js';

const sectionSchema = z.enum(["Research Article", "Review", "Case Report", "Short Communication"], {
  errorMap: () => ({ message: 'Invalid Journal Section selected' })
});

export class SectionValidator implements Validator<string | undefined> {
  validate(section: string | undefined): ValidationResult {
    if (!section) {
      return {
        isValid: false,
        errors: [{ field: 'section', message: 'Journal Section is required' }]
      };
    }

    const result = sectionSchema.safeParse(section);
    if (!result.success) {
      return {
        isValid: false,
        errors: result.error.errors.map(e => ({ field: 'section', message: e.message }))
      };
    }
    return { isValid: true, errors: [] };
  }
}
