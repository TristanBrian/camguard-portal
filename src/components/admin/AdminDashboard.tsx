import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart2, Package, Users, DollarSign, ArrowUpRight, ArrowDownRight, ShoppingCart, TrendingUp } from 'lucide-react';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import ContactMessages from './ContactMessages';

const salesData = [
  { name: 'Jan', sales: 4000, customers: 2400, amt: 2400 },
  { name: 'Feb', sales: 3000, customers: 1398, amt: 2210 },
  { name: 'Mar', sales: 2000, customers: 9800, amt: 2290 },
  { name: 'Apr', sales: 2780, customers: 3908, amt: 2000 },
  { name: 'May', sales: 1890, customers: 4800, amt: 2181 },
  { name: 'Jun', sales: 2390, customers: 3800, amt: 2500 },
  { name: 'Jul', sales: 3490, customers: 4300, amt: 2100 },
];

const topProducts = [
  {
    id: '1',
    name: 'Wireless Keyboard',
    price: 'KSh 4,500',
    sales: 152,
    stock: 24,
    trend: 'up'
  },
  {
    id: '2',
    name: 'LED Monitor 24"',
    price: 'KSh 18,900',
    sales: 89,
    stock: 12,
    trend: 'up'
  },
  {
    id: '3',
    name: 'Ergonomic Mouse',
    price: 'KSh 2,800',
    sales: 74,
    stock: 35,
    trend: 'down'
  },
  {
    id: '4',
    name: 'USB-C Hub',
    price: 'KSh 3,599',
    sales: 67,
    stock: 18,
    trend: 'up'
  },
];

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center bg-white rounded-lg border border-gray-200 px-3 py-1">
          <span className="text-sm text-gray-500">Last updated: </span>
          <span className="text-sm font-medium ml-1">{new Date().toLocaleDateString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <div className="h-8 w-8 rounded-full bg-blue-100 p-1.5 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-blue-700" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KSh 1,234,567</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <ArrowUpRight className="mr-1 h-3 w-3" />
              <span>+12.5% from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <div className="h-8 w-8 rounded-full bg-green-100 p-1.5 flex items-center justify-center">
              <Package className="h-5 w-5 text-green-700" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <ArrowUpRight className="mr-1 h-3 w-3" />
              <span>+4 new products</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <div className="h-8 w-8 rounded-full bg-purple-100 p-1.5 flex items-center justify-center">
              <Users className="h-5 w-5 text-purple-700" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">573</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <ArrowUpRight className="mr-1 h-3 w-3" />
              <span>+18.2% from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <div className="h-8 w-8 rounded-full bg-amber-100 p-1.5 flex items-center justify-center">
              <BarChart2 className="h-5 w-5 text-amber-700" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2%</div>
            <div className="flex items-center text-xs text-red-500 mt-1">
              <ArrowDownRight className="mr-1 h-3 w-3" />
              <span>-0.5% from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <ContactMessages />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Sales Overview</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => navigate('/admin/statistics')}>
                View Details
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer
              config={{
                sales: { 
                  label: "Sales",
                  theme: {
                    light: "#2563eb",
                    dark: "#3b82f6",
                  }
                },
                customers: {
                  label: "Customers",
                  theme: {
                    light: "#10b981",
                    dark: "#34d399"
                  }
                }
              }}
              className="aspect-[2/1]"
            >
              <AreaChart
                data={salesData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip />
                <Area type="monotone" dataKey="customers" stroke="var(--color-customers)" fill="var(--color-customers)" fillOpacity={0.2} />
                <Area type="monotone" dataKey="sales" stroke="var(--color-sales)" fill="var(--color-sales)" fillOpacity={0.2} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Best Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Sales</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end">
                        <span className="mr-2">{product.sales}</span>
                        {product.trend === 'up' ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button 
              variant="outline" 
              className="w-full mt-4" 
              onClick={() => navigate('/admin/products')}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Manage Products
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
