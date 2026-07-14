import { z } from 'zod';
import { Validator } from '../Validator.js';
import { ValidationResult } from '../ValidationResult.js';

const tablesSchema = z.array(z.string())
  .max(10, "The document cannot contain more than 10 tables");

export class TablesValidator implements Validator<string[] | undefined> {
  validate(tables: string[] | undefined): ValidationResult {
    const result = tablesSchema.safeParse(tables || []);
    if (!result.success) {
      return {
        isValid: false,
        errors: result.error.errors.map(e => ({ field: 'tables', message: e.message }))
      };
    }
    return { isValid: true, errors: [] };
  }
}
