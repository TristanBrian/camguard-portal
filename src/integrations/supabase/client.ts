import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Warning: Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY environment variables. Supabase client may not work properly.');
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null;

// Add global auth state change listener to handle refresh token errors
if (supabase) {
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT') {
      // Clear session and redirect to login page
      supabase.auth.signOut().then(() => {
        window.location.href = '/manage-7s8dF3k/login';
      });
    }
  });
}

// Export service role key for components that need it
export const serviceRoleKey = supabaseServiceRoleKey || null;
