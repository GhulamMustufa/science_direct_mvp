import { describe, it, expect } from 'vitest';
import { KeywordValidator } from '../validators/KeywordValidator';

describe('KeywordValidator', () => {
  const validator = new KeywordValidator();

  it('should invalidate undefined keywords', () => {
    const result = validator.validate(undefined);
    expect(result.isValid).toBe(false);
    expect(result.errors[0].message).toBe('Keywords are required');
  });

  it('should invalidate less than 3 keywords', () => {
    const result = validator.validate(['biology', 'physics']);
    expect(result.isValid).toBe(false);
    expect(result.errors[0].message).toBe('At least 3 keywords are required');
  });

  it('should validate exactly 3 keywords', () => {
    const result = validator.validate(['biology', 'physics', 'chemistry']);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should invalidate more than 10 keywords', () => {
    const keywords = Array.from({ length: 11 }, (_, i) => `keyword${i}`);
    const result = validator.validate(keywords);
    expect(result.isValid).toBe(false);
    expect(result.errors[0].message).toBe('No more than 10 keywords are allowed');
  });
});
