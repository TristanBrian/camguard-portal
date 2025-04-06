
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarInset } from '@/components/ui/sidebar';
import { Home, Package, BarChart2, TrendingUp, Settings, LogOut, Shield, Calendar, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Sample market trends data
const marketShareData = [
  { name: 'KimCom', value: 24 },
  { name: 'SecureTech', value: 32 },
  { name: 'SafeGuard', value: 18 },
  { name: 'ProtectView', value: 15 },
  { name: 'Others', value: 11 },
];

const priceComparisonData = [
  { name: 'Indoor Cam', kimcom: 8999, competitor: 9500 },
  { name: 'Outdoor Cam', kimcom: 15999, competitor: 16800 },
  { name: '8-Ch NVR', kimcom: 29999, competitor: 32500 },
  { name: 'WiFi Router', kimcom: 6500, competitor: 7200 },
  { name: 'Dome Camera', kimcom: 12000, competitor: 11500 },
];

const industryTrendsData = [
  { name: 'Jan', smart: 3200, standard: 4500 },
  { name: 'Feb', smart: 3600, standard: 4300 },
  { name: 'Mar', smart: 4100, standard: 4100 },
  { name: 'Apr', smart: 4800, standard: 3900 },
  { name: 'May', smart: 5200, standard: 3700 },
  { name: 'Jun', smart: 5900, standard: 3500 },
  { name: 'Jul', smart: 6500, standard: 3300 },
];

const customerPrefData = [
  { name: 'Wired', '2023': 60, '2024': 45 },
  { name: 'Wireless', '2023': 40, '2024': 55 },
  { name: 'Local Storage', '2023': 70, '2024': 40 },
  { name: 'Cloud Storage', '2023': 30, '2024': 60 },
  { name: 'HD Quality', '2023': 55, '2024': 25 },
  { name: '4K Quality', '2023': 45, '2024': 75 },
];

const MarketTrends: React.FC = () => {
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState('trends');
  
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
              <h1 className="text-3xl font-bold tracking-tight">Market Trends</h1>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Last updated: </span>
                <span className="text-sm font-medium">{new Date().toLocaleDateString()}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Market Position</CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="text-2xl font-bold">#2</div>
                  <div className="flex items-center space-x-1 text-xs text-green-500">
                    <ArrowUpRight className="h-3 w-3" />
                    <span>Up from #3 last quarter</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Industry Growth</CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="text-2xl font-bold">+8.3%</div>
                  <div className="flex items-center space-x-1 text-xs text-green-500">
                    <TrendingUp className="h-3 w-3" />
                    <span>Growing steadily</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Price Competitiveness</CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="text-2xl font-bold">93%</div>
                  <div className="flex items-center space-x-1 text-xs text-red-500">
                    <ArrowDownRight className="h-3 w-3" />
                    <span>Down 2% from last month</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="marketShare" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="marketShare">Market Share</TabsTrigger>
                <TabsTrigger value="priceComparison">Price Comparison</TabsTrigger>
                <TabsTrigger value="industryTrends">Industry Trends</TabsTrigger>
                <TabsTrigger value="customerPreferences">Customer Preferences</TabsTrigger>
              </TabsList>
              <TabsContent value="marketShare" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Market Share Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <ChartContainer 
                      config={{
                        value: { 
                          theme: { 
                            light: "#8b5cf6", 
                            dark: "#a78bfa" 
                          } 
                        }
                      }}
                      className="aspect-[3/2]"
                    >
                      <BarChart
                        data={marketShareData}
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
                        <Bar dataKey="value" name="Market Share (%)" fill="var(--color-value)" />
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="priceComparison" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Price Comparison with Competitors</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <ChartContainer 
                      config={{
                        kimcom: { 
                          label: "KimCom Price (KSh)",
                          theme: { 
                            light: "#2563eb", 
                            dark: "#3b82f6" 
                          } 
                        },
                        competitor: {
                          label: "Competitor Avg. Price (KSh)",
                          theme: {
                            light: "#ef4444",
                            dark: "#f87171"
                          }
                        }
                      }}
                      className="aspect-[3/2]"
                    >
                      <BarChart
                        data={priceComparisonData}
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
                        <Bar dataKey="kimcom" fill="var(--color-kimcom)" />
                        <Bar dataKey="competitor" fill="var(--color-competitor)" />
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="industryTrends" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Industry Trend: Smart vs. Standard Systems</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <ChartContainer 
                      config={{
                        smart: { 
                          label: "Smart Systems",
                          theme: { 
                            light: "#10b981", 
                            dark: "#34d399" 
                          } 
                        },
                        standard: {
                          label: "Standard Systems",
                          theme: {
                            light: "#f59e0b",
                            dark: "#fbbf24"
                          }
                        }
                      }}
                      className="aspect-[3/2]"
                    >
                      <LineChart
                        data={industryTrendsData}
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
                        <Line 
                          type="monotone" 
                          dataKey="smart" 
                          stroke="var(--color-smart)" 
                          strokeWidth={2}
                          activeDot={{ r: 8 }} 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="standard" 
                          stroke="var(--color-standard)" 
                          strokeWidth={2}
                          activeDot={{ r: 8 }} 
                        />
                      </LineChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="customerPreferences" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Preferences: 2023 vs. 2024</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <ChartContainer 
                      config={{
                        "2023": { 
                          label: "2023",
                          theme: { 
                            light: "#8b5cf6", 
                            dark: "#a78bfa" 
                          } 
                        },
                        "2024": {
                          label: "2024",
                          theme: {
                            light: "#ec4899",
                            dark: "#f472b6"
                          }
                        }
                      }}
                      className="aspect-[3/2]"
                    >
                      <BarChart
                        data={customerPrefData}
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
                        <Bar dataKey="2023" fill="var(--color-2023)" />
                        <Bar dataKey="2024" fill="var(--color-2024)" />
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <Card>
              <CardHeader>
                <CardTitle>Market Insights</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div className="border-l-4 border-kimcom-600 pl-4 py-2">
                    <h3 className="font-semibold">Smart Systems Gaining Traction</h3>
                    <p className="text-sm text-gray-600">The market is rapidly shifting towards smart security systems with AI capabilities and mobile integration. Consider expanding your smart product offerings.</p>
                  </div>
                  <div className="border-l-4 border-kimcom-600 pl-4 py-2">
                    <h3 className="font-semibold">Price Sensitivity Analysis</h3>
                    <p className="text-sm text-gray-600">Your mid-range products show the best competitive advantage. High-end products are slightly overpriced compared to the market average.</p>
                  </div>
                  <div className="border-l-4 border-kimcom-600 pl-4 py-2">
                    <h3 className="font-semibold">Customer Preference Shift</h3>
                    <p className="text-sm text-gray-600">There's a significant trend towards wireless systems and cloud storage solutions. Consider bundling cloud storage with your camera systems.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default MarketTrends;
