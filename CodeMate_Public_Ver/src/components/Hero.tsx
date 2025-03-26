
import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi
} from "@/components/ui/carousel";
import { useAutoScroll } from '@/hooks/useAutoScroll';

const Hero = () => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  // Use the custom hook for auto-scrolling
  useAutoScroll(carouselApi, 2000);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 pt-16 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-codemate-purple/20 rounded-full blur-3xl opacity-20 animate-pulse-subtle"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-codemate-blue/20 rounded-full blur-3xl opacity-20 animate-pulse-subtle" style={{ animationDelay: '1s' }}></div>
      </div>
      
      {/* Main content */}
      <div className="w-full max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
        <div className="inline-block glass-morphism px-4 py-2 rounded-full text-sm text-gray-300 dark:text-gray-300 light:text-gray-700 mb-2">
          <span className="bg-codemate-purple/20 text-codemate-purple-light px-2 py-0.5 rounded-full mr-2">New</span>
          All-in-One Hackathon Toolkit
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
          <span className="gradient-text">Hackathon Ideas to</span>
          <br /> Working Prototypes
        </h1>
        
        <p className="text-lg md:text-xl text-gray-300 dark:text-gray-300 light:text-gray-700 max-w-2xl mx-auto">
          Generate innovative hackathon ideas, analyze data with AI, and build 
          reliable software with test-driven development in one seamless platform.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link to="/idea-generator">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-codemate-purple to-codemate-blue hover:opacity-90 transition-opacity w-full sm:w-auto"
            >
              Get Started
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
          <Link to="/how-it-works">
            <Button 
              variant="outline" 
              size="lg" 
              className="gradient-border w-full sm:w-auto"
            >
              See How It Works
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Trusted by section */}
      <div className="w-full max-w-5xl mx-auto mt-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold mb-2">Trusted by 100's of STUDENTS for Hackathon and Project Ideas</h2>
        </div>
        
        <Carousel 
          opts={{
            align: "start",
            loop: true,
            dragFree: true,
            containScroll: false,
          }}
          setApi={setCarouselApi}
          className="w-full cursor-grab"
        >
          <CarouselContent className="py-4">
            {/* University logos */}
            <UniversityLogo 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Seal_of_University_of_California%2C_Berkeley.svg/1200px-Seal_of_University_of_California%2C_Berkeley.svg.png" 
              alt="UC Berkeley" 
            />
            <UniversityLogo 
              src="https://kinlane-productions2.s3.amazonaws.com/api-evangelist-site/blog/carnegie-mellon-logo.png" 
              alt="Carnegie Mellon University" 
            />
            <UniversityLogo 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/MIT_logo.svg/2560px-MIT_logo.svg.png" 
              alt="MIT" 
            />
            <UniversityLogo 
              src="https://upload.wikimedia.org/wikipedia/en/thumb/a/a4/Seal_of_the_California_Institute_of_Technology.svg/150px-Seal_of_the_California_Institute_of_Technology.svg.png" 
              alt="Caltech" 
            />
            <UniversityLogo 
              src="https://identity.stanford.edu/wp-content/uploads/sites/3/2020/07/block-s-right.png" 
              alt="Stanford University" 
            />
            <UniversityLogo 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Harvard_University_coat_of_arms.svg/1200px-Harvard_University_coat_of_arms.svg.png" 
              alt="Harvard University" 
            />
            <UniversityLogo 
              src="https://upload.wikimedia.org/wikipedia/en/thumb/6/6e/University_of_Waterloo_seal.svg/1200px-University_of_Waterloo_seal.svg.png" 
              alt="University of Waterloo" 
            />
            <UniversityLogo 
              src="https://brand.gatech.edu/sites/default/files/inline-images/GeorgiaTech_RGB.png" 
              alt="Georgia Tech" 
            />
            <UniversityLogo 
              src="https://1000logos.net/wp-content/uploads/2018/08/University-of-Michigan-Logo.png" 
              alt="University of Michigan" 
            />
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
};

const UniversityLogo = ({ src, alt }: { src: string; alt: string }) => {
  return (
    <CarouselItem className="basis-1/2 md:basis-1/3 lg:basis-1/4 pl-4">
      <div className="flex items-center justify-center h-24">
        <img src={src} alt={alt} className="max-h-full max-w-full object-contain" />
      </div>
    </CarouselItem>
  );
};

export default Hero;
