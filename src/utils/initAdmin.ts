
import { setupHardcodedAdmin, checkIfAdmin } from './adminAuth';

// This function automatically initializes the admin user when imported
// We'll use this in the main.tsx file to ensure admin is available globally
const initAdmin = () => {
  if (!checkIfAdmin()) {
    console.log('Initializing hardcoded admin user for development...');
    setupHardcodedAdmin();
  } else {
    console.log('Admin user already initialized');
  }
  
  // Ensure admin is created in session storage as well for API access
  sessionStorage.setItem('admin_initialized', 'true');
};

// Self-invoke the function when this module is imported
initAdmin();

export default initAdmin;
