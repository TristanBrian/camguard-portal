
// supabase/functions/create-bucket/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0';

// Follow Deno Deploy environment variables
// Change accordingly to your project's env
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

Deno.serve(async (req: Request) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Content-Type': 'application/json',
  };

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers });
  }

  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers }
      );
    }

    // Parse request body
    const { bucketName, isPublic = true } = await req.json();

    // Validate bucket name
    if (!bucketName || typeof bucketName !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid or missing bucket name' }),
        { status: 400, headers }
      );
    }

    console.log(`Creating bucket '${bucketName}' with public access: ${isPublic}`);

    // Create Supabase client with service role key
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    try {
      // Check if bucket already exists
      const { data: existingBucket, error: checkError } = await supabase.storage.getBucket(bucketName);
      
      if (!checkError && existingBucket) {
        console.log(`Bucket '${bucketName}' already exists`);
        return new Response(
          JSON.stringify({ success: true, message: 'Bucket already exists', bucket: existingBucket }),
          { headers }
        );
      }
      
      // If we get here, bucket doesn't exist or there was an error checking
      // Try to create the bucket
      const { data, error } = await supabase.storage.createBucket(bucketName, {
        public: isPublic,
      });

      if (error) {
        // Check if the error is because bucket already exists (common race condition)
        if (error.message?.includes('already exists')) {
          return new Response(
            JSON.stringify({ success: true, message: 'Bucket already exists (from error)' }),
            { headers }
          );
        }
        
        throw error;
      }

      return new Response(
        JSON.stringify({ success: true, message: 'Bucket created successfully', bucket: data }),
        { headers }
      );
    } catch (error) {
      console.error('Error creating bucket:', error);
      
      // Try one more time to check if bucket exists despite the error
      try {
        const { data: retryCheck } = await supabase.storage.getBucket(bucketName);
        if (retryCheck) {
          return new Response(
            JSON.stringify({ success: true, message: 'Bucket exists after retry check' }),
            { headers }
          );
        }
      } catch (retryError) {
        // Ignore retry errors
      }
      
      return new Response(
        JSON.stringify({ 
          error: 'Failed to create bucket', 
          details: error.message || String(error) 
        }),
        { status: 500, headers }
      );
    }
  } catch (e) {
    console.error('Unexpected error:', e);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: e.message || String(e) }),
      { status: 500, headers }
    );
  }
});
