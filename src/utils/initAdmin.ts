
import { checkIfAdmin, setupHardcodedAdmin } from './adminAuth';

// This function ensures that the admin user is set up for development
export const ensureAdminIsInitialized = () => {
  if (!checkIfAdmin()) {
    setupHardcodedAdmin();
    console.log('Admin account initialized');
    return true;
  }
  return false;
};

// Call this function to ensure we have an admin during development
export const initializeAdminForDevelopment = () => {
  if (process.env.NODE_ENV === 'development') {
    ensureAdminIsInitialized();
  }
};

// Initialize admin on module load
initializeAdminForDevelopment();
