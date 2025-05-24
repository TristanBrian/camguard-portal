import { supabase } from './client';

export async function addContactMessageWithMpesaCode(
  user_id: string,
  mpesa_code: string,
  name: string,
  email: string,
  phone?: string,
  subject?: string,
  message?: string
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([
        {
          name,
          email,
          phone,
          subject: subject || 'M-Pesa Payment Confirmation',
          message: message || `Payment confirmed with M-Pesa code: ${mpesa_code}`,
          mpesa_code,
          status: 'new',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);

    if (error) {
      console.error('Error inserting contact message with mpesa code:', error);
      return false;
    }

    if (!data || !Array.isArray(data)) {
      return false;
    }

    return data.length > 0;
  } catch (error) {
    console.error('Exception inserting contact message with mpesa code:', error);
    return false;
  }
}

export async function addAdminNotification(
  orderId: string,
  message: string
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([
        {
          subject: 'New Order Approval Needed',
          message: `Order ID: ${orderId}\nDetails: ${message}`,
          status: 'new',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);

    if (error) {
      console.error('Error inserting admin notification:', error);
      return false;
    }

    if (!data || !Array.isArray(data)) {
      return false;
    }

    return data.length > 0;
  } catch (error) {
    console.error('Exception inserting admin notification:', error);
    return false;
  }
}
