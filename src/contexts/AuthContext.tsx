
import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '@/services/api';

export type UserRole = 'customer' | 'shop_owner' | 'admin';

export interface User {
  id: string;
  phone?: string;
  email?: string;
  role: UserRole;
  name?: string;
  shopId?: string;
  shopName?: string;
  needsNameUpdate?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (phone: string) => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  updateUserName: (name: string) => Promise<void>;
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
    // Check for existing token on app load
    const storedToken = localStorage.getItem('printeasy_token');
    const storedUser = localStorage.getItem('printeasy_user');
    
    if (storedToken && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setToken(storedToken);
        
        // Verify token is still valid by fetching profile
        apiService.getProfile()
          .then(response => {
            if (response.success) {
              setUser(response.user);
              localStorage.setItem('printeasy_user', JSON.stringify(response.user));
            }
          })
          .catch(() => {
            // Token invalid, clear storage
            localStorage.removeItem('printeasy_token');
            localStorage.removeItem('printeasy_user');
            setUser(null);
            setToken(null);
          });
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('printeasy_token');
        localStorage.removeItem('printeasy_user');
        setToken(null);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (phone: string) => {
    // Validate phone number - must be exactly 10 digits
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      throw new Error('Phone number must be exactly 10 digits');
    }

    setIsLoading(true);
    try {
      const response = await apiService.phoneLogin(phone);
      
      if (response.success) {
        const { token: authToken, user: userData } = response;
        
        localStorage.setItem('printeasy_token', authToken);
        localStorage.setItem('printeasy_user', JSON.stringify(userData));
        setUser(userData);
        setToken(authToken);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.error || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiService.emailLogin(email, password);
      
      if (response.success) {
        const { token: authToken, user: userData } = response;
        
        localStorage.setItem('printeasy_token', authToken);
        localStorage.setItem('printeasy_user', JSON.stringify(userData));
        setUser(userData);
        setToken(authToken);
      }
    } catch (error: any) {
      console.error('Email login error:', error);
      throw new Error(error.response?.data?.error || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserName = async (name: string) => {
    if (!user) return;
    
    try {
      const response = await apiService.updateProfile(name);
      
      if (response.success) {
        const updatedUser = { ...user, ...response.user, needsNameUpdate: false };
        setUser(updatedUser);
        localStorage.setItem('printeasy_user', JSON.stringify(updatedUser));
      }
    } catch (error: any) {
      console.error('Update name error:', error);
      throw new Error(error.response?.data?.error || 'Update failed');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('printeasy_token');
    localStorage.removeItem('printeasy_user');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('printeasy_user', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    loginWithEmail,
    logout,
    updateUser,
    updateUserName,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
