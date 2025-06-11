
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiService from '@/services/api';
import { User, UserRole } from '@/types/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isLoading: boolean; // Alias for compatibility
  token: string | null;
  login: (phone: string) => Promise<{ isNewUser?: boolean }>;
  emailLogin: (email: string, password: string) => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>; // Alias for compatibility
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
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        try {
          const response = await apiService.getCurrentUser();
          setUser(response.user);
          setToken(storedToken);
        } catch (error) {
          console.error('Failed to get current user:', error);
          localStorage.removeItem('authToken');
          setToken(null);
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
        setToken(response.token);
        setUser(response.user);
        return { isNewUser: response.isNewUser };
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
        setToken(response.token);
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

  // Alias for compatibility
  const loginWithEmail = emailLogin;

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
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
    token,
    login,
    emailLogin,
    loginWithEmail, // Alias for compatibility
    logout,
    updateProfile,
    updateUserName, // Alias for compatibility
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export type { UserRole };
