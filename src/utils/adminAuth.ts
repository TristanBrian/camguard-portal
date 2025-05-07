
/**
 * Helper utility to set up a hardcoded admin account in localStorage
 * This is a development-only utility to help with testing admin features
 */
export const setupHardcodedAdmin = () => {
  const adminUser = {
    id: 'admin-00000000-0000-0000-0000-000000000000',
    email: 'admin@kimcom.com',
    role: 'admin',
    name: 'Admin User',
    createdAt: new Date().toISOString()
  };
  
  localStorage.setItem('kimcom_current_user', JSON.stringify(adminUser));
  console.log('Hardcoded admin user set up in localStorage');
  return adminUser;
};

export const checkIfAdmin = (): boolean => {
  try {
    const currentUser = localStorage.getItem('kimcom_current_user');
    if (currentUser) {
      const parsedUser = JSON.parse(currentUser);
      if (parsedUser.email === 'admin@kimcom.com' && parsedUser.role === 'admin') {
        console.log("Admin check: Using local admin authentication");
        return true;
      }
    }
    
    // Check Supabase auth for admin role if local check fails
    return false;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};

// Add this function to initialize admin user if not already set
export const initializeAdminIfNeeded = () => {
  if (!checkIfAdmin()) {
    console.log("Initializing admin user for development");
    setupHardcodedAdmin();
    return true;
  }
  return false;
};

// Function to force re-initialization of admin user
export const forceInitializeAdmin = () => {
  console.log("Force initializing admin user for development");
  setupHardcodedAdmin();
  return true;
};
