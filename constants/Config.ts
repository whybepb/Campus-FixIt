import { IssueCategory, IssuePriority, IssueStatus } from '@/types';
import Colors from './Colors';

// App Configuration
export const APP_CONFIG = {
  name: 'Campus FixIt',
  version: '1.0.0',
  description: 'Campus Issue Reporting System',
};

// Issue Categories
export const ISSUE_CATEGORIES: {
  value: IssueCategory;
  label: string;
  icon: string;
  color: string;
}[] = [
    { value: 'electrical', label: 'Electrical', icon: 'flash', color: Colors.categoryElectrical },
    { value: 'water', label: 'Water', icon: 'water', color: Colors.categoryWater },
    { value: 'internet', label: 'Internet', icon: 'wifi', color: Colors.categoryInternet },
    { value: 'infrastructure', label: 'Infrastructure', icon: 'construct', color: Colors.categoryInfrastructure },
    { value: 'other', label: 'Other', icon: 'ellipsis-horizontal', color: Colors.categoryOther },
  ];

// Issue Statuses
export const ISSUE_STATUSES: {
  value: IssueStatus;
  label: string;
  color: string;
}[] = [
    { value: 'open', label: 'Open', color: Colors.statusOpen },
    { value: 'in_progress', label: 'In Progress', color: Colors.statusInProgress },
    { value: 'resolved', label: 'Resolved', color: Colors.statusResolved },
  ];

// Issue Priorities
export const ISSUE_PRIORITIES: {
  value: IssuePriority;
  label: string;
  color: string;
}[] = [
    { value: 'low', label: 'Low', color: Colors.priorityLow },
    { value: 'medium', label: 'Medium', color: Colors.priorityMedium },
    { value: 'high', label: 'High', color: Colors.priorityHigh },
    { value: 'urgent', label: 'Urgent', color: Colors.priorityUrgent },
  ];

// Helper functions
export const getCategoryConfig = (category: IssueCategory) =>
  ISSUE_CATEGORIES.find(c => c.value === category) || ISSUE_CATEGORIES[4];

export const getStatusConfig = (status: IssueStatus) =>
  ISSUE_STATUSES.find(s => s.value === status) || ISSUE_STATUSES[0];

export const getPriorityConfig = (priority: IssuePriority) =>
  ISSUE_PRIORITIES.find(p => p.value === priority) || ISSUE_PRIORITIES[0];

// API Configuration
// For physical device testing, replace 'localhost' with your computer's IP address
// Find your IP: Mac/Linux: `ifconfig` or `ip addr`, Windows: `ipconfig`
export const API_CONFIG = {
  baseUrl: 'http://10.51.3.206:3000/api',
  timeout: 10000,
};

// Storage Keys
export const STORAGE_KEYS = {
  authToken: '@auth_token',
  user: '@user',
  theme: '@theme',
  onboarded: '@onboarded',
};

// Validation Rules
export const VALIDATION = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password: {
    minLength: 6,
  },
  title: {
    minLength: 5,
    maxLength: 100,
  },
  description: {
    minLength: 10,
    maxLength: 500,
  },
};
