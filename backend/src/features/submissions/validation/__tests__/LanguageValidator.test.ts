import { describe, it, expect } from 'vitest';
import { LanguageValidator } from '../validators/LanguageValidator';

describe('LanguageValidator', () => {
  const validator = new LanguageValidator();

  it('should invalidate undefined language', () => {
    const result = validator.validate(undefined);
    expect(result.isValid).toBe(false);
    expect(result.errors[0].message).toBe('Language is required');
  });

  it('should validate English', () => {
    const result = validator.validate('English');
    expect(result.isValid).toBe(true);
  });

  it('should invalidate non-English', () => {
    const result = validator.validate('Spanish');
    expect(result.isValid).toBe(false);
    expect(result.errors[0].message).toBe('Language must be English');
  });
});
