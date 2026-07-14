import { Validator } from '../Validator.js';
import { ValidationResult } from '../ValidationResult.js';
import { ParsedDocument } from '../../parser/DocumentParser.js';

export class MetadataValidator implements Validator<ParsedDocument | undefined> {
  validate(parsedDoc: ParsedDocument | undefined): ValidationResult {
    const errors = [];
    if (!parsedDoc) {
      return {
        isValid: false,
        errors: [{ field: 'metadata', message: 'No document metadata was parsed' }]
      };
    }

    if (!parsedDoc.title || parsedDoc.title.trim().length === 0) {
      errors.push({ field: 'metadata', message: 'Document Title could not be parsed' });
    }
    if (!parsedDoc.abstract || parsedDoc.abstract.trim().length === 0) {
      errors.push({ field: 'metadata', message: 'Document Abstract could not be parsed' });
    }
    if (!parsedDoc.keywords || parsedDoc.keywords.length === 0) {
      errors.push({ field: 'metadata', message: 'Document Keywords could not be parsed' });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
