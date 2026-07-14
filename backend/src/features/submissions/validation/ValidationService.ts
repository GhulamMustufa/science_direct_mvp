import { 
  ValidationResult, 
  ValidationError, 
  ValidationIssue, 
  ValidationReport,
  CategoryResult 
} from './ValidationResult.js';
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
    const report = this.validateSubmissionReport(payload);
    return {
      isValid: report.isValid,
      errors: report.errors
    };
  }

  validateSubmissionReport(payload: SubmissionPayload): ValidationReport {
    const startTime = performance.now();

    const parsed = payload.parsedDocument || ({} as Partial<ParsedDocument>);
    const finalTitle = parsed.title || payload.title;
    const finalAbstract = parsed.abstract || payload.abstract;
    const finalKeywords = parsed.keywords && parsed.keywords.length > 0 ? parsed.keywords : payload.keywords;
    const finalAuthors = payload.authors;
    const finalSection = payload.section;
    const finalLanguage = payload.language;

    const categoryMap: { [key: string]: string } = {
      title: 'Metadata',
      abstract: 'Metadata',
      keywords: 'Metadata',
      section: 'Metadata',
      language: 'Metadata',
      metadata: 'Metadata',
      authors: 'Authors',
      file: 'File',
      headings: 'Structure',
      sections: 'Structure',
      wordCount: 'Structure',
      pageCount: 'Structure',
      figures: 'Structure',
      tables: 'Structure',
      references: 'Structure'
    };

    const runCheck = (
      name: string,
      validator: { validate: (arg: any) => ValidationResult },
      value: any
    ): ValidationIssue[] => {
      const res = validator.validate(value);
      const cat = categoryMap[name] || 'General';
      return res.errors.map(err => ({
        field: name,
        message: err.message,
        severity: err.severity || 'error',
        category: cat
      }));
    };

    const rawIssues: ValidationIssue[] = [];

    // Run Metadata Validators
    rawIssues.push(...runCheck('title', this.titleValidator, finalTitle));
    rawIssues.push(...runCheck('abstract', this.abstractValidator, finalAbstract));
    rawIssues.push(...runCheck('keywords', this.keywordValidator, finalKeywords));
    rawIssues.push(...runCheck('section', this.sectionValidator, finalSection));
    rawIssues.push(...runCheck('language', this.languageValidator, finalLanguage));

    // Run Authors Validator
    rawIssues.push(...runCheck('authors', this.authorValidator, finalAuthors));

    // Run File Validator
    rawIssues.push(...runCheck('file', this.fileValidator, payload.file));

    // Run Structural Parsed Document Validators
    if (payload.parsedDocument) {
      rawIssues.push(...runCheck('headings', this.headingsValidator, payload.parsedDocument.sections));
      rawIssues.push(...runCheck('sections', this.requiredSectionsValidator, payload.parsedDocument.sections));
      rawIssues.push(...runCheck('wordCount', this.wordCountValidator, payload.parsedDocument.wordCount));
      rawIssues.push(...runCheck('pageCount', this.pageCountValidator, payload.parsedDocument.pageCount));
      rawIssues.push(...runCheck('figures', this.figuresValidator, payload.parsedDocument.figures));
      rawIssues.push(...runCheck('tables', this.tablesValidator, payload.parsedDocument.tables));
      rawIssues.push(...runCheck('references', this.referencesValidator, payload.parsedDocument.references));
      rawIssues.push(...runCheck('metadata', this.metadataValidator, payload.parsedDocument));
    }

    const categoriesList = ['Metadata', 'Authors', 'File', 'Structure'];
    const categories: { [category: string]: CategoryResult } = {};
    
    for (const cat of categoriesList) {
      categories[cat] = {
        score: 100,
        passed: [],
        issues: []
      };
    }

    // Populate issues into categories
    const errors: ValidationIssue[] = [];
    const warnings: ValidationIssue[] = [];

    for (const issue of rawIssues) {
      const catObj = categories[issue.category] || { score: 100, passed: [], issues: [] };
      catObj.issues.push(issue);
      if (issue.severity === 'error') {
        errors.push(issue);
        catObj.score = Math.max(0, catObj.score - 20);
      } else {
        warnings.push(issue);
        catObj.score = Math.max(0, catObj.score - 5);
      }
    }

    // Determine which checks passed
    const allChecks = [
      { name: 'Document Title Check', field: 'title', category: 'Metadata' },
      { name: 'Document Abstract Check', field: 'abstract', category: 'Metadata' },
      { name: 'Keywords Compliance', field: 'keywords', category: 'Metadata' },
      { name: 'Journal Section Match', field: 'section', category: 'Metadata' },
      { name: 'Language Setting Check', field: 'language', category: 'Metadata' },
      { name: 'Authors Information', field: 'authors', category: 'Authors' },
      { name: 'File Structure Validation', field: 'file', category: 'File' }
    ];

    if (payload.parsedDocument) {
      allChecks.push(
        { name: 'Headings Count', field: 'headings', category: 'Structure' },
        { name: 'Required Sections Verification', field: 'sections', category: 'Structure' },
        { name: 'Word Count Limits', field: 'wordCount', category: 'Structure' },
        { name: 'Page Count Limits', field: 'pageCount', category: 'Structure' },
        { name: 'Figures Limit and Density', field: 'figures', category: 'Structure' },
        { name: 'Tables Limit and Density', field: 'tables', category: 'Structure' },
        { name: 'References Density Check', field: 'references', category: 'Structure' },
        { name: 'Comprehensive Metadata Extract', field: 'metadata', category: 'Metadata' }
      );
    }

    const passed: Array<{ name: string; category: string }> = [];

    for (const check of allChecks) {
      const fieldIssues = rawIssues.filter(i => i.field === check.field);
      // If there are no error level issues, we consider it passed (warnings don't fail the check, but are listed separately)
      if (!fieldIssues.some(i => i.severity === 'error')) {
        passed.push(check);
        categories[check.category].passed.push(check.name);
      }
    }

    // Overall score is the average of category scores
    let totalScoreSum = 0;
    for (const cat of categoriesList) {
      totalScoreSum += categories[cat].score;
    }
    const score = Math.round(totalScoreSum / categoriesList.length);

    const executionTimeMs = performance.now() - startTime;

    return {
      isValid: errors.length === 0,
      score,
      passed,
      warnings,
      errors,
      executionTimeMs,
      categories
    };
  }

  validateRevision(payload: { file?: FileData }): ValidationResult {
    return this.fileValidator.validate(payload.file);
  }
}

export const validationService = new ValidationService();
