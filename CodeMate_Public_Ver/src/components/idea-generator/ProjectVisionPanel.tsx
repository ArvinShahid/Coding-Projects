
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Calendar, Kanban } from 'lucide-react';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import TechStackSelector from './TechStackSelector';

interface ProjectVisionPanelProps {
  selectedIdea: { 
    title: string; 
    description: string;
    problem: string; 
    solution: string; 
    vision: string 
  } | null;
  projectVision: string;
  onProjectVisionChange: (vision: string) => void;
  onPopulateProjectManager: () => void;
  projectTimeline: Date | undefined;
  onProjectTimelineChange: (date: Date | undefined) => void;
  techStack: string[];
  onTechStackChange: (techs: string[]) => void;
}

const ProjectVisionPanel = ({ 
  selectedIdea, 
  projectVision, 
  onProjectVisionChange, 
  onPopulateProjectManager,
  projectTimeline,
  onProjectTimelineChange,
  techStack,
  onTechStackChange
}: ProjectVisionPanelProps) => {
  if (!selectedIdea) return null;

  return (
    <Card className="bg-black/30 border-codemate-blue/30">
      <CardContent className="p-8">
        <h2 className="text-2xl font-bold text-codemate-blue-light mb-4">
          Hackathon Project: {selectedIdea.title}
        </h2>
        
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-400 mb-1">Vision & User Stories</h3>
          <p className="text-xs text-gray-400 mb-2">
            Describe your hackathon project vision, including user stories and key features. Focus on what makes your project innovative and impactful.
          </p>
          <Textarea 
            value={projectVision}
            onChange={(e) => onProjectVisionChange(e.target.value)}
            className="min-h-[250px] mb-4"
            placeholder="Our project aims to... [Describe your vision]\n\nUser Stories:\n- As a user, I want to...\n- As an admin, I need to...\n\nKey Features:\n- Feature 1\n- Feature 2\n\nInnovation Aspects:\n- What makes this project innovative?"
          />
        </div>
        
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="border-codemate-blue/50 hover:bg-codemate-blue/20 flex-1"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  {projectTimeline ? format(projectTimeline, 'MMM d, yyyy') : 'Hackathon Deadline'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-auto" align="center">
                <div className="p-3 pointer-events-auto">
                  <div className="mb-2 text-sm font-medium text-foreground">Hackathon Deadline</div>
                  <div className="space-y-2">
                    <div className="flex flex-col">
                      <label htmlFor="project-date" className="text-xs pb-1">When is your hackathon deadline?</label>
                      <input
                        id="project-date"
                        type="date"
                        className="rounded border border-white/10 bg-black/30 p-2 text-sm"
                        value={projectTimeline ? format(projectTimeline, 'yyyy-MM-dd') : ''}
                        onChange={(e) => {
                          if (e.target.value) {
                            onProjectTimelineChange(new Date(e.target.value));
                          }
                        }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground pt-2">
                      Tasks will be prioritized based on this deadline.
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            
            <TechStackSelector 
              selectedTechs={techStack} 
              onTechChange={onTechStackChange} 
            />
          </div>
          
          <Button 
            className="bg-gradient-to-r from-green-500 to-green-700"
            onClick={onPopulateProjectManager}
          >
            <Kanban className="h-4 w-4 mr-2" />
            Generate Hackathon Project Plan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectVisionPanel;
