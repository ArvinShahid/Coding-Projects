import { useState, useEffect } from 'react';
import { generateImplementation } from '@/utils/openAiService';
import { useToast } from "@/hooks/use-toast";
import { 
  DEFAULT_IMPLEMENTATION_CODE, 
  DEFAULT_TEST_CODE, 
  executeTestsWithCode,
  TestResult
} from '@/utils/codeExecutionUtils';

export interface TestResults {
  passing: number;
  failing: number;
  total: number;
  logs: string[];
  failingTests: Array<{name: string, error: string}>;
}

export const useCodeEditor = () => {
  const [activeTab, setActiveTab] = useState('editor');
  const [isGithubModalOpen, setIsGithubModalOpen] = useState(false);
  const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [showTestResults, setShowTestResults] = useState(false);
  const [implementationCode, setImplementationCode] = useState(DEFAULT_IMPLEMENTATION_CODE);
  const [testCode, setTestCode] = useState(DEFAULT_TEST_CODE);
  const [generatedTestCases, setGeneratedTestCases] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const [testResults, setTestResults] = useState<TestResults>({
    passing: 3,
    failing: 0,
    total: 3,
    logs: [],
    failingTests: []
  });

  const handleTestCasesGenerated = (newTestCases: string) => {
    setGeneratedTestCases(newTestCases);
    setActiveTab('tests');
    setShowTestResults(false);
    
    toast({
      title: "Test Cases Generated",
      description: "New test cases have been generated. Add them to your tests to run them.",
    });
  };

  const handleAddTestCase = (testCase: string) => {
    const newTestCode = testCode.replace(
      /}\);$/,
      `\n  ${testCase}\n});`
    );
    
    setTestCode(newTestCode);
    setActiveTab('tests');
    toast({
      title: "Test Case Added",
      description: "Test case has been added to your test file.",
    });
  };

  const handleAutoFix = async () => {
    const apiKey = localStorage.getItem('openai_api_key');
    if (!apiKey) {
      toast({
        title: "API Key Missing",
        description: "Please set your OpenAI API key first",
        variant: "destructive",
      });
      setIsApiKeyModalOpen(true);
      return;
    }

    setIsGenerating(true);
    
    try {
      // Run tests first to provide failing test info to the AI
      const currentResults = executeTestsWithCode(implementationCode, testCode);
      
      // Generate implementation with test results for context
      const implementation = await generateImplementation(testCode, apiKey, implementationCode, currentResults);
      
      if (implementation) {
        // Apply the generated code
        setImplementationCode(implementation);
        setActiveTab('editor');
        
        // Run tests with the new implementation
        const results = executeTestsWithCode(implementation, testCode);
        setTestResults(results);
        setShowTestResults(true);
        
        if (results.failing > 0) {
          toast({
            title: `${results.failing} Tests Failing`,
            description: `Generated code has ${results.failing} failing tests. You may need to modify it.`,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Code Successfully Generated",
            description: `All ${results.passing} tests are passing!`,
          });
        }
      }
    } catch (error) {
      console.error("Error generating implementation:", error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate implementation code",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const checkApiKeyAndOpenModal = () => {
    const apiKey = localStorage.getItem('openai_api_key');
    if (!apiKey) {
      setIsApiKeyModalOpen(true);
      return false;
    }
    return true;
  };

  const handleRunTests = () => {
    setShowTestResults(true);
    const results = executeTestsWithCode(implementationCode, testCode);
    setTestResults(results);
    
    if (results.failing > 0) {
      toast({
        title: `${results.failing} Tests Failing`,
        description: `${results.passing} tests passing, ${results.failing} failing`,
        variant: "destructive",
      });
    } else if (results.passing > 0) {
      toast({
        title: "All Tests Passing",
        description: `${results.passing} tests passing successfully`,
        variant: "default",
      });
    }
  };

  return {
    activeTab,
    setActiveTab,
    isGithubModalOpen,
    setIsGithubModalOpen,
    isFeatureModalOpen, 
    setIsFeatureModalOpen,
    isApiKeyModalOpen,
    setIsApiKeyModalOpen,
    showTestResults,
    setShowTestResults,
    implementationCode,
    setImplementationCode,
    testCode,
    setTestCode,
    generatedTestCases,
    testResults,
    handleTestCasesGenerated,
    handleAddTestCase,
    handleAutoFix,
    checkApiKeyAndOpenModal,
    handleRunTests,
    isGenerating
  };
};
