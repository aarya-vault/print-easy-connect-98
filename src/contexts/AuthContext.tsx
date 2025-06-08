
import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '@/services/api';

export type UserRole = 'customer' | 'shop_owner' | 'admin';

interface User {
  id: number;
  phone: string;
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
  login: (phone: string, password?: string, rememberMe?: boolean) => Promise<void>;
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
        response = await apiService.phoneLogin(phone);
      } catch (loginError: any) {
        // If login fails and it's a customer (no password), try to register
        if (!password && loginError.response?.status === 401) {
          console.log('Customer not found, creating new account...');
          try {
            // Create new customer account
            const registerResponse = await fetch('/api/auth/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                phone, 
                role: 'customer',
                name: `Customer ${phone.slice(-4)}`
              })
            });
            response = { data: await registerResponse.json() };
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

  const loginWithEmail = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await apiService.emailLogin(email, password);
      const { token: authToken, user: userData } = response;
      
      setToken(authToken);
      setUser(userData);
      
      localStorage.setItem('auth_token', authToken);
      localStorage.setItem('auth_user', JSON.stringify(userData));
    } catch (error: any) {
      console.error('Email login error:', error);
      throw new Error(error.response?.data?.error || error.message || 'Login failed');
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
