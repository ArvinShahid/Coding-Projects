
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { BarChart, Brain, LineChart, GitMerge } from 'lucide-react';
import { useDataset } from '@/contexts/DatasetContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

const MLModels = () => {
  const { dataset, models, setModels, selectedModel, setSelectedModel, modelResults, setModelResults } = useDataset();
  const [trainingStatus, setTrainingStatus] = useState<'idle' | 'training' | 'completed' | 'error'>('idle');
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  useEffect(() => {
    if (dataset.columns.length > 0) {
      setSelectedTarget(dataset.columns[0]);
      setSelectedFeatures(dataset.columns.slice(1));
    }
  }, [dataset.columns]);

  useEffect(() => {
    // Initialize default models if none exist
    if (!models || models.length === 0) {
      setModels([
        { value: 'linear-regression', label: 'Linear Regression', description: 'For predicting continuous values' },
        { value: 'logistic-regression', label: 'Logistic Regression', description: 'For binary classification tasks' },
        { value: 'decision-tree', label: 'Decision Tree', description: 'For classification and regression tasks' },
        { value: 'random-forest', label: 'Random Forest', description: 'Ensemble learning method' },
        { value: 'svm', label: 'Support Vector Machine', description: 'For classification and regression tasks' }
      ]);
    }
  }, [models, setModels]);

  const handleModelChange = (modelName: string) => {
    setSelectedModel(modelName);
  };

  const handleTrainModel = async () => {
    if (!dataset.raw || dataset.raw.length === 0) {
      toast({
        title: 'Error',
        description: 'No dataset available. Please upload a dataset first.',
        variant: 'destructive',
      });
      return;
    }

    if (!selectedTarget) {
      toast({
        title: 'Error',
        description: 'Please select a target variable.',
        variant: 'destructive',
      });
      return;
    }

    if (selectedFeatures.length === 0) {
      toast({
        title: 'Error',
        description: 'Please select at least one feature.',
        variant: 'destructive',
      });
      return;
    }



      setModelResults((prevResults) => ({
        ...prevResults,
        [selectedModel]: results,
      }));

      setTrainingStatus('completed');
      toast({
        title: 'Model Training Complete',
        description: `Model "${selectedModel}" trained with accuracy: ${(accuracy * 100).toFixed(2)}%`,
      });
    }, 3000);
  };

  const handleFeatureSelection = (feature: string) => {
    setSelectedFeatures((prevFeatures) => {
      if (prevFeatures.includes(feature)) {
        return prevFeatures.filter((f) => f !== feature);
      } else {
        return [...prevFeatures, feature];
      }
    });
  };

  if (!dataset.raw) {
    return (
      <Card className="bg-black/30 border-codemate-blue/30">
        <CardContent className="p-8 flex flex-col items-center justify-center min-h-[400px]">
          <Brain className="h-16 w-16 text-gray-500 mb-4" />
          <p className="text-xl text-center text-gray-400 mb-4">
            No dataset available for training
          </p>
          <p className="text-gray-500 text-center max-w-md">
            Upload a dataset to start training machine learning models
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black/30 border-codemate-blue/30">
      <CardContent className="p-8">
        <h2 className="text-2xl font-bold text-codemate-blue-light mb-6">
          Machine Learning Models
        </h2>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Select Model</h3>
          <Select
            value={selectedModel}
            onValueChange={handleModelChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              {models.map((model) => (
                <SelectItem key={model.value} value={model.value}>
                  {model.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {models.map((model) => (
              <Card
                key={model.value}
                className={`border cursor-pointer transition-all ${selectedModel === model.value
                  ? 'border-codemate-blue bg-codemate-blue/10'
                  : 'border-gray-700 hover:border-gray-500'
                  }`}
                onClick={() => handleModelChange(model.value)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">{model.label}</h4>
                    {selectedModel === model.value && (
                      <GitMerge className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mt-1">{model.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Select Target Variable</h3>
          <Select onValueChange={(value) => setSelectedTarget(value)} value={selectedTarget || undefined}>
            <SelectTrigger>
              <SelectValue placeholder="Select target variable" />
            </SelectTrigger>
            <SelectContent>
              {dataset.columns.map((column) => (
                <SelectItem key={column} value={column}>
                  {column}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Select Features</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {dataset.columns.map((column) => (
              <Card
                key={column}
                className={`border cursor-pointer transition-all ${selectedFeatures.includes(column)
                  ? 'border-codemate-blue bg-codemate-blue/10'
                  : 'border-gray-700 hover:border-gray-500'
                  }`}
                onClick={() => handleFeatureSelection(column)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">{column}</h4>
                    {selectedFeatures.includes(column) && (
                      <GitMerge className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Button
          className="bg-gradient-to-r from-codemate-purple to-codemate-blue"
          onClick={handleTrainModel}
          disabled={trainingStatus === 'training'}
        >
          {trainingStatus === 'training' ? (
            <>
              <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-current rounded-full"></div>
              Training...
            </>
          ) : trainingStatus === 'completed' ? (
            <>
              <GitMerge className="h-4 w-4 mr-2" />
              Model Trained
            </>
          ) : (
            <>
              <Brain className="h-4 w-4 mr-2" />
              Train Model
            </>
          )}
        </Button>

        {modelResults[selectedModel] && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Model Results</h3>
            <p>Accuracy: {(modelResults[selectedModel].accuracy * 100).toFixed(2)}%</p>
            <p>Precision: {(modelResults[selectedModel].precision * 100).toFixed(2)}%</p>
            <p>Recall: {(modelResults[selectedModel].recall * 100).toFixed(2)}%</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MLModels;
