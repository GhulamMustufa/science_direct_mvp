import { describe, it, expect } from 'vitest';
import { HeadingsValidator } from '../validators/HeadingsValidator.js';
import { RequiredSectionsValidator } from '../validators/RequiredSectionsValidator.js';
import { WordCountValidator } from '../validators/WordCountValidator.js';
import { PageCountValidator } from '../validators/PageCountValidator.js';
import { FiguresValidator } from '../validators/FiguresValidator.js';
import { TablesValidator } from '../validators/TablesValidator.js';
import { ReferencesValidator } from '../validators/ReferencesValidator.js';
import { MetadataValidator } from '../validators/MetadataValidator.js';
import { ParsedDocument } from '../../parser/DocumentParser.js';

describe('Parsed Document Structural Validators', () => {
  describe('HeadingsValidator', () => {
    const validator = new HeadingsValidator();

    it('should invalidate if headings are fewer than 3', () => {
      const result = validator.validate(['Intro', 'Methods']);
      expect(result.isValid).toBe(false);
      expect(result.errors[0].message).toContain('at least 3 headings');
    });

    it('should validate 3 or more headings', () => {
      const result = validator.validate(['Intro', 'Methods', 'Results']);
      expect(result.isValid).toBe(true);
    });
  });

  describe('RequiredSectionsValidator', () => {
    const validator = new RequiredSectionsValidator();

    it('should invalidate if required sections are missing', () => {
      const result = validator.validate(['Intro', 'Results']);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBe(3); // Introduction, Methods, and Discussion missing
    });

    it('should validate if all required sections are present', () => {
      const result = validator.validate([
        '1. Introduction',
        '2. Methodology & Materials',
        '3. Experimental Results',
        '4. Discussion of Findings'
      ]);
      expect(result.isValid).toBe(true);
    });
  });

  describe('WordCountValidator', () => {
    const validator = new WordCountValidator();

    it('should invalidate if word count is too low', () => {
      const result = validator.validate(50);
      expect(result.isValid).toBe(false);
      expect(result.errors[0].message).toContain('at least 100 words');
    });

    it('should invalidate if word count is too high', () => {
      const result = validator.validate(12000);
      expect(result.isValid).toBe(false);
      expect(result.errors[0].message).toContain('cannot exceed 10000 words');
    });

    it('should validate a correct word count', () => {
      const result = validator.validate(3500);
      expect(result.isValid).toBe(true);
    });
  });

  describe('PageCountValidator', () => {
    const validator = new PageCountValidator();

    it('should invalidate if page count is 0', () => {
      const result = validator.validate(0);
      expect(result.isValid).toBe(false);
    });

    it('should invalidate if page count exceeds 50', () => {
      const result = validator.validate(55);
      expect(result.isValid).toBe(false);
    });

    it('should validate correct page count', () => {
      const result = validator.validate(15);
      expect(result.isValid).toBe(true);
    });
  });

  describe('FiguresValidator', () => {
    const validator = new FiguresValidator();

    it('should invalidate if figures exceed 15', () => {
      const figures = Array(16).fill('fig');
      const result = validator.validate(figures);
      expect(result.isValid).toBe(false);
    });

    it('should validate figures within limits', () => {
      const result = validator.validate(['fig1', 'fig2']);
      expect(result.isValid).toBe(true);
    });
  });

  describe('TablesValidator', () => {
    const validator = new TablesValidator();

    it('should invalidate if tables exceed 10', () => {
      const tables = Array(11).fill('table');
      const result = validator.validate(tables);
      expect(result.isValid).toBe(false);
    });

    it('should validate tables within limits', () => {
      const result = validator.validate(['table1']);
      expect(result.isValid).toBe(true);
    });
  });

  describe('ReferencesValidator', () => {
    const validator = new ReferencesValidator();

    it('should invalidate if references are fewer than 5', () => {
      const result = validator.validate(['ref1', 'ref2']);
      expect(result.isValid).toBe(false);
    });

    it('should validate if references are 5 or more', () => {
      const result = validator.validate(['ref1', 'ref2', 'ref3', 'ref4', 'ref5']);
      expect(result.isValid).toBe(true);
    });
  });

  describe('MetadataValidator', () => {
    const validator = new MetadataValidator();

    it('should invalidate if title, abstract, or keywords are missing', () => {
      const doc: ParsedDocument = {
        title: '',
        abstract: 'valid abstract',
        keywords: ['test'],
        sections: [],
        references: [],
        tables: [],
        figures: [],
        pageCount: 1,
        wordCount: 100
      };
      const result = validator.validate(doc);
      expect(result.isValid).toBe(false);
      expect(result.errors[0].message).toContain('Title could not be parsed');
    });

    it('should validate if all metadata fields are present', () => {
      const doc: ParsedDocument = {
        title: 'Superconductivity in Graphene',
        abstract: 'This is a valid abstract explaining the superconductivity.',
        keywords: ['graphene', 'superconductivity'],
        sections: [],
        references: [],
        tables: [],
        figures: [],
        pageCount: 5,
        wordCount: 1500
      };
      const result = validator.validate(doc);
      expect(result.isValid).toBe(true);
    });
  });
});
