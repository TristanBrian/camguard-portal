import { supabase } from './client';

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
export async function fetchProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  
  if (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
  
  return data || [];
}

export async function createProduct(product) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log("Creating product as user:", user);

  const productToInsert = { ...product };
  if ('imageUrl' in productToInsert && typeof productToInsert.imageUrl === 'string') {
    productToInsert.image = productToInsert.imageUrl;
  }
  if ('imageUrl' in productToInsert) {
    delete productToInsert.imageUrl;
  }
  console.log("Product to insert:", productToInsert);

  const { data, error } = await supabase
    .from("products")
    .insert([productToInsert])
    .select("*");
  
  if (error) {
    console.error("Error creating product:", error);
    throw error;
  }
  
  if (data?.[0]) {
    return data[0];
  }
  return null;
}

export async function updateProduct(id, updates) {
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
    return data[0];
  }
  return null;
}

export async function deleteProduct(id) {
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
export async function uploadProductImage(file, fileName) {
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
  const publicUrl = supabase.storage.from("gallery").getPublicUrl(fileName);
  return publicUrl.data.publicUrl;
}

/**
 * Product Gallery: Upload multiple images for a product
 */
export async function uploadGalleryImages(files, productId) {
  const uploadPromises = files.map(async (file, index) => {
    const fileName = `product-${productId}-gallery-${index}-${Date.now()}-${file.name}`;
    return uploadProductImage(file, fileName);
  });
  
  const urls = await Promise.all(uploadPromises);
  return urls;
}

/**
 * List all images in the gallery bucket
 */
export async function listGalleryImages() {
  const { data, error } = await supabase.storage
    .from("gallery")
    .list('', { limit: 100, offset: 0, sortBy: { column: 'name', order: 'asc' } });
  if (error) {
    console.error("Error listing gallery images:", error);
    throw error;
  }
  return data || [];
}

/**
 * Delete an image from the gallery bucket by file name
 */
export async function deleteGalleryImage(fileName) {
  const { data, error } = await supabase.storage
    .from("gallery")
    .remove([fileName]);
  if (error) {
    console.error("Error deleting gallery image:", error);
    throw error;
  }
  return data;
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
  
  const stats = {
    totalProducts: data?.length || 0,
    totalValue: data?.reduce((sum, item) => sum + Number(item.price) * Number(item.stock), 0) || 0,
    totalStock: data?.reduce((sum, item) => sum + Number(item.stock), 0) || 0,
    categoryCounts: {},
    categoryValue: {}
  };
  
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
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    if (listError) {
      console.error("Error listing buckets:", listError);
      return false;
    }
    const galleryExists = buckets?.some(bucket => bucket.name === 'gallery');
    
    if (!galleryExists) {
      console.warn("Gallery bucket does not exist. Please create it using the backend service role key.");
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error checking storage bucket:", error);
    return false;
  }
}

/**
 * Create a new admin notification
 * @param message Notification message
 * @param orderId Optional order ID related to the notification
 */
export async function createAdminNotification(message, orderId) {
  const { data, error } = await supabase
    .from('admin_notifications')
    .insert([
      {
        message,
        order_id: orderId || null,
        read: false,
        timestamp: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating admin notification:', error);
    return null;
  }

  return data;
}

/**
 * CRUD: Services table
 */
export async function fetchServices() {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("created_at", { ascending: false });
  
  if (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
  
  return data || [];
}

export async function createService(service) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log("Creating service as user:", user);

  const serviceToInsert = { ...service };
  if ('imageUrl' in serviceToInsert && typeof serviceToInsert.imageUrl === 'string') {
    serviceToInsert.icon = serviceToInsert.imageUrl;
  }
  if ('imageUrl' in serviceToInsert) {
    delete serviceToInsert.imageUrl;
  }
  console.log("Service to insert:", serviceToInsert);

  const { data, error } = await supabase
    .from("services")
    .insert([serviceToInsert])
    .select("*");
  
  if (error) {
    console.error("Error creating service:", error);
    throw error;
  }
  
  if (data?.[0]) {
    return data[0];
  }
  return null;
}

export async function updateService(id, updates) {
  const { data, error } = await supabase
    .from("services")
    .update(updates)
    .eq("id", id)
    .select("*");
  
  if (error) {
    console.error("Error updating service:", error);
    throw error;
  }
  
  if (data?.[0]) {
    return data[0];
  }
  return null;
}

export async function deleteService(id) {
  const { error } = await supabase
    .from("services")
    .delete()
    .eq("id", id);
  
  if (error) {
    console.error("Error deleting service:", error);
    throw error;
  }
  return true;
}
