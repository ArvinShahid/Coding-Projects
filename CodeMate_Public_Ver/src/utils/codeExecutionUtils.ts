
// Re-export all functionality from the smaller modules to maintain the same API
import { DEFAULT_IMPLEMENTATION_CODE, DEFAULT_TEST_CODE } from './templates/codeTemplates';
import { executeCode } from './execution/codeExecutor';
import { extractTestCases } from './testing/testExtractor';
import { executeTestsWithCode } from './testing/testValidator';
import type { CalculatorFunctions, TestResult, TestCase } from './types/calculatorTypes';

// Re-export the types with 'export type' explicitly
export type { CalculatorFunctions, TestResult, TestCase };

// Re-export the functions
export {
  DEFAULT_IMPLEMENTATION_CODE,
  DEFAULT_TEST_CODE,
  executeCode,
  extractTestCases,
  executeTestsWithCode
};
