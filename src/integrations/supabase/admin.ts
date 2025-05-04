
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
  try {
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
  } catch (error) {
    console.error("Failed to fetch products:", error);
    throw error;
  }
}

export async function createProduct(product: Omit<Product, 'id'>) {
  try {
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
  } catch (error) {
    console.error("Failed to create product:", error);
    throw error;
  }
}

export async function updateProduct(id: string, updates: Partial<Omit<Product, 'id'>>) {
  try {
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
  } catch (error) {
    console.error("Failed to update product:", error);
    throw error;
  }
}

export async function deleteProduct(id: string) {
  try {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);
    
    if (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
    return true;
  } catch (error) {
    console.error("Failed to delete product:", error);
    throw error;
  }
}

/**
 * Storage: Upload product image to bucket (public "gallery" bucket)
 */
export async function uploadProductImage(file: File, fileName: string) {
  try {
    await setupStorageBucket(); // Ensure bucket exists before upload
    
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
  } catch (error) {
    console.error("Failed to upload product image:", error);
    throw error;
  }
}

/**
 * Product Gallery: Upload multiple images for a product
 */
export async function uploadGalleryImages(files: File[], productId: string) {
  try {
    const uploadPromises = files.map(async (file, index) => {
      const fileName = `product-${productId}-gallery-${index}-${Date.now()}-${file.name}`;
      return uploadProductImage(file, fileName);
    });
    
    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.error("Failed to upload gallery images:", error);
    throw error;
  }
}

/**
 * Add images to product gallery
 */
export async function addToProductGallery(productId: string, imageUrls: string[]) {
  try {
    // Fetch current product first to get existing features
    const { data: product, error: fetchError } = await supabase
      .from("products")
      .select("features")
      .eq("id", productId)
      .single();
      
    if (fetchError) {
      console.error("Error fetching product for gallery update:", fetchError);
      throw fetchError;
    }
    
    // Combine existing features with new image URLs
    const existingFeatures = product.features || [];
    const features = Array.isArray(existingFeatures) 
      ? [...existingFeatures, ...imageUrls] 
      : [...imageUrls];
      
    // Update product with new features array including gallery images
    const { error: updateError } = await supabase
      .from("products")
      .update({ 
        features,
        updated_at: new Date().toISOString()
      })
      .eq("id", productId);
      
    if (updateError) {
      console.error("Error adding to product gallery:", updateError);
      throw updateError;
    }
    
    return true;
  } catch (error) {
    console.error("Failed to add to product gallery:", error);
    throw error;
  }
}

/**
 * Statistics: Get product stats
 */
export async function getProductStats() {
  try {
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
  } catch (error) {
    console.error("Failed to get product stats:", error);
    throw error;
  }
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
        throw error;
      } else {
        console.log("Gallery bucket created successfully");
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error checking/creating storage bucket:", error);
    throw error;
  }
}

/**
 * Get all images for a product (from features array)
 */
export async function getProductGalleryImages(productId: string): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("features")
      .eq("id", productId)
      .single();
      
    if (error) {
      console.error("Error fetching product gallery:", error);
      throw error;
    }
    
    if (!data || !data.features) return [];
    
    // Filter features array to only include URLs
    const galleryImages = Array.isArray(data.features) 
      ? data.features.filter((f: any) => 
          typeof f === 'string' && 
          (f.startsWith('http') || f.startsWith('/'))
        )
      : [];
      
    return galleryImages;
  } catch (error) {
    console.error("Failed to get product gallery images:", error);
    return [];
  }
}
