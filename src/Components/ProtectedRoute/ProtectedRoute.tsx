import { Navigate } from 'react-router-dom';
import { useAuth } from '../../Contexts/AuthContext';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};