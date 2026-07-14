import { z } from 'zod';
import { Validator } from '../Validator.js';
import { ValidationResult } from '../ValidationResult.js';

const languageSchema = z.literal("English", {
  errorMap: () => ({ message: 'Language must be English' })
});

export class LanguageValidator implements Validator<string | undefined> {
  validate(language: string | undefined): ValidationResult {
    if (!language) {
      return {
        isValid: false,
        errors: [{ field: 'language', message: 'Language is required' }]
      };
    }

    const result = languageSchema.safeParse(language);
    if (!result.success) {
      return {
        isValid: false,
        errors: result.error.errors.map(e => ({ field: 'language', message: e.message }))
      };
    }
    return { isValid: true, errors: [] };
  }
}
