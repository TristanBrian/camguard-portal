
import { supabase } from './client';
import { adminClient, debugFetchProducts, forceInsertProduct } from './adminClient';
import { toast } from 'sonner';

// Function to fetch all products
export const fetchProducts = async () => {
  try {
    console.log("Fetching products via admin.ts");
    const products = await debugFetchProducts();
    return products;
  } catch (error) {
    console.error("Error in fetchProducts:", error);
    throw error;
  }
};

// Function to add a new product
export const addProduct = async (productData) => {
  try {
    console.log("Adding product via admin.ts:", productData);
    const result = await forceInsertProduct(productData);
    return result;
  } catch (error) {
    console.error("Error in addProduct:", error);
    throw error;
  }
};

// Function to delete a product (stub for now)
export const deleteProduct = async (productId) => {
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

export default {
  fetchProducts,
  addProduct,
  deleteProduct
};
