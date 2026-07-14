import { describe, it, expect } from 'vitest';
import { AuthorValidator } from '../validators/AuthorValidator';

describe('AuthorValidator', () => {
  const validator = new AuthorValidator();

  const validAuthor = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    affiliation: 'University of Science',
    isCorresponding: true
  };

  it('should invalidate undefined authors', () => {
    const result = validator.validate(undefined);
    expect(result.isValid).toBe(false);
    expect(result.errors[0].message).toBe('Author information is required');
  });

  it('should invalidate empty authors array', () => {
    const result = validator.validate([]);
    expect(result.isValid).toBe(false);
    expect(result.errors[0].message).toBe('At least one author is required');
  });

  it('should validate correctly formatted authors with a corresponding author', () => {
    const result = validator.validate([validAuthor]);
    expect(result.isValid).toBe(true);
  });

  it('should invalidate authors missing a corresponding author', () => {
    const author = { ...validAuthor, isCorresponding: false };
    const result = validator.validate([author]);
    expect(result.isValid).toBe(false);
    expect(result.errors[0].message).toBe('At least one corresponding author must be selected');
  });

  it('should invalidate authors with missing email', () => {
    const author = { ...validAuthor, email: 'not-an-email' };
    const result = validator.validate([author]);
    expect(result.isValid).toBe(false);
    expect(result.errors[0].message).toBe('Valid email is required for all authors');
  });

  it('should invalidate authors with missing affiliation', () => {
    const author = { ...validAuthor, affiliation: '' };
    const result = validator.validate([author]);
    expect(result.isValid).toBe(false);
    expect(result.errors[0].message).toBe('Affiliation is required for all authors');
  });
});
