import React, { useEffect, useState } from 'react';
import { fetchTotalRevenue, fetchTotalProducts, fetchTotalCustomers, fetchConversionRate, fetchProducts } from 'integrations/supabase/admin';
import { Card, CardContent, CardHeader, CardTitle } from 'src/components/ui/card';
import { BarChart2, Package, Users, DollarSign, ArrowUpRight, ArrowDownRight, ShoppingCart, TrendingUp } from 'lucide-react';
import { ChartContainer, ChartTooltip } from 'src/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'src/components/ui/table';
import { Button } from 'src/components/ui/button';
import ContactMessages from './ContactMessages';
import AdminNewOrdersByUser from './AdminNewOrdersByUser';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [totalRevenue, setTotalRevenue] = useState<number | null>(null);
  const [totalProducts, setTotalProducts] = useState<number | null>(null);
  const [totalCustomers, setTotalCustomers] = useState<number | null>(null);
  const [conversionRate, setConversionRate] = useState<number | null>(null);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [
          revenue,
          productsCount,
          customersCount,
          convRate,
          productsList
        ] = await Promise.all([
          fetchTotalRevenue(),
          fetchTotalProducts(),
          fetchTotalCustomers(),
          fetchConversionRate(),
          fetchProducts()
        ]);

        setTotalRevenue(revenue);
        setTotalProducts(productsCount);
        setTotalCustomers(customersCount);
        setConversionRate(convRate);

        const sortedProducts = productsList
          .map((p: any) => ({
            id: p.id,
            name: p.name,
            price: p.price ? `KSh ${p.price}` : 'N/A',
            sales: p.sales || 0,
            stock: p.stock || 0,
            trend: p.sales && p.sales > 50 ? 'up' : 'down'
          }))
          .sort((a, b) => b.sales - a.sales);

        setTopProducts(sortedProducts.slice(0, 4));
      } catch (err) {
        setError('Failed to load dashboard data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="text-red-600 p-4">{error}</div>;
  }

  // Sample data - replace with your actual data source
  const salesData = [
    { name: 'Jan', sales: 4000, customers: 2400 },
    { name: 'Feb', sales: 3000, customers: 1398 },
    { name: 'Mar', sales: 2000, customers: 9800 },
    { name: 'Apr', sales: 2780, customers: 3908 },
    { name: 'May', sales: 1890, customers: 4800 },
    { name: 'Jun', sales: 2390, customers: 3800 },
    { name: 'Jul', sales: 3490, customers: 4300 },
  ];

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
            <div className="text-2xl font-bold">
              {totalRevenue !== null ? `KSh ${totalRevenue.toLocaleString()}` : 'N/A'}
            </div>
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
            <div className="text-2xl font-bold">
              {totalProducts !== null ? totalProducts : 'N/A'}
            </div>
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
            <div className="text-2xl font-bold">
              {totalCustomers !== null ? totalCustomers : 'N/A'}
            </div>
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
            <div className="text-2xl font-bold">
              {conversionRate !== null ? `${conversionRate.toFixed(1)}%` : 'N/A'}
            </div>
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
              onClick={() => navigate('/manage-7s8dF3k/products')}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Manage Products
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* New Orders Section */}
      <section className="mt-6 bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">New Orders</h2>
        <AdminNewOrdersByUser />
      </section>
    </div>
  );
};

export default AdminDashboard;
