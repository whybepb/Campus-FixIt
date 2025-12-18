import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginPayload, SignupPayload, AuthResponse } from '@/types';
import { authService } from '@/services/authService';
import { storageService } from '@/services/storageService';
import { STORAGE_KEYS } from '@/constants';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<User>;
  signup: (payload: SignupPayload) => Promise<User>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await storageService.get(STORAGE_KEYS.authToken);
      const storedUser = await storageService.get(STORAGE_KEYS.user);
      
      if (token && storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (payload: LoginPayload): Promise<User> => {
    try {
      setIsLoading(true);
      const response: AuthResponse = await authService.login(payload);
      
      await storageService.set(STORAGE_KEYS.authToken, response.token);
      await storageService.set(STORAGE_KEYS.user, JSON.stringify(response.user));
      
      setUser(response.user);
      return response.user;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (payload: SignupPayload): Promise<User> => {
    try {
      setIsLoading(true);
      const response: AuthResponse = await authService.signup(payload);
      
      await storageService.set(STORAGE_KEYS.authToken, response.token);
      await storageService.set(STORAGE_KEYS.user, JSON.stringify(response.user));
      
      setUser(response.user);
      return response.user;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      await storageService.remove(STORAGE_KEYS.authToken);
      await storageService.remove(STORAGE_KEYS.user);
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    storageService.set(STORAGE_KEYS.user, JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
