import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Props {
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<Props> = ({ allowedRoles = [] }) => {
  const { isAuthenticated, user } = useAuth();

  // Not logged in -> redirect to login
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // If allowedRoles provided, check user role
  if (allowedRoles.length > 0) {
    if (!user || !allowedRoles.includes(user.role)) {
      // Optionally show a '403' page or redirect to login/home
      return <Navigate to="/login" replace />;
    }
  }

  // Authorized -> render nested routes
  return <Outlet />;
};

export default ProtectedRoute;
