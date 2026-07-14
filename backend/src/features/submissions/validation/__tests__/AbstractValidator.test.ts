import { describe, it, expect } from 'vitest';
import { AbstractValidator } from '../validators/AbstractValidator';

describe('AbstractValidator', () => {
  const validator = new AbstractValidator();

  it('should invalidate undefined abstract', () => {
    const result = validator.validate(undefined);
    expect(result.isValid).toBe(false);
    expect(result.errors[0].message).toBe('Required');
  });

  it('should invalidate a short abstract', () => {
    const result = validator.validate('Too short');
    expect(result.isValid).toBe(false);
    expect(result.errors[0].message).toBe('Abstract must be at least 10 characters');
  });

  it('should validate a valid abstract', () => {
    const abstract = 'This is a valid abstract that goes on for a bit. It explains the core concepts of the research and findings. It meets the fifty character minimum easily.';
    const result = validator.validate(abstract);
    expect(result.isValid).toBe(true);
  });

  it('should invalidate a long abstract', () => {
    const abstract = 'A'.repeat(4001);
    const result = validator.validate(abstract);
    expect(result.isValid).toBe(false);
    expect(result.errors[0].message).toBe('Abstract cannot exceed 4000 characters');
  });
});
