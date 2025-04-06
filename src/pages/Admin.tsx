
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarInset } from '@/components/ui/sidebar';
import { Home, Package, BarChart2, TrendingUp, Settings, LogOut, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import AdminDashboard from '@/components/admin/AdminDashboard';

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState('dashboard');
  
  const handleNavigation = (path: string, item: string) => {
    setSelectedItem(item);
    navigate(path);
  };

  const handleLogout = () => {
    toast.success('Successfully logged out');
    navigate('/');
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
                  onClick={() => setSelectedItem('dashboard')}
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
        <SidebarInset className="p-4 md:p-6">
          <AdminDashboard />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Admin;
