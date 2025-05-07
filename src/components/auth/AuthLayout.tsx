
import React from 'react';

interface AuthLayoutProps {
  icon: React.ReactNode;
  title?: string;
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ icon, title, children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white shadow-md rounded-lg border border-gray-200 p-6">
            <div className="flex justify-center mb-6">
              <div className="bg-kimcom-100 p-3 rounded-full">
                {icon}
              </div>
            </div>
            
            {title && <h2 className="text-xl font-semibold text-center mb-6">{title}</h2>}
            
            {children}
          </div>
        </div>
      </div>
      
      <div className="py-4 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} KimCom Solutions. All rights reserved.</p>
      </div>
    </div>
  );
};

export default AuthLayout;
