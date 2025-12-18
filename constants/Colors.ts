// App Colors
export const Colors = {
  primary: '#6366F1', // Indigo
  primaryDark: '#4F46E5',
  primaryLight: '#A5B4FC',
  
  secondary: '#10B981', // Emerald
  secondaryDark: '#059669',
  secondaryLight: '#6EE7B7',
  
  background: '#F9FAFB',
  surface: '#FFFFFF',
  surfaceVariant: '#F3F4F6',
  
  text: '#1F2937',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',
  textOnPrimary: '#FFFFFF',
  
  border: '#E5E7EB',
  divider: '#E5E7EB',
  
  error: '#EF4444',
  errorLight: '#FEE2E2',
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  info: '#3B82F6',
  infoLight: '#DBEAFE',
  
  // Status Colors
  statusOpen: '#F59E0B',
  statusInProgress: '#3B82F6',
  statusResolved: '#10B981',
  
  // Priority Colors
  priorityLow: '#6B7280',
  priorityMedium: '#F59E0B',
  priorityHigh: '#EF4444',
  priorityUrgent: '#DC2626',
  
  // Category Colors
  categoryElectrical: '#FBBF24',
  categoryWater: '#3B82F6',
  categoryInternet: '#8B5CF6',
  categoryInfrastructure: '#F97316',
  categoryOther: '#6B7280',
  
  overlay: 'rgba(0, 0, 0, 0.5)',
  shadow: 'rgba(0, 0, 0, 0.1)',
};

// Dark Mode Colors
export const DarkColors = {
  ...Colors,
  background: '#111827',
  surface: '#1F2937',
  surfaceVariant: '#374151',
  text: '#F9FAFB',
  textSecondary: '#D1D5DB',
  textLight: '#9CA3AF',
  border: '#374151',
  divider: '#374151',
};

export default Colors;
