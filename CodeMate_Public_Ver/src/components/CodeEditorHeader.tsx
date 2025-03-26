
import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Code, Upload, Github, GitBranch } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CodeEditorHeaderProps {
  onApiKeyOpen: () => void;
  onGithubOpen: () => void;
  onFeatureRequestOpen: () => void;
  checkApiKey: () => boolean;
}

const CodeEditorHeader: React.FC<CodeEditorHeaderProps> = ({
  onApiKeyOpen,
  onGithubOpen,
  onFeatureRequestOpen,
  checkApiKey
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // Handle the file upload logic here
      console.log("Files selected:", files);
      // Reset the input so the same file can be selected again
      event.target.value = '';
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-white/10">
      <h2 className="text-xl font-semibold">Code Editor</h2>
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm"
          className="gap-2"
          onClick={onApiKeyOpen}
        >
          <Code className="h-4 w-4" />
          <span className="hidden sm:inline">API Key</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className="gap-2"
          onClick={onGithubOpen}
        >
          <Github className="h-4 w-4" />
          <span className="hidden sm:inline">GitHub</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className="gap-2"
        >
          <GitBranch className="h-4 w-4" />
          <span className="hidden sm:inline">Push to Git</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className="gap-2"
          onClick={handleUploadClick}
        >
          <Upload className="h-4 w-4" />
          <span className="hidden sm:inline">Upload</span>
        </Button>
        <Link to="/devops">
          <Button 
            variant="outline"
            size="sm"
            className="gap-2 bg-gradient-to-r from-codemate-purple to-codemate-blue hover:opacity-90 text-white"
          >
            <span className="hidden sm:inline">DevOps</span>
          </Button>
        </Link>
        <Button 
          className="bg-gradient-to-r from-codemate-purple to-codemate-blue hover:opacity-90 transition-opacity gap-2"
          size="sm"
          onClick={() => {
            if (checkApiKey()) {
              onFeatureRequestOpen();
            }
          }}
        >
          <Code className="h-4 w-4" />
          <span className="hidden sm:inline">Add Feature</span>
        </Button>
        
        {/* Hidden file input for upload */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          style={{ display: 'none' }} 
          multiple 
        />
      </div>
    </div>
  );
};

export default CodeEditorHeader;
