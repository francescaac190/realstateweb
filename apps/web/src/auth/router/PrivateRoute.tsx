import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function PrivateRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null; // or a full-page spinner

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
