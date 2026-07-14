import { ValidationResult, ValidationError } from './ValidationResult.js';
import { TitleValidator } from './validators/TitleValidator.js';
import { AbstractValidator } from './validators/AbstractValidator.js';
import { AuthorValidator, AuthorData } from './validators/AuthorValidator.js';
import { FileValidator, FileData } from './validators/FileValidator.js';
import { KeywordValidator } from './validators/KeywordValidator.js';
import { SectionValidator } from './validators/SectionValidator.js';
import { LanguageValidator } from './validators/LanguageValidator.js';
import { ParsedDocument } from '../parser/DocumentParser.js';
import { HeadingsValidator } from './validators/HeadingsValidator.js';
import { RequiredSectionsValidator } from './validators/RequiredSectionsValidator.js';
import { WordCountValidator } from './validators/WordCountValidator.js';
import { PageCountValidator } from './validators/PageCountValidator.js';
import { FiguresValidator } from './validators/FiguresValidator.js';
import { TablesValidator } from './validators/TablesValidator.js';
import { ReferencesValidator } from './validators/ReferencesValidator.js';
import { MetadataValidator } from './validators/MetadataValidator.js';

export interface SubmissionPayload {
  title?: string;
  abstract?: string;
  authors?: AuthorData[];
  keywords?: string[];
  section?: string;
  language?: string;
  file?: FileData;
  parsedDocument?: ParsedDocument;
}

export class ValidationService {
  private titleValidator = new TitleValidator();
  private abstractValidator = new AbstractValidator();
  private authorValidator = new AuthorValidator();
  private fileValidator = new FileValidator();
  private keywordValidator = new KeywordValidator();
  private sectionValidator = new SectionValidator();
  private languageValidator = new LanguageValidator();
  private headingsValidator = new HeadingsValidator();
  private requiredSectionsValidator = new RequiredSectionsValidator();
  private wordCountValidator = new WordCountValidator();
  private pageCountValidator = new PageCountValidator();
  private figuresValidator = new FiguresValidator();
  private tablesValidator = new TablesValidator();
  private referencesValidator = new ReferencesValidator();
  private metadataValidator = new MetadataValidator();

  validateSubmission(payload: SubmissionPayload): ValidationResult {
    const errors: ValidationError[] = [];

    // Fallback strategy: Parsed Document takes priority, fallback to manual form inputs
    const parsed = payload.parsedDocument || ({} as Partial<ParsedDocument>);
    
    const finalTitle = parsed.title || payload.title;
    const finalAbstract = parsed.abstract || payload.abstract;
    const finalKeywords = parsed.keywords && parsed.keywords.length > 0 ? parsed.keywords : payload.keywords;
    
    // Authors, section, and language are usually manual because they involve structured/system-specific enum data
    const finalAuthors = payload.authors; 
    const finalSection = payload.section;
    const finalLanguage = payload.language;

    const titleRes = this.titleValidator.validate(finalTitle);
    if (!titleRes.isValid) errors.push(...titleRes.errors);

    const abstractRes = this.abstractValidator.validate(finalAbstract);
    if (!abstractRes.isValid) errors.push(...abstractRes.errors);

    const authorRes = this.authorValidator.validate(finalAuthors);
    if (!authorRes.isValid) errors.push(...authorRes.errors);

    const keywordRes = this.keywordValidator.validate(finalKeywords);
    if (!keywordRes.isValid) errors.push(...keywordRes.errors);

    const sectionRes = this.sectionValidator.validate(finalSection);
    if (!sectionRes.isValid) errors.push(...sectionRes.errors);

    const languageRes = this.languageValidator.validate(finalLanguage);
    if (!languageRes.isValid) errors.push(...languageRes.errors);

    const fileRes = this.fileValidator.validate(payload.file);
    if (!fileRes.isValid) errors.push(...fileRes.errors);

    // Structural validations on the parsed document
    if (payload.parsedDocument) {
      const headingsRes = this.headingsValidator.validate(payload.parsedDocument.sections);
      if (!headingsRes.isValid) errors.push(...headingsRes.errors);

      const reqSectionsRes = this.requiredSectionsValidator.validate(payload.parsedDocument.sections);
      if (!reqSectionsRes.isValid) errors.push(...reqSectionsRes.errors);

      const wordCountRes = this.wordCountValidator.validate(payload.parsedDocument.wordCount);
      if (!wordCountRes.isValid) errors.push(...wordCountRes.errors);

      const pageCountRes = this.pageCountValidator.validate(payload.parsedDocument.pageCount);
      if (!pageCountRes.isValid) errors.push(...pageCountRes.errors);

      const figuresRes = this.figuresValidator.validate(payload.parsedDocument.figures);
      if (!figuresRes.isValid) errors.push(...figuresRes.errors);

      const tablesRes = this.tablesValidator.validate(payload.parsedDocument.tables);
      if (!tablesRes.isValid) errors.push(...tablesRes.errors);

      const referencesRes = this.referencesValidator.validate(payload.parsedDocument.references);
      if (!referencesRes.isValid) errors.push(...referencesRes.errors);

      const metadataRes = this.metadataValidator.validate(payload.parsedDocument);
      if (!metadataRes.isValid) errors.push(...metadataRes.errors);
    }

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
