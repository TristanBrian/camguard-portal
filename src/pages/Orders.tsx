import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../components/ui/table';
import { getOrdersByUser } from '../integrations/supabase/orders';
import { toast } from 'sonner';

const Orders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Helper function to safely format total
  const formatTotal = (total: any): string => {
    if (total == null || total === undefined) return 'N/A';
    if (typeof total === 'number' && !isNaN(total)) return total.toLocaleString();
    if (typeof total === 'string' && !isNaN(Number(total))) return Number(total).toLocaleString();
    return 'N/A';
  };

  // Helper function to safely format date
  const formatDate = (date: any): string => {
    if (!date) return 'Unknown';
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Unknown';
    return d.toLocaleDateString();
  };

  useEffect(() => {
    async function fetchOrders() {
      try {
        // Get user ID from localStorage
        const currentUser = localStorage.getItem('kimcom_current_user');
        if (!currentUser) {
          toast.error('Please log in to view your orders.');
          navigate('/login');
          return;
        }
        const user = JSON.parse(currentUser);
        if (!user.id) {
          toast.error('Invalid user data. Please log in again.');
          navigate('/login');
          return;
        }
        const ordersData = await getOrdersByUser(user.id);
        setOrders(ordersData);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to load orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <p>Loading orders...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
          {orders.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Order List</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.id}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Unknown'}
                          </span>
                        </TableCell>
                        <TableCell>{formatDate(order.created_at)}</TableCell>
                        <TableCell>KSh {formatTotal(order.total_amount)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-4 bg-gray-50 rounded-md">
              <p className="text-gray-500">You have no orders yet.</p>
              <button
                onClick={() => navigate('/products')}
                className="mt-4 px-4 py-2 bg-kimcom-600 text-white rounded hover:bg-kimcom-700"
              >
                Shop Now
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Orders;
