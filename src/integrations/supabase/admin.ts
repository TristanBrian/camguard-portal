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
    // Use a more complete query with explicit ordering and error handling
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.log("No products found in database");
      return [];
    }
    
    console.log(`Successfully fetched ${data.length} products from database`);
    
    // Convert database results to Product objects with careful type handling
    return data.map(item => ({
      id: item.id,
      name: item.name || "Untitled Product",
      description: item.description || "",
      category: item.category || "Uncategorized",
      price: Number(item.price) || 0,
      stock: Number(item.stock) || 0,
      image: item.image || "/placeholder.svg",
      difficulty: (item.difficulty || 'Medium') as 'Easy' | 'Medium' | 'Advanced',
      brand: item.brand || "",
      model: item.model || "",
      features: Array.isArray(item.features) ? item.features : [],
      sku: item.sku || `SKU-${item.id.substring(0, 8)}`
    }));
  } catch (error) {
    console.error("Failed to fetch products:", error);
    // Return an empty array instead of throwing to prevent UI crashes
    return [];
  }
}

export async function createProduct(product: Omit<Product, 'id'>) {
  try {
    console.log("Creating new product:", product);
    const { data, error } = await supabase
      .from("products")
      .insert([product])
      .select("*");
    
    if (error) {
      console.error("Error creating product:", error);
      throw error;
    }
    
    if (data?.[0]) {
      console.log("Product created successfully:", data[0].id);
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
 * Storage: Upload product image to bucket with improved error handling
 */
export async function uploadProductImage(file: File, fileName: string) {
  try {
    // Check if the bucket exists, create if it doesn't
    const { data: buckets } = await supabase.storage.listBuckets();
    console.log("Available buckets:", buckets);
    
    const galleryExists = buckets?.some(bucket => bucket.name === 'gallery');
    
    if (!galleryExists) {
      console.log("Gallery bucket doesn't exist, creating...");
      try {
        await setupStorageBucket();
      } catch (bucketError) {
        console.error("Failed to create gallery bucket:", bucketError);
        // Attempt to use another method for creation
        try {
          const { data, error } = await supabase.storage.createBucket('gallery', {
            public: true,
            fileSizeLimit: 10485760, // 10MB
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif']
          });
          
          if (error) throw error;
          console.log("Gallery bucket created using alternative method");
        } catch (altError) {
          console.error("All attempts to create bucket failed:", altError);
          throw new Error("Unable to create storage bucket. Please check permissions.");
        }
      }
    }
    
    // Add timestamp to filename to prevent collisions
    const uniqueFileName = `${Date.now()}-${fileName.replace(/\s+/g, '-')}`;
    console.log("Uploading image with filename:", uniqueFileName);
    
    const { data, error } = await supabase.storage
      .from("gallery")
      .upload(uniqueFileName, file, {
        cacheControl: "3600",
        upsert: true,
      });
      
    if (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
    
    // Get and return public URL
    const publicUrl = supabase.storage.from("gallery").getPublicUrl(uniqueFileName);
    console.log("Uploaded successfully, public URL:", publicUrl.data.publicUrl);
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
 * Setup Storage Bucket with enhanced error handling and permissions
 */
export async function setupStorageBucket() {
  try {
    console.log("Setting up storage bucket...");
    
    // Check if gallery bucket exists
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error("Error checking buckets:", bucketsError);
      throw bucketsError;
    }
    
    const galleryExists = buckets?.some(bucket => bucket.name === 'gallery');
    console.log("Gallery bucket exists:", galleryExists);
    
    if (!galleryExists) {
      console.log("Creating gallery bucket...");
      
      // Create the gallery bucket
      const { data, error } = await supabase.storage.createBucket('gallery', {
        public: true,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif']
      });
      
      if (error) {
        console.error("Error creating gallery bucket:", error);
        throw error;
      } else {
        console.log("Gallery bucket created successfully");
      }
      
      // Add a public policy to the bucket to ensure images are accessible
      try {
        // This step might not be necessary as the bucket is set to public
        console.log("Bucket created and set to public");
      } catch (policyError) {
        console.error("Error setting bucket policy:", policyError);
        // Continue anyway as the bucket is already public
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

/**
 * New method: Ensure products exist (can be used for seeding initial data)
 */
export async function ensureProductsExist() {
  try {
    const { count, error } = await supabase
      .from("products")
      .select("*", { count: 'exact', head: true });
    
    if (error) {
      console.error("Error checking product count:", error);
      return false;
    }
    
    console.log(`Current product count: ${count}`);
    return count && count > 0;
  } catch (error) {
    console.error("Failed to check if products exist:", error);
    return false;
  }
}

/**
 * Get a single product by ID with detailed error handling
 */
export async function getProductById(id: string): Promise<Product | null> {
  try {
    console.log("Fetching product with ID:", id);
    
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    
    if (error) {
      console.error("Error fetching product by ID:", error);
      throw error;
    }
    
    if (!data) {
      console.log("No product found with ID:", id);
      return null;
    }
    
    console.log("Product fetched successfully:", data.name);
    
    return {
      ...data,
      difficulty: (data.difficulty || 'Medium') as 'Easy' | 'Medium' | 'Advanced',
      price: Number(data.price),
      stock: Number(data.stock),
      features: Array.isArray(data.features) ? data.features : []
    } as Product;
  } catch (error) {
    console.error("Failed to get product by ID:", error);
    return null;
  }
}
