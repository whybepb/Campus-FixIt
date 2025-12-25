// User Types
export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  studentId?: string;
  department?: string;
  phone?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Issue Types
export type IssueCategory = 'electrical' | 'water' | 'internet' | 'infrastructure' | 'other';

export type IssueStatus = 'open' | 'in_progress' | 'resolved';

export type IssuePriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Issue {
  id: string;
  _id?: string; // MongoDB ObjectId fallback
  title: string;
  description: string;
  category: IssueCategory;
  status: IssueStatus;
  priority: IssuePriority;
  imageUrl?: string;
  location: string;
  createdBy: string;
  createdByName?: string;
  reportedBy?: {
    id?: string;
    _id?: string;
    name: string;
    email: string;
    studentId?: string;
  };
  assignedTo?: string;
  remarks?: string;
  adminRemarks?: string;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateIssuePayload {
  title: string;
  description: string;
  category: IssueCategory;
  priority?: IssuePriority;
  imageUrl?: string;
  location: string;
}

export interface UpdateIssuePayload {
  status?: IssueStatus;
  priority?: IssuePriority;
  remarks?: string;
  assignedTo?: string;
}

// Auth Types
export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  email: string;
  password: string;
  name: string;
  studentId?: string;
  department?: string;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Filter Types
export interface IssueFilters {
  category?: IssueCategory;
  status?: IssueStatus;
  priority?: IssuePriority;
  search?: string;
}

// Navigation Types
export type RootStackParamList = {
  '(auth)': undefined;
  '(student)': undefined;
  '(admin)': undefined;
};

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
