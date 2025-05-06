import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

/**
 * Backend: Create gallery bucket if it doesn't exist
 */
export async function ensureGalleryBucketExists() {
  try {
    const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets();
    if (listError) {
      console.error("Error listing buckets:", listError);
      throw listError;
    }
    const galleryExists = buckets?.some(bucket => bucket.name === 'gallery');
    if (!galleryExists) {
      const { data, error } = await supabaseAdmin.storage.createBucket('gallery', {
        public: true,
        fileSizeLimit: 10485760, // 10MB
      });
      if (error) {
        console.error("Error creating gallery bucket:", error);
        throw error;
      }
      console.log("Gallery bucket created successfully:", data);
    } else {
      console.log("Gallery bucket already exists.");
    }
  } catch (error) {
    console.error("Error ensuring gallery bucket exists:", error);
    throw error;
  }
}
