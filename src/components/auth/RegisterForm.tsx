
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Loader2, Mail, Lock, User } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

const RegisterForm: React.FC = () => {
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  return (
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
  );
};

export default RegisterForm;
