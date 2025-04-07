
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Lock, User } from 'lucide-react';
import Navbar from '@/components/Navbar';

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is already logged in as admin
    const currentUser = localStorage.getItem('kimcom_current_user');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      if (user.role === 'admin') {
        navigate('/admin');
      }
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Check if admin credentials match
    if (username === 'admin' && password === 'admin123') {
      // Create admin user if not in users list
      const users = JSON.parse(localStorage.getItem('kimcom_users') || '[]');
      const adminExists = users.some((user: any) => user.email === 'admin@kimcom.com');
      
      if (!adminExists) {
        const adminUser = {
          id: Date.now(),
          fullName: 'Admin User',
          email: 'admin@kimcom.com',
          password: 'admin123',
          role: 'admin'
        };
        users.push(adminUser);
        localStorage.setItem('kimcom_users', JSON.stringify(users));
        localStorage.setItem('kimcom_current_user', JSON.stringify(adminUser));
      } else {
        const adminUser = users.find((user: any) => user.email === 'admin@kimcom.com');
        localStorage.setItem('kimcom_current_user', JSON.stringify(adminUser));
      }
      
      toast.success('Login successful');
      navigate('/admin');
    } else {
      // Check if user exists and is an admin
      const users = JSON.parse(localStorage.getItem('kimcom_users') || '[]');
      const adminUser = users.find((user: any) => 
        user.email === username && 
        user.password === password && 
        user.role === 'admin'
      );
      
      if (adminUser) {
        localStorage.setItem('kimcom_current_user', JSON.stringify(adminUser));
        toast.success('Login successful');
        navigate('/admin');
      } else {
        toast.error('Invalid credentials or insufficient permissions');
      }
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
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username or Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10 w-full"
                      placeholder="Enter your username or email"
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
                
                <Button 
                  type="submit" 
                  className="w-full bg-kimcom-600 hover:bg-kimcom-700"
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
                
                <div className="text-center text-sm text-gray-500 mt-2">
                  <p>For demo use: username: admin, password: admin123</p>
                </div>
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
