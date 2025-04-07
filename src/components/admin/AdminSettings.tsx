
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, CheckCircle2, Lock, Mail, ShieldCheck, User, Globe, Bell, LogOut, Smartphone, Users, Trash2, FileText, Download, Upload } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';

const AdminSettings: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // General settings
  const [generalSettings, setGeneralSettings] = useState({
    storeName: "KimCom Electronics",
    email: "admin@kimcom.com",
    phone: "+254 123 456 789",
    address: "Nairobi, Kenya",
    currency: "KSH",
    language: "English",
    timeZone: "Africa/Nairobi",
    taxRate: "16",
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    orderNotifications: true,
    stockAlerts: true,
    marketingEmails: false,
    securityAlerts: true,
    appNotifications: true,
    promotionAlerts: false,
  });

  // Security settings
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);

  // User settings
  const [userData, setUserData] = useState({
    fullName: "Admin User",
    email: "admin@kimcom.com",
    role: "Super Admin",
    joinDate: "Jan 12, 2023",
    lastLogin: "Today at 8:45 AM",
    avatar: "/placeholder.svg"
  });

  // Backup & Data
  const [lastBackup, setLastBackup] = useState("Never");
  const [autoBackup, setAutoBackup] = useState(true);
  const [backupFrequency, setBackupFrequency] = useState("weekly");

  const handleGeneralSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setGeneralSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleCurrencyChange = (value: string) => {
    setGeneralSettings(prev => ({
      ...prev,
      currency: value
    }));
  };

  const handleLanguageChange = (value: string) => {
    setGeneralSettings(prev => ({
      ...prev,
      language: value
    }));
  };

  const handleTimeZoneChange = (value: string) => {
    setGeneralSettings(prev => ({
      ...prev,
      timeZone: value
    }));
  };

  const handleBackupFrequencyChange = (value: string) => {
    setBackupFrequency(value);
  };

  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length > 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    setPasswordStrength(strength);
  };

  const saveGeneralSettings = () => {
    setLoading(true);
    // Simulating API call
    setTimeout(() => {
      setLoading(false);
      toast.success("General settings updated successfully");
    }, 1000);
  };

  const saveNotificationSettings = () => {
    setLoading(true);
    // Simulating API call
    setTimeout(() => {
      setLoading(false);
      toast.success("Notification preferences updated successfully");
    }, 1000);
  };

  const changePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All password fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    if (passwordStrength < 3) {
      toast.error("Password is too weak. Include uppercase, lowercase, numbers and special characters.");
      return;
    }

    setLoading(true);
    // Simulating API call
    setTimeout(() => {
      setLoading(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordStrength(0);
      toast.success("Password changed successfully");
    }, 1500);
  };

  const enableTwoFactor = () => {
    setLoading(true);
    // Simulating API call
    setTimeout(() => {
      setLoading(false);
      setTwoFactorEnabled(true);
      toast.success("Two-factor authentication enabled");
    }, 1500);
  };

  const disableTwoFactor = () => {
    setLoading(true);
    // Simulating API call
    setTimeout(() => {
      setLoading(false);
      setTwoFactorEnabled(false);
      toast.success("Two-factor authentication disabled");
    }, 1500);
  };

  const createBackup = () => {
    setLoading(true);
    // Simulating API call
    setTimeout(() => {
      setLoading(false);
      setLastBackup(new Date().toLocaleString());
      toast.success("Backup created successfully");
    }, 2000);
  };

  const downloadBackup = () => {
    toast.info("Preparing backup for download...");
    setTimeout(() => {
      toast.success("Backup downloaded successfully");
    }, 1500);
  };

  const restoreBackup = () => {
    toast.info("System restore in progress...");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("System restored successfully");
    }, 3000);
  };

  const deleteAccount = () => {
    toast.info("This would delete your admin account permanently");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-5 lg:w-[600px]">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="backup">Backup & Data</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4 pt-4">
          <Card className="border-t-4 border-t-kimcom-600">
            <CardHeader className="bg-gray-50">
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-kimcom-600" />
                General Settings
              </CardTitle>
              <CardDescription>
                Update your store information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label htmlFor="storeName">Store Name</Label>
                <Input
                  id="storeName"
                  name="storeName"
                  value={generalSettings.storeName}
                  onChange={handleGeneralSettingsChange}
                />
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={generalSettings.email}
                    onChange={handleGeneralSettingsChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={generalSettings.phone}
                    onChange={handleGeneralSettingsChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  name="address"
                  value={generalSettings.address}
                  onChange={handleGeneralSettingsChange}
                  rows={3}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="currency">Default Currency</Label>
                  <Select
                    value={generalSettings.currency}
                    onValueChange={handleCurrencyChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="KSH">Kenyan Shilling (KSH)</SelectItem>
                      <SelectItem value="USD">US Dollar (USD)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                      <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={generalSettings.language}
                    onValueChange={handleLanguageChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Swahili">Swahili</SelectItem>
                      <SelectItem value="French">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="timeZone">Time Zone</Label>
                  <Select
                    value={generalSettings.timeZone}
                    onValueChange={handleTimeZoneChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select time zone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Africa/Nairobi">Nairobi (EAT)</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">New York (EST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="taxRate">Default Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    name="taxRate"
                    type="number"
                    value={generalSettings.taxRate}
                    onChange={handleGeneralSettingsChange}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-gray-50">
              <Button onClick={saveGeneralSettings} disabled={loading} className="bg-kimcom-600 hover:bg-kimcom-700">
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4 pt-4">
          <Card className="border-t-4 border-t-purple-600">
            <CardHeader className="bg-gray-50">
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-purple-600" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose what notifications you receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-full bg-blue-100">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-muted-foreground">
                      Receive system emails with important updates
                    </p>
                  </div>
                </div>
                <Switch
                  checked={notifications.emailAlerts}
                  onCheckedChange={() => handleNotificationToggle('emailAlerts')}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-full bg-green-100">
                    <ShoppingCart className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Order Updates</h3>
                    <p className="text-sm text-muted-foreground">
                      Get notified about new orders and status changes
                    </p>
                  </div>
                </div>
                <Switch
                  checked={notifications.orderNotifications}
                  onCheckedChange={() => handleNotificationToggle('orderNotifications')}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-full bg-amber-100">
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Stock Alerts</h3>
                    <p className="text-sm text-muted-foreground">
                      Receive alerts when products are low or out of stock
                    </p>
                  </div>
                </div>
                <Switch
                  checked={notifications.stockAlerts}
                  onCheckedChange={() => handleNotificationToggle('stockAlerts')}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-full bg-purple-100">
                    <Bell className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Marketing Emails</h3>
                    <p className="text-sm text-muted-foreground">
                      Receive tips, product updates and marketing emails
                    </p>
                  </div>
                </div>
                <Switch
                  checked={notifications.marketingEmails}
                  onCheckedChange={() => handleNotificationToggle('marketingEmails')}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-full bg-red-100">
                    <ShieldCheck className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Security Alerts</h3>
                    <p className="text-sm text-muted-foreground">
                      Get important security notifications about your account
                    </p>
                  </div>
                </div>
                <Switch
                  checked={notifications.securityAlerts}
                  onCheckedChange={() => handleNotificationToggle('securityAlerts')}
                />
              </div>

              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-full bg-blue-100">
                    <Smartphone className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Mobile App Notifications</h3>
                    <p className="text-sm text-muted-foreground">
                      Push notifications on your mobile devices
                    </p>
                  </div>
                </div>
                <Switch
                  checked={notifications.appNotifications}
                  onCheckedChange={() => handleNotificationToggle('appNotifications')}
                />
              </div>
            </CardContent>
            <CardFooter className="border-t bg-gray-50">
              <Button onClick={saveNotificationSettings} disabled={loading} className="bg-purple-600 hover:bg-purple-700">
                {loading ? "Saving..." : "Save Preferences"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-4 pt-4">
          <Card className="border-t-4 border-t-red-600">
            <CardHeader className="bg-gray-50">
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-red-600" />
                Change Password
              </CardTitle>
              <CardDescription>
                Update your account password regularly for better security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    checkPasswordStrength(e.target.value);
                  }}
                />
                {newPassword && (
                  <div className="mt-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            passwordStrength < 2 ? 'bg-red-500' : 
                            passwordStrength < 4 ? 'bg-yellow-500' : 
                            'bg-green-500'
                          }`} 
                          style={{ width: `${passwordStrength * 20}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium">
                        {passwordStrength < 2 ? 'Weak' : 
                         passwordStrength < 4 ? 'Medium' : 
                         'Strong'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">Passwords don't match</p>
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t bg-gray-50">
              <Button onClick={changePassword} disabled={loading} className="bg-red-600 hover:bg-red-700">
                {loading ? "Updating..." : "Update Password"}
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-t-4 border-t-blue-600">
            <CardHeader className="bg-gray-50">
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-blue-600" />
                Two-Factor Authentication
              </CardTitle>
              <CardDescription>
                Add an extra layer of security to your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-full ${twoFactorEnabled ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <Smartphone className={`h-6 w-6 ${twoFactorEnabled ? 'text-green-600' : 'text-gray-600'}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Two-Factor Authentication</h3>
                  <p className="text-sm text-muted-foreground">
                    {twoFactorEnabled 
                      ? "Two-factor authentication is enabled for your account" 
                      : "Protect your account with two-factor authentication"}
                  </p>
                </div>
                <div className="flex items-center">
                  {twoFactorEnabled ? (
                    <>
                      <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
                      <span className="text-sm font-medium text-green-500">Enabled</span>
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-5 w-5 text-gray-400" />
                      <span className="text-sm font-medium text-gray-500">Disabled</span>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-gray-50">
              {twoFactorEnabled ? (
                <Button variant="outline" onClick={disableTwoFactor} disabled={loading} className="border-blue-600 text-blue-600">
                  {loading ? "Disabling..." : "Disable Two-Factor"}
                </Button>
              ) : (
                <Button onClick={enableTwoFactor} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                  {loading ? "Enabling..." : "Enable Two-Factor"}
                </Button>
              )}
            </CardFooter>
          </Card>

          <Card className="border-t-4 border-t-pink-600">
            <CardHeader className="bg-gray-50">
              <CardTitle className="flex items-center gap-2">
                <LogOut className="h-5 w-5 text-pink-600" />
                Account Management
              </CardTitle>
              <CardDescription>
                Manage active sessions and account status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-full bg-pink-100">
                    <LogOut className="h-5 w-5 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Log Out From All Devices</h3>
                    <p className="text-sm text-muted-foreground">
                      This will log you out from all devices except your current one
                    </p>
                  </div>
                </div>
                <Button variant="outline" onClick={() => toast.info("This would log you out from all devices")} className="border-pink-600 text-pink-600">
                  Log Out All
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-full bg-red-100">
                    <Trash2 className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Delete Account</h3>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account and all associated data
                    </p>
                  </div>
                </div>
                <Button variant="destructive" onClick={deleteAccount}>
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="space-y-4 pt-4">
          <Card className="border-t-4 border-t-green-600">
            <CardHeader className="bg-gray-50">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-green-600" />
                User Profile
              </CardTitle>
              <CardDescription>
                View and update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/4 flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full bg-gray-200 mb-4 overflow-hidden">
                    <img src={userData.avatar} alt="Profile" className="w-full h-full object-cover" />
                  </div>
                  <Button className="w-full bg-green-600 hover:bg-green-700">Change Avatar</Button>
                </div>
                <div className="md:w-3/4 space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={userData.fullName}
                        onChange={(e) => setUserData({...userData, fullName: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="userEmail">Email</Label>
                      <Input
                        id="userEmail"
                        value={userData.email}
                        onChange={(e) => setUserData({...userData, email: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <div className="flex items-center">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {userData.role}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Join Date</Label>
                      <div className="text-sm">{userData.joinDate}</div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Last Login</Label>
                      <div className="text-sm">{userData.lastLogin}</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-gray-50">
              <Button className="bg-green-600 hover:bg-green-700" onClick={() => toast.success("Profile updated successfully")}>
                Save Profile
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-4 pt-4">
          <Card className="border-t-4 border-t-amber-600">
            <CardHeader className="bg-gray-50">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-amber-600" />
                Backup & Data Management
              </CardTitle>
              <CardDescription>
                Manage your system data and scheduled backups
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-full bg-amber-100">
                    <FileText className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Last Backup</h3>
                    <p className="text-sm text-muted-foreground">
                      {lastBackup === "Never" ? "No backups created yet" : `Last backup created on ${lastBackup}`}
                    </p>
                  </div>
                </div>
                <Button onClick={createBackup} disabled={loading} className="bg-amber-600 hover:bg-amber-700">
                  {loading ? "Creating..." : "Create Backup"}
                </Button>
              </div>

              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-full bg-blue-100">
                    <Download className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Download Backup</h3>
                    <p className="text-sm text-muted-foreground">
                      Download a copy of your system data
                    </p>
                  </div>
                </div>
                <Button variant="outline" onClick={downloadBackup} className="border-blue-600 text-blue-600">
                  Download
                </Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-full bg-green-100">
                    <Upload className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Restore System</h3>
                    <p className="text-sm text-muted-foreground">
                      Restore your system from a previous backup
                    </p>
                  </div>
                </div>
                <Button variant="outline" onClick={restoreBackup} disabled={loading} className="border-green-600 text-green-600">
                  {loading ? "Restoring..." : "Restore"}
                </Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium">Automatic Backups</h3>
                    <p className="text-sm text-muted-foreground ml-2">
                      Schedule regular system backups
                    </p>
                  </div>
                  <Switch
                    checked={autoBackup}
                    onCheckedChange={setAutoBackup}
                  />
                </div>
                
                {autoBackup && (
                  <div className="ml-6 mt-2">
                    <Label htmlFor="backupFrequency">Backup Frequency</Label>
                    <Select
                      value={backupFrequency}
                      onValueChange={handleBackupFrequencyChange}
                    >
                      <SelectTrigger className="w-full max-w-xs">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t bg-gray-50">
              <Button className="bg-amber-600 hover:bg-amber-700" onClick={() => toast.success("Backup settings saved")}>
                Save Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;

function ShoppingCart(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}

