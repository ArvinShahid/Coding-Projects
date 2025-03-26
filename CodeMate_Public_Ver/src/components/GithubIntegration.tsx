
import React, { useState } from 'react';
import { X, Github, FileCode, CheckCheck } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface GithubIntegrationProps {
  isOpen: boolean;
  onClose: () => void;
}

const GithubIntegration: React.FC<GithubIntegrationProps> = ({ isOpen, onClose }) => {
  const [repoUrl, setRepoUrl] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const handleConnect = () => {
    if (!repoUrl.trim()) {
      toast({
        title: "Repository URL Required",
        description: "Please enter a GitHub repository URL",
        variant: "destructive",
      });
      return;
    }
    
    setIsConnecting(true);
    
    // Simulate connection
    setTimeout(() => {
      setIsConnecting(false);
      toast({
        title: "Repository Connected",
        description: "Successfully connected to GitHub repository",
      });
      onClose();
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-morphism border-white/10 animate-fade-in sm:max-w-md">
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="gradient-text text-xl">Connect to GitHub</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="p-4 rounded-lg bg-black/20 flex items-center justify-center">
            <Github className="h-12 w-12 text-white" />
          </div>
          
          <div className="space-y-1">
            <label htmlFor="repoUrl" className="text-sm text-gray-300">
              Repository URL
            </label>
            <Input
              id="repoUrl"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/username/repo"
              className="bg-black/30 border-white/10"
            />
          </div>
          
          <div className="flex flex-col space-y-2">
            <Button 
              onClick={handleConnect}
              disabled={isConnecting}
              className="w-full bg-gradient-to-r from-codemate-purple to-codemate-blue hover:opacity-90"
            >
              {isConnecting ? (
                <>
                  <Github className="h-4 w-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Github className="h-4 w-4 mr-2" />
                  Connect Repository
                </>
              )}
            </Button>
            
            <div className="flex justify-center">
              <span className="text-xs text-gray-400">or</span>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full gradient-border"
            >
              <FileCode className="h-4 w-4 mr-2" />
              Select Local Files
            </Button>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Recently Connected</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded-md bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                <div className="flex items-center gap-2">
                  <Github className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">username/project-utils</span>
                </div>
                <CheckCheck className="h-4 w-4 text-green-400" />
              </div>
              <div className="flex items-center justify-between p-2 rounded-md bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                <div className="flex items-center gap-2">
                  <Github className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">username/api-service</span>
                </div>
                <CheckCheck className="h-4 w-4 text-green-400" />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GithubIntegration;
