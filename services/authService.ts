import { LoginPayload, SignupPayload, AuthResponse, User } from '@/types';
import { apiClient } from './apiClient';

// Set to true to use mock data (no backend needed)
const USE_MOCK_API = false;

// Mock user data for development
const MOCK_USERS = {
  student: {
    id: '1',
    email: 'student@campus.edu',
    name: 'John Student',
    role: 'student' as const,
    studentId: 'STU001',
    department: 'Computer Science',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  admin: {
    id: '2',
    email: 'admin@campus.edu',
    name: 'Admin User',
    role: 'admin' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

// Mock implementation for testing
const mockAuthService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (payload.email === 'admin@campus.edu' && payload.password === 'admin123') {
      return { user: MOCK_USERS.admin, token: 'mock-admin-token' };
    }
    
    if (payload.email === 'student@campus.edu' && payload.password === 'student123') {
      return { user: MOCK_USERS.student, token: 'mock-student-token' };
    }
    
    throw new Error('Invalid email or password');
  },

  async signup(payload: SignupPayload): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newUser: User = {
      id: Date.now().toString(),
      email: payload.email,
      name: payload.name,
      role: 'student',
      studentId: payload.studentId,
      department: payload.department,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return { user: newUser, token: 'mock-token-' + Date.now() };
  },

  async logout(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
  },

  async forgotPassword(_email: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 1000));
  },

  async resetPassword(_token: string, _newPassword: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 1000));
  },

  async getCurrentUser(): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_USERS.student;
  },
};

// Real API implementation
const realAuthService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/login', payload, { requiresAuth: false });
  },

  async signup(payload: SignupPayload): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/signup', payload, { requiresAuth: false });
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      // Ignore errors on logout
    }
  },

  async forgotPassword(email: string): Promise<void> {
    await apiClient.post('/auth/forgot-password', { email }, { requiresAuth: false });
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await apiClient.post('/auth/reset-password', { token, newPassword }, { requiresAuth: false });
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<{ user: User }>('/auth/me');
    return response.user;
  },
};

export const authService = USE_MOCK_API ? mockAuthService : realAuthService;
