import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Header, LoadingSpinner, EmptyState, UserAvatar } from '@/components';
import Colors from '@/constants/Colors';
import { User } from '@/types';
import { apiClient } from '@/services/apiClient';

export default function AdminUsersScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get<{ users: User[] }>('/users');
      setUsers(response.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleUserRole = async (user: User) => {
    const newRole = user.role === 'admin' ? 'student' : 'admin';
    const action = newRole === 'admin' ? 'Make Admin' : 'Make Student';
    
    Alert.alert(
      action,
      `Are you sure you want to make ${user.name} ${newRole === 'admin' ? 'an admin' : 'a student'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: action,
          style: newRole === 'admin' ? 'default' : 'destructive',
          onPress: async () => {
            try {
              setUpdatingUserId(user.id || (user as any)._id);
              await apiClient.put(`/users/${user.id || (user as any)._id}/role`, { role: newRole });
              
              // Update local state
              setUsers(prev => prev.map(u => 
                (u.id || (u as any)._id) === (user.id || (user as any)._id) 
                  ? { ...u, role: newRole } 
                  : u
              ));
              
              Alert.alert('Success', `${user.name} is now ${newRole === 'admin' ? 'an admin' : 'a student'}.`);
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to update user role.');
            } finally {
              setUpdatingUserId(null);
            }
          },
        },
      ]
    );
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

  const renderUser = ({ item }: { item: User }) => {
    const isUpdating = updatingUserId === (item.id || (item as any)._id);
    
    return (
      <View style={styles.userCard}>
        <View style={styles.userRow}>
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
        </View>
        
        {/* Role Toggle Button */}
        <TouchableOpacity
          style={[
            styles.roleButton,
            item.role === 'admin' ? styles.demoteButton : styles.promoteButton,
            isUpdating && styles.disabledButton,
          ]}
          onPress={() => toggleUserRole(item)}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <Text style={styles.roleButtonText}>...</Text>
          ) : (
            <>
              <Ionicons 
                name={item.role === 'admin' ? 'person-outline' : 'shield-checkmark-outline'} 
                size={14} 
                color="#fff" 
              />
              <Text style={styles.roleButtonText}>
                {item.role === 'admin' ? 'Make Student' : 'Make Admin'}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    );
  };

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
    flexDirection: 'column',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
  roleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 12,
    gap: 6,
  },
  promoteButton: {
    backgroundColor: Colors.primary,
  },
  demoteButton: {
    backgroundColor: Colors.warning,
  },
  disabledButton: {
    opacity: 0.6,
  },
  roleButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
