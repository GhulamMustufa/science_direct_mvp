import { Validator } from '../Validator.js';
import { ValidationResult } from '../ValidationResult.js';

export class RequiredSectionsValidator implements Validator<string[] | undefined> {
  validate(sections: string[] | undefined): ValidationResult {
    const errors = [];
    const secList = sections || [];

    const requiredTerms = [
      { name: 'Introduction', regex: /introduction/i },
      { name: 'Methods/Methodology', regex: /(methods|methodology)/i },
      { name: 'Results', regex: /results/i },
      { name: 'Discussion', regex: /discussion/i }
    ];

    for (const term of requiredTerms) {
      const hasSection = secList.some(s => term.regex.test(s));
      if (!hasSection) {
        errors.push({
          field: 'sections',
          message: `Missing required section: ${term.name}`
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
