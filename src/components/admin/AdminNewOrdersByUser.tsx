import React, { useEffect, useState } from 'react';
import { getOrdersByUser, updateOrderStatus } from 'src/integrations/supabase/orders';
import { supabase } from 'src/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'src/components/ui/table';
import { Badge } from 'src/components/ui/badge';
import { Button } from 'src/components/ui/button';

interface Order {
  id: string;
  order_number: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  total_amount: number;
  created_at: string;
  items: Array<{
    product_id: string;
    quantity: number;
    price: number;
    name: string;
  }>;
}

interface UserOrders {
  user_id: string;
  user_full_name: string;
  user_email: string;
  orders: Order[];
}

const AdminNewOrdersByUser: React.FC = () => {
  const [userOrdersList, setUserOrdersList] = useState<UserOrders[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  // Fetch distinct user_ids with orders
  const fetchUsersWithNewOrders = async (): Promise<string[]> => {
    const { data, error } = await supabase
      .from('orders')
      .select('user_id')
      .not('user_id', 'is', null);

    if (error) {
      console.error('Error fetching user_ids with orders:', error);
      return [];
    }

    // Extract unique user_ids
    const userIds = data?.map((row: any) => row.user_id) || [];
    return Array.from(new Set(userIds));
  };

  // Fetch user full name and email by user_id
  const fetchUserEmail = async (userId: string): Promise<{ full_name: string; email: string }> => {
    const { data, error } = await supabase
      .from('users')
      .select('full_name, email')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error(`Error fetching user info for user ${userId}:`, error);
      return { full_name: 'Unknown', email: 'Unknown' };
    }
    if (!data) {
      console.warn(`No user found with id ${userId}`);
      return { full_name: 'Unknown', email: 'Unknown' };
    }
    return { full_name: data.full_name || 'Unknown', email: data.email || 'Unknown' };
  };

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    setUpdatingOrderId(orderId);
    // Find the order to get current payment_status
    const userOrder = userOrdersList.find(userOrder =>
      userOrder.orders.some(order => order.id === orderId)
    );
    if (!userOrder) {
      console.error('Order not found in state');
      setUpdatingOrderId(null);
      return;
    }
    const order = userOrder.orders.find(order => order.id === orderId);
    if (!order) {
      console.error('Order not found in state');
      setUpdatingOrderId(null);
      return;
    }
    const currentPaymentStatus = order.payment_status || 'pending';

    const success = await updateOrderStatus(orderId, newStatus, currentPaymentStatus);
    if (success) {
      // Update local state
      setUserOrdersList(prevList =>
        prevList.map(userOrder => ({
          ...userOrder,
          orders: userOrder.orders.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order
          ),
        }))
      );
    } else {
      console.error('Failed to update order status');
    }
    setUpdatingOrderId(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userIds = await fetchUsersWithNewOrders();
        const userOrdersPromises = userIds.map(async (userId) => {
          const ordersRaw = await getOrdersByUser(userId);
          // Transform ordersRaw to match local Order interface (add price, name to items)
          const orders = ordersRaw.map(order => ({
            ...order,
            items: order.items?.map(item => ({
              product_id: (item as any).product_id || item.id,
              quantity: item.quantity,
              price: (item as any).unit_price || 0,
              name: (item as any).name || '',
            })) || []
          }));
          const userInfo = await fetchUserEmail(userId);
          return { user_id: userId, user_full_name: userInfo.full_name, user_email: userInfo.email, orders };
        });

        const results = await Promise.all(userOrdersPromises);
        setUserOrdersList(results);
      } catch (error) {
        console.error('Error fetching new orders by user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading new orders by user...</div>;
  }

  if (userOrdersList.length === 0) {
    return <div>No new orders found.</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">New Orders by User</h2>
      {userOrdersList.map(({ user_id, user_full_name, user_email, orders }) => (
        <div key={user_id} className="mb-8">
          <h3 className="text-xl font-semibold mb-2">User: {user_full_name} ({user_email})</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map(order => (
                <TableRow key={order.id}>
                  <TableCell>{order.order_number}</TableCell>
                  <TableCell>
                    <select
                      value={order.status}
                      disabled={updatingOrderId === order.id}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                      className="border rounded px-2 py-1"
                    >
                      <option value="pending">pending</option>
                      <option value="processing">processing</option>
                      <option value="completed">completed</option>
                      <option value="cancelled">cancelled</option>
                      <option value="refunded">refunded</option>
                    </select>
                  </TableCell>
                  <TableCell>ksh {order.total_amount.toFixed(2)}</TableCell>
                  <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {order.items?.map(item => (
                      <div key={item.product_id}>
                        {item.name} x {item.quantity}
                      </div>
                    ))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ))}
    </div>
  );
};

export default AdminNewOrdersByUser;
