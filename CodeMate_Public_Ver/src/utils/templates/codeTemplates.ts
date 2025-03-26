
// Default test code for calculator with only 3 test cases
export const DEFAULT_TEST_CODE = `const { add, subtract, multiply } = require('./calculator');

describe('Calculator', () => {
  // Test cases for add function
  test('should correctly add two positive numbers', () => {
    expect(add(2, 3)).toBe(5);
  });

  // Test cases for subtract function
  test('should correctly subtract two positive numbers', () => {
    expect(subtract(5, 3)).toBe(2);
  });

  // Test cases for multiply function
  test('should correctly multiply two positive numbers', () => {
    expect(multiply(2, 3)).toBe(6);
  });
});`;

// Default implementation code
export const DEFAULT_IMPLEMENTATION_CODE = `// Simple Calculator Implementation

/**
 * Adds two numbers together
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Sum of a and b
 */
function add(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    return 0;
  }
  return a + b;
}

/**
 * Subtracts the second number from the first
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Result of a - b
 */
function subtract(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    return 0;
  }
  return a - b;
}

/**
 * Multiplies two numbers
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Product of a and b
 */
function multiply(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    return 0;
  }
  return a * b;
}

// Log function availability for debugging
console.log('Function availability:', {
  add: typeof add,
  subtract: typeof subtract,
  multiply: typeof multiply
});

module.exports = {
  add,
  subtract,
  multiply
};`;
