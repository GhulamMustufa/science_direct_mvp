import { z } from 'zod';
import { Validator } from '../Validator';
import { ValidationResult } from '../ValidationResult';

const sectionSchema = z.enum(["Research Article", "Review", "Case Report", "Short Communication"], {
  message: 'Invalid Journal Section selected'
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
        errors: result.error.issues.map(e => ({ field: 'section', message: e.message }))
      };
    }
    return { isValid: true, errors: [] };
  }
}
