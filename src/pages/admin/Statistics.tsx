
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Download, RefreshCw, BarChart3, Activity, ShoppingBag } from "lucide-react";
import { format } from "date-fns";
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";
import { fetchProducts } from "@/integrations/supabase/admin";

const Statistics: React.FC = () => {
  const [activeTab, setActiveTab] = useState('sales');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [timeRange, setTimeRange] = useState('month');
  const [loading, setLoading] = useState(false);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [productData, setProductData] = useState<any[]>([]);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [trafficData, setTrafficData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [deviceData, setDeviceData] = useState([
    { name: 'Mobile', value: 65 },
    { name: 'Desktop', value: 30 },
    { name: 'Tablet', value: 5 },
  ]);
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  // Check admin status on mount
  useEffect(() => {
    const checkAdminStatus = async () => {
      setLoading(true);
      
      // First check for hardcoded admin in localStorage (from AdminLogin)
      const currentUser = localStorage.getItem('kimcom_current_user');
      if (currentUser) {
        try {
          const parsedUser = JSON.parse(currentUser);
          if (parsedUser.email === 'admin@kimcom.com') {
            setIsAdminUser(true);
            setLoading(false);
            return;
          }
        } catch (e) {
          // Handle parsing error silently
        }
      }

      // Then check for Supabase auth
      const userInfo = supabase.auth.getUser ? (await supabase.auth.getUser()).data?.user : null;
      if (userInfo?.id) {
        const { data, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", userInfo.id)
          .eq("role", "admin")
          .maybeSingle();
          
        if (!error && data) {
          setIsAdminUser(true);
        }
      }
      
      setLoading(false);
    };
    
    checkAdminStatus();
  }, []);

  // Fetch product data when component mounts
  useEffect(() => {
    if (!isAdminUser && loading) return;
    
    fetchData();
  }, [isAdminUser, loading]);

  // Fetch data based on selected date and time range
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch products data
      const products = await fetchProducts();
      setProductData(products);
      
      // Generate mock sales data (replace with real data when available)
      generateMockData(products);
      
      setLoading(false);
      toast.success('Data refreshed successfully');
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
      setLoading(false);
    }
  };

  // Generate mock data based on real products
  const generateMockData = (products: any[]) => {
    // Group products by category
    const categories: { [key: string]: number } = {};
    products.forEach(product => {
      if (categories[product.category]) {
        categories[product.category] += 1;
      } else {
        categories[product.category] = 1;
      }
    });
    
    // Create category data for pie chart
    const catData = Object.keys(categories).map(cat => ({
      name: cat,
      value: categories[cat]
    }));
    setCategoryData(catData);
    
    // Generate mock sales data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const mockSalesData = months.map(month => {
      const sales = Math.floor(Math.random() * 5000) + 1000;
      return {
        name: month,
        sales: sales,
        traffic: Math.floor(Math.random() * 2000) + 500,
        orders: Math.floor(sales / 10)
      };
    });
    
    setSalesData(mockSalesData);
    setTrafficData(mockSalesData);
  };

  const exportReport = () => {
    // Generate a simple CSV with sales data
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Month,Sales,Orders,Traffic\n";
    salesData.forEach(item => {
      csvContent += `${item.name},${item.sales},${item.orders},${item.traffic}\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `statistics_${timeRange}_${format(date || new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Report downloaded successfully');
  };
  
  if (loading && !salesData.length) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-kimcom-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading statistics data...</p>
        </div>
      </div>
    );
  }

  if (!isAdminUser) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="bg-red-100 text-red-700 px-6 py-4 rounded shadow">
          <p>You do not have admin access to this page.</p>
        </div>
      </div>
    );
  }

  // Calculate summary data
  const totalRevenue = salesData.reduce((total, item) => total + item.sales, 0);
  const totalOrders = salesData.reduce((total, item) => total + item.orders, 0);
  const averageOrderValue = totalRevenue / (totalOrders || 1);
  const visitors = trafficData.reduce((total, item) => total + item.traffic, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Statistics</h1>
          <p className="text-muted-foreground">
            Analyze your store's performance metrics
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[180px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="quarter">Quarter</SelectItem>
                <SelectItem value="year">Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button variant="outline" size="icon" onClick={fetchData} disabled={loading}>
            {loading ? (
              <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
          
          <Button variant="outline" onClick={exportReport} disabled={loading}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="sales" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="sales" className="flex items-center">
            <BarChart3 className="h-4 w-4 mr-2" />
            Sales
          </TabsTrigger>
          <TabsTrigger value="traffic" className="flex items-center">
            <Activity className="h-4 w-4 mr-2" />
            Traffic
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center">
            <ShoppingBag className="h-4 w-4 mr-2" />
            Products
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="sales" className="space-y-4 pt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <CardDescription>Current Period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">KSh {totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Orders
                </CardTitle>
                <CardDescription>Current Period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+{totalOrders}</div>
                <p className="text-xs text-muted-foreground">
                  +10.5% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Average Order Value
                </CardTitle>
                <CardDescription>Current Period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">KSh {averageOrderValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                <p className="text-xs text-muted-foreground">
                  +8.2% from last month
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
              <CardDescription>
                Monthly revenue for the current year
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={salesData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sales" fill="#8884d8" name="Sales (KSh)" />
                    <Bar dataKey="orders" fill="#82ca9d" name="Orders" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="traffic" className="space-y-4 pt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Visitors
                </CardTitle>
                <CardDescription>Current Period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{visitors.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  +12.3% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Conversion Rate
                </CardTitle>
                <CardDescription>Visitors to Customers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{((totalOrders / visitors) * 100).toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">
                  +0.5% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Average Session
                </CardTitle>
                <CardDescription>Time on Site</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3m 42s</div>
                <p className="text-xs text-muted-foreground">
                  +12s from last month
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
                <CardDescription>
                  Where your visitors are coming from
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deviceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {deviceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Traffic Trends</CardTitle>
                <CardDescription>
                  Monthly site visits
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={trafficData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="traffic"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                        name="Visitors"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="products" className="space-y-4 pt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Product Categories</CardTitle>
                <CardDescription>
                  Distribution across categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Top Products</CardTitle>
                <CardDescription>
                  Best selling products by stock level
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {productData.slice(0, 5).map((product, i) => (
                    <div key={i} className="flex items-center">
                      <div className="flex flex-col gap-0.5 flex-1">
                        <p className="text-sm font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.category}</p>
                      </div>
                      <div className="flex flex-col items-end gap-0.5">
                        <p className="text-sm font-medium">KSh {product.price.toLocaleString()}</p>
                        <div className="flex items-center gap-1 text-xs">
                          <div className="w-20 h-2 rounded-full bg-gray-100 overflow-hidden">
                            <div
                              className="h-full bg-blue-600 rounded-full"
                              style={{ width: `${(product.stock / 10) * 100}%` }}
                            />
                          </div>
                          <span>{product.stock} in stock</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => window.location.href = '/admin/products'}
                >
                  View All Products
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Statistics;
