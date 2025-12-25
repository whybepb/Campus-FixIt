// Enhanced App Colors with Modern Design Tokens
export const Colors = {
  // Primary Palette - Vibrant Indigo with depth
  primary: '#6366F1',
  primaryDark: '#4F46E5',
  primaryLight: '#A5B4FC',
  primaryGradientStart: '#6366F1',
  primaryGradientEnd: '#8B5CF6',

  // Secondary Palette - Fresh Emerald
  secondary: '#10B981',
  secondaryDark: '#059669',
  secondaryLight: '#6EE7B7',
  secondaryGradientStart: '#10B981',
  secondaryGradientEnd: '#34D399',

  // Backgrounds with subtle warmth
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceVariant: '#F1F5F9',
  surfaceElevated: '#FFFFFF',

  // Text with better contrast
  text: '#0F172A',
  textSecondary: '#64748B',
  textLight: '#94A3B8',
  textOnPrimary: '#FFFFFF',

  // Borders and dividers
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  divider: '#E2E8F0',

  // Semantic Colors with vibrant tones
  error: '#EF4444',
  errorLight: '#FEE2E2',
  errorDark: '#DC2626',
  success: '#10B981',
  successLight: '#D1FAE5',
  successDark: '#059669',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  warningDark: '#D97706',
  info: '#3B82F6',
  infoLight: '#DBEAFE',
  infoDark: '#2563EB',

  // Status Colors - More vibrant
  statusOpen: '#F59E0B',
  statusInProgress: '#3B82F6',
  statusResolved: '#10B981',

  // Priority Colors
  priorityLow: '#64748B',
  priorityMedium: '#F59E0B',
  priorityHigh: '#EF4444',
  priorityUrgent: '#DC2626',

  // Category Colors - Richer palette
  categoryElectrical: '#F59E0B',
  categoryWater: '#0EA5E9',
  categoryInternet: '#8B5CF6',
  categoryInfrastructure: '#F97316',
  categoryOther: '#64748B',

  // Effects
  overlay: 'rgba(15, 23, 42, 0.6)',
  shadow: 'rgba(15, 23, 42, 0.08)',
  shadowStrong: 'rgba(15, 23, 42, 0.15)',

  // Accent colors for highlights
  accent: '#EC4899',
  accentLight: '#FCE7F3',

  // Glass effect background
  glass: 'rgba(255, 255, 255, 0.85)',
  glassDark: 'rgba(15, 23, 42, 0.85)',
};

// Dark Mode Colors - Rich and immersive
export const DarkColors = {
  ...Colors,
  background: '#0F172A',
  surface: '#1E293B',
  surfaceVariant: '#334155',
  surfaceElevated: '#1E293B',
  text: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textLight: '#94A3B8',
  border: '#334155',
  borderLight: '#1E293B',
  divider: '#334155',
  shadow: 'rgba(0, 0, 0, 0.3)',
  shadowStrong: 'rgba(0, 0, 0, 0.5)',
  glass: 'rgba(30, 41, 59, 0.85)',
  glassDark: 'rgba(15, 23, 42, 0.95)',
};

export default Colors;
