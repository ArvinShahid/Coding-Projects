
import React from 'react';
import { Terminal, Check, X, AlertCircle, ArrowRight } from 'lucide-react';

interface CodeOutputProps {
  showTestResults: boolean;
  testResults: {
    passing: number;
    failing: number;
    total: number;
    logs: string[];
    failingTests?: Array<{
      name: string;
      error: string;
    }>;
  };
}

const CodeOutput: React.FC<CodeOutputProps> = ({ showTestResults, testResults }) => {
  // Function to get current time with optional offset in seconds
  const getCurrentTime = (offsetSeconds = 0) => {
    const now = new Date();
    now.setSeconds(now.getSeconds() + offsetSeconds);
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  };

  // Generate console entries based on actual execution results
  const generateConsoleEntries = () => {
    if (!showTestResults) {
      return [
        { type: 'info', text: 'Console ready', time: getCurrentTime() }
      ];
    }

    const entries = [
      { type: 'info', text: 'Starting code execution...', time: getCurrentTime() }
    ];
    
    // Add real console logs from code execution
    if (testResults.logs && testResults.logs.length > 0) {
      testResults.logs.forEach((log, index) => {
        entries.push({
          type: 'info',
          text: log,
          time: getCurrentTime(1 + index * 0.5)
        });
      });
    }

    // Add test case results for passing tests
    if (testResults.passing > 0) {
      for (let i = 0; i < testResults.passing; i++) {
        entries.push({
          type: 'success',
          text: `PASS: test_${i + 1}`,
          time: getCurrentTime(2 + i * 2)
        });
      }
    }

    // Add failing test outputs with detailed errors
    if (testResults.failing > 0 && testResults.failingTests) {
      testResults.failingTests.forEach((test, index) => {
        const timeOffset = 2 + (testResults.passing * 2) + (index * 3);
        entries.push({
          type: 'error',
          text: `FAIL: ${test.name}`,
          time: getCurrentTime(timeOffset)
        });
        entries.push({
          type: 'warning',
          text: `Error: ${test.error}`,
          time: getCurrentTime(timeOffset + 0.1)
        });
      });
    }

    // Add completion message
    if (testResults.failing > 0) {
      entries.push({ 
        type: 'info', 
        text: `Code execution completed with errors (${testResults.failing} failing)`, 
        time: getCurrentTime(10) 
      });
    } else {
      entries.push({ 
        type: 'info', 
        text: 'Code execution completed successfully', 
        time: getCurrentTime(10) 
      });
    }

    return entries;
  };

  const consoleEntries = generateConsoleEntries();

  return (
    <div className="p-4">
      <h3 className="text-sm font-medium mb-2">Console Output</h3>
      <div className="bg-codemate-darker rounded-md overflow-hidden">
        <div className="border-b border-white/10 py-2 px-3 flex items-center bg-black/20">
          <Terminal className="h-4 w-4 mr-2 text-gray-400" />
          <span className="text-xs text-gray-400">Console</span>
        </div>
        <div className="p-3 font-mono text-xs h-[220px] overflow-auto">
          {consoleEntries.map((entry, index) => (
            <div 
              key={index} 
              className={`py-0.5 ${
                entry.type === 'success' ? 'text-green-400' : 
                entry.type === 'error' ? 'text-red-400' : 
                entry.type === 'warning' ? 'text-yellow-400' : 
                'text-gray-300'
              }`}
            >
              <span className="text-gray-500 mr-2">{entry.time}</span>
              <span className="text-gray-500 mr-1">
                {entry.type === 'success' ? <Check className="h-3 w-3 inline" /> : 
                entry.type === 'error' ? <X className="h-3 w-3 inline" /> : 
                entry.type === 'warning' ? <AlertCircle className="h-3 w-3 inline" /> : 
                <ArrowRight className="h-3 w-3 inline" />}
              </span>
              {entry.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CodeOutput;
