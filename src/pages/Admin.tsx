import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from 'integrations/supabase/client';
import { isAdmin } from 'integrations/supabase/admin';
import AdminLayout from 'components/admin/AdminLayout';

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const hasRole = await isAdmin(session.user.id);
        if (hasRole) {
          setAuthenticated(true);
          setLoading(false);
          return;
        }
      }
      setAuthenticated(false);
      setLoading(false);
      navigate('/manage-7s8dF3k/login');
    };
    checkAuth();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!authenticated) {
    return null; // Redirect handled in useEffect
  }

  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
};

export default Admin;
