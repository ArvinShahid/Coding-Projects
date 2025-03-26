
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import TestCases from './TestCases';
import { Textarea } from "@/components/ui/textarea";
import { TestResult } from '@/utils/codeExecutionUtils';

interface EditorContentProps {
  implementationCode: string;
  setImplementationCode: (code: string) => void;
  testCode: string;
  setTestCode: (code: string) => void;
  testResults?: TestResult;
  generatedTestCases?: string;
  onAddTestCase?: (testCase: string) => void;
}

const EditorContent: React.FC<EditorContentProps> = ({
  implementationCode,
  setImplementationCode,
  testCode,
  setTestCode,
  testResults,
  generatedTestCases,
  onAddTestCase,
}) => {
  return (
    <>
      <TabsContent value="editor" className="p-0 m-0">
        <div className="h-[500px] bg-codemate-darker p-4">
          <Textarea 
            className="h-full w-full bg-transparent text-sm font-mono text-[#E5DEFF] border-none resize-none focus-visible:ring-0 focus-visible:ring-offset-0" 
            value={implementationCode}
            onChange={(e) => setImplementationCode(e.target.value)}
            spellCheck={false}
            placeholder="// Write your JavaScript/TypeScript code here
// Example:
// function add(a, b) {
//   return a + b;
// }
//
// module.exports = { add };"
          />
        </div>
      </TabsContent>
      
      <TabsContent value="tests" className="p-0 m-0">
        <TestCases 
          testCode={testCode} 
          setTestCode={setTestCode}
          generatedTestCases={generatedTestCases}
          onAddTestCase={onAddTestCase}
          testResults={testResults}
          placeholder="// Write your test code here
// Example:
// test('adds 1 + 2 to equal 3', () => {
//   expect(add(1, 2)).toBe(3);
// });"
        />
      </TabsContent>
    </>
  );
};

export default EditorContent;
