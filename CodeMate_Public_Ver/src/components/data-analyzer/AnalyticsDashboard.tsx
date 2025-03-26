
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, LineChart, PieChart, Plus, Trash2 } from 'lucide-react';
import { useDataset } from '@/contexts/DatasetContext';
import { toast } from '@/hooks/use-toast';
import { 
  BarChart, 
  LineChart as RechartsLineChart, 
  PieChart as RechartsPieChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid, 
  Line, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  ScatterChart,
  Scatter as RechartsScatter,
  ZAxis,
  TooltipProps
} from 'recharts';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c', '#d0ed57'];

type ChartType = 'bar' | 'line' | 'pie' | 'scatter';

interface ChartConfig {
  id: string;
  title: string;
  type: ChartType;
  xAxis: string;
  yAxis: string;
  aggregation: 'sum' | 'average' | 'count' | 'none';
  filter?: string;
}

const AnalyticsDashboard = () => {
  const { dataset, isLoading, setIsLoading, charts, setCharts } = useDataset();
  const [showNewChartForm, setShowNewChartForm] = useState(false);
  const [newChart, setNewChart] = useState<ChartConfig>({
    id: '',
    title: '',
    type: 'bar',
    xAxis: '',
    yAxis: '',
    aggregation: 'sum',
  });

  const handleGenerateDashboard = () => {
    if (!dataset.cleaned || dataset.cleaned.length === 0) {
      toast({
        title: 'Error',
        description: 'Please clean your data first',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    toast({ 
      title: 'Generating dashboard',
      description: 'Creating visualizations based on your data...'
    });
    
    // Simulate AI processing with a timeout
    setTimeout(() => {
      const columns = Object.keys(dataset.cleaned![0]);
      
      // Find numeric and categorical columns
      const numericColumns = columns.filter(col => typeof dataset.cleaned![0][col] === 'number');
      const categoricalColumns = columns.filter(col => !numericColumns.includes(col));
      
      // Create automatic visualizations based on data types
      const generatedCharts: ChartConfig[] = [];
      
      if (numericColumns.length >= 2) {
        // Create scatter plot of first two numeric columns
        generatedCharts.push({
          id: `scatter-${Date.now()}-1`,
          title: `${numericColumns[0]} vs ${numericColumns[1]}`,
          type: 'scatter',
          xAxis: numericColumns[0],
          yAxis: numericColumns[1],
          aggregation: 'none',
        });
      }
      
      if (categoricalColumns.length >= 1 && numericColumns.length >= 1) {
        // Create bar chart for categorical and numeric
        generatedCharts.push({
          id: `bar-${Date.now()}-1`,
          title: `${numericColumns[0]} by ${categoricalColumns[0]}`,
          type: 'bar',
          xAxis: categoricalColumns[0],
          yAxis: numericColumns[0],
          aggregation: 'average',
        });
        
        // Create pie chart for distribution
        if (categoricalColumns.length >= 1) {
          generatedCharts.push({
            id: `pie-${Date.now()}-1`,
            title: `Distribution of ${categoricalColumns[0]}`,
            type: 'pie',
            xAxis: categoricalColumns[0],
            yAxis: 'count',
            aggregation: 'count',
          });
        }
      }
      
      if (numericColumns.length >= 1) {
        // Create line chart for numeric values
        generatedCharts.push({
          id: `line-${Date.now()}-1`,
          title: `Trend of ${numericColumns[0]}`,
          type: 'line',
          xAxis: 'index',
          yAxis: numericColumns[0],
          aggregation: 'none',
        });
      }
      
      setCharts(generatedCharts);
      setIsLoading(false);
      
      toast({
        title: 'Success',
        description: `Generated ${generatedCharts.length} visualizations`,
      });
    }, 1500);
  };

  const addNewChart = () => {
    if (!newChart.title || !newChart.xAxis || !newChart.yAxis) {
      toast({
        title: 'Error',
        description: 'Please fill all required fields',
        variant: 'destructive',
      });
      return;
    }
    
    const chartWithId = {
      ...newChart,
      id: `custom-${Date.now()}`,
    };
    
    setCharts([...charts, chartWithId]);
    
    // Reset form
    setNewChart({
      id: '',
      title: '',
      type: 'bar',
      xAxis: '',
      yAxis: '',
      aggregation: 'sum',
    });
    
    setShowNewChartForm(false);
    
    toast({
      title: 'Chart added',
      description: 'Your custom chart has been added to the dashboard',
    });
  };

  const deleteChart = (id: string) => {
    setCharts(charts.filter(chart => chart.id !== id));
  };

  const prepareChartData = (chart: ChartConfig) => {
    if (!dataset.cleaned || dataset.cleaned.length === 0) return [];
    
    // For pie and bar charts with aggregation
    if ((chart.type === 'pie' || chart.type === 'bar') && chart.aggregation !== 'none') {
      const aggregatedData: Record<string, { name: string, value: number, count: number }> = {};
      
      dataset.cleaned.forEach(row => {
        const key = row[chart.xAxis]?.toString() || 'undefined';
        
        if (!aggregatedData[key]) {
          aggregatedData[key] = { name: key, value: 0, count: 0 };
        }
        
        if (chart.aggregation === 'count') {
          aggregatedData[key].value += 1;
          aggregatedData[key].count += 1;
        } else {
          const value = row[chart.yAxis];
          if (typeof value === 'number') {
            aggregatedData[key].value += value;
            aggregatedData[key].count += 1;
          }
        }
      });
      
      // Calculate averages if needed
      if (chart.aggregation === 'average') {
        Object.values(aggregatedData).forEach(item => {
          if (item.count > 0) {
            item.value = item.value / item.count;
          }
        });
      }
      
      return Object.values(aggregatedData);
    }
    
    // For scatter plots and line charts
    if (chart.type === 'scatter' || chart.type === 'line') {
      if (chart.xAxis === 'index') {
        // Use index as x-axis
        return dataset.cleaned.map((row, index) => ({
          name: index,
          x: index,
          y: row[chart.yAxis],
        }));
      } else {
        // Use specified columns
        return dataset.cleaned.map((row, index) => ({
          name: index,
          x: row[chart.xAxis],
          y: row[chart.yAxis],
        }));
      }
    }
    
    // Default case
    return dataset.cleaned;
  };

  const renderChart = (chart: ChartConfig) => {
    const data = prepareChartData(chart);
    
    switch (chart.type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );
        
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <RechartsLineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="x" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="y" stroke="#8884d8" />
            </RechartsLineChart>
          </ResponsiveContainer>
        );
        
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </RechartsPieChart>
          </ResponsiveContainer>
        );
        
      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart>
              <CartesianGrid />
              <XAxis type="number" dataKey="x" name={chart.xAxis} />
              <YAxis type="number" dataKey="y" name={chart.yAxis} />
              <ZAxis range={[20]} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Legend />
              <RechartsScatter name={chart.title} data={data} fill="#8884d8" />
            </ScatterChart>
          </ResponsiveContainer>
        );
        
      default:
        return <div>Unsupported chart type</div>;
    }
  };

  if (!dataset.raw) {
    return (
      <Card className="bg-black/30 border-codemate-blue/30">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold text-codemate-blue-light mb-6">
            Analytics Dashboard
          </h2>
          <p className="mb-4">Please upload a dataset first</p>
        </CardContent>
      </Card>
    );
  }

  if (!dataset.cleaned) {
    return (
      <Card className="bg-black/30 border-codemate-blue/30">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold text-codemate-blue-light mb-6">
            Analytics Dashboard
          </h2>
          <p className="mb-4">Please clean your data first</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black/30 border-codemate-blue/30">
      <CardContent className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-codemate-blue-light">
            Analytics Dashboard
          </h2>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="border-codemate-blue/50 hover:bg-codemate-blue/20"
              onClick={() => setShowNewChartForm(!showNewChartForm)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Chart
            </Button>
            
            <Button 
              className="bg-gradient-to-r from-codemate-purple to-codemate-blue"
              onClick={handleGenerateDashboard}
              disabled={isLoading}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Generate Dashboard
            </Button>
          </div>
        </div>
        
        {showNewChartForm && (
          <Card className="bg-black/40 border-gray-700 mb-6">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Create New Chart</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Chart Title</label>
                  <Input 
                    value={newChart.title}
                    onChange={(e) => setNewChart({...newChart, title: e.target.value})}
                    placeholder="Enter chart title"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Chart Type</label>
                  <Select 
                    value={newChart.type} 
                    onValueChange={(value) => setNewChart({...newChart, type: value as ChartType})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select chart type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bar">Bar Chart</SelectItem>
                      <SelectItem value="line">Line Chart</SelectItem>
                      <SelectItem value="pie">Pie Chart</SelectItem>
                      <SelectItem value="scatter">Scatter Plot</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">X-Axis</label>
                  <Select 
                    value={newChart.xAxis} 
                    onValueChange={(value) => setNewChart({...newChart, xAxis: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select X-Axis" />
                    </SelectTrigger>
                    <SelectContent>
                      {newChart.type === 'line' && (
                        <SelectItem value="index">Index (Row Number)</SelectItem>
                      )}
                      {dataset.cleaned && Object.keys(dataset.cleaned[0]).map(column => (
                        <SelectItem key={column} value={column}>{column}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Y-Axis</label>
                  <Select 
                    value={newChart.yAxis} 
                    onValueChange={(value) => setNewChart({...newChart, yAxis: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Y-Axis" />
                    </SelectTrigger>
                    <SelectContent>
                      {newChart.type === 'pie' && (
                        <SelectItem value="count">Count</SelectItem>
                      )}
                      {dataset.cleaned && Object.keys(dataset.cleaned[0])
                        .filter(column => typeof dataset.cleaned![0][column] === 'number')
                        .map(column => (
                          <SelectItem key={column} value={column}>{column}</SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                </div>
                
                {(newChart.type === 'bar' || newChart.type === 'pie') && (
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Aggregation</label>
                    <Select 
                      value={newChart.aggregation} 
                      onValueChange={(value) => setNewChart({
                        ...newChart, 
                        aggregation: value as 'sum' | 'average' | 'count' | 'none'
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select aggregation method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sum">Sum</SelectItem>
                        <SelectItem value="average">Average</SelectItem>
                        <SelectItem value="count">Count</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end">
                <Button 
                  variant="ghost" 
                  className="mr-2"
                  onClick={() => setShowNewChartForm(false)}
                >
                  Cancel
                </Button>
                <Button onClick={addNewChart}>
                  Add Chart
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {isLoading && (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-codemate-blue"></div>
          </div>
        )}
        
        {charts.length === 0 ? (
          <div className="text-center py-12">
            <BarChart3 className="h-16 w-16 mx-auto text-gray-500 mb-4" />
            <h3 className="text-xl font-medium mb-2">No charts yet</h3>
            <p className="text-gray-400 mb-6">
              Generate a dashboard or create custom charts to visualize your data
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {charts.map(chart => (
              <Card key={chart.id} className="bg-black/20 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">{chart.title}</h3>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => deleteChart(chart.id)}
                      className="h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {renderChart(chart)}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnalyticsDashboard;
