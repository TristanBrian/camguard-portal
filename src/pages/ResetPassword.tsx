
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Lock, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [validSession, setValidSession] = useState(false);
  const [verifyingStatus, setVerifyingStatus] = useState('checking'); // 'checking', 'success', 'error'
  const [tokenError, setTokenError] = useState('');
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
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 w-full"
                  placeholder="Enter new password"
                  required
                />
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
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 w-full"
                  placeholder="Confirm new password"
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
