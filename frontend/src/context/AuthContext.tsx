import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserAccount, AuthState } from '../types';
import { loginApi, registerApi } from "../api/authApi";

// 1. Thêm loading vào Interface
interface AuthContextType extends AuthState {
  loading: boolean; // <--- Thêm dòng này
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserAccount | null>(null);
  // 2. Thêm state loading, mặc định là TRUE (đang tải)
  const [loading, setLoading] = useState<boolean>(true); 

  useEffect(() => {
    const checkUser = async () => {
      try {
        const storedUser = localStorage.getItem('petcare_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Lỗi đọc local storage", error);
      } finally {
        // 3. QUAN TRỌNG: Dù có user hay không, sau khi check xong thì tắt loading
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await loginApi(email, password);
      if (!res.success) return false;

      const { user, token } = res.data;
      const normalizedUser = {
        ...user,
        role: user.VaiTro ?? user.role,
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

  const register = async (email: string, password: string, name: string, cccd: string): Promise<boolean> => {
    try {
      const res = await registerApi(email, password, name, cccd);
      return !!res?.success;
    } catch {
      return false;
    }
  };

  return (
    // 4. Truyền loading xuống Provider
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};