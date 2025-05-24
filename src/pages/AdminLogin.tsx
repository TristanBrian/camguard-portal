import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { toast } from 'sonner';
import { Lock, User } from 'lucide-react';
import Navbar from 'components/Navbar';
import { supabase } from 'integrations/supabase/client';
import { isAdmin } from 'integrations/supabase/admin';

import { useLocation } from 'react-router-dom';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const hasRole = await isAdmin(session.user.id);
        if (hasRole) {
          navigate('/manage-7s8dF3k');
        }
      }
    };
    checkAdmin();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Try Supabase sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Supabase signInWithPassword error:', error);
    }

    if (error || !data.session?.user) {
      toast.error('Invalid credentials or unable to log in');
      setLoading(false);
      return;
    }

    // Check if user is admin in user_roles table
    const hasRole = await isAdmin(data.session.user.id);

    if (hasRole) {
      toast.success('Login successful');
      navigate('/manage-7s8dF3k');
    } else {
      toast.error('You do not have admin permissions.');
      await supabase.auth.signOut();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white shadow-md rounded-lg border border-gray-200 p-6">
            <div className="flex justify-center mb-6">
              <div className="bg-kimcom-100 p-3 rounded-full">
                <Lock className="h-8 w-8 text-kimcom-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Admin Login</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 w-full"
                      placeholder="Enter your admin email"
                      autoComplete="username"
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
                      autoComplete="current-password"
                      required
                    />
                  </div>
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
          </div>
        </div>
      </div>
      <div className="py-4 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} KimCom Solutions. All rights reserved.</p>
      </div>
    </div>
  );
};

export default AdminLogin;
