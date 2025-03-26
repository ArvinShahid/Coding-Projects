
import React from 'react';
import { Tabs } from "@/components/ui/tabs";
import CodeOutput from './CodeOutput';
import FeatureRequestModal from './FeatureRequestModal';
import GithubIntegration from './GithubIntegration';
import ApiKeyModal from './ApiKeyModal';
import CodeEditorHeader from './CodeEditorHeader';
import EditorToolbar from './EditorToolbar';
import EditorContent from './EditorContent';
import TestRunner from './TestRunner';
import { useCodeEditor } from '@/hooks/useCodeEditor';

const CodeEditor = () => {
  const {
    activeTab,
    setActiveTab,
    isGithubModalOpen,
    setIsGithubModalOpen,
    isFeatureModalOpen,
    setIsFeatureModalOpen,
    isApiKeyModalOpen,
    setIsApiKeyModalOpen,
    showTestResults,
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
  } = useCodeEditor();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8" id="editor-section">
      <div className="glass-morphism rounded-xl overflow-hidden">
        <CodeEditorHeader 
          onApiKeyOpen={() => setIsApiKeyModalOpen(true)}
          onGithubOpen={() => setIsGithubModalOpen(true)}
          onFeatureRequestOpen={() => setIsFeatureModalOpen(true)}
          checkApiKey={checkApiKeyAndOpenModal}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
          <div className="col-span-1 lg:col-span-3 border-r border-white/10">
            <Tabs defaultValue="editor" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <EditorToolbar 
                activeTab={activeTab}
                onAutoFix={handleAutoFix}
                onRunTests={handleRunTests}
                setActiveTab={setActiveTab}
              />
              
              <EditorContent 
                implementationCode={implementationCode}
                setImplementationCode={setImplementationCode}
                testCode={testCode}
                setTestCode={setTestCode}
                testResults={testResults}
                generatedTestCases={generatedTestCases}
                onAddTestCase={handleAddTestCase}
              />
            </Tabs>
          </div>
          
          <div className="col-span-1 lg:col-span-2">
            <TestRunner 
              showTestResults={showTestResults}
              onRunTests={handleRunTests}
              testResults={testResults}
              generatedTestCases={generatedTestCases}
              onAddTestCase={handleAddTestCase}
              isGenerating={isGenerating}
            />
            
            <CodeOutput 
              showTestResults={showTestResults}
              testResults={testResults}
            />
          </div>
        </div>
      </div>
      
      <GithubIntegration 
        isOpen={isGithubModalOpen} 
        onClose={() => setIsGithubModalOpen(false)} 
      />
      
      <FeatureRequestModal 
        isOpen={isFeatureModalOpen} 
        onClose={() => setIsFeatureModalOpen(false)}
        onTestCasesGenerated={handleTestCasesGenerated}
      />

      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
      />
    </div>
  );
};

export default CodeEditor;
