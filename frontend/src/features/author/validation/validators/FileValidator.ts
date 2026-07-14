import { Validator } from '../Validator';
import { ValidationResult } from '../ValidationResult';

export class FileValidator implements Validator<File | null> {
  validate(file: File | null): ValidationResult {
    if (!file) {
      return {
        isValid: false,
        errors: [{ field: 'file', message: 'PDF or Word Document file is required' }]
      };
    }

    const errors = [];
    const allowedExtensions = ['.pdf', '.docx', '.doc'];
    const fileName = file.name.toLowerCase();
    
    if (!allowedExtensions.some(ext => fileName.endsWith(ext))) {
      errors.push({ field: 'file', message: 'Only PDF and Word Document (.docx, .doc) files are allowed' });
    }

    if (file.size > 10 * 1024 * 1024) {
      errors.push({ field: 'file', message: 'File size cannot exceed 10MB' });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
