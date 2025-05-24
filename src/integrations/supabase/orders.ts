import { supabase } from './client';
import { createAdminNotification } from './admin';

export interface OrderItem {
  id: string;
  quantity: number;
}

export interface Order {
  id: string;
  store_id: string;
  user_id: string | null;
  order_number: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';
  total_amount: number;
  payment_method: string | null;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  created_at: string;
  updated_at: string;
  metadata: any;
  items?: OrderItem[];
}

// Updated createOrder to accept unit_price and total_price for order items
export async function createOrder(
  store_id: string,
  user_id: string | null,
  order_number: string,
  items: (OrderItem & { unit_price: number; total_price: number })[],
  total_amount: number,
  payment_method: string | null = null,
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded' = 'pending',
  metadata: any = {}
): Promise<Order | null> {
  // Validate user_id is a valid UUID before proceeding
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!user_id || !uuidRegex.test(user_id)) {
    console.error('Login to place an order. Invalid or missing user_id.');
    return null;
  }

  // Insert order record
  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .insert([
      {
        store_id,
        user_id,
        order_number,
        status: 'pending',
        total_amount,
        payment_method,
        payment_status,
        metadata,
        updated_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (orderError || !orderData) {
    console.error('Error creating order:', orderError);
    return null;
  }

  const orderId = orderData.id;

  // Insert order items with unit_price and total_price
  const orderItemsToInsert = items.map(item => ({
    order_id: orderId,
    product_id: item.id,
    quantity: item.quantity,
    unit_price: item.unit_price,
    total_price: item.total_price,
    created_at: new Date().toISOString(),
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItemsToInsert);

  if (itemsError) {
    console.error('Error inserting order items:', itemsError);
    // Optionally, you might want to rollback the order insertion here
    return null;
  }

  // Attach items to orderData for return
  orderData.items = items;

  // Notify admin about new order
  await createAdminNotification(
    `New order received: ${orderData.order_number}. Please review and approve.`,
    orderData.id
  );

  return orderData as Order;
}

// Updated getOrdersByUser to fetch order items and attach them
export async function getOrdersByUser(userId: string): Promise<Order[]> {
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders by user:', error);
    return [];
  }

  if (!orders || orders.length === 0) {
    return [];
  }

  // Fetch order items for all orders
  const orderIds = orders.map(order => order.id);
  const { data: orderItems, error: itemsError } = await supabase
    .from('order_items')
    .select('*')
    .in('order_id', orderIds);

  if (itemsError) {
    console.error('Error fetching order items:', itemsError);
    return orders;
  }

  // Attach items to corresponding orders
  const orderItemsMap: Record<string, any[]> = {};
  orderItems.forEach(item => {
    if (!orderItemsMap[item.order_id]) {
      orderItemsMap[item.order_id] = [];
    }
    orderItemsMap[item.order_id].push(item);
  });

  const ordersWithItems = orders.map(order => ({
    ...order,
    items: orderItemsMap[order.id] || [],
  }));

  return ordersWithItems as Order[];
}

// Utility function to generate order number
export function generateOrderNumber(): string {
  // Simple order number generator using timestamp and random number
  const timestamp = Date.now().toString();
  const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD-${timestamp}-${randomNum}`;
}

// New function to update order status and payment status
export async function updateOrderStatus(
  orderId: string,
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded',
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
): Promise<boolean> {
  const { error } = await supabase
    .from('orders')
    .update({ status, payment_status, updated_at: new Date().toISOString() })
    .eq('id', orderId);

  if (error) {
    console.error('Error updating order status:', error);
    return false;
  }
  return true;
}
