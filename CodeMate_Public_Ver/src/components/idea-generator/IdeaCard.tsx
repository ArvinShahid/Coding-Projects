
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkle, Award } from 'lucide-react';

interface IdeaCardProps {
  idea: { 
    title: string; 
    description: string; 
    problem: string; 
    solution: string 
  };
  onExpand: (idea: { title: string; description: string; problem: string; solution: string }) => void;
}

const IdeaCard = ({ idea, onExpand }: IdeaCardProps) => {
  return (
    <Card className="bg-black/40 border-white/10 hover:border-white/30 transition-all">
      <CardContent className="p-4">
        <div className="flex items-center mb-2">
          <Award className="h-5 w-5 text-yellow-400 mr-2" />
          <h3 className="text-xl font-semibold">{idea.title}</h3>
        </div>
        <p className="text-gray-300 mb-4">{idea.description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="text-sm font-medium text-gray-400">Problem:</h4>
            <p className="text-gray-300">{idea.problem}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-400">Solution:</h4>
            <p className="text-gray-300">{idea.solution}</p>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => onExpand(idea)}
        >
          <Sparkle className="h-4 w-4 mr-2" />
          Plan Hackathon Project
        </Button>
      </CardContent>
    </Card>
  );
};

export default IdeaCard;
