
import { TestCase } from '../types/calculatorTypes';

// Extract test cases from the test code
export const extractTestCases = (testCodeString: string): TestCase[] => {
  const testCases: TestCase[] = [];
  const lines = testCodeString.split('\n');
  let currentTest = '';
  let testName = '';
  let collecting = false;
  
  // Check for import/require statements to determine function names
  const importLines = lines.filter(line => line.includes('require') || line.includes('import'));
  let importedFunctions: string[] = [];
  
  for (const line of importLines) {
    // Extract function names from require/import statements
    const match = line.match(/const\s+\{\s*([^}]+)\s*\}\s*=\s*require/);
    if (match && match[1]) {
      importedFunctions = match[1].split(',').map(fn => fn.trim());
    }
  }
  
  for (const line of lines) {
    if (line.includes('test(') || line.includes('it(')) {
      // Start collecting a new test
      collecting = true;
      testName = line.match(/['"]([^'"]+)['"]/)?.[1] || 'unnamed test';
      currentTest = line + '\n';
    } else if (collecting) {
      currentTest += line + '\n';
      if (line.includes('});')) {
        // End of test case reached
        testCases.push({
          name: testName,
          testFunction: currentTest
        });
        currentTest = '';
        collecting = false;
      }
    }
  }
  
  return testCases;
};
