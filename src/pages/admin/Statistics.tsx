
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarInset } from '@/components/ui/sidebar';
import { Home, Package, BarChart2, TrendingUp, Settings, LogOut, Shield, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

// Sample data
const visitData = [
  { name: 'Mon', visits: 120 },
  { name: 'Tue', visits: 150 },
  { name: 'Wed', visits: 180 },
  { name: 'Thu', visits: 145 },
  { name: 'Fri', visits: 190 },
  { name: 'Sat', visits: 210 },
  { name: 'Sun', visits: 170 },
];

const pageViewData = [
  { name: 'Home', views: 4200 },
  { name: 'Products', views: 3800 },
  { name: 'Services', views: 2400 },
  { name: 'About', views: 1200 },
  { name: 'Contact', views: 1000 },
];

const deviceData = [
  { name: 'Desktop', value: 55 },
  { name: 'Mobile', value: 35 },
  { name: 'Tablet', value: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const conversionData = [
  { name: 'Jan', conversion: 4.2 },
  { name: 'Feb', conversion: 3.8 },
  { name: 'Mar', conversion: 4.5 },
  { name: 'Apr', conversion: 5.2 },
  { name: 'May', conversion: 4.8 },
  { name: 'Jun', conversion: 5.5 },
  { name: 'Jul', conversion: 6.0 },
];

const Statistics: React.FC = () => {
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState('statistics');
  const [timeRange, setTimeRange] = useState('weekly');
  
  const handleNavigation = (path: string, item: string) => {
    setSelectedItem(item);
    navigate(path);
  };

  const handleLogout = () => {
    toast.success('Successfully logged out');
    navigate('/');
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-100">
        <Sidebar>
          <SidebarHeader className="border-b border-gray-200 p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-kimcom-600" />
              <h1 className="text-xl font-bold">KimCom Admin</h1>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={selectedItem === 'dashboard'}
                  onClick={() => handleNavigation('/admin', 'dashboard')}
                  tooltip="Dashboard"
                >
                  <Home className="h-5 w-5" />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={selectedItem === 'products'}
                  onClick={() => handleNavigation('/admin/products', 'products')}
                  tooltip="Product Management"
                >
                  <Package className="h-5 w-5" />
                  <span>Products</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={selectedItem === 'statistics'}
                  onClick={() => handleNavigation('/admin/statistics', 'statistics')}
                  tooltip="Website Statistics"
                >
                  <BarChart2 className="h-5 w-5" />
                  <span>Statistics</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={selectedItem === 'trends'}
                  onClick={() => handleNavigation('/admin/market-trends', 'trends')}
                  tooltip="Market Trends"
                >
                  <TrendingUp className="h-5 w-5" />
                  <span>Market Trends</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={selectedItem === 'settings'}
                  tooltip="Settings"
                >
                  <Settings className="h-5 w-5" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="border-t border-gray-200 p-4">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-gray-500 hover:text-red-500"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-2" />
              Log Out
            </Button>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="p-4 md:p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold tracking-tight">Website Statistics</h1>
              <div className="flex items-center space-x-2 bg-white rounded-lg border border-gray-200 p-1">
                <Calendar className="h-4 w-4 ml-2 text-gray-400" />
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="appearance-none bg-transparent border-none text-sm font-medium focus:outline-none pr-8"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
                <div className="pointer-events-none absolute right-16 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Visits</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12,543</div>
                  <p className="text-xs text-green-500">+12.5% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Time on Site</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3m 42s</div>
                  <p className="text-xs text-green-500">+0.8% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Bounce Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">42%</div>
                  <p className="text-xs text-red-500">+2.3% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Conversion Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3.2%</div>
                  <p className="text-xs text-green-500">+1.1% from last month</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="traffic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="traffic">Traffic</TabsTrigger>
                <TabsTrigger value="pages">Page Views</TabsTrigger>
                <TabsTrigger value="devices">Devices</TabsTrigger>
              </TabsList>
              <TabsContent value="traffic" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Daily Traffic</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <ChartContainer config={{ visits: { theme: { light: "#2563eb", dark: "#3b82f6" } } }}>
                      <LineChart
                        data={visitData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <ChartTooltip />
                        <Legend />
                        <Line type="monotone" dataKey="visits" stroke="var(--color-visits)" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="pages" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Page Views</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <ChartContainer config={{ views: { theme: { light: "#10b981", dark: "#34d399" } } }}>
                      <BarChart
                        data={pageViewData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <ChartTooltip />
                        <Legend />
                        <Bar dataKey="views" fill="var(--color-views)" />
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="devices" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Device Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2 flex justify-center">
                    <div style={{ width: 400, height: 300 }}>
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
                          <ChartTooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <Card>
              <CardHeader>
                <CardTitle>Conversion Rate Trend</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <ChartContainer config={{ conversion: { theme: { light: "#8b5cf6", dark: "#a78bfa" } } }}>
                  <LineChart
                    data={conversionData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip />
                    <Legend />
                    <Line type="monotone" dataKey="conversion" stroke="var(--color-conversion)" activeDot={{ r: 8 }} />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Statistics;
