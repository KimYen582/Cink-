import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedAdminRoute = () => {
  const { isLoaded, isLoggedIn, user } = useAuth();

  if (!isLoaded) {
    return <div className="flex justify-center items-center min-h-screen text-white">Loading...</div>;
  }

  if (isLoggedIn && user?.role === 'admin') {
    return <Outlet />;
  }

  return <Navigate to="/" replace />;
};

export default ProtectedAdminRoute;
