import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://lcqrwhnpscchimjqysau.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjcXJ3aG5wc2NjaGltanF5c2F1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTM0MzI3NywiZXhwIjoyMDYwOTE5Mjc3fQ.wGjkk1Z2RkMyn7ctiR7ycjKDFXQzeMlft3FsK1tc2LM";

// Create a special admin client that can bypass RLS
// WARNING: This should only be used on the admin pages with proper authentication checks
export const adminClient = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
  global: {
    headers: {
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
    },
  },
});

// Function to ensure a user is admin before using admin functions
export const ensureAdminAuth = async () => {
  // Check for hardcoded admin credentials in localStorage first
  const currentUser = localStorage.getItem('kimcom_current_user');
  if (currentUser) {
    try {
      const parsedUser = JSON.parse(currentUser);
      if (parsedUser.email === 'admin@kimcom.com' && parsedUser.role === 'admin') {
        return true; // This is our hardcoded admin user
      }
    } catch (err) {
      console.error("Error parsing stored user:", err);
    }
  }
  
  // Otherwise check for Supabase auth
  const { data: { user } } = await adminClient.auth.getUser();
  if (!user) {
    throw new Error("Authentication required for admin operations");
  }
  
  const { data: roles } = await adminClient
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", "admin");
    
  if (!roles || roles.length === 0) {
    throw new Error("Admin role required for this operation");
  }
  
  return true;
};

// Create a storage bucket if it doesn't exist using edge function
export const createStorageBucket = async (bucketName: string, isPublic = true) => {
  try {
    // First check if we have the gallery bucket via REST API
    try {
      const { data, error } = await adminClient.storage.getBucket(bucketName);
      if (!error && data) {
        console.log(`Bucket ${bucketName} already exists`);
        return true;
      }
    } catch (err) {
      // Bucket doesn't exist, we'll create it
      console.log(`Bucket ${bucketName} does not exist, creating...`);
    }
    
    // Call our edge function to create the bucket (this works around storage API issues)
    try {
      const { data, error } = await adminClient.functions.invoke("create-bucket", {
        body: { bucketName },
      });
      
      if (error) {
        console.error("Error creating bucket via edge function:", error);
        return false;
      }
      
      console.log("Edge function response:", data);
      return true;
    } catch (edgeFuncErr) {
      console.error("Error calling edge function:", edgeFuncErr);
      return false;
    }
  } catch (err) {
    console.error("Error in createStorageBucket:", err);
    return false;
  }
};
