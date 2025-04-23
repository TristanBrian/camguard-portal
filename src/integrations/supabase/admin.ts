
import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/data/productsData";

/**
 * Check if the current user is an admin.
 */
export async function isAdmin(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) {
    console.error("Admin check error:", error);
    return false;
  }
  return !!data;
}

/**
 * CRUD: Products table
 */
export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  
  if (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
  
  // Convert database results to Product objects
  return data?.map(item => ({
    ...item,
    difficulty: (item.difficulty || 'Medium') as 'Easy' | 'Medium' | 'Advanced',
    // Ensure other fields match the Product interface
    price: Number(item.price),
    stock: Number(item.stock),
    features: item.features || []
  })) || [];
}

export async function createProduct(product: Omit<Product, 'id'>) {
  const { data, error } = await supabase
    .from("products")
    .insert([product])
    .select("*");
  
  if (error) {
    console.error("Error creating product:", error);
    throw error;
  }
  
  if (data?.[0]) {
    return {
      ...data[0],
      difficulty: (data[0].difficulty || 'Medium') as 'Easy' | 'Medium' | 'Advanced',
      price: Number(data[0].price),
      stock: Number(data[0].stock),
      features: data[0].features || []
    } as Product;
  }
  return null;
}

export async function updateProduct(id: string, updates: Partial<Omit<Product, 'id'>>) {
  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id)
    .select("*");
  
  if (error) {
    console.error("Error updating product:", error);
    throw error;
  }
  
  if (data?.[0]) {
    return {
      ...data[0],
      difficulty: (data[0].difficulty || 'Medium') as 'Easy' | 'Medium' | 'Advanced',
      price: Number(data[0].price),
      stock: Number(data[0].stock),
      features: data[0].features || []
    } as Product;
  }
  return null;
}

export async function deleteProduct(id: string) {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);
  
  if (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
  return true;
}

/**
 * Storage: Upload product image to bucket (public "gallery" bucket)
 */
export async function uploadProductImage(file: File, fileName: string) {
  const { data, error } = await supabase.storage
    .from("gallery")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: true,
    });
  if (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
  // Return public URL for use in DB
  const publicUrl = supabase.storage.from("gallery").getPublicUrl(fileName);
  return publicUrl.data.publicUrl;
}

/**
 * Product Gallery: Upload multiple images for a product
 */
export async function uploadGalleryImages(files: File[], productId: string) {
  const uploadPromises = files.map(async (file, index) => {
    const fileName = `product-${productId}-gallery-${index}-${Date.now()}-${file.name}`;
    return uploadProductImage(file, fileName);
  });
  
  const urls = await Promise.all(uploadPromises);
  return urls;
}

/**
 * Statistics: Get product stats
 */
export async function getProductStats() {
  const { data, error } = await supabase
    .from("products")
    .select("category, price, stock")
    .order("created_at", { ascending: false });
  
  if (error) {
    console.error("Error fetching product stats:", error);
    throw error;
  }
  
  // Calculate stats
  const stats = {
    totalProducts: data?.length || 0,
    totalValue: data?.reduce((sum, item) => sum + Number(item.price) * Number(item.stock), 0) || 0,
    totalStock: data?.reduce((sum, item) => sum + Number(item.stock), 0) || 0,
    categoryCounts: {} as Record<string, number>,
    categoryValue: {} as Record<string, number>
  };
  
  // Process categories
  if (data) {
    data.forEach(item => {
      const category = item.category;
      if (!stats.categoryCounts[category]) {
        stats.categoryCounts[category] = 0;
        stats.categoryValue[category] = 0;
      }
      stats.categoryCounts[category]++;
      stats.categoryValue[category] += Number(item.price) * Number(item.stock);
    });
  }
  
  return stats;
}

/**
 * Setup Storage Bucket if it doesn't exist
 */
export async function setupStorageBucket() {
  try {
    // Check if gallery bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const galleryExists = buckets?.some(bucket => bucket.name === 'gallery');
    
    if (!galleryExists) {
      // Create the gallery bucket
      const { data, error } = await supabase.storage.createBucket('gallery', {
        public: true,
        fileSizeLimit: 10485760, // 10MB
      });
      
      if (error) {
        console.error("Error creating gallery bucket:", error);
      } else {
        console.log("Gallery bucket created successfully");
      }
    }
  } catch (error) {
    console.error("Error checking/creating storage bucket:", error);
  }
}
