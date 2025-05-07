
import React, { useState, useEffect } from 'react';
import { UserCircle2, Lock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AuthLayout from '@/components/auth/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';

const Login: React.FC = () => {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  
  // Clear any reset links when leaving the page
  useEffect(() => {
    return () => {
      // Cleanup function
    };
  }, []);

  // Back to login from forgot password view
  const handleBackToLogin = () => {
    setShowForgotPassword(false);
  };

  // If showing the forgot password screen
  if (showForgotPassword) {
    return (
      <AuthLayout icon={<Lock className="h-8 w-8 text-kimcom-600" />} title="Reset Your Password">
        <ForgotPasswordForm onBackToLogin={handleBackToLogin} />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout icon={<UserCircle2 className="h-8 w-8 text-kimcom-600" />}>
      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <LoginForm onForgotPassword={() => setShowForgotPassword(true)} />
        </TabsContent>
        
        <TabsContent value="register">
          <RegisterForm />
        </TabsContent>
      </Tabs>
    </AuthLayout>
  );
};

export default Login;
