import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

/**
 * Component to protect routes that require authentication
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  redirectTo = '/login',
  fallback,
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  // Show fallback or loading indicator while loading
  if (isLoading) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )
    );
  }

  // Redirect to login page if not authenticated
  if (!isAuthenticated) {
    router.push(redirectTo);
    return fallback || null;
  }

  // Check permissions if specific role is required
  if (requiredRole && user?.role !== requiredRole) {
    router.push('/unauthorized');
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
            <p className="text-gray-600">
              You don&apos;t have the required permissions to access this page.
            </p>
          </div>
        </div>
      )
    );
  }

  // Render children if authenticated and authorized
  return <>{children}</>;
};

/**
 * Component to protect routes that require admin role
 */
export const AdminRoute: React.FC<Omit<ProtectedRouteProps, 'requiredRole'>> = (props) => {
  return <ProtectedRoute {...props} requiredRole="admin" />;
};

/**
 * Component to protect routes that require user role
 */
export const UserRoute: React.FC<Omit<ProtectedRouteProps, 'requiredRole'>> = (props) => {
  return <ProtectedRoute {...props} requiredRole="user" />;
};
