export interface ValidationError {
  field: string;
  message: string;
  severity?: 'error' | 'warning';
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface ValidationIssue {
  field: string;
  message: string;
  severity: 'error' | 'warning';
  category: string;
}

export interface CategoryResult {
  score: number;
  passed: string[];
  issues: ValidationIssue[];
}

export interface ValidationReport {
  isValid: boolean;
  score: number;
  passed: Array<{ name: string; category: string }>;
  warnings: ValidationIssue[];
  errors: ValidationIssue[];
  executionTimeMs: number;
  categories: {
    [category: string]: CategoryResult;
  };
}
