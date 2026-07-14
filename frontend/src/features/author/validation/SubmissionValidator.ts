import { ValidationResult, ValidationError } from './ValidationResult';
import { TitleValidator } from './validators/TitleValidator';
import { AbstractValidator } from './validators/AbstractValidator';
import { AuthorValidator, AuthorData } from './validators/AuthorValidator';
import { FileValidator } from './validators/FileValidator';
import { KeywordValidator } from './validators/KeywordValidator';
import { SectionValidator } from './validators/SectionValidator';
import { LanguageValidator } from './validators/LanguageValidator';
import { ChecklistValidator, ChecklistState } from './validators/ChecklistValidator';

export interface FrontendSubmissionPayload {
  title?: string;
  abstract?: string;
  authors?: AuthorData[];
  keywords?: string[];
  section?: string;
  language?: string;
  file?: File | null;
  checklist?: ChecklistState;
}

export class SubmissionValidator {
  private titleValidator = new TitleValidator();
  private abstractValidator = new AbstractValidator();
  private authorValidator = new AuthorValidator();
  private keywordValidator = new KeywordValidator();
  private sectionValidator = new SectionValidator();
  private languageValidator = new LanguageValidator();
  private fileValidator = new FileValidator();
  private checklistValidator = new ChecklistValidator();

  validateSubmission(payload: FrontendSubmissionPayload): ValidationResult {
    const errors: ValidationError[] = [];

    // We no longer validate Title, Abstract, or Keywords on the frontend because
    // they are parsed and validated on the backend from the uploaded document.

    const authorRes = this.authorValidator.validate(payload.authors);
    if (!authorRes.isValid) errors.push(...authorRes.errors);

    const sectionRes = this.sectionValidator.validate(payload.section);
    if (!sectionRes.isValid) errors.push(...sectionRes.errors);

    const languageRes = this.languageValidator.validate(payload.language);
    if (!languageRes.isValid) errors.push(...languageRes.errors);

    const fileRes = this.fileValidator.validate(payload.file ?? null);
    if (!fileRes.isValid) errors.push(...fileRes.errors);

    const checklistRes = this.checklistValidator.validate(payload.checklist ?? {
      originality: false,
      format: false,
      references: false,
      styling: false,
      ethics: false
    });
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
