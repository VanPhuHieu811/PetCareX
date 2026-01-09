import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserAccount, AuthState } from '../types';
import { MOCK_ACCOUNTS } from '../services/mockDataQL';
import { loginApi, registerApi } from "../api/authApi";
// Mở rộng interface AuthState để có thêm hàm register
interface AuthContextType extends AuthState {}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserAccount | null>(null);
  
  // Dùng state nội bộ để lưu danh sách tài khoản (bao gồm cả tài khoản mới đăng ký)
  const [accounts, setAccounts] = useState<UserAccount[]>(MOCK_ACCOUNTS);

  useEffect(() => {
    const storedUser = localStorage.getItem('petcare_user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await loginApi(email, password);

      if (!res.success) return false;

      const { user, token } = res.data;

      // Chuẩn hoá role cho FE (giữ logic điều hướng của bạn)
      const normalizedUser = {
        ...user,
        role: user.VaiTro ?? user.role, // ưu tiên VaiTro backend
      };

      setUser(normalizedUser);
      localStorage.setItem("petcare_user", JSON.stringify(normalizedUser));
      localStorage.setItem("petcare_token", token);

      return true;
    } catch (err) {
      return false;
    }
  };    


  const logout = () => {
    setUser(null);
    localStorage.removeItem("petcare_user");
    localStorage.removeItem("petcare_token");
  };

  // Hàm Đăng ký: Mặc định role là "Khách hàng" để khớp với ProtectedRoute
  const register = async (email: string, password: string, name: string, cccd: string): Promise<boolean> => {
    try {
      const res = await registerApi(email, password, name, cccd);
      return !!res?.success;
    } catch {
      return false;
    }
  };



  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};