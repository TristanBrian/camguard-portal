
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Loader2, Mail, ArrowLeft, AlertCircle } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onBackToLogin }) => {
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [testReset, setTestReset] = useState(false);
  const [resetLink, setResetLink] = useState<string | null>(null);

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

  return (
    <>
      <button 
        onClick={onBackToLogin}
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
    </>
  );
};

export default ForgotPasswordForm;
