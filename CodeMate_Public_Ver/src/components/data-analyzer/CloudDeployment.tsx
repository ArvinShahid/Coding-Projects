import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Cloud, Server, Check, ExternalLink } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useDataset } from '@/contexts/DatasetContext';

const CloudDeployment = () => {
  const { dataset, modelResults, deployedModels, setDeployedModels } = useDataset();
  const [selectedProvider, setSelectedProvider] = useState<string>('gcp');
  const [deploymentStatus, setDeploymentStatus] = useState<'idle' | 'deploying' | 'deployed' | 'failed'>('idle');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [settings, setSettings] = useState({
    instanceType: 'small',
    region: 'us-central1',
    autoScaling: false
  });
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [loginCredentials, setLoginCredentials] = useState({
    email: '',
    password: '',
    apiKey: ''
  });
  const [isLoggedIn, setIsLoggedIn] = useState({
    gcp: false,
    aws: false,
    azure: false
  });
  
  const handleProviderSelect = (provider: string) => {
    setSelectedProvider(provider);
    
    if (!isLoggedIn[provider as keyof typeof isLoggedIn]) {
      setShowLoginDialog(true);
    }
  };

  const handleLogin = () => {
    // Simulate authentication with cloud provider
    console.log(`Logging into ${getProviderName(selectedProvider)}...`);
    
    // In a real implementation, this would call the provider's authentication API
    setTimeout(() => {
      setIsLoggedIn({
        ...isLoggedIn,
        [selectedProvider]: true
      });
      
      setShowLoginDialog(false);
      
      toast({
        title: 'Login Successful',
        description: `You are now logged in to ${getProviderName(selectedProvider)}`,
      });
    }, 1500);
  };
  
  const handleDeploy = () => {
    if (!selectedModel) {
      toast({
        title: 'Error',
        description: 'Please select a model to deploy',
        variant: 'destructive',
      });
      return;
    }
    
    if (!isLoggedIn[selectedProvider as keyof typeof isLoggedIn]) {
      setShowLoginDialog(true);
      return;
    }
    
    setDeploymentStatus('deploying');
    
    // Simulate deployment process
    setTimeout(() => {
      const success = Math.random() > 0.2; // 80% success rate for demo
      
      if (success) {
        setDeploymentStatus('deployed');
        
        // Save deployed model
        const newDeployedModel = {
          id: `${selectedProvider}-${Date.now()}`,
          name: selectedModel,
          provider: selectedProvider,
          region: settings.region,
          instanceType: settings.instanceType,
          deployedAt: new Date().toISOString(),
          status: 'active',
          endpoint: `https://api.${selectedProvider}.example.com/models/${selectedModel.toLowerCase().replace(/\s+/g, '-')}`
        };
        
        setDeployedModels({
          ...deployedModels,
          [newDeployedModel.id]: newDeployedModel
        });
        
        toast({
          title: 'Deployment Successful',
          description: `Your model has been deployed to ${getProviderName(selectedProvider)}`,
        });
      } else {
        setDeploymentStatus('failed');
        toast({
          title: 'Deployment Failed',
          description: 'There was an error deploying your model. Please try again.',
          variant: 'destructive',
        });
      }
    }, 3000);
  };
  
  const getProviderName = (provider: string) => {
    switch (provider) {
      case 'gcp': return 'Google Cloud Platform';
      case 'aws': return 'Amazon Web Services';
      case 'azure': return 'Microsoft Azure';
      default: return 'Cloud Provider';
    }
  };
  
  const getProviderLogo = (provider: string) => {
    switch (provider) {
      case 'gcp': return 'https://static-00.iconduck.com/assets.00/google-cloud-icon-2048x1646-7admxejz.png';
      case 'aws': return 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/2560px-Amazon_Web_Services_Logo.svg.png';
      case 'azure': return 'https://swimburger.net/media/ppnn3pcl/azure.png';
      default: return '';
    }
  };
  
  const getInstanceTypes = (provider: string) => {
    switch (provider) {
      case 'gcp': 
        return [
          { value: 'small', label: 'e2-standard-2 (2 vCPU, 8GB memory)' },
          { value: 'medium', label: 'e2-standard-4 (4 vCPU, 16GB memory)' },
          { value: 'large', label: 'e2-standard-8 (8 vCPU, 32GB memory)' }
        ];
      case 'aws':
        return [
          { value: 'small', label: 't3.medium (2 vCPU, 4GB memory)' },
          { value: 'medium', label: 't3.large (2 vCPU, 8GB memory)' },
          { value: 'large', label: 't3.xlarge (4 vCPU, 16GB memory)' }
        ];
      case 'azure':
        return [
          { value: 'small', label: 'Standard_D2s_v3 (2 vCPU, 8GB memory)' },
          { value: 'medium', label: 'Standard_D4s_v3 (4 vCPU, 16GB memory)' },
          { value: 'large', label: 'Standard_D8s_v3 (8 vCPU, 32GB memory)' }
        ];
      default:
        return [];
    }
  };
  
  const getRegions = (provider: string) => {
    switch (provider) {
      case 'gcp': 
        return [
          { value: 'us-central1', label: 'Iowa (us-central1)' },
          { value: 'us-east1', label: 'South Carolina (us-east1)' },
          { value: 'europe-west1', label: 'Belgium (europe-west1)' },
          { value: 'asia-east1', label: 'Taiwan (asia-east1)' }
        ];
      case 'aws':
        return [
          { value: 'us-east-1', label: 'N. Virginia (us-east-1)' },
          { value: 'us-west-2', label: 'Oregon (us-west-2)' },
          { value: 'eu-west-1', label: 'Ireland (eu-west-1)' },
          { value: 'ap-northeast-1', label: 'Tokyo (ap-northeast-1)' }
        ];
      case 'azure':
        return [
          { value: 'eastus', label: 'East US' },
          { value: 'westus2', label: 'West US 2' },
          { value: 'westeurope', label: 'West Europe' },
          { value: 'southeastasia', label: 'Southeast Asia' }
        ];
      default:
        return [];
    }
  };
  
  const renderDeployButton = () => {
    if (deploymentStatus === 'deploying') {
      return (
        <Button disabled className="w-full">
          <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-current rounded-full"></div>
          Deploying...
        </Button>
      );
    }
    
    if (deploymentStatus === 'deployed') {
      return (
        <Button className="w-full bg-green-600 hover:bg-green-700">
          <Check className="h-4 w-4 mr-2" />
          Deployed
        </Button>
      );
    }
    
    return (
      <Button 
        onClick={handleDeploy} 
        className="w-full bg-gradient-to-r from-codemate-purple to-codemate-blue"
        disabled={!selectedModel}
      >
        <Cloud className="h-4 w-4 mr-2" />
        Deploy Model
      </Button>
    );
  };
  
  if (!dataset.raw) {
    return (
      <Card className="bg-black/30 border-codemate-blue/30">
        <CardContent className="p-8 flex flex-col items-center justify-center min-h-[400px]">
          <Server className="h-16 w-16 text-gray-500 mb-4" />
          <p className="text-xl text-center text-gray-400 mb-4">
            No dataset available for deployment
          </p>
          <p className="text-gray-500 text-center max-w-md">
            Upload a dataset and train a model before deploying to the cloud
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="bg-black/30 border-codemate-blue/30">
      <CardContent className="p-8">
        <h2 className="text-2xl font-bold text-codemate-blue-light mb-6">
          Cloud Deployment
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {['gcp', 'aws', 'azure'].map((provider) => (
            <Card 
              key={provider}
              className={`border cursor-pointer transition-all ${
                selectedProvider === provider 
                  ? 'border-codemate-blue bg-codemate-blue/10' 
                  : 'border-gray-700 hover:border-gray-500'
              }`}
              onClick={() => handleProviderSelect(provider)}
            >
              <CardContent className="p-6 flex flex-col items-center justify-center">
                <div className="h-16 flex items-center justify-center mb-4">
                  <img 
                    src={getProviderLogo(provider)} 
                    alt={getProviderName(provider)}
                    className="max-h-full object-contain"
                  />
                </div>
                <p className="text-center font-medium">{getProviderName(provider)}</p>
                {isLoggedIn[provider as keyof typeof isLoggedIn] && (
                  <div className="absolute top-2 right-2">
                    <Check className="h-4 w-4 text-green-500" />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-2">Available Models</h3>
          {Object.keys(modelResults).length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.keys(modelResults).map((model) => (
                <Card 
                  key={model}
                  className={`border cursor-pointer transition-all ${
                    selectedModel === model 
                      ? 'border-codemate-blue bg-codemate-blue/10' 
                      : 'border-gray-700 hover:border-gray-500'
                  }`}
                  onClick={() => setSelectedModel(model)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">{model}</h4>
                      {selectedModel === model && (
                        <Check className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                      Accuracy: {modelResults[model]?.accuracy ? `${(modelResults[model].accuracy * 100).toFixed(2)}%` : 'N/A'}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No trained models available. Go to the ML Models tab to train a model first.</p>
          )}
        </div>
        
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Deployment Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Instance Type</label>
              <Select 
                value={settings.instanceType}
                onValueChange={(value) => setSettings({...settings, instanceType: value})}
                disabled={!isLoggedIn[selectedProvider as keyof typeof isLoggedIn]}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select instance type" />
                </SelectTrigger>
                <SelectContent>
                  {getInstanceTypes(selectedProvider).map((instance) => (
                    <SelectItem key={instance.value} value={instance.value}>
                      {instance.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Region</label>
              <Select 
                value={settings.region}
                onValueChange={(value) => setSettings({...settings, region: value})}
                disabled={!isLoggedIn[selectedProvider as keyof typeof isLoggedIn]}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {getRegions(selectedProvider).map((region) => (
                    <SelectItem key={region.value} value={region.value}>
                      {region.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="outline" 
                className="border-codemate-blue/50 hover:bg-codemate-blue/20"
                disabled={!isLoggedIn[selectedProvider as keyof typeof isLoggedIn]}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Advanced Configuration
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Advanced Configuration</SheetTitle>
                <SheetDescription>
                  Configure advanced settings for your cloud deployment.
                </SheetDescription>
              </SheetHeader>
              <div className="py-4">
                <h4 className="text-sm font-medium mb-2">Provider-specific Settings</h4>
                <p className="text-sm text-gray-400 mb-4">
                  These settings are specific to {getProviderName(selectedProvider)}.
                </p>
                
                <div className="space-y-4">
                  {selectedProvider === 'gcp' && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Enable Cloud Monitoring</span>
                        <input type="checkbox" className="toggle" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Use Preemptible VMs</span>
                        <input type="checkbox" className="toggle" />
                      </div>
                    </>
                  )}
                  
                  {selectedProvider === 'aws' && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Enable CloudWatch</span>
                        <input type="checkbox" className="toggle" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Use Spot Instances</span>
                        <input type="checkbox" className="toggle" />
                      </div>
                    </>
                  )}
                  
                  {selectedProvider === 'azure' && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Enable Application Insights</span>
                        <input type="checkbox" className="toggle" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Use Low Priority VMs</span>
                        <input type="checkbox" className="toggle" />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        
        <div className="mt-8">
          {renderDeployButton()}
        </div>
      </CardContent>

      {/* Cloud Provider Login Dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Login to {getProviderName(selectedProvider)}</DialogTitle>
            <DialogDescription>
              Enter your credentials to connect to your {getProviderName(selectedProvider)} account.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input 
                id="email" 
                value={loginCredentials.email}
                onChange={(e) => setLoginCredentials({...loginCredentials, email: e.target.value})}
                placeholder="your.email@example.com"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <Input 
                id="password"
                type="password"
                value={loginCredentials.password}
                onChange={(e) => setLoginCredentials({...loginCredentials, password: e.target.value})}
                placeholder="••••••••"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="apiKey" className="text-sm font-medium">API Key</label>
              <Input 
                id="apiKey"
                value={loginCredentials.apiKey}
                onChange={(e) => setLoginCredentials({...loginCredentials, apiKey: e.target.value})}
                placeholder="Enter your API key"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleLogin}>Login</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default CloudDeployment;
