import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function createAdminUser() {
  const email = 'admin@kimcom.com';
  const password = 'admin123';

  try {
    // Check if user already exists
    const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
      throw listError;
    }
    const userExists = existingUsers.users.some(user => user.email === email);
    if (userExists) {
      console.log('Admin user already exists.');
      return;
    }

    // Create user
    const { data: userData, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role: 'admin' }
    });

    if (createError) {
      throw createError;
    }

    console.log('Admin user created:', userData.user);

    // Insert admin role in user_roles table
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert([{ user_id: userData.user.id, role: 'admin' }]);

    if (roleError) {
      throw roleError;
    }

    console.log('Admin role assigned to user.');
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

createAdminUser();
