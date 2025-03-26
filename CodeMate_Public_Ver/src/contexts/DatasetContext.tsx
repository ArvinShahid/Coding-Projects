
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Define types for our dataset and context
type DatasetType = {
  raw: any[] | null;
  cleaned: any[] | null;
  columns: string[];
  fileName: string;
};

type DatasetContextType = {
  dataset: DatasetType;
  setDataset: React.Dispatch<React.SetStateAction<DatasetType>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  selectedModel: string;
  setSelectedModel: React.Dispatch<React.SetStateAction<string>>;
  models: any[];
  setModels: React.Dispatch<React.SetStateAction<any[]>>;
  modelResults: Record<string, any>;
  setModelResults: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  charts: any[];
  setCharts: React.Dispatch<React.SetStateAction<any[]>>;
  deployedModels: Record<string, any>;
  setDeployedModels: React.Dispatch<React.SetStateAction<Record<string, any>>>;
};

const defaultDataset: DatasetType = {
  raw: null,
  cleaned: null,
  columns: [],
  fileName: '',
};

const DatasetContext = createContext<DatasetContextType | undefined>(undefined);

export const DatasetProvider = ({ children }: { children: ReactNode }) => {
  const [dataset, setDataset] = useState<DatasetType>(defaultDataset);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState('linear-regression');
  const [models, setModels] = useState<any[]>([]);
  const [modelResults, setModelResults] = useState<Record<string, any>>({});
  const [charts, setCharts] = useState<any[]>([]);
  const [deployedModels, setDeployedModels] = useState<Record<string, any>>({});
  
  // Load saved state from localStorage on initialization
  useEffect(() => {
    try {
      const savedCharts = localStorage.getItem('analyticsDashboardCharts');
      if (savedCharts) {
        setCharts(JSON.parse(savedCharts));
      }
      
      const savedDataset = localStorage.getItem('analyticsDashboardDataset');
      if (savedDataset) {
        setDataset(JSON.parse(savedDataset));
      }
      
      const savedModelResults = localStorage.getItem('analyticsDashboardModelResults');
      if (savedModelResults) {
        setModelResults(JSON.parse(savedModelResults));
      }
      
      const savedDeployedModels = localStorage.getItem('analyticsDashboardDeployedModels');
      if (savedDeployedModels) {
        setDeployedModels(JSON.parse(savedDeployedModels));
      }
    } catch (err) {
      console.error('Error loading saved state:', err);
    }
  }, []);
  
  // Save charts and dataset to localStorage when they change
  useEffect(() => {
    try {
      if (charts.length > 0) {
        localStorage.setItem('analyticsDashboardCharts', JSON.stringify(charts));
      }
    } catch (err) {
      console.error('Error saving charts:', err);
    }
  }, [charts]);
  
  useEffect(() => {
    try {
      if (dataset.raw) {
        localStorage.setItem('analyticsDashboardDataset', JSON.stringify(dataset));
      }
    } catch (err) {
      console.error('Error saving dataset:', err);
    }
  }, [dataset]);
  
  // Save model results to localStorage when they change
  useEffect(() => {
    try {
      if (Object.keys(modelResults).length > 0) {
        localStorage.setItem('analyticsDashboardModelResults', JSON.stringify(modelResults));
      }
    } catch (err) {
      console.error('Error saving model results:', err);
    }
  }, [modelResults]);
  
  // Save deployed models to localStorage when they change
  useEffect(() => {
    try {
      if (Object.keys(deployedModels).length > 0) {
        localStorage.setItem('analyticsDashboardDeployedModels', JSON.stringify(deployedModels));
      }
    } catch (err) {
      console.error('Error saving deployed models:', err);
    }
  }, [deployedModels]);

  const value = {
    dataset,
    setDataset,
    isLoading,
    setIsLoading,
    error,
    setError,
    selectedModel,
    setSelectedModel,
    models,
    setModels,
    modelResults,
    setModelResults,
    charts,
    setCharts,
    deployedModels,
    setDeployedModels,
  };

  return <DatasetContext.Provider value={value}>{children}</DatasetContext.Provider>;
};

export const useDataset = () => {
  const context = useContext(DatasetContext);
  if (context === undefined) {
    throw new Error('useDataset must be used within a DatasetProvider');
  }
  return context;
};
