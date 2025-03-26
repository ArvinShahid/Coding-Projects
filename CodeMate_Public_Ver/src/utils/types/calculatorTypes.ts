
// Types for the calculator functions
export interface CalculatorFunctions {
  add?: (a: number, b: number) => number;
  subtract?: (a: number, b: number) => number;
  multiply?: (a: number, b: number) => number;
  addExponent?: (base: number, exponent: number) => number;
  exponent?: (base: number, exponent: number) => number; // Add both possible function names
  divide?: (a: number, b: number) => number | string;
  squareRoot?: (a: number) => number | string;
  [key: string]: any;
}

export interface TestResult {
  passing: number;
  failing: number;
  total: number;
  logs: string[];
  failingTests: Array<{name: string, error: string}>;
}

export interface TestCase {
  name: string;
  testFunction: string;
}
