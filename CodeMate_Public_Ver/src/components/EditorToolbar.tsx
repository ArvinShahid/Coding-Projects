
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Play } from 'lucide-react';

interface EditorToolbarProps {
  activeTab: string;
  onAutoFix: () => void;
  onRunTests: () => void;
  setActiveTab: (tab: string) => void;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({
  activeTab,
  onAutoFix,
  onRunTests,
  setActiveTab
}) => {
  const handleGenerateCode = () => {
    setActiveTab('editor'); // Switch to editor tab first
    onAutoFix(); // Then generate the code
  };

  return (
    <div className="flex items-center justify-between border-b border-white/10 px-4">
      <TabsList className="bg-transparent">
        <TabsTrigger 
          value="editor" 
          className="data-[state=active]:bg-white/10 data-[state=active]:text-white"
        >
          Editor
        </TabsTrigger>
        <TabsTrigger 
          value="tests" 
          className="data-[state=active]:bg-white/10 data-[state=active]:text-white"
        >
          Test Cases
        </TabsTrigger>
      </TabsList>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2"
          onClick={handleGenerateCode}
        >
          <RefreshCcw className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Generate Code</span>
        </Button>
        <Button 
          className="bg-green-500/90 hover:bg-green-500 transition-colors gap-2"
          size="sm"
          onClick={onRunTests}
        >
          <Play className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Run</span>
        </Button>
      </div>
    </div>
  );
};

export default EditorToolbar;
