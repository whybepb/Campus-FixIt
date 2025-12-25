import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginPayload, SignupPayload, AuthResponse } from '@/types';
import { authService } from '@/services/authService';
import { storageService } from '@/services/storageService';
import { STORAGE_KEYS } from '@/constants';
import { 
  requestNotificationPermissions,
  addNotificationResponseListener,
  removeNotificationSubscription,
  clearStatusCache,
} from '@/services/notificationService';
import { router } from 'expo-router';

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

  // Check auth on mount and request notification permissions
  useEffect(() => {
    const init = async () => {
      // Request notification permissions immediately on app start
      await requestNotificationPermissions();
      await checkAuth();
    };
    init();
  }, []);

  // Set up notification tap listener
  useEffect(() => {
    // Handle notification response (user tapped notification)
    const responseListener = addNotificationResponseListener((response) => {
      const data = response.notification.request.content.data;
      console.log('Notification tapped:', data);
      
      // Navigate to issue details if issueId is present
      if (data?.issueId && user) {
        if (user.role === 'admin') {
          router.push({ pathname: '/(admin)/issue/[id]', params: { id: data.issueId as string } });
        } else {
          router.push({ pathname: '/(student)/issue/[id]', params: { id: data.issueId as string } });
        }
      }
    });

    return () => {
      removeNotificationSubscription(responseListener);
    };
  }, [user]);

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
      // Clear notification status cache on logout
      await clearStatusCache();
      
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
