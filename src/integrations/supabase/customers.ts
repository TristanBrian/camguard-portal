import { supabase } from './client';

export interface Customer {
  id: string;
  store_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

/**
 * Get existing customer by id or create a new one if not exists.
 * @param userId - UUID of the user (customer id)
 * @param storeId - UUID of the store
 * @param email - Customer email
 * @param firstName - Optional first name
 * @param lastName - Optional last name
 * @returns Customer id or null if error
 */
export async function getOrCreateCustomer(
  userId: string,
  storeId: string,
  email: string,
  firstName?: string,
  lastName?: string
): Promise<string | null> {
  try {
    // Check if customer exists
    const { data: existingCustomer, error: fetchError } = await supabase
      .from<Customer>('customers')
      .select('id')
      .eq('id', userId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('Error fetching customer:', fetchError);
      return null;
    }

    if (existingCustomer) {
      return existingCustomer.id;
    }

    // Insert new customer
    const { data: newCustomer, error: insertError } = await supabase
      .from<Customer>('customers')
      .insert([
        {
          id: userId,
          store_id: storeId,
          email,
          first_name: firstName,
          last_name: lastName,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select('id')
      .single();

    if (insertError) {
      console.error('Error creating customer:', insertError);
      return null;
    }

    return newCustomer?.id || null;
  } catch (err) {
    console.error('Unexpected error in getOrCreateCustomer:', err);
    return null;
  }
}
