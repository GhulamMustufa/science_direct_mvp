import { Validator } from '../Validator';
import { ValidationResult } from '../ValidationResult';

export interface ChecklistState {
  originality: boolean;
  format: boolean;
  references: boolean;
  styling: boolean;
  ethics: boolean;
}

export class ChecklistValidator implements Validator<ChecklistState> {
  validate(checklist: ChecklistState): ValidationResult {
    const allChecked = Object.values(checklist).every(Boolean);
    if (!allChecked) {
      return {
        isValid: false,
        errors: [{ field: 'checklist', message: 'You must agree to all the submission checklist requirements to proceed.' }]
      };
    }
    return { isValid: true, errors: [] };
  }
}
