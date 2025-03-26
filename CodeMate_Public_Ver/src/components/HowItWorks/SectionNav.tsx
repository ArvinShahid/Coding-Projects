
import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '../ui/button';
import { DemoSectionProps } from './DemoSection';

interface SectionNavProps {
  sections: DemoSectionProps[];
  activeSection: number;
  scrollToSection: (index: number) => void;
  scrolling: boolean;
}

export const SectionNav: React.FC<SectionNavProps> = ({ 
  sections, 
  activeSection, 
  scrollToSection,
  scrolling
}) => {
  return (
    <>
      {/* Horizontal nav buttons */}
      <div className="absolute left-1/2 top-36 transform -translate-x-1/2 flex space-x-4">
        {sections.map((section, index) => (
          <button
            key={index}
            className={`py-2 px-4 rounded-full transition-colors ${
              index === activeSection 
                ? 'bg-gradient-to-r from-codemate-purple to-codemate-blue text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => scrollToSection(index)}
            aria-label={`Go to ${section.title}`}
          >
            {section.title}
          </button>
        ))}
      </div>
      
      {/* Vertical navigation buttons */}
      <div className="absolute right-6 top-1/2 transform -translate-y-1/2 flex flex-col gap-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          className="bg-black/30 backdrop-blur-md rounded-full"
          onClick={() => activeSection > 0 && scrollToSection(activeSection - 1)}
          disabled={activeSection === 0 || scrolling}
        >
          <ChevronUp className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="bg-black/30 backdrop-blur-md rounded-full"
          onClick={() => activeSection < sections.length - 1 && scrollToSection(activeSection + 1)}
          disabled={activeSection === sections.length - 1 || scrolling}
        >
          <ChevronDown className="h-6 w-6" />
        </Button>
      </div>
    </>
  );
};

export default SectionNav;
