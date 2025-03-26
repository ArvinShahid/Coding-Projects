
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wand2, FilterX, GitMerge, List, ArrowUpDown, BrainCircuit, RefreshCw } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { useDataset } from '@/contexts/DatasetContext';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';

const DataCleaner = () => {
  const { dataset, setDataset } = useDataset();
  const [cleaningOptions, setCleaningOptions] = useState({
    // Missing Values
    removeMissingRows: false,
    fillMissingValues: 'mean',
    // Outliers
    removeOutliers: false,
    outlierMethod: 'iqr',
    outlierThreshold: 1.5,
    // Transformations
    normalizeData: false,
    normalizationMethod: 'minmax',
    logTransform: false,
    // Encodings
    oneHotEncoding: false,
    labelEncoding: false,
    // Feature Engineering
    createInteractions: false,
    polynomialFeatures: false,
    polynomialDegree: 2,
  });
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [affectedColumns, setAffectedColumns] = useState<string[]>([]);

  useEffect(() => {
    if (dataset.raw) {
      setPreviewData(dataset.raw.slice(0, 5));
      setAffectedColumns(dataset.columns);
    }
  }, [dataset.raw, dataset.columns]);

  const handleCleanData = () => {
    if (!dataset.raw) {
      toast({
        title: 'Error',
        description: 'No dataset to clean. Please upload a dataset first.',
        variant: 'destructive',
      });
      return;
    }

    let cleanedData = [...dataset.raw];

    // Missing Values
    if (cleaningOptions.removeMissingRows) {
      cleanedData = removeMissingValueRows(cleanedData);
    } else if (cleaningOptions.fillMissingValues) {
      cleanedData = fillMissingValues(cleanedData, cleaningOptions.fillMissingValues, affectedColumns);
    }

    // Outliers
    if (cleaningOptions.removeOutliers) {
      cleanedData = removeOutlierValues(
        cleanedData, 
        cleaningOptions.outlierMethod, 
        cleaningOptions.outlierThreshold,
        affectedColumns
      );
    }

    // Transformations
    if (cleaningOptions.normalizeData) {
      cleanedData = normalizeData(cleanedData, cleaningOptions.normalizationMethod, affectedColumns);
    }

    if (cleaningOptions.logTransform) {
      cleanedData = logTransformData(cleanedData, affectedColumns);
    }

    // Encodings
    if (cleaningOptions.oneHotEncoding) {
      cleanedData = oneHotEncode(cleanedData, affectedColumns);
    }

    if (cleaningOptions.labelEncoding) {
      cleanedData = labelEncode(cleanedData, affectedColumns);
    }

    // Feature Engineering
    if (cleaningOptions.createInteractions) {
      cleanedData = createInteractionFeatures(cleanedData, affectedColumns);
    }

    if (cleaningOptions.polynomialFeatures) {
      cleanedData = createPolynomialFeatures(
        cleanedData, 
        cleaningOptions.polynomialDegree,
        affectedColumns
      );
    }

    setDataset({
      ...dataset,
      cleaned: cleanedData,
    });

    toast({
      title: 'Data Cleaning Complete',
      description: 'Your dataset has been cleaned according to your specifications.',
    });
  };

  // Missing values functions
  const removeMissingValueRows = (data: any[]) => {
    return data.filter(row => 
      Object.keys(row).every(key => 
        row[key] !== null && row[key] !== undefined && row[key] !== ''
      )
    );
  };

  const fillMissingValues = (data: any[], method: string, columns: string[]) => {
    const newData = data.map(item => ({ ...item }));

    columns.forEach(column => {
      const columnValues = newData.map(item => item[column]);
      const missingValues = columnValues.filter(value => value === null || value === undefined || value === '');

      if (missingValues.length > 0) {
        if (method === 'mean') {
          const numericValues = columnValues.filter(value => typeof value === 'number');
          if (numericValues.length > 0) {
            const mean = numericValues.reduce((a, b) => a + b, 0) / numericValues.length;
            newData.forEach(item => {
              if (item[column] === null || item[column] === undefined || item[column] === '') {
                item[column] = mean;
              }
            });
          }
        } else if (method === 'median') {
          const numericValues = columnValues.filter(value => typeof value === 'number').sort((a, b) => a - b);
          if (numericValues.length > 0) {
            const median = numericValues[Math.floor(numericValues.length / 2)];
            newData.forEach(item => {
              if (item[column] === null || item[column] === undefined || item[column] === '') {
                item[column] = median;
              }
            });
          }
        } else if (method === 'mode') {
          const counts: { [key: string]: number } = {};
          columnValues.forEach(value => {
            if (value !== null && value !== undefined && value !== '') {
              counts[value] = (counts[value] || 0) + 1;
            }
          });
          if (Object.keys(counts).length > 0) {
            const mode = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
            newData.forEach(item => {
              if (item[column] === null || item[column] === undefined || item[column] === '') {
                item[column] = mode;
              }
            });
          }
        } else if (method === 'zero') {
          newData.forEach(item => {
            if (item[column] === null || item[column] === undefined || item[column] === '') {
              item[column] = 0;
            }
          });
        } else if (method === 'constant') {
          newData.forEach(item => {
            if (item[column] === null || item[column] === undefined || item[column] === '') {
              item[column] = 'MISSING';
            }
          });
        }
      }
    });

    return newData;
  };

  // Outlier functions
  const removeOutlierValues = (data: any[], method: string, threshold: number, columns: string[]) => {
    const newData = data.filter(row => {
      for (const column of columns) {
        if (typeof row[column] === 'number') {
          if (method === 'iqr') {
            const values = data.map(item => item[column]).filter(val => typeof val === 'number');
            values.sort((a, b) => a - b);
            
            const q1 = values[Math.floor(values.length * 0.25)];
            const q3 = values[Math.floor(values.length * 0.75)];
            const iqr = q3 - q1;
            
            const lowerBound = q1 - threshold * iqr;
            const upperBound = q3 + threshold * iqr;
            
            if (row[column] < lowerBound || row[column] > upperBound) {
              return false;
            }
          } else if (method === 'zscore') {
            const values = data.map(item => item[column]).filter(val => typeof val === 'number');
            const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
            const squaredDifferences = values.map(val => Math.pow(val - mean, 2));
            const variance = squaredDifferences.reduce((sum, val) => sum + val, 0) / values.length;
            const stdDev = Math.sqrt(variance);
            
            const zScore = Math.abs((row[column] - mean) / stdDev);
            if (zScore > threshold) {
              return false;
            }
          }
        }
      }
      return true;
    });
    
    return newData;
  };

  // Transformation functions
  const normalizeData = (data: any[], method: string, columns: string[]) => {
    const newData = data.map(item => ({ ...item }));

    columns.forEach(column => {
      if (typeof newData[0][column] === 'number') {
        const columnValues = newData.map(item => item[column]).filter(val => typeof val === 'number');
        
        if (method === 'minmax') {
          const min = Math.min(...columnValues);
          const max = Math.max(...columnValues);
          const range = max - min;
          
          if (range !== 0) {
            newData.forEach(item => {
              if (typeof item[column] === 'number') {
                item[column] = (item[column] - min) / range;
              }
            });
          }
        } else if (method === 'zscore') {
          const mean = columnValues.reduce((sum, val) => sum + val, 0) / columnValues.length;
          const squaredDifferences = columnValues.map(val => Math.pow(val - mean, 2));
          const variance = squaredDifferences.reduce((sum, val) => sum + val, 0) / columnValues.length;
          const stdDev = Math.sqrt(variance);
          
          if (stdDev !== 0) {
            newData.forEach(item => {
              if (typeof item[column] === 'number') {
                item[column] = (item[column] - mean) / stdDev;
              }
            });
          }
        }
      }
    });

    return newData;
  };

  const logTransformData = (data: any[], columns: string[]) => {
    const newData = data.map(item => ({ ...item }));

    columns.forEach(column => {
      newData.forEach(item => {
        if (typeof item[column] === 'number' && item[column] > 0) {
          item[column] = Math.log(item[column]);
        }
      });
    });

    return newData;
  };

  // Encoding functions
  const oneHotEncode = (data: any[], columns: string[]) => {
    let newData = data.map(item => ({ ...item }));

    columns.forEach(column => {
      // Skip numerical columns
      if (typeof newData[0][column] === 'number') return;
      
      // Get unique values for the column
      const uniqueValues = Array.from(new Set(newData.map(item => item[column])));
      
      // Create new columns for each unique value
      uniqueValues.forEach(value => {
        if (value !== null && value !== undefined && value !== '') {
          const newColumnName = `${column}_${value}`;
          
          newData.forEach(item => {
            item[newColumnName] = item[column] === value ? 1 : 0;
          });
        }
      });
    });

    return newData;
  };

  const labelEncode = (data: any[], columns: string[]) => {
    const newData = data.map(item => ({ ...item }));
    
    columns.forEach(column => {
      // Skip numerical columns
      if (typeof newData[0][column] === 'number') return;
      
      // Get unique values and create mapping
      const uniqueValues = Array.from(new Set(newData.map(item => item[column])))
        .filter(val => val !== null && val !== undefined && val !== '');
      
      const valueMap: Record<string, number> = {};
      uniqueValues.forEach((value, index) => {
        valueMap[value as string] = index;
      });
      
      // Replace values with their encoded versions
      newData.forEach(item => {
        if (item[column] !== null && item[column] !== undefined && item[column] !== '') {
          item[column] = valueMap[item[column]];
        }
      });
    });
    
    return newData;
  };

  // Feature engineering functions
  const createInteractionFeatures = (data: any[], columns: string[]) => {
    const newData = data.map(item => ({ ...item }));
    const numericColumns = columns.filter(col => typeof newData[0][col] === 'number');
    
    for (let i = 0; i < numericColumns.length; i++) {
      for (let j = i + 1; j < numericColumns.length; j++) {
        const col1 = numericColumns[i];
        const col2 = numericColumns[j];
        const interactionCol = `${col1}_x_${col2}`;
        
        newData.forEach(item => {
          item[interactionCol] = item[col1] * item[col2];
        });
      }
    }
    
    return newData;
  };

  const createPolynomialFeatures = (data: any[], degree: number, columns: string[]) => {
    const newData = data.map(item => ({ ...item }));
    const numericColumns = columns.filter(col => typeof newData[0][col] === 'number');
    
    numericColumns.forEach(col => {
      for (let i = 2; i <= degree; i++) {
        const polyCol = `${col}_pow${i}`;
        
        newData.forEach(item => {
          item[polyCol] = Math.pow(item[col], i);
        });
      }
    });
    
    return newData;
  };

  const handleAffectedColumnsChange = (column: string) => {
    if (affectedColumns.includes(column)) {
      setAffectedColumns(affectedColumns.filter(col => col !== column));
    } else {
      setAffectedColumns([...affectedColumns, column]);
    }
  };

  const renderPreview = () => {
    if (!dataset.raw || dataset.raw.length === 0) return null;

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

  const renderSelectedColumns = () => {
    return (
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">Apply to Columns</h3>
        <div className="max-h-40 overflow-y-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 border border-gray-700 rounded-lg p-3">
          {dataset.columns.map((column) => (
            <div key={column} className="flex items-center space-x-2">
              <Checkbox 
                id={`column-${column}`} 
                checked={affectedColumns.includes(column)}
                onCheckedChange={() => handleAffectedColumnsChange(column)}
              />
              <label htmlFor={`column-${column}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {column}
              </label>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card className="bg-black/30 border-codemate-blue/30">
      <CardContent className="p-8">
        <h2 className="text-2xl font-bold text-codemate-blue-light mb-6">
          Data Cleaning
        </h2>

        <Tabs defaultValue="missing" className="w-full mb-6">
          <TabsList className="grid grid-cols-5 gap-4 mb-4">
            <TabsTrigger value="missing"><FilterX className="h-4 w-4 mr-2" /> Missing Values</TabsTrigger>
            <TabsTrigger value="outliers"><GitMerge className="h-4 w-4 mr-2" /> Outliers</TabsTrigger>
            <TabsTrigger value="transform"><ArrowUpDown className="h-4 w-4 mr-2" /> Transformations</TabsTrigger>
            <TabsTrigger value="encode"><List className="h-4 w-4 mr-2" /> Encoding</TabsTrigger>
            <TabsTrigger value="feature"><BrainCircuit className="h-4 w-4 mr-2" /> Feature Engineering</TabsTrigger>
          </TabsList>
          
          <TabsContent value="missing" className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="inline-flex items-center space-x-2">
                  <Checkbox
                    checked={cleaningOptions.removeMissingRows}
                    onCheckedChange={(checked) => 
                      setCleaningOptions({ ...cleaningOptions, removeMissingRows: checked as boolean })
                    }
                  />
                  <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Remove Rows with Missing Values
                  </span>
                </label>
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Fill Missing Values Method</label>
                <Select value={cleaningOptions.fillMissingValues} onValueChange={(value) => setCleaningOptions({ ...cleaningOptions, fillMissingValues: value })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mean">Mean</SelectItem>
                    <SelectItem value="median">Median</SelectItem>
                    <SelectItem value="mode">Mode</SelectItem>
                    <SelectItem value="zero">Replace with Zero</SelectItem>
                    <SelectItem value="constant">Replace with Constant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="outliers" className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="inline-flex items-center space-x-2">
                  <Checkbox
                    checked={cleaningOptions.removeOutliers}
                    onCheckedChange={(checked) => 
                      setCleaningOptions({ ...cleaningOptions, removeOutliers: checked as boolean })
                    }
                  />
                  <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Remove Outliers
                  </span>
                </label>
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Outlier Detection Method</label>
                <Select 
                  value={cleaningOptions.outlierMethod} 
                  onValueChange={(value) => setCleaningOptions({ ...cleaningOptions, outlierMethod: value })}
                  disabled={!cleaningOptions.removeOutliers}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="iqr">IQR (Interquartile Range)</SelectItem>
                    <SelectItem value="zscore">Z-Score</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">
                  Threshold ({cleaningOptions.outlierMethod === 'iqr' ? 'multiplier of IQR' : 'standard deviations'})
                </label>
                <Input
                  type="number"
                  value={cleaningOptions.outlierThreshold.toString()}
                  onChange={(e) => setCleaningOptions({ 
                    ...cleaningOptions, 
                    outlierThreshold: parseFloat(e.target.value) || 1.5 
                  })}
                  disabled={!cleaningOptions.removeOutliers}
                  step="0.1"
                  min="0"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="transform" className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="inline-flex items-center space-x-2">
                  <Checkbox
                    checked={cleaningOptions.normalizeData}
                    onCheckedChange={(checked) => 
                      setCleaningOptions({ ...cleaningOptions, normalizeData: checked as boolean })
                    }
                  />
                  <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Normalize Data
                  </span>
                </label>
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Normalization Method</label>
                <Select 
                  value={cleaningOptions.normalizationMethod} 
                  onValueChange={(value) => setCleaningOptions({ ...cleaningOptions, normalizationMethod: value })}
                  disabled={!cleaningOptions.normalizeData}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minmax">Min-Max Scaling (0-1)</SelectItem>
                    <SelectItem value="zscore">Z-Score Standardization</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="inline-flex items-center space-x-2">
                  <Checkbox
                    checked={cleaningOptions.logTransform}
                    onCheckedChange={(checked) => 
                      setCleaningOptions({ ...cleaningOptions, logTransform: checked as boolean })
                    }
                  />
                  <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Apply Log Transformation
                  </span>
                </label>
                <p className="text-xs text-gray-400 ml-6 mt-1">
                  Useful for skewed data (only applies to positive values)
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="encode" className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="inline-flex items-center space-x-2">
                  <Checkbox
                    checked={cleaningOptions.oneHotEncoding}
                    onCheckedChange={(checked) => 
                      setCleaningOptions({ ...cleaningOptions, oneHotEncoding: checked as boolean })
                    }
                  />
                  <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    One-Hot Encoding
                  </span>
                </label>
                <p className="text-xs text-gray-400 ml-6 mt-1">
                  Creates binary columns for each category
                </p>
              </div>

              <div>
                <label className="inline-flex items-center space-x-2">
                  <Checkbox
                    checked={cleaningOptions.labelEncoding}
                    onCheckedChange={(checked) => 
                      setCleaningOptions({ ...cleaningOptions, labelEncoding: checked as boolean })
                    }
                  />
                  <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Label Encoding
                  </span>
                </label>
                <p className="text-xs text-gray-400 ml-6 mt-1">
                  Converts categories to numeric values
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="feature" className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="inline-flex items-center space-x-2">
                  <Checkbox
                    checked={cleaningOptions.createInteractions}
                    onCheckedChange={(checked) => 
                      setCleaningOptions({ ...cleaningOptions, createInteractions: checked as boolean })
                    }
                  />
                  <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Create Interaction Features
                  </span>
                </label>
                <p className="text-xs text-gray-400 ml-6 mt-1">
                  Multiplies pairs of numeric columns
                </p>
              </div>

              <div>
                <label className="inline-flex items-center space-x-2">
                  <Checkbox
                    checked={cleaningOptions.polynomialFeatures}
                    onCheckedChange={(checked) => 
                      setCleaningOptions({ ...cleaningOptions, polynomialFeatures: checked as boolean })
                    }
                  />
                  <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Create Polynomial Features
                  </span>
                </label>
                <p className="text-xs text-gray-400 ml-6 mt-1">
                  Creates higher order terms of numeric columns
                </p>
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Polynomial Degree</label>
                <Input
                  type="number"
                  value={cleaningOptions.polynomialDegree.toString()}
                  onChange={(e) => setCleaningOptions({ 
                    ...cleaningOptions, 
                    polynomialDegree: parseInt(e.target.value) || 2 
                  })}
                  disabled={!cleaningOptions.polynomialFeatures}
                  min="2"
                  max="5"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {dataset.columns.length > 0 && renderSelectedColumns()}

        <Button
          className="bg-gradient-to-r from-codemate-purple to-codemate-blue mt-8"
          onClick={handleCleanData}
          disabled={!dataset.raw}
        >
          <Wand2 className="h-4 w-4 mr-2" />
          Clean Data
        </Button>

        {renderPreview()}
      </CardContent>
    </Card>
  );
};

export default DataCleaner;
