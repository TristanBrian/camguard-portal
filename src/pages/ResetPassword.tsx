
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Lock, AlertCircle, Loader2, Check, Eye, EyeOff } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [validSession, setValidSession] = useState(false);
  const [verifyingStatus, setVerifyingStatus] = useState('checking'); // 'checking', 'success', 'error'
  const [tokenError, setTokenError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0); // 0-3 scale
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Extract the hash parameters from the URL
    const hash = window.location.hash.substring(1);
    if (hash) {
      const hashParams = new URLSearchParams(hash);
      const type = hashParams.get('type');
      const access_token = hashParams.get('access_token');
      
      if (type === 'recovery' && access_token) {
        // Verify the recovery token
        const verifyToken = async () => {
          setVerifyingStatus('checking');
          try {
            const { data, error } = await supabase.auth.setSession({
              access_token,
              refresh_token: access_token,
            });
            
            if (error) {
              setVerifyingStatus('error');
              setTokenError(error.message || 'Invalid or expired recovery link');
              toast.error('Invalid or expired recovery link');
              console.error('Error setting session:', error);
              setTimeout(() => navigate('/login'), 3000);
            } else {
              console.log('Valid recovery session established', data);
              setVerifyingStatus('success');
              setValidSession(true);
            }
          } catch (error: any) {
            setVerifyingStatus('error');
            setTokenError(error.message || 'Failed to process recovery link');
            console.error('Exception during token verification:', error);
            toast.error('Failed to process recovery link');
            setTimeout(() => navigate('/login'), 3000);
          }
        };
        
        verifyToken();
      } else {
        setVerifyingStatus('error');
        setTokenError('Invalid recovery link format');
        console.log('Missing required hash parameters', { type, access_token });
        toast.error('Invalid recovery link format');
        setTimeout(() => navigate('/login'), 3000);
      }
    } else {
      // If no hash parameters, check if user has a valid session already
      const checkExistingSession = async () => {
        const { data } = await supabase.auth.getSession();
        if (data?.session) {
          console.log('User already has an active session');
          setVerifyingStatus('success');
          setValidSession(true);
        } else {
          setVerifyingStatus('error');
          setTokenError('No recovery parameters found and no active session');
          console.log('No recovery parameters found and no active session');
          toast.error('Please use the reset link from your email');
          setTimeout(() => navigate('/login'), 3000);
        }
      };
      
      checkExistingSession();
    }
  }, [navigate]);

  // Check password strength when it changes
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }
    
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength++;
    
    // Complexity checks
    if (/[A-Z]/.test(password)) strength++; // Has uppercase
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) strength++; // Has number or special char
    
    setPasswordStrength(strength);
  }, [password]);

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0: return 'bg-gray-200';
      case 1: return 'bg-red-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-green-500';
      default: return 'bg-gray-200';
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0: return 'Enter a password';
      case 1: return 'Weak';
      case 2: return 'Moderate';
      case 3: return 'Strong';
      default: return '';
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    
    setLoading(true);
    
    try {
      // Update password via Supabase
      const { data, error } = await supabase.auth.updateUser({
        password: password
      });
      
      if (error) {
        throw error;
      }
      
      console.log('Password updated successfully:', data);
      toast.success('Password has been reset successfully');
      
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error: any) {
      toast.error(error.message || 'Failed to reset password');
      console.error('Reset password error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (verifyingStatus === 'checking') {
      return (
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 text-kimcom-600 mx-auto animate-spin" />
          <p className="text-gray-600 mt-4">Verifying your reset link...</p>
        </div>
      );
    } else if (verifyingStatus === 'error') {
      return (
        <div className="text-center py-8">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-10 w-10 text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-red-700 mb-2">Verification Failed</h3>
          <p className="text-gray-600 mb-4">{tokenError}</p>
          <p className="text-gray-600">Redirecting you to the login page...</p>
        </div>
      );
    } else if (validSession) {
      return (
        <form onSubmit={handleResetPassword}>
          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 w-full"
                  placeholder="Enter new password"
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              
              {/* Password strength indicator */}
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500">Password strength:</span>
                  <span className="text-xs font-medium">
                    {getPasswordStrengthText()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`${getPasswordStrengthColor()} h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${(passwordStrength / 3) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 pr-10 w-full"
                  placeholder="Confirm new password"
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              
              {/* Password match indicator */}
              {confirmPassword && (
                <div className="flex items-center mt-2">
                  {password === confirmPassword ? (
                    <>
                      <Check className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-xs text-green-500">Passwords match</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                      <span className="text-xs text-red-500">Passwords don't match</span>
                    </>
                  )}
                </div>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-kimcom-600 hover:bg-kimcom-700"
              disabled={loading || password !== confirmPassword || password.length < 6}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting...
                </>
              ) : 'Reset Password'}
            </Button>
          </div>
        </form>
      );
    }
  };

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
            
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Reset Your Password</h2>
            
            {renderContent()}
          </div>
        </div>
      </div>
      
      <div className="py-4 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} KimCom Solutions. All rights reserved.</p>
      </div>
    </div>
  );
};

export default ResetPassword;
