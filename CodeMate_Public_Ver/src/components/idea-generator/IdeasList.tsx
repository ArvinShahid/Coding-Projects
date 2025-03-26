
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Lightbulb } from 'lucide-react';
import IdeaCard from './IdeaCard';

interface IdeasListProps {
  topic: string;
  setTopic: (topic: string) => void;
  isLoading: boolean;
  ideas: { title: string; description: string; problem: string; solution: string }[];
  onGenerateIdeas: () => void;
  onExpandIdea: (idea: { title: string; description: string; problem: string; solution: string }) => void;
}

const IdeasList = ({ 
  topic, 
  setTopic, 
  isLoading, 
  ideas, 
  onGenerateIdeas, 
  onExpandIdea 
}: IdeasListProps) => {
  return (
    <Card className="bg-black/30 border-codemate-purple/30 mb-8">
      <CardContent className="p-8">
        <h2 className="text-2xl font-bold text-codemate-purple-light mb-4 flex items-center gap-2">
          <Lightbulb className="h-6 w-6" />
          Generate Ideas
        </h2>
        
        <div className="flex gap-4 mb-8">
          <Input 
            placeholder="Enter a topic (e.g., AI, climate change, healthcare)" 
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="flex-grow"
          />
          <Button 
            className="bg-gradient-to-r from-codemate-purple to-codemate-blue"
            onClick={onGenerateIdeas}
            disabled={isLoading}
          >
            <Search className="h-4 w-4 mr-2" />
            {isLoading ? 'Generating...' : 'Generate'}
          </Button>
        </div>
        
        <div className="space-y-4">
          {ideas.map((idea, index) => (
            <IdeaCard 
              key={index} 
              idea={idea}
              onExpand={onExpandIdea}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default IdeasList;
