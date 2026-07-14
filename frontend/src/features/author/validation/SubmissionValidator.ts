import { ValidationResult, ValidationError } from './ValidationResult';
import { TitleValidator } from './validators/TitleValidator';
import { AbstractValidator } from './validators/AbstractValidator';
import { FileValidator } from './validators/FileValidator';
import { ChecklistValidator, ChecklistState } from './validators/ChecklistValidator';

export interface FrontendSubmissionPayload {
  title: string;
  abstract: string;
  file: File | null;
  checklist: ChecklistState;
}

export class SubmissionValidator {
  private titleValidator = new TitleValidator();
  private abstractValidator = new AbstractValidator();
  private fileValidator = new FileValidator();
  private checklistValidator = new ChecklistValidator();

  validateSubmission(payload: FrontendSubmissionPayload): ValidationResult {
    const errors: ValidationError[] = [];

    const titleRes = this.titleValidator.validate(payload.title);
    if (!titleRes.isValid) errors.push(...titleRes.errors);

    const abstractRes = this.abstractValidator.validate(payload.abstract);
    if (!abstractRes.isValid) errors.push(...abstractRes.errors);

    const fileRes = this.fileValidator.validate(payload.file);
    if (!fileRes.isValid) errors.push(...fileRes.errors);

    const checklistRes = this.checklistValidator.validate(payload.checklist);
    if (!checklistRes.isValid) errors.push(...checklistRes.errors);

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  validateRevision(payload: { file: File | null }): ValidationResult {
    return this.fileValidator.validate(payload.file);
  }
}

export const submissionValidator = new SubmissionValidator();
