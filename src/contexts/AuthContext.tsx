
import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '@/services/api';

export type UserRole = 'customer' | 'shop_owner' | 'admin';

interface User {
  id: number;
  phone?: string;
  name?: string;
  email?: string;
  role: UserRole;
  is_active: boolean;
  shop_id?: number;
  shop_name?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (phone: string) => Promise<{ isNewUser: boolean }>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  updateUserName: (name: string) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('auth_user') || sessionStorage.getItem('auth_user');
        
        if (storedToken && storedUser) {
          const userData = JSON.parse(storedUser);
          setToken(storedToken);
          setUser(userData);
          
          // Verify token is still valid
          try {
            await apiService.getCurrentUser();
          } catch (error) {
            console.warn('Stored token invalid, clearing auth state');
            logout();
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (phone: string): Promise<{ isNewUser: boolean }> => {
    try {
      setIsLoading(true);
      const response = await apiService.phoneLogin(phone);
      
      // Handle both nested and direct response structures
      const authToken = response?.token || response;
      const userData = response?.user || response;
      
      setToken(authToken);
      setUser(userData);
      
      // Store in localStorage for persistence
      localStorage.setItem('auth_token', authToken);
      localStorage.setItem('auth_user', JSON.stringify(userData));
      
      // Check if user name needs to be collected
      const isNewUser = userData.name?.includes('Customer') || !userData.name;
      
      return { isNewUser };
      
    } catch (error: any) {
      console.error('Phone login error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Phone login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await apiService.emailLogin(email, password);
      
      // Handle both nested and direct response structures
      const authToken = response?.token || response;
      const userData = response?.user || response;
      
      setToken(authToken);
      setUser(userData);
      
      // Store in localStorage for persistence
      localStorage.setItem('auth_token', authToken);
      localStorage.setItem('auth_user', JSON.stringify(userData));
      
    } catch (error: any) {
      console.error('Email login error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Email login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserName = async (name: string) => {
    try {
      await apiService.updateProfile(name);
      updateUser({ name });
    } catch (error: any) {
      console.error('Update name error:', error);
      throw new Error('Failed to update name');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_user');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      
      // Update stored user data
      const storedToken = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      if (storedToken) {
        if (localStorage.getItem('auth_token')) {
          localStorage.setItem('auth_user', JSON.stringify(updatedUser));
        } else {
          sessionStorage.setItem('auth_user', JSON.stringify(updatedUser));
        }
      }
    }
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    loginWithEmail,
    logout,
    updateUser,
    updateUserName,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
