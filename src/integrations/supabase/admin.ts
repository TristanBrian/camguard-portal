
import { supabase } from "@/integrations/supabase/client";
import { adminClient, ensureAdminAuth, createStorageBucket } from "@/integrations/supabase/adminClient";
import type { Product } from "@/data/productsData";

/**
 * Check if the current user is an admin.
 */
export async function isAdmin(userId: string): Promise<boolean> {
  // First check localStorage for hardcoded admin
  const currentUser = localStorage.getItem('kimcom_current_user');
  if (currentUser) {
    try {
      const parsedUser = JSON.parse(currentUser);
      if (parsedUser.email === 'admin@kimcom.com' && parsedUser.role === 'admin') {
        return true; // Hardcoded admin user
      }
    } catch (e) {
      // Handle parsing error silently, continue with DB check
    }
  }
  
  // Then check database
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
    console.log("Fetching products from database...");
    
    // Use public client for reading products since we have a public read policy
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
    // First check admin authentication with improved error handling
    try {
      console.log("Verifying admin authentication...");
      await ensureAdminAuth();
      console.log("Admin authentication successful");
    } catch (authError) {
      console.error("Admin authentication failed:", authError);
      throw new Error("Authentication required for admin operations");
    }
    
    console.log("Creating new product:", product);
    
    // Clean up the product object before insertion
    const productToInsert = {
      name: product.name,
      description: product.description,
      category: product.category || 'Uncategorized',
      price: Number(product.price) || 0,
      stock: Number(product.stock) || 0,
      image: product.image || '/placeholder.svg',
      sku: product.sku,
      difficulty: product.difficulty || 'Medium',
      brand: product.brand,
      model: product.model,
      features: Array.isArray(product.features) ? product.features : []
    };
    
    try {
      // Use adminClient with explicit authorization headers for better auth handling
      const { data, error } = await adminClient
        .from("products")
        .insert([productToInsert])
        .select();
      
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
    } catch (dbError) {
      console.error("Failed to create product in database:", dbError);
      throw dbError;
    }
  } catch (error) {
    console.error("Failed to create product:", error);
    throw error;
  }
}

export async function updateProduct(id: string, updates: Partial<Omit<Product, 'id'>>) {
  try {
    // First check admin authentication
    await ensureAdminAuth();
    
    // Use admin client to bypass RLS
    const { data, error } = await adminClient
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
    // First check admin authentication
    await ensureAdminAuth();
    
    // Use admin client to bypass RLS
    const { error } = await adminClient
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
export async function uploadProductImage(file: File, fileName: string): Promise<string> {
  try {
    console.log("Uploading image with filename:", fileName);
    
    // First check admin authentication
    try {
      await ensureAdminAuth();
    } catch (authError) {
      console.error("Admin authentication failed:", authError);
      return "/placeholder.svg";
    }
    
    // Sanitize file name to prevent path issues
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    
    // Ensure gallery bucket exists before upload
    const bucketCreated = await createStorageBucket('gallery', true);
    if (!bucketCreated) {
      console.warn("Couldn't ensure gallery bucket exists, but will try upload anyway");
    }
    
    // Attempt upload with better error handling using admin client with explicit auth
    try {
      const { data, error } = await adminClient.storage
        .from("gallery")
        .upload(sanitizedFileName, file, {
          cacheControl: "3600",
          upsert: true,
        });
        
      if (error) {
        console.error("Error uploading image:", error);
        return "/placeholder.svg";
      }
      
      // Get and return public URL
      const publicUrl = adminClient.storage.from("gallery").getPublicUrl(sanitizedFileName);
      console.log("Uploaded successfully, public URL:", publicUrl.data.publicUrl);
      return publicUrl.data.publicUrl;
    } catch (uploadError) {
      console.error("Upload operation failed:", uploadError);
      return "/placeholder.svg";
    }
  } catch (error) {
    console.error("Failed to upload product image:", error);
    // Return a placeholder image instead of throwing to prevent UI crashes
    return "/placeholder.svg";
  }
}

/**
 * Product Gallery: Upload multiple images for a product
 */
export async function uploadGalleryImages(files: File[], productId: string) {
  try {
    // Only attempt upload if we have admin access
    try {
      await ensureAdminAuth();
    } catch (authError) {
      console.error("Admin authentication failed for gallery upload:", authError);
      return files.map(() => "/placeholder.svg"); // Return placeholders for all files
    }
    
    const uploadPromises = files.map(async (file, index) => {
      // Sanitize file name to prevent path traversal issues
      const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `product-${productId}-gallery-${index}-${Date.now()}-${safeFileName}`;
      return uploadProductImage(file, fileName);
    });
    
    const urls = await Promise.all(uploadPromises);
    return urls.filter(url => url !== "/placeholder.svg"); // Filter out any failed uploads
  } catch (error) {
    console.error("Failed to upload gallery images:", error);
    return [];
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
      .maybeSingle();
      
    if (fetchError) {
      console.error("Error fetching product for gallery update:", fetchError);
      throw fetchError;
    }
    
    // Combine existing features with new image URLs
    const existingFeatures = product?.features || [];
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
 * Setup Storage Bucket - Using admin client to bypass RLS
 */
export async function setupStorageBucket() {
  try {
    console.log("Setting up storage bucket...");
    
    return await createStorageBucket('gallery', true);
  } catch (error) {
    console.error("Error in setupStorageBucket:", error);
    return false;
  }
}

/**
 * Improved method to ensure storage bucket exists
 */
export async function ensureStorageBucket() {
  try {
    // Check admin authentication first
    try {
      await ensureAdminAuth();
    } catch (authError) {
      console.error("Admin authentication failed for bucket creation:", authError);
      return false;
    }
    
    return await createStorageBucket('gallery', true);
  } catch (error) {
    console.error("Error in ensureStorageBucket:", error);
    return false;
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
      .maybeSingle();
      
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

/**
 * Statistics: Get product stats with enhanced analytics
 */
export async function getProductStats() {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("category, price, stock, brand, model, difficulty");
    
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
      categoryValue: {} as Record<string, number>,
      brandCounts: {} as Record<string, number>,
      lowStockCount: 0,
      outOfStockCount: 0,
      difficultyBreakdown: {
        Easy: 0,
        Medium: 0,
        Advanced: 0
      },
      lowStockItems: [] as any[],
      outOfStockItems: [] as any[]
    };
    
    // Process items
    if (data) {
      data.forEach(item => {
        // Process categories
        const category = item.category || 'Uncategorized';
        if (!stats.categoryCounts[category]) {
          stats.categoryCounts[category] = 0;
          stats.categoryValue[category] = 0;
        }
        stats.categoryCounts[category]++;
        stats.categoryValue[category] += Number(item.price) * Number(item.stock);
        
        // Process brands
        if (item.brand) {
          if (!stats.brandCounts[item.brand]) {
            stats.brandCounts[item.brand] = 0;
          }
          stats.brandCounts[item.brand]++;
        }
        
        // Process difficulty
        if (item.difficulty && ['Easy', 'Medium', 'Advanced'].includes(item.difficulty)) {
          stats.difficultyBreakdown[item.difficulty as keyof typeof stats.difficultyBreakdown]++;
        } else {
          stats.difficultyBreakdown.Medium++;
        }
        
        // Count low/out of stock items
        const stock = Number(item.stock);
        if (stock === 0) {
          stats.outOfStockCount++;
          stats.outOfStockItems.push(item);
        } else if (stock <= 5) {
          stats.lowStockCount++;
          stats.lowStockItems.push(item);
        }
      });
    }
    
    return stats;
  } catch (error) {
    console.error("Failed to get product stats:", error);
    throw error;
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
