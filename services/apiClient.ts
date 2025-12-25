import { API_CONFIG, STORAGE_KEYS } from '@/constants';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import { storageService } from './storageService';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
  requiresAuth?: boolean;
}

class ApiClient {
  private baseUrl: string;
  private isHandlingExpiry: boolean = false;

  constructor() {
    this.baseUrl = API_CONFIG.baseUrl;
  }

  private async getAuthToken(): Promise<string | null> {
    return await storageService.get(STORAGE_KEYS.authToken);
  }

  private async handleTokenExpiry(): Promise<void> {
    // Prevent multiple simultaneous expiry handlers
    if (this.isHandlingExpiry) return;
    this.isHandlingExpiry = true;

    try {
      // Clear stored auth data
      await storageService.remove(STORAGE_KEYS.authToken);
      await storageService.remove(STORAGE_KEYS.user);

      // Show alert and redirect to login
      Alert.alert(
        'Session Expired',
        'Your session has expired. Please log in again.',
        [
          {
            text: 'OK',
            onPress: () => {
              router.replace('/(auth)/login');
            },
          },
        ],
        { cancelable: false }
      );
    } finally {
      // Reset flag after a delay to allow for navigation
      setTimeout(() => {
        this.isHandlingExpiry = false;
      }, 2000);
    }
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const {
      method = 'GET',
      body,
      headers = {},
      requiresAuth = true,
    } = options;

    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    };

    if (requiresAuth) {
      const token = await this.getAuthToken();
      if (token) {
        requestHeaders['Authorization'] = `Bearer ${token}`;
      }
    }

    const config: RequestInit = {
      method,
      headers: requestHeaders,
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `Request failed with status ${response.status}`;

        // Check for token expiry
        if (response.status === 401 && (errorMessage === 'Token expired' || errorMessage === 'Invalid token')) {
          await this.handleTokenExpiry();
        }

        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error [${method} ${endpoint}]:`, error);
      throw error;
    }
  }

  get<T>(endpoint: string, options?: Omit<RequestOptions, 'method'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body });
  }

  put<T>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body });
  }

  patch<T>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body });
  }

  delete<T>(endpoint: string, options?: Omit<RequestOptions, 'method'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
