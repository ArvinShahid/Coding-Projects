
import React from 'react';
import { RotateCw } from 'lucide-react';

const TDDSectionDetails: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-black/20 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-codemate-purple-light">How It Works:</h3>
        <ol className="list-decimal list-inside space-y-4 text-gray-300">
          <li className="p-2 bg-black/20 rounded">
            <span className="font-semibold">Describe Your Feature</span>
            <p className="text-sm mt-1">Tell CodeMate what you want to build in plain English. No need for formal specifications.</p>
          </li>
          <li className="p-2 bg-black/20 rounded">
            <span className="font-semibold">AI Generates Test Cases</span>
            <p className="text-sm mt-1">Our AI automatically creates comprehensive test cases that cover all edge cases and requirements.</p>
          </li>
          <li className="p-2 bg-black/20 rounded">
            <span className="font-semibold">Implement With Guidance</span>
            <p className="text-sm mt-1">Write your code with AI suggestions to make the tests pass, ensuring your implementation meets all requirements.</p>
          </li>
          <li className="p-2 bg-black/20 rounded">
            <span className="font-semibold">Refactor Confidently</span>
            <p className="text-sm mt-1">Improve your code knowing that the tests will catch any regressions.</p>
          </li>
        </ol>
      </div>

      <div className="bg-black/20 p-6 rounded-lg font-mono text-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="text-codemate-purple-light">// Example Workflow</div>
          <RotateCw className="h-4 w-4 text-gray-400 animate-spin" />
        </div>
        <p className="text-green-400 mb-2">// 1. Feature Request</p>
        <div className="bg-black/40 p-3 rounded mb-4 text-white">
          "Create a calculator function that adds two numbers and handles negative inputs correctly"
        </div>
        
        <p className="text-green-400 mb-2">// 2. AI-Generated Tests</p>
        <code className="block text-white whitespace-pre-wrap mb-4 bg-black/40 p-3 rounded">
{`describe('Calculator', () => {
  test('should correctly add two numbers', () => {
    const result = add(2, 3);
    expect(result).toEqual(5);
  });

  test('should handle negative numbers', () => {
    const result = add(-2, 3);
    expect(result).toEqual(1);
  });
});`}
        </code>
        
        <p className="text-green-400 mb-2">// 3. AI-Assisted Implementation</p>
        <code className="block text-white whitespace-pre-wrap bg-black/40 p-3 rounded">
{`function add(a: number, b: number): number {
  return a + b;
}`}
        </code>
      </div>
    </div>
  );
};

export default TDDSectionDetails;
