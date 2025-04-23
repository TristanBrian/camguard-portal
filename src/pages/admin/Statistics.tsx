
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getProductStats } from '@/integrations/supabase/admin';
import { ArrowUpRight, Download, Users, ShoppingBag, DollarSign, Package, RefreshCw, LineChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

const Statistics: React.FC = () => {
  const [productStats, setProductStats] = useState<any>({
    totalProducts: 0,
    totalValue: 0,
    totalStock: 0,
    categoryCounts: {},
    categoryValue: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const stats = await getProductStats();
      setProductStats(stats);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching product stats:', err);
      toast.error('Failed to load statistics');
      setLoading(false);
    }
  };

  // Transform category data for charts
  const categoryPieData = Object.entries(productStats.categoryCounts).map(([name, value]) => ({
    name,
    value
  }));

  const categoryBarData = Object.entries(productStats.categoryValue).map(([name, value]) => ({
    name,
    value: Number(value)
  }));

  // Mock sales and user data (would come from real tables in the future)
  const mockSalesData = [
    { month: 'Jan', sales: 4200 },
    { month: 'Feb', sales: 3800 },
    { month: 'Mar', sales: 5200 },
    { month: 'Apr', sales: 4900 },
    { month: 'May', sales: 6100 },
    { month: 'Jun', sales: 5400 }
  ];

  const mockUserData = {
    total: 250,
    active: 180,
    new: 45
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Website Statistics</h1>
        <Button 
          variant="outline" 
          onClick={fetchStats}
          disabled={loading}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productStats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Products in inventory
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KSh {productStats.totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Total value of inventory
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productStats.totalStock}</div>
            <p className="text-xs text-muted-foreground">
              Units in stock
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockUserData.active}</div>
            <div className="flex items-center pt-1">
              <ArrowUpRight className="mr-1 h-3 w-3 text-emerald-500" />
              <span className="text-xs text-emerald-500">{mockUserData.new} new this month</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Product Categories</CardTitle>
            <CardDescription>
              Distribution of products by category
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            {loading ? (
              <div className="flex justify-center items-center h-[300px]">
                <div className="animate-spin h-8 w-8 border-4 border-kimcom-600 border-t-transparent rounded-full"></div>
              </div>
            ) : (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryPieData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      nameKey="name"
                      dataKey="value"
                      outerRadius={80}
                      fill="#8884d8"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name) => [
                        `${value} products`,
                        `${name}`
                      ]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Category Value</CardTitle>
            <CardDescription>
              Value distribution of products by category
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            {loading ? (
              <div className="flex justify-center items-center h-[300px]">
                <div className="animate-spin h-8 w-8 border-4 border-kimcom-600 border-t-transparent rounded-full"></div>
              </div>
            ) : (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryBarData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`KSh ${Number(value).toLocaleString()}`, 'Value']} />
                    <Legend />
                    <Bar dataKey="value" name="Category Value" fill="#8884d8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Monthly Sales Overview</CardTitle>
          <CardDescription>
            Sales trend over the past 6 months
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockSalesData} margin={{ top: 20, right: 30, left: 30, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`KSh ${Number(value).toLocaleString()}`, 'Sales']} />
                <Legend />
                <Bar dataKey="sales" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button variant="outline" onClick={() => toast.success('Report generated!')}>
          <Download className="h-4 w-4 mr-2" />
          Export Reports
        </Button>
      </div>
    </div>
  );
};

export default Statistics;
