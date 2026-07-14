import { ValidationResult } from './ValidationResult';

export interface Validator<T> {
  validate(data: T): ValidationResult | Promise<ValidationResult>;
}
