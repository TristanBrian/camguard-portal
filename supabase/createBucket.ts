import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function createGalleryBucket() {
  try {
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    if (listError) {
      throw listError;
    }
    const galleryExists = buckets?.some(bucket => bucket.name === 'gallery');
    if (galleryExists) {
      console.log('Gallery bucket already exists.');
      return;
    }

    // Create bucket
    const { data, error } = await supabase.storage.createBucket('gallery', {
      public: true,
      fileSizeLimit: 10485760, // 10MB
    });

    if (error) {
      throw error;
    }

    console.log('Gallery bucket created successfully:', data);
  } catch (error) {
    console.error('Error creating gallery bucket:', error);
    process.exit(1);
  }
}

createGalleryBucket();
