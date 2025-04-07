import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { User, Mail, Phone, MapPin, ShoppingBag } from 'lucide-react';

interface UserProfileProps {
  userId?: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    // If userId is provided, find that specific user
    // Otherwise, get the current logged in user
    const currentUser = localStorage.getItem('kimcom_current_user');
    
    if (currentUser) {
      setUser(JSON.parse(currentUser));
    }
  }, [userId]);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="bg-kimcom-600 h-32 flex items-center justify-center">
        <User className="h-16 w-16 text-white" />
      </div>
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-center mb-4">{user.fullName}</h2>
        
        <div className="space-y-3">
          <div className="flex items-center">
            <Mail className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-gray-700">{user.email}</span>
          </div>
          
          <div className="flex items-center">
            <User className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-gray-700 capitalize">{user.role || 'Customer'}</span>
          </div>
          
          {user.phone && (
            <div className="flex items-center">
              <Phone className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-gray-700">{user.phone}</span>
            </div>
          )}
          
          {user.address && (
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-gray-700">{user.address}</span>
            </div>
          )}
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="font-medium text-gray-900 mb-3">Account Options</h3>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start" onClick={() => toast.info('Feature coming soon!')}>
              <ShoppingBag className="h-4 w-4 mr-2" />
              Order History
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => toast.info('Feature coming soon!')}>
              <MapPin className="h-4 w-4 mr-2" />
              Update Address
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => toast.info('Feature coming soon!')}>
              <User className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
