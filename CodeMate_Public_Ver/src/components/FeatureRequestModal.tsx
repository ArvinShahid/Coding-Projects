
import React, { useState } from 'react';
import { MessageSquare, Sparkles } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { generateTestCases } from "@/utils/openAiService";

interface FeatureRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTestCasesGenerated: (testCases: string) => void;
}

const FeatureRequestModal: React.FC<FeatureRequestModalProps> = ({ 
  isOpen, 
  onClose,
  onTestCasesGenerated 
}) => {
  const [featureDescription, setFeatureDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerateTests = async () => {
    if (!featureDescription.trim()) {
      toast({
        title: "Feature Description Required",
        description: "Please describe the feature you want to implement",
        variant: "destructive",
      });
      return;
    }
    
    // Get API key from localStorage
    const apiKey = localStorage.getItem('openai_api_key');
    if (!apiKey) {
      toast({
        title: "API Key Missing",
        description: "Please set your OpenAI API key in the settings",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const testCases = await generateTestCases(featureDescription, apiKey);
      if (testCases) {
        onTestCasesGenerated(testCases);
        toast({
          title: "Tests Generated",
          description: "Test cases have been created for your feature",
        });
        onClose();
      }
    } catch (error) {
      console.error("Error in test generation:", error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate test cases. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-morphism border-white/10 animate-fade-in sm:max-w-md">
        <DialogHeader className="space-y-4">
          <DialogTitle className="gradient-text text-xl">Request New Feature</DialogTitle>
          <DialogDescription className="text-gray-400">
            Describe the feature you want to implement. CodeMate will generate test cases to guide your implementation.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="flex items-start gap-3 bg-black/20 p-3 rounded-md text-sm">
            <MessageSquare className="h-5 w-5 text-codemate-purple-light shrink-0 mt-0.5" />
            <p className="text-gray-300">
              Try describing functions for a simple calculator, like <span className="text-white font-medium">division</span> or <span className="text-white font-medium">square root</span>.
            </p>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="feature" className="text-sm text-gray-300">
              Feature Description
            </label>
            <Textarea
              id="feature"
              value={featureDescription}
              onChange={(e) => setFeatureDescription(e.target.value)}
              placeholder="For example: Add a divide function that divides the first number by the second and returns an error if dividing by zero."
              className="bg-black/30 border-white/10 min-h-[120px] resize-none"
            />
          </div>
          
          <Button 
            onClick={handleGenerateTests}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-codemate-purple to-codemate-blue hover:opacity-90"
          >
            {isGenerating ? (
              <>
                <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
                Generating Tests...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Test Cases
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeatureRequestModal;
