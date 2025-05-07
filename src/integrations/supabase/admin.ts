
import { supabase } from './client';
import { adminClient, debugFetchProducts, forceInsertProduct } from './adminClient';
import { toast } from 'sonner';
import { Product } from '@/data/productsData';

// Function to check if user is admin
export const isAdmin = async () => {
  try {
    // This is a simple check - could be expanded with actual role checking
    const { data: { user } } = await supabase.auth.getUser();
    return user !== null;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};

// Function to fetch all products
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    console.log("Fetching products via admin.ts");
    const products = await debugFetchProducts();
    
    // Ensure products conform to the Product type
    const typedProducts: Product[] = products.map(product => ({
      id: product.id || crypto.randomUUID(),
      name: product.name,
      price: Number(product.price),
      stock: Number(product.stock),
      category: product.category,
      sku: product.sku || '',
      description: product.description || '',
      image: product.image || '/placeholder.svg',
      difficulty: product.difficulty || 'Medium' as 'Easy' | 'Medium' | 'Advanced',
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
    const result = await forceInsertProduct(productData);
    return result;
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
