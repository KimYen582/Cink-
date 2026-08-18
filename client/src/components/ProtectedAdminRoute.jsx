import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import api from '../services/api';

const getUserRole = (user) => {
  const role = user?.publicMetadata?.role ?? user?.privateMetadata?.role ?? user?.unsafeMetadata?.role;

  if (typeof role === 'string') {
    return role.toLowerCase();
  }

  return 'user';
};

const ProtectedAdminRoute = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [localUser, setLocalUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLocalAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const data = await api.get('/auth/me', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          if (data.success) {
            setLocalUser(data.user);
          }
        } catch (error) {
          console.error('Auth check failed:', error);
        }
      }
      setIsLoading(false);
    };

    if (isLoaded) {
      checkLocalAuth();
    }
  }, [isLoaded]);

  if (!isLoaded || isLoading) {
    return <div className="flex justify-center items-center min-h-screen text-white">Loading...</div>;
  }

  // Check Clerk auth
  if (isSignedIn && user) {
    if (getUserRole(user) === 'admin') {
      return <Outlet />;
    }
  }

  // Check local token auth
  if (localUser && localUser.role === 'admin') {
    return <Outlet />;
  }

  // Not authorized
  if (isSignedIn || localUser) {
    return <Navigate to="/" replace />;
  }

  // Not logged in
  return <Navigate to="/" replace />;
};

export default ProtectedAdminRoute;
