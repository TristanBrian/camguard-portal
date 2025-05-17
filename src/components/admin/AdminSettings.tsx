
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PasswordChangeForm from './PasswordChangeForm';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CompanySettings {
  name: string;
  website: string;
  email: string;
  phone: string;
  address: string;
  maintenanceMode: boolean;
}

interface NotificationSettings {
  emailNotifications: boolean;
  lowStockAlerts: boolean;
  orderNotifications: boolean;
  marketingUpdates: boolean;
}

const AdminSettings = () => {
  const navigate = useNavigate();
  const [companySettings, setCompanySettings] = useState<CompanySettings>({
    name: 'KimCom Electronics',
    website: 'https://kimcom.co.ke',
    email: 'info@kimcom.co.ke',
    phone: '+254 700 000000',
    address: '123 Main St, Nairobi, Kenya',
    maintenanceMode: false
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    lowStockAlerts: true,
    orderNotifications: true,
    marketingUpdates: false
  });

  const [isSaving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("You must be logged in to access settings");
        navigate('/admin-login');
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handleCompanySettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setCompanySettings(prev => ({
      ...prev,
      [id.replace('company-', '')]: type === 'checkbox' ? checked : value
    }));
  };

  const handleMaintenanceModeChange = (checked: boolean) => {
    setCompanySettings(prev => ({
      ...prev,
      maintenanceMode: checked
    }));
  };

  const handleNotificationChange = (key: keyof NotificationSettings, checked: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: checked
    }));
  };

  const handleSaveGeneralSettings = async () => {
    try {
      setSaving(true);
      // In a real app, you would save to the database here
      // const { error } = await supabase.from('company_settings').upsert({
      //   settings: companySettings
      // });
      
      // if (error) throw error;
      
      setTimeout(() => {
        setSaving(false);
        toast.success("Settings saved successfully!");
      }, 800);
    } catch (error) {
      setSaving(false);
      toast.error("Failed to save settings");
      console.error("Error saving settings:", error);
    }
  };

  const handleSaveNotificationSettings = async () => {
    try {
      setSaving(true);
      // In a real app, you would save to the database here
      // const { error } = await supabase.from('notification_settings').upsert({
      //   settings: notificationSettings
      // });
      
      // if (error) throw error;
      
      setTimeout(() => {
        setSaving(false);
        toast.success("Notification settings saved successfully!");
      }, 800);
    } catch (error) {
      setSaving(false);
      toast.error("Failed to save notification settings");
      console.error("Error saving notification settings:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      // Redirect will be handled by the auth state change in Admin.tsx
      navigate('/admin-login');
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to log out");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input 
                    id="company-name" 
                    value={companySettings.name}
                    onChange={handleCompanySettingChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company-website">Website URL</Label>
                  <Input 
                    id="company-website" 
                    value={companySettings.website}
                    onChange={handleCompanySettingChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company-email">Contact Email</Label>
                  <Input 
                    id="company-email"
                    type="email" 
                    value={companySettings.email}
                    onChange={handleCompanySettingChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company-phone">Contact Phone</Label>
                  <Input 
                    id="company-phone" 
                    value={companySettings.phone}
                    onChange={handleCompanySettingChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company-address">Business Address</Label>
                <Input 
                  id="company-address" 
                  value={companySettings.address}
                  onChange={handleCompanySettingChange}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="maintenance-mode"
                  checked={companySettings.maintenanceMode}
                  onCheckedChange={handleMaintenanceModeChange}
                />
                <Label htmlFor="maintenance-mode">Enable Maintenance Mode</Label>
              </div>
              
              <Button 
                onClick={handleSaveGeneralSettings} 
                className="bg-kimcom-600 hover:bg-kimcom-700"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <div className="space-y-6">
            <PasswordChangeForm />
            
            <Card>
              <CardHeader>
                <CardTitle>Account Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full sm:w-auto" onClick={handleLogout}>
                  Log Out of All Devices
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive email notifications for important events</p>
                </div>
                <Switch 
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) => handleNotificationChange('emailNotifications', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Low Stock Alerts</p>
                  <p className="text-sm text-muted-foreground">Get notified when product stock is running low</p>
                </div>
                <Switch 
                  checked={notificationSettings.lowStockAlerts}
                  onCheckedChange={(checked) => handleNotificationChange('lowStockAlerts', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Order Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive notifications for new orders</p>
                </div>
                <Switch 
                  checked={notificationSettings.orderNotifications}
                  onCheckedChange={(checked) => handleNotificationChange('orderNotifications', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Marketing Updates</p>
                  <p className="text-sm text-muted-foreground">Receive updates about marketing campaigns</p>
                </div>
                <Switch 
                  checked={notificationSettings.marketingUpdates}
                  onCheckedChange={(checked) => handleNotificationChange('marketingUpdates', checked)}
                />
              </div>
              
              <Button 
                className="bg-kimcom-600 hover:bg-kimcom-700"
                onClick={handleSaveNotificationSettings}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Notification Settings'
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
