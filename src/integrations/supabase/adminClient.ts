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

// Create a storage bucket if it doesn't exist
export const createStorageBucket = async (bucketName: string, isPublic = true) => {
  try {
    // First check if bucket exists
    const { data: buckets } = await adminClient.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      try {
        const { error } = await adminClient.storage.createBucket(bucketName, {
          public: isPublic
        });
        
        if (error) {
          console.error("Error creating bucket directly:", error);
          return false;
        }
      } catch (directErr) {
        console.error("Exception creating bucket directly:", directErr);
        return false;
      }
    }
    return true;
  } catch (err) {
    console.error("Error in createStorageBucket:", err);
    return false;
  }
};
