
import { TestResult } from '../types/calculatorTypes';
import { executeCode } from '../execution/codeExecutor';

// Execute tests with arbitrary code
export const executeTestsWithCode = (implementationCode: string, testCode: string): TestResult => {
  // First run the implementation code to get any exports
  const implementationResult = executeCode(implementationCode);
  
  // Prepare the logs and start with implementation logs
  const logs: string[] = [...(implementationResult.logs || [])];
  
  // If implementation failed, return error
  if (!implementationResult.success) {
    return {
      passing: 0,
      failing: 1,
      total: 1,
      logs,
      failingTests: [{
        name: 'Implementation Code Error',
        error: implementationResult.errors?.[0] || 'Unknown error in implementation code'
      }]
    };
  }
  
  // Extract exported functions to make them available to tests
  const exportedFunctions = implementationResult.exportedValues || {};
  
  // Create a combined code that includes both implementation exports and tests
  let combinedCode = '// Making implementation exports available\n';
  
  // Extract all exports from the implementation to be available in tests
  Object.entries(exportedFunctions).forEach(([name, func]) => {
    // For functions, we need to maintain their toString() representation
    if (typeof func === 'function') {
      combinedCode += `const ${name} = ${func.toString()};\n`;
    } else {
      // For non-function values, we can just stringify
      combinedCode += `const ${name} = ${JSON.stringify(func)};\n`;
    }
  });
  
  // Also make functions available through require('./calculator')
  combinedCode += `
  // Make exports available through require
  module.exports = {
    ${Object.keys(exportedFunctions).join(', ')}
  };
  `;
  
  // Add lightweight test framework
  combinedCode += `
  // Lightweight test framework
  let __tests = [];
  let __currentTest = null;
  
  function describe(name, fn) {
    console.log(\`[TEST SUITE] \${name}\`);
    try {
      fn();
    } catch (e) {
      console.error(\`[TEST SUITE ERROR] \${name}: \${e.message}\`);
    }
  }
  
  function test(name, fn) {
    __currentTest = { name, passed: false, error: null };
    __tests.push(__currentTest);
    
    try {
      console.log(\`[TEST] Running: \${name}\`);
      fn();
      __currentTest.passed = true;
      console.log(\`[TEST] Passed: \${name}\`);
    } catch (e) {
      __currentTest.error = e.message;
      console.error(\`[TEST] Failed: \${name} - \${e.message}\`);
    }
  }
  
  // Alias for test
  const it = test;
  
  // Helper function for NaN comparison
  const isNaN = (value) => value !== value;
  
  // Mock expect functions
  function expect(actual) {
    return {
      toBe: (expected) => {
        // Special handling for NaN
        if (isNaN(expected) && isNaN(actual)) {
          return; // NaN is equal to NaN for test purposes
        }
        if (actual !== expected) {
          throw new Error(\`Expected \${JSON.stringify(expected)}, received \${JSON.stringify(actual)}\`);
        }
      },
      toEqual: (expected) => {
        // Special handling for NaN in objects/arrays
        const serializedActual = JSON.stringify(actual, (_, value) => 
          isNaN(value) ? "NaN_PLACEHOLDER" : value
        );
        const serializedExpected = JSON.stringify(expected, (_, value) => 
          isNaN(value) ? "NaN_PLACEHOLDER" : value
        );
        
        if (serializedActual !== serializedExpected) {
          throw new Error(\`Expected \${JSON.stringify(expected)}, received \${JSON.stringify(actual)}\`);
        }
      },
      toBeTruthy: () => {
        if (!actual) {
          throw new Error(\`Expected \${actual} to be truthy\`);
        }
      },
      toBeFalsy: () => {
        if (actual) {
          throw new Error(\`Expected \${actual} to be falsy\`);
        }
      },
      toContain: (item) => {
        if (!actual.includes(item)) {
          throw new Error(\`Expected \${JSON.stringify(actual)} to contain \${JSON.stringify(item)}\`);
        }
      },
      toBeCloseTo: (expected, precision = 2) => {
        const power = Math.pow(10, precision);
        const actualRounded = Math.round(actual * power) / power;
        const expectedRounded = Math.round(expected * power) / power;
        if (actualRounded !== expectedRounded) {
          throw new Error(\`Expected \${expected} to be close to \${actual} (with precision \${precision})\`);
        }
      },
      toBeNaN: () => {
        if (!isNaN(actual)) {
          throw new Error(\`Expected \${actual} to be NaN\`);
        }
      },
      toThrow: () => {
        let threw = false;
        try {
          actual();
        } catch (e) {
          threw = true;
        }
        if (!threw) {
          throw new Error('Expected function to throw an error');
        }
      },
      not: {
        toBe: (expected) => {
          if (actual === expected) {
            throw new Error(\`Expected \${JSON.stringify(actual)} not to be \${JSON.stringify(expected)}\`);
          }
        },
        toEqual: (expected) => {
          if (JSON.stringify(actual) === JSON.stringify(expected)) {
            throw new Error(\`Expected \${JSON.stringify(actual)} not to equal \${JSON.stringify(expected)}\`);
          }
        },
        toBeNaN: () => {
          if (isNaN(actual)) {
            throw new Error(\`Expected \${actual} not to be NaN\`);
          }
        }
      }
    };
  }
  
  // Run the tests
  try {
    // User's test code will run here
    ${testCode}
    
    // After running all tests
    console.log(\`[SUMMARY] Total tests: \${__tests.length}, Passed: \${__tests.filter(t => t.passed).length}, Failed: \${__tests.filter(t => !t.passed).length}\`);
  } catch (e) {
    console.error(\`[ERROR] Error in test suite: \${e.message}\`);
  }
  
  // Return the test results
  return {
    tests: __tests,
    summary: {
      total: __tests.length,
      passing: __tests.filter(t => t.passed).length,
      failing: __tests.filter(t => !t.passed).length
    }
  };
  `;
  
  // Execute the combined code
  const testResult = executeCode(combinedCode);
  
  // Extract test results from the logs
  let passing = 0;
  let failing = 0;
  const failingTests: Array<{name: string, error: string}> = [];
  
  // Count passing and failing tests from log output
  testResult.logs.forEach(log => {
    if (log.includes('[TEST] Passed:')) {
      passing++;
    } else if (log.includes('[TEST] Failed:')) {
      const match = log.match(/\[TEST\] Failed: (.*?) - (.*)/);
      if (match && match.length >= 3) {
        failing++;
        failingTests.push({
          name: match[1],
          error: match[2]
        });
      }
    }
  });
  
  // If no tests were found in logs, look for results in the exports
  if ((passing === 0 && failing === 0) && testResult.exportedValues?.tests) {
    const tests = testResult.exportedValues.tests;
    passing = tests.filter((t: any) => t.passed).length;
    failing = tests.filter((t: any) => !t.passed).length;
    
    tests.filter((t: any) => !t.passed).forEach((test: any) => {
      failingTests.push({
        name: test.name,
        error: test.error || 'Test failed'
      });
    });
  }
  
  return {
    passing,
    failing,
    total: passing + failing,
    logs: testResult.logs,
    failingTests
  };
};
