import { describe, it, expect } from 'vitest';
import { SectionValidator } from '../validators/SectionValidator';

describe('SectionValidator', () => {
  const validator = new SectionValidator();

  it('should invalidate undefined section', () => {
    const result = validator.validate(undefined);
    expect(result.isValid).toBe(false);
    expect(result.errors[0].message).toBe('Journal Section is required');
  });

  it('should validate a valid section', () => {
    const result = validator.validate('Research Article');
    expect(result.isValid).toBe(true);
  });

  it('should invalidate an invalid section', () => {
    const result = validator.validate('Fake Section');
    expect(result.isValid).toBe(false);
    expect(result.errors[0].message).toBe('Invalid Journal Section selected');
  });
});
