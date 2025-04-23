
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const UserSettings: React.FC = () => {
  const navigate = useNavigate();

  // These would typically be forms to update user info, and display orders
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6 mt-6">
      <h2 className="text-2xl font-bold mb-4">Account Settings</h2>
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Profile Info</h3>
          <Button disabled variant="outline" className="mb-2 w-full">Update Profile (Coming soon)</Button>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Orders</h3>
          <Button disabled variant="outline" className="mb-2 w-full">View Orders (Coming soon)</Button>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Address</h3>
          <Button disabled variant="outline" className="mb-2 w-full">Update Address (Coming soon)</Button>
        </div>
      </div>
      <div className="mt-6">
        <Button variant="default" onClick={() => navigate('/profile')}>Go back to Profile</Button>
      </div>
    </div>
  );
};

export default UserSettings;
