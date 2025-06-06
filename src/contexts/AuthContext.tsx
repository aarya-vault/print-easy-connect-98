
import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'customer' | 'shop_owner' | 'admin';

export interface User {
  id: string;
  phone: string;
  role: UserRole;
  name?: string;
  email?: string;
  shopId?: string; // For shop owners
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (phone: string) => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on app load
    const storedUser = localStorage.getItem('printeasy_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('printeasy_user');
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
      // Simulate API call for phone-based authentication
      const existingUsers = JSON.parse(localStorage.getItem('printeasy_all_users') || '[]');
      let userData = existingUsers.find((u: User) => u.phone === phone);
      
      if (!userData) {
        // Create new customer account automatically
        userData = {
          id: `user_${Date.now()}`,
          phone,
          role: 'customer' as UserRole,
          name: `Customer ${phone.slice(-4)}`,
        };
        existingUsers.push(userData);
        localStorage.setItem('printeasy_all_users', JSON.stringify(existingUsers));
      }
      
      setUser(userData);
      localStorage.setItem('printeasy_user', JSON.stringify(userData));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock shop owners and admin for demo
      const businessUsers = [
        {
          id: 'shop_1',
          email: 'shop@example.com',
          password: 'password',
          role: 'shop_owner' as UserRole,
          name: 'Print Shop Owner',
          shopId: 'shop_1',
          phone: '9876543210'
        },
        {
          id: 'admin_1',
          email: 'admin@printeasy.com',
          password: 'admin123',
          role: 'admin' as UserRole,
          name: 'PrintEasy Admin',
          phone: '9999999999'
        }
      ];
      
      const userData = businessUsers.find(u => u.email === email && u.password === password);
      
      if (!userData) {
        throw new Error('Invalid credentials');
      }
      
      // Remove password from stored user data
      const { password: _, ...userWithoutPassword } = userData;
      setUser(userWithoutPassword);
      localStorage.setItem('printeasy_user', JSON.stringify(userWithoutPassword));
    } catch (error) {
      console.error('Email login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
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
    isLoading,
    login,
    loginWithEmail,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
