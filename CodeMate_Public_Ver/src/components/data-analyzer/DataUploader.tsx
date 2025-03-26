
import React, { useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileType, Database, Download, Globe, ExternalLink } from 'lucide-react';
import { useDataset } from '@/contexts/DatasetContext';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const DataUploader = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { dataset, setDataset, isLoading, setIsLoading, error, setError } = useDataset();
  const [kaggleDatasetUrl, setKaggleDatasetUrl] = useState('');
  const [kaggleApiKey, setKaggleApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if it's a CSV file
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      toast({
        title: 'Error',
        description: 'Please upload a CSV file',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const csvData = event.target?.result as string;
        const parsedData = parseCSV(csvData);
        
        if (parsedData.length > 0) {
          const columns = Object.keys(parsedData[0]);
          
          setDataset({
            raw: parsedData,
            cleaned: null,
            columns,
            fileName: file.name,
          });
          
          toast({
            title: 'Success',
            description: `Uploaded ${file.name} with ${parsedData.length} rows and ${columns.length} columns`,
          });
        }
      } catch (err) {
        setError('Failed to parse CSV file');
        toast({
          title: 'Error',
          description: 'Failed to parse CSV file',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    reader.onerror = () => {
      setError('Failed to read file');
      setIsLoading(false);
      toast({
        title: 'Error',
        description: 'Failed to read file',
        variant: 'destructive',
      });
    };

    reader.readAsText(file);
  };

  const handleKaggleDatasetDownload = () => {
    if (!kaggleDatasetUrl) {
      toast({
        title: 'Error',
        description: 'Please enter a Kaggle dataset URL',
        variant: 'destructive',
      });
      return;
    }
    
    // Extract dataset info from URL
    // Example URL: https://www.kaggle.com/datasets/uciml/iris
    const urlParts = kaggleDatasetUrl.split('/');
    let owner = '';
    let datasetName = '';
    
    if (urlParts.includes('datasets')) {
      const datasetIndex = urlParts.indexOf('datasets');
      if (datasetIndex + 2 < urlParts.length) {
        owner = urlParts[datasetIndex + 1];
        datasetName = urlParts[datasetIndex + 2];
      }
    }
    
    if (!owner || !datasetName) {
      toast({
        title: 'Error',
        description: 'Invalid Kaggle dataset URL format',
        variant: 'destructive',
      });
      return;
    }
    
    if (!kaggleApiKey && !showApiKeyInput) {
      setShowApiKeyInput(true);
      return;
    }
    
    if (!kaggleApiKey) {
      toast({
        title: 'Error',
        description: 'Please enter your Kaggle API key',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    toast({
      title: 'Simulating API Call',
      description: 'This would normally call the Kaggle API, but we\'re simulating it for demo purposes',
    });
    
    // Simulate API call delay
    setTimeout(() => {
      // For demo purposes, just load the demo dataset
      const demoData = generateDemoData();
      const columns = Object.keys(demoData[0]);
      
      setDataset({
        raw: demoData,
        cleaned: null,
        columns,
        fileName: `${datasetName}.csv`,
      });
      
      toast({
        title: 'Success',
        description: `Downloaded dataset "${datasetName}" with ${demoData.length} rows`,
      });
      
      setIsLoading(false);
      setShowApiKeyInput(false);
    }, 2000);
  };

  const loadDemoData = () => {
    setIsLoading(true);
    
    // Generate sample housing dataset
    const demoData = generateDemoData();
    const columns = Object.keys(demoData[0]);
    
    setDataset({
      raw: demoData,
      cleaned: null,
      columns,
      fileName: 'demo_housing_data.csv',
    });
    
    toast({
      title: 'Demo Dataset Loaded',
      description: `Loaded housing data with ${demoData.length} rows and ${columns.length} columns`,
    });
    
    setIsLoading(false);
  };

  const generateDemoData = () => {
    // Generate a synthetic housing dataset
    const data = [];
    const locations = ['Downtown', 'Suburb', 'Countryside', 'Coastal', 'Urban'];
    const propertyTypes = ['Apartment', 'House', 'Condo', 'Townhouse'];
    
    for (let i = 0; i < 100; i++) {
      const sqft = Math.floor(Math.random() * 3000) + 500;
      const bedrooms = Math.floor(Math.random() * 6) + 1;
      const bathrooms = Math.floor(Math.random() * 4) + 1;
      const yearBuilt = Math.floor(Math.random() * 70) + 1950;
      const location = locations[Math.floor(Math.random() * locations.length)];
      const propertyType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
      
      // Add some missing values and outliers
      const hasGarage = Math.random() > 0.2 ? (Math.random() > 0.5 ? 'Yes' : 'No') : '';
      const schoolRating = Math.random() > 0.15 ? Math.floor(Math.random() * 10) + 1 : null;
      
      // Price is determined by features with some noise
      let price = 100000 + (sqft * 200) + (bedrooms * 25000) + (bathrooms * 15000);
      price = price - (2023 - yearBuilt) * 1000;
      
      if (location === 'Downtown' || location === 'Coastal') price *= 1.4;
      if (propertyType === 'House') price *= 1.3;
      if (hasGarage === 'Yes') price *= 1.1;
      
      // Add some random noise
      price = Math.round(price * (0.9 + Math.random() * 0.4));
      
      // Add some extremely high outliers
      if (Math.random() > 0.98) price *= 10;
      
      data.push({
        price,
        sqft,
        bedrooms,
        bathrooms,
        yearBuilt,
        location,
        propertyType,
        hasGarage,
        schoolRating,
      });
    }
    
    return data;
  };

  const parseCSV = (csvText: string) => {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(header => header.trim());
    
    const data = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const values = line.split(',').map(value => value.trim());
      
      const row: Record<string, any> = {};
      headers.forEach((header, index) => {
        const value = values[index];
        // Try to convert to number if possible
        const numValue = Number(value);
        row[header] = !isNaN(numValue) ? numValue : value;
      });
      
      data.push(row);
    }
    
    return data;
  };

  const renderPreview = () => {
    if (!dataset.raw || dataset.raw.length === 0) return null;
    
    const previewData = dataset.raw.slice(0, 5);
    const columns = dataset.columns;
    
    return (
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Dataset Preview</h3>
        <div className="border border-gray-700 rounded-lg overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column}>{column}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {previewData.map((row, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={`${index}-${column}`}>
                      {row[column] !== null && row[column] !== undefined 
                        ? row[column].toString() 
                        : 'NULL'}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 text-sm text-gray-400">
          Showing {previewData.length} of {dataset.raw.length} rows
        </div>
      </div>
    );
  };

  return (
    <Card className="bg-black/30 border-codemate-blue/30">
      <CardContent className="p-8">
        <h2 className="text-2xl font-bold text-codemate-blue-light mb-6">
          Upload Dataset
        </h2>
        
        <Tabs defaultValue="upload" className="w-full mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="upload">Local File</TabsTrigger>
            <TabsTrigger value="kaggle">Kaggle Dataset</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-700 rounded-lg p-12">
              <Upload className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg mb-6">Upload your CSV dataset or use our demo data</p>
              
              <div className="flex gap-4">
                <Button 
                  className="bg-gradient-to-r from-codemate-purple to-codemate-blue"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload CSV
                </Button>
                
                <Button 
                  variant="outline" 
                  className="border-codemate-blue/50 hover:bg-codemate-blue/20"
                  onClick={loadDemoData}
                  disabled={isLoading}
                >
                  <Database className="h-4 w-4 mr-2" />
                  Load Demo Data
                </Button>
              </div>
              
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".csv"
                onChange={handleFileUpload}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="kaggle">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-700 rounded-lg p-12">
              <Globe className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg mb-6">Download datasets from Kaggle</p>
              
              <div className="w-full max-w-lg mb-6">
                <div className="flex flex-col space-y-2 mb-4">
                  <label htmlFor="kaggle-url" className="text-sm font-medium">
                    Kaggle Dataset URL
                  </label>
                  <div className="flex gap-2">
                    <Input
                      id="kaggle-url"
                      value={kaggleDatasetUrl}
                      onChange={(e) => setKaggleDatasetUrl(e.target.value)}
                      placeholder="https://www.kaggle.com/datasets/uciml/iris"
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => window.open('https://www.kaggle.com/datasets', '_blank')}
                      title="Browse Kaggle Datasets"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {showApiKeyInput && (
                  <div className="flex flex-col space-y-2 mb-4">
                    <label htmlFor="kaggle-api-key" className="text-sm font-medium">
                      Kaggle API Key
                    </label>
                    <Input
                      id="kaggle-api-key"
                      value={kaggleApiKey}
                      onChange={(e) => setKaggleApiKey(e.target.value)}
                      placeholder="Enter your Kaggle API key"
                      type="password"
                    />
                    <p className="text-xs text-gray-400">
                      Get your API key from your Kaggle account settings
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex gap-4">
                <Button 
                  className="bg-gradient-to-r from-codemate-purple to-codemate-blue"
                  onClick={handleKaggleDatasetDownload}
                  disabled={isLoading}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Dataset
                </Button>
                
                <Button 
                  variant="outline" 
                  className="border-codemate-blue/50 hover:bg-codemate-blue/20"
                  onClick={loadDemoData}
                  disabled={isLoading}
                >
                  <Database className="h-4 w-4 mr-2" />
                  Load Demo Data
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        {isLoading && (
          <div className="flex justify-center mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-codemate-blue"></div>
          </div>
        )}
        
        {error && (
          <div className="text-red-500 mb-4 text-center">
            {error}
          </div>
        )}
        
        {renderPreview()}
      </CardContent>
    </Card>
  );
};

export default DataUploader;
