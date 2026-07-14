import { ValidationResult, ValidationError } from './ValidationResult.js';
import { TitleValidator } from './validators/TitleValidator.js';
import { AbstractValidator } from './validators/AbstractValidator.js';
import { AuthorValidator } from './validators/AuthorValidator.js';
import { FileValidator, FileData } from './validators/FileValidator.js';

export interface SubmissionPayload {
  title?: string;
  abstract?: string;
  additionalAuthors?: string;
  file?: FileData;
}

export class ValidationService {
  private titleValidator = new TitleValidator();
  private abstractValidator = new AbstractValidator();
  private authorValidator = new AuthorValidator();
  private fileValidator = new FileValidator();

  validateSubmission(payload: SubmissionPayload): ValidationResult {
    const errors: ValidationError[] = [];

    const titleRes = this.titleValidator.validate(payload.title);
    if (!titleRes.isValid) errors.push(...titleRes.errors);

    const abstractRes = this.abstractValidator.validate(payload.abstract);
    if (!abstractRes.isValid) errors.push(...abstractRes.errors);

    const authorRes = this.authorValidator.validate(payload.additionalAuthors);
    if (!authorRes.isValid) errors.push(...authorRes.errors);

    const fileRes = this.fileValidator.validate(payload.file);
    if (!fileRes.isValid) errors.push(...fileRes.errors);

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  validateRevision(payload: { file?: FileData }): ValidationResult {
    return this.fileValidator.validate(payload.file);
  }
}

export const validationService = new ValidationService();
