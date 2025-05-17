
import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter } from '@/components/ui/sidebar';
import { 
  Home, Package, BarChart2, TrendingUp, Settings, LogOut, Shield, Menu, X,
  Users, ShoppingBag, Bell, FileText, PieChart, ChevronRight, ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import AdminDashboard from '@/components/admin/AdminDashboard';
import AdminSettings from '@/components/admin/AdminSettings';
import { ensureAdminAuth } from '@/integrations/supabase/adminClient';
import { supabase } from '@/integrations/supabase/client';

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(() => {
    // Determine the selected item based on the current path
    const path = location.pathname;
    if (path.includes('products')) return 'products';
    if (path.includes('statistics')) return 'statistics';
    if (path.includes('market-trends')) return 'trends';
    if (path.includes('settings')) return 'settings';
    if (path.includes('orders')) return 'orders';
    if (path.includes('customers')) return 'customers';
    if (path.includes('reports')) return 'reports';
    return 'dashboard';
  });
  
  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        await ensureAdminAuth();
        setIsLoading(false);
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
    setIsMobileMenuOpen(false);
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
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="inline-block animate-spin h-8 w-8 border-4 border-kimcom-600 border-t-transparent rounded-full mb-4"></div>
            <p>Loading admin panel...</p>
          </div>
        </div>
      );
    }
    
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

  // Create menu items array for better organization
  const menuItems = [
    { id: 'dashboard', title: 'Dashboard', path: '/admin/dashboard', icon: Home },
    { id: 'products', title: 'Products', path: '/admin/products', icon: Package },
    { id: 'orders', title: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { id: 'customers', title: 'Customers', path: '/admin/customers', icon: Users },
    { id: 'statistics', title: 'Statistics', path: '/admin/statistics', icon: BarChart2 },
    { id: 'reports', title: 'Reports', path: '/admin/reports', icon: FileText },
    { id: 'trends', title: 'Market Trends', path: '/admin/market-trends', icon: TrendingUp },
    { id: 'settings', title: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-100">
        {/* Mobile Menu Button - Only visible on mobile */}
        <div className="block md:hidden fixed top-4 left-4 z-50">
          <Button 
            variant="outline" 
            size="icon" 
            className="bg-white shadow-md"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Collapse button for desktop - Only visible on desktop */}
        <div className="hidden md:block fixed top-4 left-4 z-40">
          <Button 
            variant="outline" 
            size="icon" 
            className={`bg-white shadow-md transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
        </div>

        {/* Sidebar with responsive behavior */}
        <Sidebar className={`
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
          ${isCollapsed ? 'md:w-20' : 'md:w-72'} 
          md:translate-x-0 transition-all duration-300 fixed md:relative z-40
          shadow-lg
        `}>
          <SidebarHeader className="border-b border-gray-200 p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-kimcom-600 flex-shrink-0" />
              {!isCollapsed && <h1 className="text-xl font-bold">KimCom Admin</h1>}
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    isActive={selectedItem === item.id}
                    onClick={() => handleNavigation(item.path, item.id)}
                    tooltip={isCollapsed ? item.title : undefined}
                    className={`${isCollapsed ? 'justify-center' : ''}`}
                  >
                    <item.icon className={`h-5 w-5 ${isCollapsed ? 'mx-auto' : 'mr-2'}`} />
                    {!isCollapsed && <span>{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="border-t border-gray-200 p-4">
            <Button 
              variant="ghost" 
              className={`w-full ${isCollapsed ? 'justify-center p-2' : 'justify-start'} text-gray-500 hover:text-red-500`}
              onClick={handleLogout}
              title="Log Out"
            >
              <LogOut className={`h-5 w-5 ${isCollapsed ? '' : 'mr-2'}`} />
              {!isCollapsed && 'Log Out'}
            </Button>
          </SidebarFooter>
        </Sidebar>
        
        {/* Main content area with more padding on mobile */}
        <div className={`
          flex-grow p-4 md:p-6 overflow-auto pt-16 md:pt-6 transition-all duration-300
          ${isCollapsed ? 'md:ml-0' : 'md:ml-0'}
        `}>
          {/* Overlay for mobile menu */}
          {isMobileMenuOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)} 
            />
          )}
          
          {/* Page title bar with breadcrumb */}
          <div className="bg-white rounded-lg mb-6 p-4 shadow-sm">
            <h1 className="text-2xl font-bold text-gray-800">
              {menuItems.find(item => item.id === selectedItem)?.title || 'Dashboard'}
            </h1>
            <div className="text-sm text-gray-500 flex items-center mt-1">
              <Home className="h-3 w-3 mr-1" />
              <span>Admin</span>
              <ChevronRight className="h-3 w-3 mx-1" />
              <span className="font-medium text-kimcom-600">
                {menuItems.find(item => item.id === selectedItem)?.title || 'Dashboard'}
              </span>
            </div>
          </div>
          
          {renderContent()}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Admin;
