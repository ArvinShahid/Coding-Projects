
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Github, GithubIcon, GitBranch, GitPullRequest, Check, RefreshCw } from 'lucide-react';
import { useProject } from '@/contexts/ProjectContext';
import { toast } from '@/hooks/use-toast';

const GithubIntegrationPanel: React.FC = () => {
  const { project, setGithubRepo } = useProject();
  const [repoUrl, setRepoUrl] = useState(project?.githubRepo || '');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const handleConnect = async () => {
    if (!repoUrl.trim()) {
      toast({
        title: "Repository URL Required",
        description: "Please enter a GitHub repository URL",
        variant: "destructive",
      });
      return;
    }
    
    setIsConnecting(true);
    
    // Simulate connection
    setTimeout(() => {
      setGithubRepo(repoUrl);
      setIsConnecting(false);
    }, 1500);
  };
  
  const handleSyncIssues = async () => {
    if (!project?.githubRepo) {
      toast({
        title: "Repository Not Connected",
        description: "Please connect to a GitHub repository first",
        variant: "destructive",
      });
      return;
    }
    
    setIsSyncing(true);
    
    // Simulate sync
    setTimeout(() => {
      setIsSyncing(false);
      
      toast({
        title: "Issues Synchronized",
        description: "GitHub issues have been synced with your project tasks",
      });
    }, 2000);
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">GitHub Integration</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-morphism border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GithubIcon className="h-5 w-5" />
              Connect Repository
            </CardTitle>
            <CardDescription>
              Link your project to a GitHub repository
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="repo-url" className="text-sm text-gray-300">
                Repository URL
              </label>
              <div className="flex gap-2">
                <Input
                  id="repo-url"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="https://github.com/username/repo"
                  className="bg-black/30 border-white/10"
                />
                <Button 
                  onClick={handleConnect}
                  disabled={isConnecting}
                  className="whitespace-nowrap"
                >
                  {isConnecting ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : project?.githubRepo ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Update
                    </>
                  ) : (
                    <>
                      <Github className="h-4 w-4 mr-2" />
                      Connect
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            {project?.githubRepo && (
              <div className="bg-green-900/20 border border-green-500/20 rounded-md p-3 flex items-center gap-3">
                <div className="bg-green-500/20 rounded-full p-1">
                  <Check className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-green-300">Repository Connected</p>
                  <p className="text-xs text-gray-400 mt-1">{project.githubRepo}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="glass-morphism border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitPullRequest className="h-5 w-5" />
              GitHub Synchronization
            </CardTitle>
            <CardDescription>
              Sync issues and pull requests with your project
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <p className="text-sm text-gray-300">
                Pull data from GitHub to update your project or push tasks to create new issues.
              </p>
              
              <div className="flex flex-col gap-3">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 border-white/10"
                  disabled={!project?.githubRepo || isSyncing}
                  onClick={handleSyncIssues}
                >
                  {isSyncing ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <GitBranch className="h-4 w-4" />
                  )}
                  {isSyncing ? 'Syncing Issues...' : 'Sync GitHub Issues'}
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 border-white/10"
                  disabled={!project?.githubRepo}
                >
                  <GitPullRequest className="h-4 w-4" />
                  Push Tasks as GitHub Issues
                </Button>
              </div>
            </div>
            
            <div className="rounded-md bg-black/20 border border-white/5 p-3">
              <h4 className="text-sm font-medium mb-2">Automation Settings</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="auto-sync" 
                    className="rounded bg-black/30 border-white/10"
                    disabled={!project?.githubRepo} 
                  />
                  <label htmlFor="auto-sync" className="text-xs text-gray-300">
                    Auto-sync issues (every 30 minutes)
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="auto-create" 
                    className="rounded bg-black/30 border-white/10"
                    disabled={!project?.githubRepo} 
                  />
                  <label htmlFor="auto-create" className="text-xs text-gray-300">
                    Auto-create GitHub issues for new tasks
                  </label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GithubIntegrationPanel;
