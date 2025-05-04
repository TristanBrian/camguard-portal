
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PasswordChangeForm from './PasswordChangeForm';
import { supabase } from '@/integrations/supabase/client';

const AdminSettings = () => {
  const handleSaveGeneralSettings = () => {
    toast.success("Settings saved successfully!");
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      // Redirect will be handled by the auth state change in Admin.tsx
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
      
      <Tabs defaultValue="general" className="w-full">
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
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input id="company-name" defaultValue="KimCom Electronics" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="website-url">Website URL</Label>
                  <Input id="website-url" defaultValue="https://kimcom.co.ke" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Contact Email</Label>
                  <Input id="contact-email" defaultValue="info@kimcom.co.ke" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contact-phone">Contact Phone</Label>
                  <Input id="contact-phone" defaultValue="+254 700 000000" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="business-address">Business Address</Label>
                <Input id="business-address" defaultValue="123 Main St, Nairobi, Kenya" />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="maintenance-mode" />
                <Label htmlFor="maintenance-mode">Enable Maintenance Mode</Label>
              </div>
              
              <Button onClick={handleSaveGeneralSettings} className="bg-kimcom-600 hover:bg-kimcom-700">Save Changes</Button>
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
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive email notifications for important events</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Low Stock Alerts</p>
                  <p className="text-sm text-muted-foreground">Get notified when product stock is running low</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Order Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive notifications for new orders</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Marketing Updates</p>
                  <p className="text-sm text-muted-foreground">Receive updates about marketing campaigns</p>
                </div>
                <Switch />
              </div>
              
              <Button className="bg-kimcom-600 hover:bg-kimcom-700">Save Notification Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
