import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function ProtectedRoute({ children }) {
  const { isLoggedIn, isGuest } = useAuth();

  if (!isLoggedIn || isGuest) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
