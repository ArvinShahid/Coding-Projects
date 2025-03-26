
import React from 'react';
import { Upload, BarChart2, FileSymlink, Brain, Clock } from 'lucide-react';

const DataAnalyticsSectionDetails = () => {
  return (
    <div className="space-y-6">
      <p className="text-gray-300">
        Our AI Data Analyzer helps you make sense of complex datasets through a comprehensive workflow:
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-black/30 p-4 rounded-md">
          <div className="flex items-center gap-2 mb-2">
            <Upload className="h-4 w-4 text-purple-400" />
            <h3 className="font-semibold text-purple-400">Data Import</h3>
          </div>
          <p className="text-sm text-gray-400">Upload your own datasets or import directly from Kaggle. Supports CSV, Excel, JSON, and other common formats.</p>
        </div>
        <div className="bg-black/30 p-4 rounded-md">
          <div className="flex items-center gap-2 mb-2">
            <FileSymlink className="h-4 w-4 text-purple-400" />
            <h3 className="font-semibold text-purple-400">Data Cleaning</h3>
          </div>
          <p className="text-sm text-gray-400">Comprehensive tools for handling missing values, outliers, duplicates, and performing data transformations and encoding.</p>
        </div>
        <div className="bg-black/30 p-4 rounded-md">
          <div className="flex items-center gap-2 mb-2">
            <BarChart2 className="h-4 w-4 text-purple-400" />
            <h3 className="font-semibold text-purple-400">Visualization</h3>
          </div>
          <p className="text-sm text-gray-400">Generate insightful charts, correlation matrices, and statistical summaries to understand patterns and relationships.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="bg-black/30 p-4 rounded-md">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="h-4 w-4 text-purple-400" />
            <h3 className="font-semibold text-purple-400">ML Model Building</h3>
          </div>
          <p className="text-sm text-gray-400">Train and evaluate machine learning models with just a few clicks. Supports classification, regression, clustering, and more.</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="text-xs bg-black/20 p-2 rounded">Random Forest</div>
            <div className="text-xs bg-black/20 p-2 rounded">Neural Networks</div>
            <div className="text-xs bg-black/20 p-2 rounded">Gradient Boosting</div>
            <div className="text-xs bg-black/20 p-2 rounded">SVM</div>
          </div>
        </div>
        <div className="bg-black/30 p-4 rounded-md">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-purple-400" />
            <h3 className="font-semibold text-purple-400">Cloud Deployment</h3>
          </div>
          <p className="text-sm text-gray-400">Deploy your models to major cloud providers with optimized configurations for production use.</p>
          <div className="mt-3 flex flex-wrap justify-center gap-4">
            <img src="https://static-00.iconduck.com/assets.00/google-cloud-icon-2048x1646-7admxejz.png" alt="Google Cloud" className="h-8" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/2560px-Amazon_Web_Services_Logo.svg.png" alt="AWS" className="h-8" />
            <img src="https://swimburger.net/media/ppnn3pcl/azure.png" alt="Azure" className="h-8" />
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-black/40 rounded-lg border border-purple-500/20">
        <h3 className="font-semibold text-purple-400 mb-2">Complete Data Science Workflow</h3>
        <ol className="space-y-2 text-sm text-gray-300">
          <li className="flex items-start">
            <span className="bg-purple-500/20 text-purple-400 rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">1</span>
            <span>Upload or connect to your data source</span>
          </li>
          <li className="flex items-start">
            <span className="bg-purple-500/20 text-purple-400 rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">2</span>
            <span>Clean and preprocess data with AI assistance</span>
          </li>
          <li className="flex items-start">
            <span className="bg-purple-500/20 text-purple-400 rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">3</span>
            <span>Visualize and gain insights from your data</span>
          </li>
          <li className="flex items-start">
            <span className="bg-purple-500/20 text-purple-400 rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">4</span>
            <span>Build, train, and evaluate machine learning models</span>
          </li>
          <li className="flex items-start">
            <span className="bg-purple-500/20 text-purple-400 rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">5</span>
            <span>Deploy your models to production environments</span>
          </li>
        </ol>
      </div>
    </div>
  );
};

export default DataAnalyticsSectionDetails;
