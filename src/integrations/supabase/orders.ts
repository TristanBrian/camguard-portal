import { supabase } from './client';

export interface OrderItem {
  id: string;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'approved' | 'delivered';
  date: string;
}

// Create a new order with status 'pending'
export async function createOrder(userId: string, items: OrderItem[], total: number): Promise<Order | null> {
  const { data, error } = await supabase
    ?.from('orders')
    .insert([
      {
        userId,
        items,
        total,
        status: 'pending',
        date: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating order:', error);
    return null;
  }

  return data as Order;
}

// Get orders by userId
export async function getOrdersByUser(userId: string): Promise<Order[]> {
  const { data, error } = await supabase
    ?.from('orders')
    .select('*')
    .eq('userId', userId)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
    return [];
  }

  return data as Order[];
}
