import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserAccount, AuthState, Role } from '../types';
import { MOCK_ACCOUNTS } from '../services/mockData';

// Mở rộng interface AuthState để có thêm hàm register
interface AuthContextType extends AuthState {
  register: (username: string, password: string, displayName: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserAccount | null>(null);
  
  // Dùng state nội bộ để lưu danh sách tài khoản (bao gồm cả tài khoản mới đăng ký)
  const [accounts, setAccounts] = useState<UserAccount[]>(MOCK_ACCOUNTS);

  useEffect(() => {
    const storedUser = localStorage.getItem('petcare_user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Fake delay
    const foundUser = accounts.find(u => u.username === username && u.password === password);
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('petcare_user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('petcare_user');
  };

  // Hàm Đăng ký: Mặc định role là CUSTOMER
  const register = async (username: string, password: string, displayName: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 800)); // Fake delay
    
    // Kiểm tra trùng username
    if (accounts.some(u => u.username === username)) {
      return false; 
    }

    const newUser: UserAccount = {
      username,
      password,
      displayName,
      role: 'CUSTOMER', // MẶC ĐỊNH LÀ KHÁCH HÀNG
      linkedId: `KHNew${Date.now()}` // Fake ID
    };

    setAccounts([...accounts, newUser]); // Cập nhật danh sách tài khoản tạm thời
    return true;
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