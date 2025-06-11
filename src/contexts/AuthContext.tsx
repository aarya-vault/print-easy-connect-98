
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiService from '@/services/api';
import { User } from '@/types/api';

export type UserRole = 'customer' | 'shop_owner' | 'admin';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isLoading: boolean; // Alias for compatibility
  login: (phone: string) => Promise<void>;
  emailLogin: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (name: string) => Promise<void>;
  updateUserName: (name: string) => Promise<void>; // Alias for compatibility
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const response = await apiService.getCurrentUser();
          setUser(response.user);
        } catch (error) {
          console.error('Failed to get current user:', error);
          localStorage.removeItem('authToken');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (phone: string) => {
    try {
      setLoading(true);
      const response = await apiService.phoneLogin(phone);
      
      if (response.success && response.token && response.user) {
        localStorage.setItem('authToken', response.token);
        setUser(response.user);
      } else {
        throw new Error('Invalid login response');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const emailLogin = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await apiService.emailLogin(email, password);
      
      if (response.success && response.token && response.user) {
        localStorage.setItem('authToken', response.token);
        setUser(response.user);
      } else {
        throw new Error('Invalid login response');
      }
    } catch (error) {
      console.error('Email login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  const updateProfile = async (name: string) => {
    try {
      const response = await apiService.updateProfile(name);
      if (response.success && response.user) {
        setUser(response.user);
      }
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  };

  // Alias for compatibility
  const updateUserName = updateProfile;

  const value: AuthContextType = {
    user,
    loading,
    isLoading: loading, // Alias for compatibility
    login,
    emailLogin,
    logout,
    updateProfile,
    updateUserName,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
