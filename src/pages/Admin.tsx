
import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter } from '@/components/ui/sidebar';
import { Home, Package, BarChart2, TrendingUp, Settings, LogOut, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import AdminDashboard from '@/components/admin/AdminDashboard';
import AdminSettings from '@/components/admin/AdminSettings';
import { ensureAdminAuth } from '@/integrations/supabase/adminClient';
import { supabase } from '@/integrations/supabase/client';

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedItem, setSelectedItem] = useState(() => {
    // Determine the selected item based on the current path
    const path = location.pathname;
    if (path.includes('products')) return 'products';
    if (path.includes('statistics')) return 'statistics';
    if (path.includes('market-trends')) return 'trends';
    if (path.includes('settings')) return 'settings';
    return 'dashboard';
  });
  
  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await ensureAdminAuth();
      } catch (error) {
        console.error("Admin authentication check failed:", error);
        toast.error("Authentication required for admin access");
        navigate('/admin-login');
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  const handleNavigation = (path: string, item: string) => {
    setSelectedItem(item);
    navigate(path);
  };

  const handleLogout = async () => {
    // Check if we're using the hardcoded admin
    const currentUser = localStorage.getItem('kimcom_current_user');
    if (currentUser) {
      try {
        const parsedUser = JSON.parse(currentUser);
        if (parsedUser.email === 'admin@kimcom.com') {
          // Remove hardcoded admin from localStorage
          localStorage.removeItem('kimcom_current_user');
          toast.success('Successfully logged out');
          navigate('/admin-login');
          return;
        }
      } catch (e) {
        // Continue to Supabase signout
      }
    }
    
    // Try Supabase signout
    try {
      await supabase.auth.signOut();
      toast.success('Successfully logged out');
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Logout failed");
    }
    
    navigate('/admin-login');
  };

  // Determine what to render in the main content area
  const renderContent = () => {
    // For paths that match specific routes, we'll show the <Outlet> component
    // which will render the nested route component
    if (location.pathname !== '/admin' && location.pathname !== '/admin/dashboard') {
      return <Outlet />;
    }
    
    // For the admin dashboard or direct /admin path, show dashboard or settings based on selection
    switch(selectedItem) {
      case 'settings':
        return <AdminSettings />;
      case 'dashboard':
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-100">
        <Sidebar>
          <SidebarHeader className="border-b border-gray-200 p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-kimcom-600" />
              <h1 className="text-xl font-bold">KimCom Admin</h1>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={selectedItem === 'dashboard'}
                  onClick={() => handleNavigation('/admin/dashboard', 'dashboard')}
                  tooltip="Dashboard"
                >
                  <Home className="h-5 w-5" />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={selectedItem === 'products'}
                  onClick={() => handleNavigation('/admin/products', 'products')}
                  tooltip="Product Management"
                >
                  <Package className="h-5 w-5" />
                  <span>Products</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={selectedItem === 'statistics'}
                  onClick={() => handleNavigation('/admin/statistics', 'statistics')}
                  tooltip="Website Statistics"
                >
                  <BarChart2 className="h-5 w-5" />
                  <span>Statistics</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={selectedItem === 'trends'}
                  onClick={() => handleNavigation('/admin/market-trends', 'trends')}
                  tooltip="Market Trends"
                >
                  <TrendingUp className="h-5 w-5" />
                  <span>Market Trends</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={selectedItem === 'settings'}
                  onClick={() => handleNavigation('/admin/settings', 'settings')}
                  tooltip="Settings"
                >
                  <Settings className="h-5 w-5" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="border-t border-gray-200 p-4">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-gray-500 hover:text-red-500"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-2" />
              Log Out
            </Button>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-grow p-6 overflow-auto">
          {renderContent()}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Admin;
