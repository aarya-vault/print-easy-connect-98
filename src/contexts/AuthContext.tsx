
import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/services/api';

interface User {
  id: number;
  phone: string;
  name?: string;
  email?: string;
  role: 'customer' | 'shop_owner' | 'admin';
  is_active: boolean;
  shop_id?: number;
  shop_name?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (phone: string, password?: string, rememberMe?: boolean) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
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
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');
    
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (phone: string, password?: string, rememberMe: boolean = false) => {
    try {
      setIsLoading(true);
      
      // Try to login first
      let response;
      try {
        response = await api.post('/auth/login', { phone, password });
      } catch (loginError: any) {
        // If login fails and it's a customer (no password), try to register
        if (!password && loginError.response?.status === 401) {
          console.log('Customer not found, creating new account...');
          try {
            response = await api.post('/auth/register', { 
              phone, 
              role: 'customer',
              name: `Customer ${phone.slice(-4)}` // Default name
            });
          } catch (registerError: any) {
            console.error('Registration failed:', registerError);
            throw new Error('Failed to create account. Please try again.');
          }
        } else {
          throw loginError;
        }
      }

      const { token: authToken, user: userData } = response.data;
      
      setToken(authToken);
      setUser(userData);
      
      if (rememberMe) {
        localStorage.setItem('auth_token', authToken);
        localStorage.setItem('auth_user', JSON.stringify(userData));
      } else {
        sessionStorage.setItem('auth_token', authToken);
        sessionStorage.setItem('auth_user', JSON.stringify(userData));
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      throw new Error(error.response?.data?.error || error.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
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
    logout,
    updateUser,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
