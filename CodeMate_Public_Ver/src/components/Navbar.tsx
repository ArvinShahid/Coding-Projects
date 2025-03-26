
import React, { useState } from 'react';
import { Menu, X, Github, GitBranch, Server, ClipboardList, Code, HelpCircle, Sparkle, BarChart3 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import ApiKeyModal from './ApiKeyModal';
import GithubIntegration from './GithubIntegration';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isGithubModalOpen, setIsGithubModalOpen] = useState(false);
  const { theme } = useTheme();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-codemate-dark/80 dark:bg-codemate-dark/80 backdrop-blur-lg border-b border-white/10 dark:border-white/10">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md code-gradient flex items-center justify-center">
              <span className="text-white font-bold">CM</span>
            </div>
            <span className="text-xl font-bold gradient-text dark:gradient-text">CodeMate</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/how-it-works" className="text-sm text-muted-foreground hover:text-white dark:hover:text-white transition-colors flex items-center gap-1">
            <HelpCircle className="h-4 w-4" />
            <span>How It Works</span>
          </Link>
          <Link to="/idea-generator" className="text-sm text-muted-foreground hover:text-white dark:hover:text-white transition-colors flex items-center gap-1">
            <Sparkle className="h-4 w-4" />
            <span>Idea Generator</span>
          </Link>
          <Link to="/code-editor" className="text-sm text-muted-foreground hover:text-white dark:hover:text-white transition-colors flex items-center gap-1">
            <Code className="h-4 w-4" />
            <span>Code Editor</span>
          </Link>
          <Link to="/devops" className="text-sm text-muted-foreground hover:text-white dark:hover:text-white transition-colors">
            DevOps
          </Link>
          <Link to="/project-manager" className="text-sm text-muted-foreground hover:text-white dark:hover:text-white transition-colors">
            Project Manager
          </Link>
          <Link to="/data-analyzer" className="text-sm text-muted-foreground hover:text-white dark:hover:text-white transition-colors flex items-center gap-1">
            <BarChart3 className="h-4 w-4" />
            <span>Data Analytics</span>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full"
            onClick={() => setIsGithubModalOpen(true)}
          >
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </Button>
          <Button 
            className="bg-gradient-to-r from-codemate-purple to-codemate-blue hover:opacity-90 transition-opacity"
            onClick={() => setIsApiKeyModalOpen(true)}
          >
            Set API Key
          </Button>
        </div>

        {/* Mobile menu button */}
        <Button 
          variant="ghost" 
          size="icon"
          className="md:hidden" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          <span className="sr-only">Toggle menu</span>
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden glass-morphism animate-fade-in">
          <div className="flex flex-col px-4 py-6 space-y-4">
            <Link 
              to="/how-it-works" 
              className="text-sm text-muted-foreground hover:text-white dark:hover:text-white transition-colors flex items-center gap-1"
              onClick={() => setIsMenuOpen(false)}
            >
              <HelpCircle className="h-4 w-4" />
              <span>How It Works</span>
            </Link>
            <Link 
              to="/idea-generator" 
              className="text-sm text-muted-foreground hover:text-white dark:hover:text-white transition-colors flex items-center gap-1"
              onClick={() => setIsMenuOpen(false)}
            >
              <Sparkle className="h-4 w-4" />
              <span>Idea Generator</span>
            </Link>
            <Link 
              to="/code-editor" 
              className="text-sm text-muted-foreground hover:text-white dark:hover:text-white transition-colors flex items-center gap-1"
              onClick={() => setIsMenuOpen(false)}
            >
              <Code className="h-4 w-4" />
              <span>Code Editor</span>
            </Link>
            <Link 
              to="/devops" 
              className="text-sm text-muted-foreground hover:text-white dark:hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              DevOps
            </Link>
            <Link 
              to="/project-manager" 
              className="text-sm text-muted-foreground hover:text-white dark:hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Project Manager
            </Link>
            <Link 
              to="/data-analyzer" 
              className="text-sm text-muted-foreground hover:text-white dark:hover:text-white transition-colors flex items-center gap-1"
              onClick={() => setIsMenuOpen(false)}
            >
              <BarChart3 className="h-4 w-4" />
              <span>Data Analytics</span>
            </Link>
            <div className="flex items-center gap-4 pt-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full"
                onClick={() => {
                  setIsGithubModalOpen(true);
                  setIsMenuOpen(false);
                }}
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Button>
            </div>
            <Button 
              className="bg-gradient-to-r from-codemate-purple to-codemate-blue hover:opacity-90 transition-opacity w-full"
              onClick={() => {
                setIsApiKeyModalOpen(true);
                setIsMenuOpen(false);
              }}
            >
              Set API Key
            </Button>
          </div>
        </div>
      )}

      <ApiKeyModal 
        isOpen={isApiKeyModalOpen} 
        onClose={() => setIsApiKeyModalOpen(false)} 
      />
      
      <GithubIntegration
        isOpen={isGithubModalOpen}
        onClose={() => setIsGithubModalOpen(false)}
      />
    </nav>
  );
};

export default Navbar;
