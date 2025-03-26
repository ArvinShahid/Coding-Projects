
import React, { useState, useEffect } from 'react';
import { X, Key, Info } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState('');

  // Load the API key from localStorage when the modal opens
  useEffect(() => {
    if (isOpen) {
      const savedApiKey = localStorage.getItem('openai_api_key');
      if (savedApiKey) {
        setApiKey(savedApiKey);
      }
    }
  }, [isOpen]);

  const handleSave = () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your OpenAI API key",
        variant: "destructive",
      });
      return;
    }
    
    // Store with consistent key name
    localStorage.setItem('openai_api_key', apiKey);
    
    toast({
      title: "API Key Saved",
      description: "Your OpenAI API key has been saved successfully",
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-morphism border-white/10 animate-fade-in">
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="gradient-text text-xl">Set Your OpenAI API Key</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="bg-black/20 p-3 rounded-md flex items-start gap-3 text-sm">
          <Info className="h-5 w-5 text-codemate-purple-light shrink-0 mt-0.5" />
          <p className="text-gray-300">
            Your API key is stored locally in your browser and never sent to our servers. 
            You can obtain an API key from the
            <a 
              href="https://platform.openai.com/account/api-keys" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-codemate-purple-light hover:text-codemate-purple hover:underline ml-1"
            >
              OpenAI dashboard
            </a>.
          </p>
        </div>
        
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <label htmlFor="apiKey" className="text-sm text-gray-300">
              OpenAI API Key
            </label>
            <div className="relative">
              <Input
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="pl-10 bg-black/30 border-white/10 h-11"
              />
              <Key className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            </div>
          </div>
          
          <Button 
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-codemate-purple to-codemate-blue hover:opacity-90"
          >
            Save API Key
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeyModal;
