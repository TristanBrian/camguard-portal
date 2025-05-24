import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function resetAdminPassword() {
  const email = 'admin@kimcom.com'; // current admin email
  const newPassword = 'newAdmin123'; // new password to set

  try {
    // List users to find the user ID
    const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
      throw listError;
    }
    const user = existingUsers.users.find(user => user.email === email);
    if (!user) {
      console.log('Admin user not found.');
      return;
    }

    // Update user password
    const { data, error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
      password: newPassword,
    });

    if (updateError) {
      throw updateError;
    }

    console.log(`Password reset successfully for user ${email}`);
  } catch (error) {
    console.error('Error resetting admin password:', error);
    process.exit(1);
  }
}

resetAdminPassword();
