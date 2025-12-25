import { Header, UserAvatar } from '@/components';
import Colors from '@/constants/Colors';
import { useAuth } from '@/context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface MenuItem {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  description?: string;
  onPress: () => void;
  color?: string;
  danger?: boolean;
}

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          }
        },
      ]
    );
  };

  const menuItems: MenuItem[] = [
    {
      icon: 'person-outline',
      label: 'Edit Profile',
      description: 'Update your information',
      onPress: () => router.push('/(student)/edit-profile'),
      color: Colors.primary,
    },
    {
      icon: 'document-text-outline',
      label: 'My Issues',
      description: 'View all your reported issues',
      onPress: () => router.push('/(student)/my-issues'),
      color: Colors.info,
    },
    {
      icon: 'help-circle-outline',
      label: 'Help & Support',
      description: 'Get assistance',
      onPress: () => Alert.alert('Help', 'Contact support@campusfixit.com for assistance.'),
      color: Colors.secondary,
    },
    {
      icon: 'information-circle-outline',
      label: 'About',
      description: 'App version and info',
      onPress: () => Alert.alert('Campus FixIt', 'Version 1.0.0\n\nA campus issue reporting system.'),
      color: Colors.textSecondary,
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Profile" showBack />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Header Card */}
        <View style={styles.profileCard}>
          <LinearGradient
            colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.profileGradient}
          >
            <View style={styles.avatarWrapper}>
              <View style={styles.avatarBorder}>
                <UserAvatar user={user} size="large" />
              </View>
            </View>
            <Text style={styles.profileName}>{user?.name || 'Student'}</Text>
            <Text style={styles.profileEmail}>{user?.email || ''}</Text>

            {user?.studentId && (
              <View style={styles.studentIdBadge}>
                <Ionicons name="card" size={14} color={Colors.textOnPrimary} />
                <Text style={styles.studentIdText}>{user.studentId}</Text>
              </View>
            )}
          </LinearGradient>
        </View>

        {/* User Info */}
        {(user?.department || user?.phone) && (
          <View style={styles.infoCard}>
            <Text style={styles.infoCardTitle}>Personal Information</Text>
            {user.department && (
              <View style={styles.infoItem}>
                <View style={styles.infoIconBg}>
                  <Ionicons name="school-outline" size={18} color={Colors.primary} />
                </View>
                <View>
                  <Text style={styles.infoLabel}>Department</Text>
                  <Text style={styles.infoValue}>{user.department}</Text>
                </View>
              </View>
            )}
            {user.phone && (
              <View style={styles.infoItem}>
                <View style={styles.infoIconBg}>
                  <Ionicons name="call-outline" size={18} color={Colors.secondary} />
                </View>
                <View>
                  <Text style={styles.infoLabel}>Phone</Text>
                  <Text style={styles.infoValue}>{user.phone}</Text>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <Text style={styles.menuSectionTitle}>Settings</Text>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                index < menuItems.length - 1 && styles.menuItemBorder,
              ]}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: (item.color || Colors.primary) + '15' }]}>
                  <Ionicons
                    name={item.icon}
                    size={20}
                    color={item.color || Colors.primary}
                  />
                </View>
                <View style={styles.menuTextContainer}>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  {item.description && (
                    <Text style={styles.menuDescription}>{item.description}</Text>
                  )}
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
          <View style={styles.logoutIcon}>
            <Ionicons name="log-out-outline" size={20} color={Colors.error} />
          </View>
          <Text style={styles.logoutText}>Logout</Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.error} />
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Campus FixIt v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  profileCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  profileGradient: {
    padding: 28,
    alignItems: 'center',
  },
  avatarWrapper: {
    marginBottom: 16,
  },
  avatarBorder: {
    padding: 4,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textOnPrimary,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: Colors.textOnPrimary,
    opacity: 0.9,
    marginBottom: 12,
  },
  studentIdBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  studentIdText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textOnPrimary,
  },
  infoCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  infoCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 16,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 10,
  },
  infoIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  menuContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  menuSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    padding: 16,
    paddingBottom: 8,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  menuIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTextContainer: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  menuDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.errorLight,
    borderRadius: 16,
    padding: 16,
    gap: 14,
  },
  logoutIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: Colors.error + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.error,
  },
  footer: {
    marginTop: 32,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: Colors.textLight,
  },
});
