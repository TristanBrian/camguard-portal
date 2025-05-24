import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import { supabase } from '@/integrations/supabase/client';

const UserSettings: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      // Check for localStorage user first (demo login)
      const currentUser = localStorage.getItem('kimcom_current_user');
      if (currentUser) {
        try {
          const userData = JSON.parse(currentUser);
          setUser(userData);
          setFormData(prev => ({
            ...prev,
            email: userData.email || '',
            fullName: userData.full_name || '',
            phone: userData.phone || '',
            address: userData.address || '',
          }));
          return;
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
      
      // Then check Supabase auth
      try {
        const { data: { user: supabaseUser } } = await supabase.auth.getUser();
        
        if (supabaseUser) {
          setUser(supabaseUser);
          
          // Fetch profile data from profiles table
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('full_name, phone, address')
            .eq('id', supabaseUser.id)
            .single();
          
          if (profileError && profileError.code !== 'PGRST116') { // Ignore no rows found error
            console.error('Error fetching profile data:', profileError);
          }
          
          setFormData(prev => ({
            ...prev,
            email: supabaseUser.email || '',
            fullName: profileData?.full_name || supabaseUser.user_metadata?.full_name || '',
            phone: profileData?.phone || supabaseUser.user_metadata?.phone || '',
            address: profileData?.address || supabaseUser.user_metadata?.address || '',
          }));
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/login');
      }
    };
    
    fetchUserData();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (user) {
        // If using localStorage (demo)
        if (localStorage.getItem('kimcom_current_user')) {
          const updatedUser = {
            ...user,
            full_name: formData.fullName,
            phone: formData.phone,
            address: formData.address,
          };
          
          localStorage.setItem('kimcom_current_user', JSON.stringify(updatedUser));
          setUser(updatedUser);
        } 
        // If using Supabase auth
        else if (user.id) {
          // Update profiles table
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: user.id,
              full_name: formData.fullName,
              phone: formData.phone,
              address: formData.address,
              updated_at: new Date().toISOString(),
            });
          if (profileError) throw profileError;

          // Update user_metadata in Supabase Auth
          const { error: authError } = await supabase.auth.updateUser({
            data: {
              full_name: formData.fullName,
              phone: formData.phone,
              address: formData.address,
            }
          });
          
          if (authError) throw authError;
        }
        
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (user.email && user.email.includes('@kimcom.com')) {
      toast.info("Password change not available for demo accounts");
      return;
    }
    if (!formData.password) {
      toast.error("Please enter a new password");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: formData.password,
      });
      if (error) throw error;
      toast.success("Password updated successfully");
      setFormData(prev => ({ ...prev, password: '' }));
    } catch (error) {
      toast.error("Failed to update password");
      console.error("Error updating password:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-kimcom-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <div className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={() => navigate('/profile')}
                >
                  Back to Profile
                </Button>
              </div>
            </div>
            
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input 
                        id="fullName" 
                        name="fullName" 
                        placeholder="Your full name" 
                        value={formData.fullName} 
                        onChange={handleChange} 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        placeholder="Your email address" 
                        value={formData.email} 
                        disabled
                      />
                      <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        name="phone" 
                        placeholder="Your phone number" 
                        value={formData.phone} 
                        onChange={handleChange} 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Shipping Address</Label>
                      <Textarea 
                        id="address" 
                        name="address" 
                        placeholder="Your shipping address" 
                        value={formData.address} 
                        onChange={handleChange}
                        rows={4} 
                      />
                    </div>
                    
                    <Button type="submit" disabled={loading}>
                      {loading ? 'Updating...' : 'Update Profile'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Password & Security</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="New password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <Button 
                    variant="outline" 
                    className="w-full sm:w-auto" 
                    onClick={handleChangePassword}
                    disabled={loading}
                  >
                    Change Password
                  </Button>
                  
                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-2">Account Security</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Manage your account security settings and connected devices.
                    </p>
                    <Button variant="outline" className="w-full sm:w-auto" onClick={() => toast.info('Coming soon!')}>
                      Security Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
