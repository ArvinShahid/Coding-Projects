
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import DataUploader from '@/components/data-analyzer/DataUploader';
import DataCleaner from '@/components/data-analyzer/DataCleaner';
import AnalyticsDashboard from '@/components/data-analyzer/AnalyticsDashboard';
import MLModels from '@/components/data-analyzer/MLModels';
import CloudDeployment from '@/components/data-analyzer/CloudDeployment';
import { DatasetProvider } from '@/contexts/DatasetContext';

const DataAnalyzer = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4 gradient-text">AI Data Analyzer</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Upload, clean, analyze and build machine learning models on your data
            </p>
          </div>
          
          <DatasetProvider>
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid grid-cols-5 gap-4 mb-8">
                <TabsTrigger value="upload">Dataset Upload</TabsTrigger>
                <TabsTrigger value="clean">Data Cleaning</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="ml">ML Models</TabsTrigger>
                <TabsTrigger value="deploy">Cloud Deployment</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upload" className="mt-6">
                <DataUploader />
              </TabsContent>
              
              <TabsContent value="clean" className="mt-6">
                <DataCleaner />
              </TabsContent>
              
              <TabsContent value="analytics" className="mt-6">
                <AnalyticsDashboard />
              </TabsContent>
              
              <TabsContent value="ml" className="mt-6">
                <MLModels />
              </TabsContent>
              
              <TabsContent value="deploy" className="mt-6">
                <CloudDeployment />
              </TabsContent>
            </Tabs>
          </DatasetProvider>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DataAnalyzer;
