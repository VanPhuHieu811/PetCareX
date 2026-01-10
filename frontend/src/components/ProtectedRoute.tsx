import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

interface Props {
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<Props> = ({ allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="text-center">
            {/* Nếu không có icon Loader2 thì dùng text "Đang tải..." */}
            <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto" />
            <p className="mt-2 text-gray-500">Đang kiểm tra đăng nhập...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0) {
    if (!user || !allowedRoles.includes(user.role)) {
      return <Navigate to="/login" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;