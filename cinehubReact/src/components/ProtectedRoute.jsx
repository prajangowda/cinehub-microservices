import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

export function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return <div className="p-8 text-center text-white">Checking auth...</div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export function GuestRoute({ children }) {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return <div className="p-8 text-center text-white">Checking auth...</div>;
  }
  if (user) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export function AdminRoute({ children }) {
  const { user, isLoading, isAdmin } = useAuth();
  if (isLoading) {
    return <div className="p-8 text-center text-white">Checking auth...</div>;
  }
  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export function OwnerRoute({ children }) {
  const { user, isLoading, isOwner } = useAuth();
  if (isLoading) {
    return <div className="p-8 text-center text-white">Checking auth...</div>;
  }
  if (!user || !isOwner) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
