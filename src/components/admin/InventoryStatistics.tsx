
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getProductStats } from '@/integrations/supabase/admin';
import { AlertCircle, TrendingDown, TrendingUp } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

const InventoryStatistics: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await getProductStats();
      console.log("Stats data:", data);
      setStats(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching stats:", err);
      setError("Failed to load inventory statistics");
    } finally {
      setLoading(false);
    }
  };

  const prepareChartData = () => {
    if (!stats) return [];
    
    return Object.entries(stats.categoryCounts).map(([category, count]) => ({
      name: category,
      count: count as number,
      value: stats.categoryValue[category] as number
    }));
  };

  const preparePieData = () => {
    if (!stats) return [];
    
    return Object.entries(stats.categoryCounts).map(([category, count]) => ({
      name: category,
      value: count as number
    }));
  };

  // Find low stock items (less than 5)
  const getLowStockCount = () => {
    if (!stats || !stats.lowStockItems) return 0;
    return stats.lowStockItems.length;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin h-8 w-8 border-4 border-kimcom-600 border-t-transparent rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
            <p className="text-red-500">{error}</p>
            <Button 
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={fetchStats}
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = prepareChartData();
  const pieData = preparePieData();

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-gray-500 text-sm">Total Products</p>
              <p className="text-3xl font-bold mt-2">{stats?.totalProducts || 0}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-gray-500 text-sm">Total Inventory Value</p>
              <p className="text-3xl font-bold mt-2">KSh {stats?.totalValue?.toLocaleString() || 0}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-gray-500 text-sm">Total Stock Units</p>
              <p className="text-3xl font-bold mt-2">{stats?.totalStock || 0}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} products`, 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Category Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`KSh ${Number(value).toLocaleString()}`, 'Value']} 
                  />
                  <Legend />
                  <Bar dataKey="value" name="Value (KSh)" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Stock Status */}
      <Card>
        <CardHeader>
          <CardTitle>Stock Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center p-4 bg-yellow-50 rounded-lg">
              <div className="p-3 bg-yellow-100 rounded-full">
                <TrendingDown className="h-6 w-6 text-yellow-700" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-yellow-700">Low Stock Items</h3>
                <p className="text-2xl font-semibold">{stats?.lowStockCount || 0}</p>
              </div>
            </div>
            
            <div className="flex items-center p-4 bg-red-50 rounded-lg">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertCircle className="h-6 w-6 text-red-700" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-red-700">Out of Stock Items</h3>
                <p className="text-2xl font-semibold">{stats?.outOfStockCount || 0}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryStatistics;
