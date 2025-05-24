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
 * Fetch total revenue from completed orders
 */
export async function fetchTotalRevenue() {
  const { data, error } = await supabase
    .from('orders')
    .select('total_amount')
    .eq('status', 'completed');

  if (error) {
    console.error('Error fetching total revenue:', error);
    return 0;
  }

  const totalRevenue = data?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;
  return totalRevenue;
}

/**
 * Fetch total number of products
 */
export async function fetchTotalProducts() {
  const { count, error } = await supabase
    .from('products')
    .select('id', { count: 'exact', head: true });

  if (error) {
    console.error('Error fetching total products:', error);
    return 0;
  }

  return count || 0;
}

/**
 * Fetch total number of customers/users
 */
export async function fetchTotalCustomers() {
  // Count users who have a corresponding customer record
  const { count, error } = await supabase
    .from('users')
    .select('id', { count: 'exact', head: true })

  if (error) {
    console.error('Error fetching total customers:', error);
    return 0;
  }

  return count || 0;
}

/**
 * Fetch count of active users
 * Assuming 'active' users are those who have logged in within the last 30 days
 */
export async function fetchActiveUsers() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { count, error } = await supabase
    .from('users')
    .select('id', { count: 'exact', head: true })
    .gte('last_login', thirtyDaysAgo.toISOString());

  if (error) {
    console.error('Error fetching active users:', error);
    return 0;
  }

  return count || 0;
}

/**
 * Fetch conversion rate based on product views and users
 * Placeholder implementation: conversion rate = (total orders / total customers) * 100
 */
export async function fetchConversionRate() {
  try {
    const { count: totalOrders, error: ordersError } = await supabase
      .from('orders')
      .select('id', { count: 'exact', head: true });

    if (ordersError) {
      console.error('Error fetching total orders:', ordersError);
      return 0;
    }

    const totalCustomers = await fetchTotalCustomers();

    if (totalCustomers === 0) {
      return 0;
    }

    const conversionRate = (totalOrders / totalCustomers) * 100;
    return conversionRate;
  } catch (error) {
    console.error('Error calculating conversion rate:', error);
    return 0;
  }
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

export async function fetchMonthlySalesData() {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from('orders')
    .select('total_amount, created_at')
    .eq('status', 'completed')
    .gte('created_at', sixMonthsAgo.toISOString());

  if (error) {
    console.error('Error fetching monthly sales data:', error);
    return [];
  }

  // Aggregate sales by month
  const salesByMonth = {};

  data.forEach(order => {
    const date = new Date(order.created_at);
    const monthKey = date.toLocaleString('default', { month: 'short', year: 'numeric' });
    if (!salesByMonth[monthKey]) {
      salesByMonth[monthKey] = 0;
    }
    salesByMonth[monthKey] += Number(order.total_amount);
  });

  // Create array for last 6 months with zero defaults
  const result = [];
  for (let i = 0; i < 6; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthKey = date.toLocaleString('default', { month: 'short', year: 'numeric' });
    result.unshift({
      month: monthKey,
      sales: salesByMonth[monthKey] || 0,
    });
  }

  return result;
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

/**
 * CRUD: Gallery Images table
 */
export async function fetchGalleryImages() {
  const { data, error } = await supabase
    .from("gallery_images")
    .select("*")
    .order("uploaded_at", { ascending: false });
  if (error) {
    console.error("Error fetching gallery images:", error);
    throw error;
  }
  return data || [];
}

export async function createGalleryImage(imageUrl, altText) {
  const { data, error } = await supabase
    .from("gallery_images")
    .insert([{ image_url: imageUrl, alt_text: altText }])
    .select()
    .single();
  if (error) {
    console.error("Error creating gallery image:", error);
    throw error;
  }
  return data;
}

export async function deleteGalleryImageById(id) {
  const { error } = await supabase
    .from("gallery_images")
    .delete()
    .eq("id", id);
  if (error) {
    console.error("Error deleting gallery image:", error);
    throw error;
  }
  return true;
}

// Admin Settings CRUD functions

export async function fetchGeneralSettings() {
  const { data, error } = await supabase
    .from("general_settings")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(1)
    .single();
  if (error) {
    console.error("Error fetching general settings:", error);
    throw error;
  }
  if (!data) return null;
  // Map snake_case to camelCase
  return {
    id: data.id,
    storeName: data.store_name,
    email: data.email,
    phone: data.phone,
    address: data.address,
    currency: data.currency,
    language: data.language,
    timeZone: data.time_zone,
    taxRate: data.tax_rate ? data.tax_rate.toString() : null,
  };
}

export async function updateGeneralSettings(settings) {
  // Map camelCase to snake_case
  const dbSettings = {
    id: settings.id,
    store_name: settings.storeName,
    email: settings.email,
    phone: settings.phone,
    address: settings.address,
    currency: settings.currency,
    language: settings.language,
    time_zone: settings.timeZone,
    tax_rate: settings.taxRate ? parseFloat(settings.taxRate) : null,
  };
  const { data, error } = await supabase
    .from("general_settings")
    .upsert(dbSettings, { onConflict: "id" })
    .select()
    .single();
  if (error) {
    console.error("Error updating general settings:", error);
    throw error;
  }
  return data;
}

export async function fetchNotificationSettings() {
  const { data, error } = await supabase
    .from("notification_settings")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(1)
    .single();
  if (error) {
    console.error("Error fetching notification settings:", error);
    throw error;
  }
  if (!data) return null;
  // Map snake_case to camelCase
  return {
    id: data.id,
    emailAlerts: data.email_alerts,
    orderNotifications: data.order_notifications,
    stockAlerts: data.stock_alerts,
    marketingEmails: data.marketing_emails,
    securityAlerts: data.security_alerts,
    appNotifications: data.app_notifications,
    promotionAlerts: data.promotion_alerts,
  };
}

export async function updateNotificationSettings(settings) {
  // Map camelCase to snake_case
  const dbSettings = {
    id: settings.id,
    email_alerts: settings.emailAlerts,
    order_notifications: settings.orderNotifications,
    stock_alerts: settings.stockAlerts,
    marketing_emails: settings.marketingEmails,
    security_alerts: settings.securityAlerts,
    app_notifications: settings.appNotifications,
    promotion_alerts: settings.promotionAlerts,
  };
  const { data, error } = await supabase
    .from("notification_settings")
    .upsert(dbSettings, { onConflict: "id" })
    .select()
    .single();
  if (error) {
    console.error("Error updating notification settings:", error);
    throw error;
  }
  return data;
}

export async function fetchSecuritySettings() {
  const { data, error } = await supabase
    .from("security_settings")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(1)
    .single();
  if (error) {
    console.error("Error fetching security settings:", error);
    throw error;
  }
  if (!data) return null;
  // Map snake_case to camelCase
  return {
    id: data.id,
    twoFactorEnabled: data.two_factor_enabled,
  };
}

export async function updateSecuritySettings(settings) {
  // Map camelCase to snake_case
  const dbSettings = {
    id: settings.id,
    two_factor_enabled: settings.twoFactorEnabled,
  };
  const { data, error } = await supabase
    .from("security_settings")
    .upsert(dbSettings, { onConflict: "id" })
    .select()
    .single();
  if (error) {
    console.error("Error updating security settings:", error);
    throw error;
  }
  return data;
}

export async function fetchUserProfile() {
  const { data, error } = await supabase
    .from("user_profile")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(1)
    .single();
  if (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
  if (!data) return null;
  // Map snake_case to camelCase
  return {
    id: data.id,
    fullName: data.full_name,
    email: data.email,
    role: data.role,
    joinDate: data.join_date ? data.join_date.toISOString().split('T')[0] : null,
    lastLogin: data.last_login ? new Date(data.last_login).toLocaleString() : null,
    avatar: data.avatar,
  };
}

export async function updateUserProfile(profile) {
  // Map camelCase to snake_case
  const dbProfile = {
    id: profile.id,
    full_name: profile.fullName,
    email: profile.email,
    role: profile.role,
    join_date: profile.joinDate ? new Date(profile.joinDate).toISOString().split('T')[0] : null,
    last_login: profile.lastLogin ? new Date(profile.lastLogin).toISOString() : null,
    avatar: profile.avatar,
  };
  const { data, error } = await supabase
    .from("user_profile")
    .upsert(dbProfile, { onConflict: "id" })
    .select()
    .single();
  if (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
  return data;
}

export async function fetchBackupSettings() {
  const { data, error } = await supabase
    .from("backup_settings")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(1)
    .single();
  if (error) {
    console.error("Error fetching backup settings:", error);
    throw error;
  }
  if (!data) return null;
  // Map snake_case to camelCase
  return {
    id: data.id,
    lastBackup: data.last_backup ? new Date(data.last_backup).toLocaleString() : null,
    autoBackup: data.auto_backup,
    backupFrequency: data.backup_frequency,
  };
}

export async function updateBackupSettings(settings) {
  // Map camelCase to snake_case
  const dbSettings = {
    id: settings.id,
    last_backup: settings.lastBackup ? new Date(settings.lastBackup).toISOString() : null,
    auto_backup: settings.autoBackup,
    backup_frequency: settings.backupFrequency,
  };
  const { data, error } = await supabase
    .from("backup_settings")
    .upsert(dbSettings, { onConflict: "id" })
    .select()
    .single();
  if (error) {
    console.error("Error updating backup settings:", error);
    throw error;
  }
  return data;
}

/**
 * Update the role of a user in the user_profile table
 * @param userId - The ID of the user to update
 * @param role - The new role to assign
 */
export async function updateUserRole(userId: string, role: string) {
  const { data, error } = await supabase
    .from("user_profile")
    .update({ role })
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    console.error("Error updating user role:", error);
    throw error;
  }

  return data;
}
