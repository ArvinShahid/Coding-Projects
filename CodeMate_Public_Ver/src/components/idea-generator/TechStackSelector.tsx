import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Code, Server, Database, Globe } from 'lucide-react';

interface TechOption {
  id: string;
  label: string;
  category: 'frontend' | 'backend' | 'database' | 'deployment' | 'other';
}

interface TechStackSelectorProps {
  selectedTechs: string[];
  onTechChange: (techs: string[]) => void;
}

const techOptions: TechOption[] = [
  // Frontend
  { id: 'react', label: 'React', category: 'frontend' },
  { id: 'vue', label: 'Vue.js', category: 'frontend' },
  { id: 'angular', label: 'Angular', category: 'frontend' },
  { id: 'svelte', label: 'Svelte', category: 'frontend' },
  { id: 'next', label: 'Next.js', category: 'frontend' },
  { id: 'tailwind', label: 'Tailwind CSS', category: 'frontend' },
  { id: 'bootstrap', label: 'Bootstrap', category: 'frontend' },
  { id: 'material-ui', label: 'Material UI', category: 'frontend' },
  { id: 'typescript', label: 'TypeScript', category: 'frontend' },
  
  // Backend
  { id: 'node', label: 'Node.js', category: 'backend' },
  { id: 'express', label: 'Express', category: 'backend' },
  { id: 'fastapi', label: 'FastAPI', category: 'backend' },
  { id: 'django', label: 'Django', category: 'backend' },
  { id: 'flask', label: 'Flask', category: 'backend' },
  { id: 'spring', label: 'Spring Boot', category: 'backend' },
  { id: 'graphql', label: 'GraphQL', category: 'backend' },
  { id: 'rest', label: 'REST API', category: 'backend' },
  
  // Database
  { id: 'mongodb', label: 'MongoDB', category: 'database' },
  { id: 'postgres', label: 'PostgreSQL', category: 'database' },
  { id: 'mysql', label: 'MySQL', category: 'database' },
  { id: 'redis', label: 'Redis', category: 'database' },
  { id: 'firebase', label: 'Firebase', category: 'database' },
  { id: 'supabase', label: 'Supabase', category: 'database' },
  
  // Deployment
  { id: 'vercel', label: 'Vercel', category: 'deployment' },
  { id: 'netlify', label: 'Netlify', category: 'deployment' },
  { id: 'aws', label: 'AWS', category: 'deployment' },
  { id: 'gcp', label: 'Google Cloud', category: 'deployment' },
  { id: 'azure', label: 'Azure', category: 'deployment' },
  { id: 'docker', label: 'Docker', category: 'deployment' },
  { id: 'kubernetes', label: 'Kubernetes', category: 'deployment' },
  
  // Other
  { id: 'ai', label: 'AI/ML Integration', category: 'other' },
  { id: 'blockchain', label: 'Blockchain', category: 'other' },
  { id: 'ar-vr', label: 'AR/VR', category: 'other' },
  { id: 'iot', label: 'IoT', category: 'other' },
  { id: 'mobile', label: 'Mobile App', category: 'other' },
];

const TechStackSelector: React.FC<TechStackSelectorProps> = ({ selectedTechs, onTechChange }) => {
  const toggleTech = (techId: string) => {
    if (selectedTechs.includes(techId)) {
      onTechChange(selectedTechs.filter(id => id !== techId));
    } else {
      onTechChange([...selectedTechs, techId]);
    }
  };
  
  const getOptionsForCategory = (category: string) => {
    return techOptions.filter(option => option.category === category);
  };
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'frontend':
        return <Globe className="h-4 w-4 text-codemate-purple-light" />;
      case 'backend':
        return <Server className="h-4 w-4 text-green-400" />;
      case 'database':
        return <Database className="h-4 w-4 text-blue-400" />;
      default:
        return <Code className="h-4 w-4 text-yellow-400" />;
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="border-codemate-purple/50 hover:bg-codemate-purple/20 flex-1"
        >
          <Code className="h-4 w-4 mr-2" />
          {selectedTechs.length > 0 
            ? `Tech Stack (${selectedTechs.length} selected)` 
            : "Select Tech Stack"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-4" align="center">
        <h3 className="font-medium text-lg mb-4">Select Technologies</h3>
        <ScrollArea className="h-72 pr-4">
          <div className="space-y-6">
            {['frontend', 'backend', 'database', 'deployment', 'other'].map((category) => (
              <div key={category} className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  {getCategoryIcon(category)}
                  <h4 className="font-medium capitalize">{category}</h4>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {getOptionsForCategory(category).map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`tech-${option.id}`} 
                        checked={selectedTechs.includes(option.id)}
                        onCheckedChange={() => toggleTech(option.id)}
                      />
                      <Label 
                        htmlFor={`tech-${option.id}`}
                        className="text-sm cursor-pointer"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default TechStackSelector;
