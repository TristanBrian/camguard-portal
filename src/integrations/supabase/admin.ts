
import { supabase } from './client';
import { fetchAllProducts, forceInsertProduct, forceDeleteProduct, forceUpdateProduct, createTestProducts } from './adminClient';
import { checkIfAdmin } from '@/utils/adminAuth';
import { toast } from 'sonner';

// Fetch all products with fallback mechanisms
export const fetchProducts = async () => {
  try {
    console.log('Fetching products via admin.ts');
    
    // First try the admin client method
    const products = await fetchAllProducts();
    
    // If we got products, return them
    if (products && products.length > 0) {
      return products;
    }
    
    // Try debug method if no products were found
    console.log('Debug: Directly fetching products with admin client');
    if (checkIfAdmin()) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*');
          
        if (!error && data) {
          console.log('Successfully loaded', data.length, 'products:', data);
          return data;
        }
      } catch (e) {
        console.error('Error in debug fetch:', e);
      }
    }
    
    // Last resort: create test products for development
    if (process.env.NODE_ENV === 'development') {
      return await createTestProducts(5);
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching products:', error);
    
    // Development fallback
    if (process.env.NODE_ENV === 'development') {
      return await createTestProducts(3);
    }
    
    throw error;
  }
};

// Add a product with error handling and fallbacks
export const addProduct = async (productData: any) => {
  try {
    console.log('Adding product via admin.ts:', productData);
    
    if (!checkIfAdmin()) {
      throw new Error('Admin authentication required');
    }
    
    // Try with supabase client first
    try {
      const { data, error } = await supabase
        .from('products')
        .insert(productData)
        .select();
        
      if (error) {
        console.error('Error adding product with supabase client:', error);
      } else if (data && data.length > 0) {
        return data[0];
      }
    } catch (e) {
      console.error('Exception adding product with supabase client:', e);
    }
    
    // Fallback to admin client method
    return await forceInsertProduct(productData);
    
  } catch (error) {
    console.error('Error adding product:', error);
    
    // Development fallback
    if (process.env.NODE_ENV === 'development') {
      toast.info('Using development mode: Product will be available locally only');
      return { id: `dev-${Date.now()}`, ...productData };
    }
    
    throw error;
  }
};

// Delete product with fallbacks
export const deleteProduct = async (id: string) => {
  try {
    if (!checkIfAdmin()) {
      throw new Error('Admin authentication required');
    }
    
    // Try normal client first
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
        
      if (!error) {
        return true;
      }
    } catch (e) {
      console.error('Error with normal delete:', e);
    }
    
    // Fallback to force delete
    return await forceDeleteProduct(id);
    
  } catch (error) {
    console.error('Error deleting product:', error);
    
    // Development fallback
    if (process.env.NODE_ENV === 'development') {
      return true;
    }
    
    throw error;
  }
};

// Update product with fallbacks
export const updateProduct = async (id: string, productData: any) => {
  try {
    if (!checkIfAdmin()) {
      throw new Error('Admin authentication required');
    }
    
    // Try normal update first
    try {
      const { data, error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', id)
        .select();
        
      if (!error && data) {
        return data[0];
      }
    } catch (e) {
      console.error('Error with normal update:', e);
    }
    
    // Fallback to force update
    return await forceUpdateProduct(id, productData);
    
  } catch (error) {
    console.error('Error updating product:', error);
    
    // Development fallback
    if (process.env.NODE_ENV === 'development') {
      return { id, ...productData };
    }
    
    throw error;
  }
};

// Initialize development environment with test data if needed
export const initDevelopmentEnvironment = async () => {
  if (process.env.NODE_ENV === 'development') {
    const { data } = await supabase.from('products').select('*').limit(1);
    
    if (!data || data.length === 0) {
      console.log('Initializing development environment with test products');
      await createTestProducts(5);
    }
  }
};
