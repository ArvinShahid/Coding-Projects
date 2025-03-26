
import React from 'react';
import { Button } from "@/components/ui/button";
import { Play, Check, X, PlusCircle, Loader2 } from 'lucide-react';

interface TestRunnerProps {
  showTestResults: boolean;
  onRunTests: () => void;
  testResults: {
    passing: number;
    failing: number;
    total: number;
    logs?: string[];
    failingTests?: Array<{
      name: string;
      error: string;
    }>;
  };
  generatedTestCases?: string;
  onAddTestCase?: (testCase: string) => void;
  isGenerating?: boolean;
}

const TestRunner: React.FC<TestRunnerProps> = ({ 
  showTestResults, 
  onRunTests, 
  testResults,
  generatedTestCases,
  onAddTestCase,
  isGenerating = false
}) => {
  // Function to parse generated test cases - limit to 5 max
  const parseGeneratedTests = () => {
    if (!generatedTestCases) return [];
    
    // Simple parsing logic to identify individual test cases
    const testBlocks: string[] = [];
    const lines = generatedTestCases.split('\n');
    let currentBlock = '';
    let inBlock = false;
    
    for (const line of lines) {
      if (line.includes('test(') || line.includes('it(')) {
        if (inBlock) {
          testBlocks.push(currentBlock);
          currentBlock = '';
        }
        inBlock = true;
      }
      
      if (inBlock) {
        currentBlock += line + '\n';
      }
      
      if (inBlock && line.includes('});') && !line.includes('describe')) {
        testBlocks.push(currentBlock);
        currentBlock = '';
        inBlock = false;
      }
    }
    
    // If there's a remaining block
    if (currentBlock.trim() !== '') {
      testBlocks.push(currentBlock);
    }
    
    // Limit to 5 test cases
    return testBlocks.filter(block => block.trim() !== '').slice(0, 5);
  };

  // Generate test result elements
  const generateTestResultElements = () => {
    const elements = [];
    
    // Create passing test elements
    if (testResults.passing > 0) {
      // For passing tests, use the actual test names if available
      const passingTests = [];
      
      // If we have failing tests record, we can infer passing tests
      if (testResults.failingTests && testResults.total > 0) {
        // Extract all test names from test results
        const allTestNames = Array.from(Array(testResults.total).keys()).map(i => `Test ${i+1}`);
        const failingTestNames = testResults.failingTests.map(test => test.name);
        
        // Tests that aren't failing are passing
        passingTests.push(...allTestNames.filter(name => !failingTestNames.includes(name)));
      } else {
        // If we don't have specific test names, use generic ones
        passingTests.push(...Array.from(Array(testResults.passing).keys()).map(i => 
          `Test ${i+1}: should correctly perform calculation`
        ));
      }
      
      // Display all passing tests
      for (let i = 0; i < testResults.passing; i++) {
        const testName = passingTests[i] || `Passing test ${i+1}`;
        elements.push(
          <div key={`pass-${i}`} className="flex items-center justify-between p-3 rounded-md bg-opacity-10 bg-white/5">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500/20 text-green-400">
                <Check className="h-3.5 w-3.5" />
              </div>
              <span className="text-sm">{testName}</span>
            </div>
            <span className="text-xs text-gray-400">{Math.floor(Math.random() * 4) + 1}ms</span>
          </div>
        );
      }
    }
    
    // Add failing tests if any
    if (testResults.failing > 0 && testResults.failingTests) {
      testResults.failingTests.forEach((test, index) => {
        elements.push(
          <div key={`fail-${index}`} className="flex items-center justify-between p-3 rounded-md bg-opacity-10 bg-white/5">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-red-500/20 text-red-400">
                <X className="h-3.5 w-3.5" />
              </div>
              <span className="text-sm">{test.name}</span>
            </div>
            <span className="text-xs text-gray-400">{Math.floor(Math.random() * 4) + 5}ms</span>
          </div>
        );
      });
    }
    
    return elements;
  };

  // Generate the UI for generated test cases
  const generatedTests = parseGeneratedTests();
  const hasGeneratedTests = generatedTests.length > 0;

  return (
    <div className="p-4">
      <h3 className="text-sm font-medium mb-2">Test Results</h3>
      
      {isGenerating ? (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="p-3 rounded-full bg-white/5 mb-3">
            <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
          </div>
          <p className="text-sm text-gray-400">Generating code that passes all tests...</p>
        </div>
      ) : !showTestResults ? (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="p-3 rounded-full bg-white/5 mb-3">
            <Play className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-sm text-gray-400">Run your code to see test results</p>
        </div>
      ) : (
        <div className="space-y-3">
          {generateTestResultElements()}
          
          <div className="flex justify-between items-center mt-4 pt-3 border-t border-white/10">
            <div className="text-sm">
              <span className="text-green-400">{testResults.passing} passing</span>
              {testResults.failing > 0 && (
                <>
                  <span className="mx-2">•</span>
                  <span className="text-red-400">{testResults.failing} failing</span>
                </>
              )}
            </div>
            <div className="text-xs text-gray-400">
              {testResults.total} tests completed
            </div>
          </div>
        </div>
      )}

      {/* Generated test cases section */}
      {hasGeneratedTests && (
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2">Generated Tests</h3>
          <div className="space-y-2">
            {generatedTests.map((test, index) => {
              const testName = test.split('\n')[0].replace(/test\(|it\(|['"]/g, '').substring(0, 25);
              return (
                <div key={`gen-${index}`} className="p-3 rounded-md bg-opacity-10 bg-white/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm truncate flex-1">{testName}...</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8"
                      onClick={() => onAddTestCase && onAddTestCase(test)}
                    >
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TestRunner;
