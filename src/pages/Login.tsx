import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { User, Lock, Mail, UserCircle2, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

const Login: React.FC = () => {
  // Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Register state
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  
  // Reset password state
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  
  // Developer mode state - for testing password reset
  const [resetLink, setResetLink] = useState<string | null>(null);
  const [testReset, setTestReset] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Clear the reset link when leaving the page
  useEffect(() => {
    return () => {
      setResetLink(null);
    };
  }, []);

  // Login with Supabase
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      toast.success('Login successful');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Invalid credentials');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Register with Supabase
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simple validation
    if (registerPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      setLoading(false);
      return;
    }

    if (registerPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      setLoading(false);
      return;
    }
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: registerEmail,
        password: registerPassword,
        options: {
          data: {
            full_name: fullName
          }
        }
      });
      
      if (error) throw error;
      
      toast.success('Account created successfully. Check your email for verification.');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
      console.error('Register error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Send custom password reset email using our Resend edge function
  const sendCustomPasswordResetEmail = async (email: string, resetToken: string) => {
    try {
      const origin = window.location.origin;
      const resetUrl = `${origin}/reset-password#type=recovery&access_token=${resetToken}`;
      
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Reset Your Password</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4f46e5; padding: 20px; text-align: center; color: white; border-radius: 5px 5px 0 0; }
            .content { padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 5px 5px; }
            .button { display: inline-block; background-color: #4f46e5; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; margin-top: 20px; }
            .footer { margin-top: 30px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <p>Hello,</p>
            <p>We received a request to reset your password for your KimCom Solutions account. 
               Click the button below to reset your password:</p>
            
            <p style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Your Password</a>
            </p>
            
            <p>If you didn't request a password reset, you can ignore this email - your account is still secure.</p>
            <p>This password reset link is only valid for the next 24 hours.</p>
            
            <p>If the button above doesn't work, you can copy and paste the following URL into your browser:</p>
            <p style="word-break: break-all; font-size: 12px;">${resetUrl}</p>
            
            <div class="footer">
              <p>Thank you,<br>The KimCom Solutions Team</p>
            </div>
          </div>
        </body>
        </html>
      `;
      
      // Call our Resend edge function to send the email
      const response = await fetch(`https://lcqrwhnpscchimjqysau.supabase.co/functions/v1/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: email,
          subject: 'Reset Your KimCom Solutions Password',
          html: htmlContent,
          from: 'KimCom Solutions <noreply@resend.dev>' // Update this when you verify your domain
        })
      });
      
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to send password reset email');
      }
      
      console.log('Custom password reset email sent successfully');
      return true;
    } catch (error) {
      console.error('Error sending custom reset email:', error);
      return false;
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResetLink(null);
    
    try {
      // Get the current site URL for the redirect
      const origin = window.location.origin;
      const redirectTo = `${origin}/reset-password`;
      console.log('Reset password redirect URL:', redirectTo);
      
      // First, generate a password recovery token with Supabase
      // But tell it not to send an email (we'll send our own)
      const { data, error } = await supabase.auth.resetPasswordForEmail(forgotPasswordEmail, {
        redirectTo: redirectTo,
      });
      
      if (error) {
        throw error;
      }
      
      // For development environment - capture the reset link from the logs
      setTestReset(true);
      console.log('Password reset process initiated successfully');
      setResetSent(true);
      toast.success('Password reset instructions sent to your email');
      
      // Wait a moment to try to get access to token info
      setTimeout(async () => {
        try {
          const { data: authData } = await supabase.auth.getSession();
          if (authData?.session) {
            console.log('Active session found, may help with password reset testing');
          }
        } catch (err) {
          console.log('Could not get session info', err);
        }
      }, 500);
      
    } catch (error: any) {
      toast.error(error.message || 'Failed to send reset email');
      console.error('Reset password error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDevModeTest = async () => {
    if (!forgotPasswordEmail) {
      toast.error('Please enter an email address first');
      return;
    }
    
    setLoading(true);
    
    try {
      // Direct link to test password reset in dev mode
      const origin = window.location.origin;
      const testResetUrl = `${origin}/reset-password`;
      
      // Try to create a test session for the user
      const { data, error } = await supabase.auth.resetPasswordForEmail(forgotPasswordEmail, {
        redirectTo: testResetUrl,
      });
      
      if (error) throw error;
      
      toast.success('Check the Supabase Auth dashboard to find the password reset link', {
        duration: 6000,
      });
      
      // Set a link to the Supabase dashboard
      setResetLink('https://supabase.com/dashboard/project/lcqrwhnpscchimjqysau/auth/users');
      
      console.log('Dev mode: Test reset link should be available in Supabase Auth dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Failed to generate test reset link');
      console.error('Dev mode test error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Back to login from forgot password view
  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setResetSent(false);
    setResetLink(null);
    setTestReset(false);
  };

  // If showing the forgot password screen
  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <div className="bg-white shadow-md rounded-lg border border-gray-200 p-6">
              <div className="flex justify-center mb-6">
                <div className="bg-kimcom-100 p-3 rounded-full">
                  <Lock className="h-8 w-8 text-kimcom-600" />
                </div>
              </div>
              
              <h2 className="text-xl font-semibold text-center mb-6">
                {resetSent ? 'Check Your Email' : 'Reset Your Password'}
              </h2>
              
              <button 
                onClick={handleBackToLogin}
                className="flex items-center text-kimcom-600 mb-6 hover:underline"
              >
                <ArrowLeft className="h-4 w-4 mr-1" /> Back to Login
              </button>
              
              {resetSent ? (
                <div className="text-center space-y-4">
                  <p>We've sent reset instructions to:</p>
                  <p className="font-medium text-kimcom-600">{forgotPasswordEmail}</p>
                  <p className="text-sm text-gray-500 mt-4">
                    Check your email and follow the link to reset your password.
                    If you don't see the email, check your spam folder.
                  </p>
                  
                  {testReset && (
                    <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-md">
                      <div className="flex items-center gap-2 text-amber-700 mb-2">
                        <AlertCircle className="h-5 w-5" />
                        <h3 className="font-semibold">Development Mode</h3>
                      </div>
                      <p className="text-sm text-amber-700 mb-3">
                        To test the password reset in development:
                      </p>
                      <Button 
                        variant="outline" 
                        className="bg-amber-100 border-amber-300 mb-3 w-full"
                        onClick={handleDevModeTest}
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Getting test link...
                          </>
                        ) : 'Generate Test Reset Link'}
                      </Button>
                      {resetLink && (
                        <div className="mt-3">
                          <p className="text-sm text-amber-700 mb-2">Check users in Supabase Auth dashboard:</p>
                          <a 
                            href="https://supabase.com/dashboard/project/lcqrwhnpscchimjqysau/auth/users" 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-amber-800 underline flex items-center"
                          >
                            Supabase Auth Dashboard
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 h-3 w-3">
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                              <polyline points="15 3 21 3 21 9"></polyline>
                              <line x1="10" y1="14" x2="21" y2="3"></line>
                            </svg>
                          </a>
                          <p className="text-xs mt-2 text-amber-700">
                            1. Find the user with email: {forgotPasswordEmail}<br/>
                            2. Click on the three dots menu<br/>
                            3. Select "Generate link" &gt; "Password recovery"<br/>
                            4. Copy and use the generated link
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={handleForgotPassword}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="forgotPasswordEmail" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          id="forgotPasswordEmail"
                          type="email"
                          value={forgotPasswordEmail}
                          onChange={(e) => setForgotPasswordEmail(e.target.value)}
                          className="pl-10 w-full"
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        We'll send you a link to reset your password.
                      </p>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-kimcom-600 hover:bg-kimcom-700"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : 'Reset Password'}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
        
        <div className="py-4 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} KimCom Solutions. All rights reserved.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white shadow-md rounded-lg border border-gray-200 p-6">
            <div className="flex justify-center mb-6">
              <div className="bg-kimcom-100 p-3 rounded-full">
                <UserCircle2 className="h-8 w-8 text-kimcom-600" />
              </div>
            </div>
            
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10 w-full"
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 w-full"
                          placeholder="Enter your password"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="text-kimcom-600 text-sm hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-kimcom-600 hover:bg-kimcom-700"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Logging in...
                        </>
                      ) : 'Login'}
                    </Button>
                  </div>
                </form>
              </TabsContent>
              
              <TabsContent value="register">
                <form onSubmit={handleRegister}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          id="fullName"
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="pl-10 w-full"
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="registerEmail" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          id="registerEmail"
                          type="email"
                          value={registerEmail}
                          onChange={(e) => setRegisterEmail(e.target.value)}
                          className="pl-10 w-full"
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="registerPassword" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          id="registerPassword"
                          type="password"
                          value={registerPassword}
                          onChange={(e) => setRegisterPassword(e.target.value)}
                          className="pl-10 w-full"
                          placeholder="Create a password"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="pl-10 w-full"
                          placeholder="Confirm your password"
                          required
                        />
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-kimcom-600 hover:bg-kimcom-700"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating Account...
                        </>
                      ) : 'Create Account'}
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      <div className="py-4 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} KimCom Solutions. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Login;
