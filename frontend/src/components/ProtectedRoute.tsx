import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-body text-secondary">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
}

// Admin route that allows john.mark.violette@icloud.com without requiring sign-in
// Just needs admin key stored in localStorage
export function AdminRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, student, loading } = useAuth();
  const ADMIN_EMAIL = 'john.mark.violette@icloud.com';
  const adminKey = localStorage.getItem('ucid_admin_key');

  // If authenticated and it's the admin email, allow access
  if (!loading && isAuthenticated && student?.email === ADMIN_EMAIL) {
    return <>{children}</>;
  }

  // If admin key exists, allow access (no sign-in required)
  // This allows direct access via /admin URL
  if (adminKey) {
    return <>{children}</>;
  }

  // Show loading while AuthContext initializes
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-body text-secondary">Loading...</p>
      </div>
    );
  }

  // If authenticated but not admin email, still allow if they have admin key
  // Otherwise, show the admin page anyway (they can enter admin key)
  return <>{children}</>;
}

