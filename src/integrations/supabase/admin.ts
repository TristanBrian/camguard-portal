
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
  
  if (error) throw error;
  
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
  
  if (error) throw error;
  
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
  
  if (error) throw error;
  
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
  
  if (error) throw error;
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
  if (error) throw error;
  // Return public URL for use in DB
  const publicUrl = supabase.storage.from("gallery").getPublicUrl(fileName);
  return publicUrl.data.publicUrl;
}
