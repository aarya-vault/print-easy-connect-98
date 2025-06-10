
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = [], 
  redirectTo = '/login' 
}) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-golden-50 via-white to-golden-100">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-golden-500 to-golden-600 rounded-xl mx-auto mb-4 flex items-center justify-center shadow-lg animate-pulse">
            <span className="text-2xl font-bold text-white">PE</span>
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-golden-500 mx-auto"></div>
          <p className="text-neutral-600 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect based on user role
    const roleRedirects: Record<UserRole, string> = {
      customer: '/customer/dashboard',
      shop_owner: '/shop/dashboard',
      admin: '/admin/dashboard'
    };
    return <Navigate to={roleRedirects[user.role]} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
