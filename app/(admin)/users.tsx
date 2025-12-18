import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Header, LoadingSpinner, EmptyState, UserAvatar } from '@/components';
import Colors from '@/constants/Colors';
import { User } from '@/types';

// Mock data for users (will be replaced with API call)
const MOCK_USERS: User[] = [
  { id: '1', name: 'John Doe', email: 'john@campus.edu', role: 'student', studentId: 'STU001', department: 'Computer Science', createdAt: new Date(), updatedAt: new Date() },
  { id: '2', name: 'Jane Smith', email: 'jane@campus.edu', role: 'student', studentId: 'STU002', department: 'Engineering', createdAt: new Date(), updatedAt: new Date() },
  { id: '3', name: 'Bob Wilson', email: 'bob@campus.edu', role: 'student', studentId: 'STU003', department: 'Business', createdAt: new Date(), updatedAt: new Date() },
  { id: '4', name: 'Alice Brown', email: 'alice@campus.edu', role: 'admin', createdAt: new Date(), updatedAt: new Date() },
];

export default function AdminUsersScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUsers(MOCK_USERS);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.studentId?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const studentCount = users.filter(u => u.role === 'student').length;
  const adminCount = users.filter(u => u.role === 'admin').length;

  const renderUser = ({ item }: { item: User }) => (
    <TouchableOpacity style={styles.userCard} activeOpacity={0.7}>
      <UserAvatar user={item} size="medium" />
      <View style={styles.userInfo}>
        <View style={styles.userNameRow}>
          <Text style={styles.userName}>{item.name}</Text>
          <View style={[styles.roleBadge, item.role === 'admin' && styles.adminBadge]}>
            <Text style={[styles.roleText, item.role === 'admin' && styles.adminText]}>
              {item.role === 'admin' ? 'Admin' : 'Student'}
            </Text>
          </View>
        </View>
        <Text style={styles.userEmail}>{item.email}</Text>
        {item.studentId && (
          <Text style={styles.userDetail}>ID: {item.studentId} • {item.department}</Text>
        )}
      </View>
      <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Users" showBack subtitle={`${users.length} total users`} />
      
      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search users..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={Colors.textLight}
        />
        {searchQuery.length > 0 && (
          <Ionicons
            name="close-circle"
            size={20}
            color={Colors.textSecondary}
            onPress={() => setSearchQuery('')}
          />
        )}
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="school" size={20} color={Colors.primary} />
          <Text style={styles.statNumber}>{studentCount}</Text>
          <Text style={styles.statLabel}>Students</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="shield-checkmark" size={20} color={Colors.secondary} />
          <Text style={styles.statNumber}>{adminCount}</Text>
          <Text style={styles.statLabel}>Admins</Text>
        </View>
      </View>

      {/* Users List */}
      {isLoading ? (
        <LoadingSpinner fullScreen text="Loading users..." />
      ) : (
        <FlatList
          data={filteredUsers}
          renderItem={renderUser}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={fetchUsers} />
          }
          ListEmptyComponent={
            <EmptyState
              icon="people-outline"
              title="No Users Found"
              description="Try adjusting your search query."
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceVariant,
    marginHorizontal: 20,
    marginVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.text,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
    flexGrow: 1,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  roleBadge: {
    backgroundColor: Colors.surfaceVariant,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  adminBadge: {
    backgroundColor: Colors.primaryLight + '30',
  },
  roleText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  adminText: {
    color: Colors.primary,
  },
  userEmail: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  userDetail: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 2,
  },
});
