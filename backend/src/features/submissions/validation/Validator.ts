import { ValidationResult } from './ValidationResult.js';

export interface Validator<T> {
  validate(data: T): ValidationResult | Promise<ValidationResult>;
}
