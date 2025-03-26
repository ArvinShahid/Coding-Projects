
import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Check, AlertCircle, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TestCasesProps {
  testCode: string;
  setTestCode: (code: string) => void;
  generatedTestCases?: string;
  onAddTestCase?: (testCase: string) => void;
  testResults?: {
    passing: number;
    failing: number;
    total: number;
    failingTests: Array<{name: string; error: string}>;
  };
  placeholder?: string; // Added placeholder prop
}

const TestCases: React.FC<TestCasesProps> = ({ 
  testCode, 
  setTestCode, 
  generatedTestCases,
  onAddTestCase,
  testResults,
  placeholder
}) => {
  // Extract test cases from the generated code
  const extractIndividualTestCases = (code: string) => {
    if (!code) return [];
    
    const testCases: {name: string; code: string}[] = [];
    const lines = code.split('\n');
    let currentTest = '';
    let testName = '';
    let collecting = false;
    
    for (const line of lines) {
      if (line.includes('test(') || line.includes('it(')) {
        // If we were already collecting a test, save it before starting a new one
        if (collecting && currentTest) {
          testCases.push({
            name: testName,
            code: currentTest
          });
        }
        
        // Start collecting a new test
        collecting = true;
        testName = line.match(/['"`]([^'"`]+)['"`]/)?.[1] || 'unnamed test';
        currentTest = line + '\n';
      } else if (collecting) {
        currentTest += line + '\n';
        if (line.includes('});')) {
          // End of test case reached
          testCases.push({
            name: testName,
            code: currentTest
          });
          currentTest = '';
          collecting = false;
        }
      }
    }
    
    return testCases;
  };

  // Convert toBe to toBeCloseTo for decimal values in the test code
  const updateCodeWithBestPractices = (code: string) => {
    // Replace test assertions that compare decimal values
    // Change .toBe(decimalValue) to .toBeCloseTo(decimalValue)
    return code.replace(
      /expect\(.*?\)\.toBe\((\d*\.\d+)\)/g, 
      'expect($&).toBeCloseTo($1)'
    );
  };
  
  const handleAddTestCase = (testCase: string) => {
    // Improve the test case by replacing toBe with toBeCloseTo for decimal values
    const improvedTestCase = updateCodeWithBestPractices(testCase);
    onAddTestCase?.(improvedTestCase);
  };

  const generatedTests = generatedTestCases ? extractIndividualTestCases(generatedTestCases) : [];

  return (
    <div className="h-[500px] bg-codemate-darker p-4 flex flex-col">
      <div className="mb-3 flex justify-between items-center text-xs text-gray-400 border-b border-white/10 pb-2">
        <span>Test file</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center">
                <Info className="h-3.5 w-3.5 text-gray-400 cursor-help" />
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-xs">
                For decimal values, use toBeCloseTo() instead of toBe() to avoid precision errors.
                For example: expect(divide(5, 2)).toBeCloseTo(2.5)
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <Textarea 
        className="flex-grow w-full bg-transparent text-sm font-mono text-gray-300 border-none resize-none focus-visible:ring-0 focus-visible:ring-offset-0" 
        value={testCode}
        onChange={(e) => setTestCode(e.target.value)}
        spellCheck={false}
        placeholder={placeholder}
      />
      
      {generatedTests.length > 0 && (
        <div className="mt-4 border-t border-white/10 pt-4">
          <h3 className="text-xs text-gray-400 mb-2">Generated Test Cases</h3>
          <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
            {generatedTests.map((test, index) => {
              // Check if this test case is already in the test code
              const isAdded = testCode.includes(test.code.trim());
              
              // Determine status from test results if available
              let status: 'passing' | 'failing' | 'unknown' = 'unknown';
              if (testResults && isAdded) {
                status = testResults.failingTests.some(ft => ft.name === test.name) ? 'failing' : 'passing';
              }
              
              // Check if the test uses toBe with decimal values
              const usesDecimalToBe = test.code.match(/expect\(.*?\)\.toBe\(\d*\.\d+\)/);
              
              return (
                <Card key={index} className={`p-2 text-xs border-0 ${
                  isAdded 
                    ? status === 'passing' 
                      ? 'bg-green-800/20 text-green-200' 
                      : status === 'failing' 
                        ? 'bg-red-800/20 text-red-200'
                        : 'bg-blue-800/20 text-blue-200'
                    : 'bg-white/5 text-gray-300'
                }`}>
                  <div className="flex justify-between items-center mb-1">
                    <div className="font-medium flex items-center gap-1">
                      {isAdded && status === 'passing' && <Check className="h-3 w-3 text-green-400" />}
                      {isAdded && status === 'failing' && <AlertCircle className="h-3 w-3 text-red-400" />}
                      {test.name}
                      {usesDecimalToBe && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-3 w-3 text-yellow-400 ml-1 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">
                                This test uses toBe() with decimal values. 
                                Consider using toBeCloseTo() for better precision handling.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                    {!isAdded && onAddTestCase && (
                      <button 
                        className="text-[10px] bg-codemate-purple/50 hover:bg-codemate-purple px-1.5 py-0.5 rounded"
                        onClick={() => handleAddTestCase(test.code)}
                      >
                        Add
                      </button>
                    )}
                  </div>
                  <pre className="text-[10px] whitespace-pre-wrap opacity-70">
                    {test.code.split('\n').slice(0, 2).join('\n')}
                    {test.code.split('\n').length > 2 ? '...' : ''}
                  </pre>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TestCases;
