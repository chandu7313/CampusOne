import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, isAuthenticated, _hasHydrated } = useAuthStore();

  if (!_hasHydrated) {
    return <div className="glass" style={{ padding: '24px', margin: '20px', textAlign: 'center' }}>Loading session...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
