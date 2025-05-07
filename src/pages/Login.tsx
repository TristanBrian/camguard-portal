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

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResetLink(null);
    
    try {
      // Get the current site URL for the redirect
      const origin = window.location.origin;
      const redirectTo = `${origin}/reset-password`;
      console.log('Reset password redirect URL:', redirectTo);
      
      // Use Supabase password reset functionality
      const { data, error } = await supabase.auth.resetPasswordForEmail(forgotPasswordEmail, {
        redirectTo: redirectTo,
      });
      
      if (error) {
        throw error;
      }
      
      console.log('Password reset email sent successfully');
      setResetSent(true);
      toast.success('Password reset instructions sent to your email');
      
      // For development environment - capture the reset link from the logs
      // In a real production scenario, this wouldn't be available
      try {
        // Wait a moment to capture any response data
        setTimeout(async () => {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            // Display a message about checking Supabase dashboard
            setResetLink('Please check the Supabase dashboard Auth > Users section to find your password reset link.');
          }
        }, 1000);
      } catch (err) {
        console.log('Could not get additional auth info', err);
      }
      
    } catch (error: any) {
      toast.error(error.message || 'Failed to send reset email');
      console.error('Reset password error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Back to login from forgot password view
  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setResetSent(false);
    setResetLink(null);
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
                  
                  {resetLink && (
                    <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-md">
                      <div className="flex items-center gap-2 text-amber-700 mb-2">
                        <AlertCircle className="h-5 w-5" />
                        <h3 className="font-semibold">Development Mode</h3>
                      </div>
                      <p className="text-sm text-amber-700">{resetLink}</p>
                      <div className="mt-3">
                        <a 
                          href="https://supabase.com/dashboard/project/lcqrwhnpscchimjqysau/auth/users" 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-amber-800 underline"
                        >
                          Go to Supabase Users Dashboard
                        </a>
                      </div>
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
