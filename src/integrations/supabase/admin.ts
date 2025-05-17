
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

// Add isAdmin function to check if user has admin role
export const isAdmin = async () => {
  try {
    // First check for localStorage admin
    if (checkIfAdmin()) {
      return true;
    }
    
    // Then check for Supabase role
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return false;
    
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .eq('role', 'admin')
      .maybeSingle();
      
    if (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Exception checking admin status:', error);
    return false;
  }
};

// Get product statistics for admin dashboard
export const getProductStats = async () => {
  try {
    if (!checkIfAdmin()) {
      throw new Error('Admin authentication required');
    }
    
    const { data, error } = await supabase
      .from('products')
      .select('*');
      
    if (error) {
      throw error;
    }
    
    const products = data || [];
    
    // Calculate various statistics
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, product) => sum + (Number(product.price) * Number(product.stock)), 0);
    const totalStock = products.reduce((sum, product) => sum + Number(product.stock), 0);
    const lowStockProducts = products.filter(product => Number(product.stock) < 5).length;
    const outOfStockProducts = products.filter(product => Number(product.stock) <= 0).length;
    
    // Calculate category statistics
    const categoryCounts: Record<string, number> = {};
    const categoryValue: Record<string, number> = {};
    
    products.forEach(product => {
      const category = product.category || 'Uncategorized';
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      categoryValue[category] = (categoryValue[category] || 0) + (Number(product.price) * Number(product.stock));
    });
    
    // Get low stock items
    const lowStockItems = products
      .filter(product => Number(product.stock) < 5)
      .map(product => ({ 
        id: product.id, 
        name: product.name, 
        stock: product.stock,
        category: product.category
      }));
    
    return {
      totalProducts,
      totalValue,
      totalStock,
      lowStockCount: lowStockProducts,
      outOfStockCount: outOfStockProducts,
      categoryCounts,
      categoryValue,
      lowStockItems
    };
  } catch (error) {
    console.error('Error getting product stats:', error);
    
    // Development fallback
    if (process.env.NODE_ENV === 'development') {
      // Return mock statistics
      return {
        totalProducts: 8,
        totalValue: 12500,
        totalStock: 45,
        lowStockCount: 2,
        outOfStockCount: 1,
        categoryCounts: {
          'CCTV': 3,
          'Network': 2,
          'Access Control': 2,
          'Alarms': 1
        },
        categoryValue: {
          'CCTV': 6000,
          'Network': 2500,
          'Access Control': 3000,
          'Alarms': 1000
        },
        lowStockItems: [
          { id: 'mock-1', name: 'IP Camera', stock: 2, category: 'CCTV' },
          { id: 'mock-2', name: 'Motion Sensor', stock: 3, category: 'Alarms' }
        ]
      };
    }
    
    throw error;
  }
};
