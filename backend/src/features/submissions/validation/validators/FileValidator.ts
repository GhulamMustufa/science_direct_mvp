import { Validator } from '../Validator.js';
import { ValidationResult } from '../ValidationResult.js';

export interface FileData {
  mimetype: string;
  size: number;
}

export class FileValidator implements Validator<FileData | undefined> {
  validate(file: FileData | undefined): ValidationResult {
    if (!file) {
      return {
        isValid: false,
        errors: [{ field: 'file', message: 'PDF or Word Document file is required' }]
      };
    }

    const errors = [];
    const allowedMimeTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
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
