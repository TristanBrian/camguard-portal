
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { User, Lock, Mail, UserCircle2, ArrowLeft } from 'lucide-react';
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
  
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Get existing users from localStorage
  const getUsers = () => {
    const savedUsers = localStorage.getItem('kimcom_users');
    return savedUsers ? JSON.parse(savedUsers) : [];
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      const users = getUsers();
      const user = users.find((u: any) => u.email === email && u.password === password);
      
      if (user) {
        toast.success('Login successful');
        localStorage.setItem('kimcom_current_user', JSON.stringify(user));
        navigate('/');
      } else {
        toast.error('Invalid credentials');
      }
      setLoading(false);
    }, 1000);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simple validation
    if (registerPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      setLoading(false);
      return;
    }

    const users = getUsers();
    // Check if user already exists
    if (users.some((user: any) => user.email === registerEmail)) {
      toast.error('Email already in use');
      setLoading(false);
      return;
    }
    
    setTimeout(() => {
      const newUser = {
        id: Date.now(),
        fullName,
        email: registerEmail,
        password: registerPassword,
        role: 'customer'
      };
      
      const updatedUsers = [...users, newUser];
      localStorage.setItem('kimcom_users', JSON.stringify(updatedUsers));
      localStorage.setItem('kimcom_current_user', JSON.stringify(newUser));
      
      toast.success('Account created successfully');
      navigate('/');
      setLoading(false);
    }, 1000);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Use Supabase password reset functionality
      const { error } = await supabase.auth.resetPasswordForEmail(forgotPasswordEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        throw error;
      }
      
      setResetSent(true);
      toast.success('Password reset instructions sent to your email');
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
                      {loading ? 'Sending...' : 'Reset Password'}
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
                      {loading ? 'Logging in...' : 'Login'}
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
                      {loading ? 'Creating Account...' : 'Create Account'}
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
