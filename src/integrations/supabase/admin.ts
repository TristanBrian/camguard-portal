
import { supabase } from "@/integrations/supabase/client";

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
  // Using any type to bypass TypeScript errors until Supabase types are updated
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false }) as any;
  if (error) throw error;
  return data;
}

export async function createProduct(product: any) {
  // Using any type to bypass TypeScript errors until Supabase types are updated
  const { data, error } = await supabase
    .from("products")
    .insert([product])
    .select("*") as any;
  if (error) throw error;
  return data?.[0];
}

export async function updateProduct(id: string, updates: any) {
  // Using any type to bypass TypeScript errors until Supabase types are updated
  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id)
    .select("*") as any;
  if (error) throw error;
  return data?.[0];
}

export async function deleteProduct(id: string) {
  // Using any type to bypass TypeScript errors until Supabase types are updated
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id) as any;
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
