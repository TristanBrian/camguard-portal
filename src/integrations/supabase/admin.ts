
import { supabase } from './client';
import { adminClient, debugFetchProducts, forceInsertProduct } from './adminClient';
import { toast } from 'sonner';
import { Product } from '@/data/productsData';
import { checkIfAdmin } from '@/utils/adminAuth';

// Function to check if user is admin
export const isAdmin = async () => {
  try {
    // First check for hardcoded admin in localStorage
    if (checkIfAdmin()) {
      return true;
    }
    
    // Otherwise check Supabase auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    // Check user_roles table for admin role
    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();
      
    if (error) {
      console.error("Error checking admin role:", error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};

// Function to fetch all products
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    console.log("Fetching products via admin.ts");
    
    // First try using supabase client for better auth handling
    try {
      const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching with supabase client:", error);
        throw error;
      }
      
      if (products && products.length > 0) {
        console.log("Successfully fetched products with supabase client:", products);
        
        // Ensure products conform to the Product type
        const typedProducts: Product[] = products.map((product: any) => ({
          id: product.id || crypto.randomUUID(),
          name: product.name,
          price: Number(product.price),
          stock: Number(product.stock),
          category: product.category,
          sku: product.sku || '',
          description: product.description || '',
          image: product.image || '/placeholder.svg',
          difficulty: (product.difficulty as 'Easy' | 'Medium' | 'Advanced') || 'Medium',
          brand: product.brand || '',
          model: product.model || ''
        }));
        
        return typedProducts;
      }
    } catch (e) {
      console.error("Fallback to debugFetchProducts due to:", e);
    }
    
    // If supabase client fails, fall back to debug fetch
    const productsData = await debugFetchProducts();
    
    // Ensure products conform to the Product type
    const typedProducts: Product[] = productsData.map((product: any) => ({
      id: product.id || crypto.randomUUID(),
      name: product.name,
      price: Number(product.price),
      stock: Number(product.stock),
      category: product.category,
      sku: product.sku || '',
      description: product.description || '',
      image: product.image || '/placeholder.svg',
      difficulty: (product.difficulty as 'Easy' | 'Medium' | 'Advanced') || 'Medium',
      brand: product.brand || '',
      model: product.model || ''
    }));
    
    return typedProducts;
  } catch (error) {
    console.error("Error in fetchProducts:", error);
    throw error;
  }
};

// Function to add a new product
export const addProduct = async (productData: any) => {
  try {
    console.log("Adding product via admin.ts:", productData);
    
    // First check if admin
    if (!checkIfAdmin()) {
      toast.error("Admin authentication required to add products");
      throw new Error("Admin authentication required");
    }
    
    // Ensure features is an array if provided
    if (productData.features && !Array.isArray(productData.features)) {
      if (typeof productData.features === 'string') {
        productData.features = productData.features
          .split('\n')
          .filter((line: string) => line.trim() !== '');
      } else {
        productData.features = [];
      }
    }
    
    // Try with regular supabase client first
    try {
      const { data, error } = await supabase
        .from('products')
        .insert(productData)
        .select();
      
      if (error) {
        console.error("Error adding product with supabase client:", error);
        // Fall back to force insert
        const result = await forceInsertProduct(productData);
        if (!result || result.length === 0) {
          throw new Error("Failed to add product");
        }
        
        // We were able to add a product via the fallback method, so we can inform the user
        toast.success("Product added in development mode");
        return result;
      }
      
      console.log("Product added successfully with supabase client:", data);
      return data;
    } catch (e) {
      console.error("Fallback to forceInsertProduct due to:", e);
      const result = await forceInsertProduct(productData);
      
      if (!result || result.length === 0) {
        throw new Error("Failed to add product");
      }
      
      // We were able to add a product via the fallback method, so we can inform the user
      toast.success("Product added in development mode");
      return result;
    }
  } catch (error) {
    console.error("Error in addProduct:", error);
    throw error;
  }
};

// Function to delete a product
export const deleteProduct = async (productId: string) => {
  try {
    console.log("Deleting product:", productId);
    const { error } = await adminClient
      .from('products')
      .delete()
      .eq('id', productId);
    
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error("Error in deleteProduct:", error);
    throw error;
  }
};

// Function to update a product
export const updateProduct = async (productId: string, productData: any) => {
  try {
    console.log("Updating product:", productId, productData);
    
    // Ensure features is an array if provided
    if (productData.features && !Array.isArray(productData.features)) {
      if (typeof productData.features === 'string') {
        productData.features = productData.features
          .split('\n')
          .filter((line: string) => line.trim() !== '');
      } else {
        productData.features = [];
      }
    }
    
    const { data, error } = await adminClient
      .from('products')
      .update(productData)
      .eq('id', productId)
      .select();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Error in updateProduct:", error);
    throw error;
  }
};

// Function to get product statistics
export const getProductStats = async () => {
  try {
    const { data: products, error } = await adminClient
      .from('products')
      .select('*');
    
    if (error) throw error;
    
    // Calculate basic stats
    const totalProducts = products?.length || 0;
    const totalValue = products?.reduce((sum, product) => sum + (Number(product.price) * Number(product.stock)), 0) || 0;
    const lowStockProducts = products?.filter(product => Number(product.stock) < 5)?.length || 0;
    
    // Group by category
    const categoryCounts = products?.reduce((acc, product) => {
      const category = product.category || 'Uncategorized';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};
    
    return {
      totalProducts,
      totalValue,
      lowStockProducts,
      categoryCounts
    };
  } catch (error) {
    console.error("Error getting product stats:", error);
    throw error;
  }
};

export default {
  fetchProducts,
  addProduct,
  deleteProduct,
  updateProduct,
  isAdmin,
  getProductStats
};
