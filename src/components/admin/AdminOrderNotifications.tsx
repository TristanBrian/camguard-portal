import React, { useEffect, useState } from 'react';
import { updateOrderStatus } from 'src/integrations/supabase/orders';
import { supabase } from 'src/integrations/supabase/client';
import { Button } from 'src/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'src/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'src/components/ui/table';
import { Badge } from 'src/components/ui/badge';
import { toast } from 'sonner';

interface Order {
  id: string;
  order_number: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';
  total_amount: number;
  created_at: string;
  customer_name: string;
  customer_email: string;
  items: Array<{
    product_id: string;
    quantity: number;
    price: number;
    name: string;
  }>;
}

interface AdminNotification {
  id: string;
  order_id: string;
  type: 'new_order' | 'status_change' | 'cancellation_request';
  read: boolean;
  created_at: string;
  metadata?: Record<string, unknown>;
}

const AdminOrderNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [orders, setOrders] = useState<Record<string, Order>>({});
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [view, setView] = useState<'notifications' | 'all-orders'>('notifications');

  // Fetch initial data
  const fetchInitialData = async () => {
    setLoading(true);
    try {
      // Fetch unread notifications
      const { data: notificationsData, error: notificationsError } = await supabase
        .from('admin_notifications')
        .select('*')
      .eq('read', false)
      .order('timestamp', { ascending: false });


      if (notificationsError) throw notificationsError;

      setNotifications(notificationsData || []);

      // Fetch related orders
      const orderIds = notificationsData?.map(n => n.order_id).filter(Boolean) as string[];
      if (orderIds.length > 0) {
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select(`
            id, 
            order_number, 
            status, 
            total_amount, 
            created_at,
            customer_name,
            customer_email,
            items:order_items(product_id, quantity, price, name)
          `)
          .in('id', orderIds);

        if (ordersError) throw ordersError;

        const ordersMap: Record<string, Order> = {};
        ordersData?.forEach(order => {
          ordersMap[order.id] = order as Order;
        });
        setOrders(ordersMap);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('admin_notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Handle order status update
  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    setLoading(true);
    try {
      const success = await updateOrderStatus(orderId, newStatus);
      
      if (success) {
        toast.success(`Order ${orders[orderId].order_number} status updated to ${newStatus}`);
        
        // Update local state
        setOrders(prev => ({
          ...prev,
          [orderId]: { ...prev[orderId], status: newStatus }
        }));

        // Create a notification about the status change
        await supabase
          .from('admin_notifications')
          .insert({
            order_id: orderId,
            type: 'status_change',
            read: false,
            metadata: { new_status: newStatus }
          });
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    } finally {
      setLoading(false);
    }
  };

  // Setup real-time listeners
  useEffect(() => {
    fetchInitialData();

    // Listen for new notifications
    const notificationsChannel = supabase
      .channel('admin_notifications_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'admin_notifications',
          filter: 'read=eq.false'
        },
        (payload) => {
          const newNotification = payload.new as AdminNotification;
          setNotifications(prev => [newNotification, ...prev]);

          // If this is a new order notification, fetch the order details
          if (newNotification.type === 'new_order') {
            supabase
              .from('orders')
              .select(`
                id, 
                order_number, 
                status, 
                total_amount, 
                created_at,
                customer_name,
                customer_email,
                items:order_items(product_id, quantity, price, name)
              `)
              .eq('id', newNotification.order_id)
              .single()
              .then(({ data: orderData, error }) => {
                if (!error && orderData) {
                  setOrders(prev => ({ ...prev, [orderData.id]: orderData as Order }));
                }
              });
          }
        }
      )
      .subscribe();

    // Listen for order changes
    const ordersChannel = supabase
      .channel('orders_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setOrders(prev => ({
              ...prev,
              [payload.new.id]: { ...prev[payload.new.id], ...payload.new }
            }));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(notificationsChannel);
      supabase.removeChannel(ordersChannel);
    };
  }, []);

  // View toggle
  const toggleView = () => {
    setView(prev => prev === 'notifications' ? 'all-orders' : 'notifications');
  };

  if (loading && notifications.length === 0 && Object.keys(orders).length === 0) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {view === 'notifications' ? 'Order Notifications' : 'All Orders'}
        </h1>
        <Button variant="outline" onClick={toggleView}>
          {view === 'notifications' ? 'View All Orders' : 'View Notifications'}
        </Button>
      </div>

      {view === 'notifications' && (
        <>
          {notifications.length === 0 ? (
            <div className="text-center py-8">No new notifications</div>
          ) : (
            <div className="space-y-4">
              {notifications.map(notification => {
                const order = orders[notification.order_id];
                if (!order) return null;

                return (
                  <div 
                    key={notification.id} 
                    className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">
                          New {notification.type.replace('_', ' ')}: Order #{order.order_number}
                        </div>
                        <div className="text-sm text-gray-500">
                          Customer: {order.customer_name} ({order.customer_email})
                        </div>
                        <div className="text-sm">
                          Amount: ${order.total_amount.toFixed(2)}
                        </div>
                          <Badge variant={order.status === 'pending' ? 'secondary' : 'default'}>
                            {order.status}
                          </Badge>
                      </div>
      <div className="text-sm text-gray-500">
        {new Date(notification.created_at).toLocaleString()}
      </div>
                    </div>

                    <div className="mt-3 flex gap-2">
                      <Select
                        value={order.status}
                        onValueChange={(value) => handleStatusChange(order.id, value as Order['status'])}
                      >
                        <SelectTrigger className="w-[150px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                          <SelectItem value="refunded">Refunded</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification.id);
                        }}
                      >
                        Mark as read
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {view === 'all-orders' && (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.values(orders).map(order => (
                <TableRow key={order.id}>
                  <TableCell>{order.order_number}</TableCell>
            <TableCell>
              <div>{order.customer_name}</div>
              <div className="text-sm text-gray-500">{order.customer_email}</div>
            </TableCell>
            <TableCell>
              <Badge variant={
                order.status === 'pending' ? 'secondary' :
                order.status === 'completed' ? 'secondary' :
                order.status === 'cancelled' ? 'destructive' : 'default'
              }>
                {order.status}
              </Badge>
            </TableCell>
            <TableCell>${order.total_amount.toFixed(2)}</TableCell>
            <TableCell>
              {new Date(order.created_at).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedOrder(order)}
              >
                View
              </Button>
            </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">
                Order #{selectedOrder.order_number}
              </h2>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedOrder(null)}
              >
                Close
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-medium mb-2">Customer Information</h3>
                <div className="space-y-1">
                  <div>Name: {selectedOrder.customer_name}</div>
                  <div>Email: {selectedOrder.customer_email}</div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Order Information</h3>
                <div className="space-y-1">
                  <div>Status: <Badge>{selectedOrder.status}</Badge></div>
                  <div>Total: ${selectedOrder.total_amount.toFixed(2)}</div>
                  <div>Date: {new Date(selectedOrder.timestamp).toLocaleString()}</div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-medium mb-2">Order Items</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedOrder.items?.map(item => (
                    <TableRow key={item.product_id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>${item.price.toFixed(2)}</TableCell>
                      <TableCell>${(item.price * item.quantity).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-between items-center">
              <Select
                value={selectedOrder.status}
                onValueChange={(value) => {
                  handleStatusChange(selectedOrder.id, value as Order['status']);
                  setSelectedOrder({
                    ...selectedOrder,
                    status: value as Order['status']
                  });
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                variant="default"
                onClick={() => {
                  // Add any additional actions here
                  setSelectedOrder(null);
                }}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrderNotifications;