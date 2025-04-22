
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

/**
 * Check if the current user is an admin.
 */
export async function isAdmin(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from<"user_roles", Tables<"user_roles">>("user_roles")
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
export async function fetchProducts(): Promise<Tables<"products">[]> {
  const { data, error } = await supabase
    .from<"products", Tables<"products">>("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createProduct(product: TablesInsert<"products">) {
  const { data, error } = await supabase
    .from<"products", Tables<"products">>("products")
    .insert([product])
    .select("*");
  if (error) throw error;
  return data?.[0];
}

export async function updateProduct(id: string, updates: TablesUpdate<"products">) {
  const { data, error } = await supabase
    .from<"products", Tables<"products">>("products")
    .update(updates)
    .eq("id", id)
    .select("*");
  if (error) throw error;
  return data?.[0];
}

export async function deleteProduct(id: string) {
  const { error } = await supabase
    .from<"products", Tables<"products">>("products")
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

