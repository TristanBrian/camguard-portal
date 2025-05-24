import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Package, ImageIcon, Settings, LogOut } from 'lucide-react';
import { Button } from 'components/ui/button';
import { supabase } from 'integrations/supabase/client';
import { toast } from 'sonner';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Define admin navigation items with correct route prefix
  const navItems = [
    { label: 'Dashboard', icon: <Home size={16} />, path: '/manage-7s8dF3k/dashboard' },
    { label: 'Product ', icon: <Package size={16} />, path: '/manage-7s8dF3k/products' },
    { label: 'Markets', icon: <ImageIcon size={16} />, path: '/manage-7s8dF3k/market-trends' },
    { label: 'Settings', icon: <Settings size={16} />, path: '/manage-7s8dF3k/settings' },
  ];

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Successfully logged out');
      navigate('/manage-7s8dF3k/login');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Admin Navbar */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            {navItems.map((item) => {
              const isActive = location.pathname.toLowerCase() === item.path.toLowerCase();
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium focus:outline-none ${
                    isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 text-gray-700 hover:text-red-600"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              <span className="hidden sm:inline">Log Out</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 p-4 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
