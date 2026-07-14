import { describe, it, expect } from 'vitest';
import { TitleValidator } from '../validators/TitleValidator';

describe('TitleValidator', () => {
  const validator = new TitleValidator();

  it('should invalidate undefined title', () => {
    const result = validator.validate(undefined);
    expect(result.isValid).toBe(false);
    expect(result.errors[0].message).toBe('Required');
  });

  it('should invalidate an empty title', () => {
    const result = validator.validate('');
    expect(result.isValid).toBe(false);
    expect(result.errors[0].message).toBe('Title must be at least 5 characters');
  });

  it('should validate a valid title', () => {
    const result = validator.validate('A novel approach to physics');
    expect(result.isValid).toBe(true);
  });

  it('should invalidate a long title', () => {
    const title = 'A'.repeat(501);
    const result = validator.validate(title);
    expect(result.isValid).toBe(false);
    expect(result.errors[0].message).toBe('Title cannot exceed 500 characters');
  });
});
