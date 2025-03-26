
import React, { useState, useRef, useEffect } from 'react';
import { getDemoSections, DemoSection } from './HowItWorks/DemoSection';
import SectionNav from './HowItWorks/SectionNav';

interface InteractiveDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

const InteractiveDemo: React.FC<InteractiveDemoProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState(0);
  const [scrolling, setScrolling] = useState(false);
  const demoRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Array<HTMLDivElement | null>>([]);
  
  const demoSections = getDemoSections();

  const scrollToSection = (index: number) => {
    if (scrolling) return;
    
    setScrolling(true);
    setActiveSection(index);
    
    sectionRefs.current[index]?.scrollIntoView({
      behavior: 'smooth'
    });
    
    setTimeout(() => {
      setScrolling(false);
    }, 1000);
  };

  const handleWheel = (e: WheelEvent) => {
    if (scrolling) return;
    
    if (e.deltaY > 0 && activeSection < demoSections.length - 1) {
      scrollToSection(activeSection + 1);
    } else if (e.deltaY < 0 && activeSection > 0) {
      scrollToSection(activeSection - 1);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (scrolling) return;
    
    if (e.key === 'ArrowDown' && activeSection < demoSections.length - 1) {
      e.preventDefault();
      scrollToSection(activeSection + 1);
    } else if (e.key === 'ArrowUp' && activeSection > 0) {
      e.preventDefault();
      scrollToSection(activeSection - 1);
    }
  };

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('wheel', handleWheel, { passive: false });
      window.addEventListener('keydown', handleKeyDown);
      
      return () => {
        window.removeEventListener('wheel', handleWheel);
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, activeSection, scrolling]);

  if (!isOpen) return null;

  return (
    <div className="bg-black/90 backdrop-blur-lg overflow-hidden pt-16">
      <div className="container mx-auto px-4">
        <div className="pt-8 pb-4">
          <h1 className="text-3xl font-bold text-center mb-2 gradient-text">How CodeMate Works</h1>
          <p className="text-center text-gray-300 max-w-2xl mx-auto">
            Discover how our AI-powered tools transform your development workflow from planning to deployment
          </p>
        </div>
        
        <SectionNav 
          sections={demoSections}
          activeSection={activeSection}
          scrollToSection={scrollToSection}
          scrolling={scrolling}
        />
        
        <div ref={demoRef} className="h-[calc(100vh-7rem)] snap-y snap-mandatory overflow-y-auto scrollbar-none">
          {demoSections.map((section, index) => (
            <DemoSection
              key={section.id}
              section={section}
              active={index === activeSection}
              onSectionRef={el => sectionRefs.current[index] = el}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default InteractiveDemo;
