
// Follow Deno conventions for imports
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the request body
    const { bucketName } = await req.json();
    
    if (!bucketName) {
      return new Response(
        JSON.stringify({ error: 'Bucket name is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Create a Supabase client with the Admin key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    console.log(`Creating storage bucket: ${bucketName}`);

    // Create the bucket
    const { data, error } = await supabaseAdmin.storage.createBucket(bucketName, {
      public: true,
      fileSizeLimit: 10485760, // 10MB
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp']
    });

    if (error) {
      console.error("Error creating bucket:", error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Create a policy to allow public access to the bucket
    const policyError = await createPublicPolicy(supabaseAdmin, bucketName);
    if (policyError) {
      return new Response(
        JSON.stringify({ error: policyError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, bucketName }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error("Error in create-bucket function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

async function createPublicPolicy(supabaseAdmin: any, bucketName: string) {
  try {
    // Policy for select (read) operations
    await supabaseAdmin.rpc('create_storage_policy', {
      bucket_name: bucketName,
      policy_name: `${bucketName}_public_select`,
      definition: 'true',
      operation: 'SELECT'
    });
    
    // Policy for insert operations
    await supabaseAdmin.rpc('create_storage_policy', {
      bucket_name: bucketName,
      policy_name: `${bucketName}_auth_insert`,
      definition: 'true',
      operation: 'INSERT'
    });
    
    // Policy for update operations
    await supabaseAdmin.rpc('create_storage_policy', {
      bucket_name: bucketName,
      policy_name: `${bucketName}_auth_update`,
      definition: 'true',
      operation: 'UPDATE'
    });
    
    // Policy for delete operations
    await supabaseAdmin.rpc('create_storage_policy', {
      bucket_name: bucketName,
      policy_name: `${bucketName}_auth_delete`,
      definition: 'true',
      operation: 'DELETE'
    });
    
    return null;
  } catch (error) {
    console.error("Error creating storage policies:", error);
    return error.message;
  }
}
