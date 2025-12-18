import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { UserAvatar } from '@/components';
import { useAuth, useIssues } from '@/context';
import Colors from '@/constants/Colors';
import { ISSUE_STATUSES, ISSUE_CATEGORIES } from '@/constants';

export default function AdminDashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { issues, isLoading, fetchIssues } = useIssues();

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  const getStatusCounts = () => {
    return {
      open: issues.filter(i => i.status === 'open').length,
      in_progress: issues.filter(i => i.status === 'in_progress').length,
      resolved: issues.filter(i => i.status === 'resolved').length,
      total: issues.length,
    };
  };

  const getCategoryCounts = () => {
    return ISSUE_CATEGORIES.map(cat => ({
      ...cat,
      count: issues.filter(i => i.category === cat.value).length,
    }));
  };

  const statusCounts = getStatusCounts();
  const categoryCounts = getCategoryCounts();
  const recentIssues = issues.slice(0, 5);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={fetchIssues} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Admin Dashboard</Text>
            <Text style={styles.subtitle}>Welcome back, {user?.name?.split(' ')[0]}!</Text>
          </View>
          <UserAvatar user={user} size="medium" onPress={() => router.push('/(admin)/settings')} />
        </View>

        {/* Stats Overview */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, styles.statCardLarge]}>
            <Ionicons name="documents" size={28} color={Colors.primary} />
            <Text style={styles.statNumber}>{statusCounts.total}</Text>
            <Text style={styles.statLabel}>Total Issues</Text>
          </View>
          
          {ISSUE_STATUSES.map((status) => (
            <TouchableOpacity
              key={status.value}
              style={styles.statCard}
              onPress={() => router.push(`/(admin)/issues?status=${status.value}`)}
            >
              <View style={[styles.statIndicator, { backgroundColor: status.color }]} />
              <Text style={styles.statNumber}>
                {statusCounts[status.value as keyof typeof statusCounts]}
              </Text>
              <Text style={styles.statLabel}>{status.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/(admin)/issues')}
            >
              <View style={[styles.actionIcon, { backgroundColor: Colors.primary + '20' }]}>
                <Ionicons name="list" size={24} color={Colors.primary} />
              </View>
              <Text style={styles.actionLabel}>All Issues</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/(admin)/issues?status=open')}
            >
              <View style={[styles.actionIcon, { backgroundColor: Colors.statusOpen + '20' }]}>
                <Ionicons name="alert-circle" size={24} color={Colors.statusOpen} />
              </View>
              <Text style={styles.actionLabel}>Pending</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/(admin)/users')}
            >
              <View style={[styles.actionIcon, { backgroundColor: Colors.secondary + '20' }]}>
                <Ionicons name="people" size={24} color={Colors.secondary} />
              </View>
              <Text style={styles.actionLabel}>Users</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/(admin)/settings')}
            >
              <View style={[styles.actionIcon, { backgroundColor: Colors.textSecondary + '20' }]}>
                <Ionicons name="settings" size={24} color={Colors.textSecondary} />
              </View>
              <Text style={styles.actionLabel}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Category Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Issues by Category</Text>
          <View style={styles.categoryList}>
            {categoryCounts.map((cat) => (
              <TouchableOpacity
                key={cat.value}
                style={styles.categoryItem}
                onPress={() => router.push(`/(admin)/issues?category=${cat.value}`)}
              >
                <View style={styles.categoryLeft}>
                  <View style={[styles.categoryIcon, { backgroundColor: cat.color + '20' }]}>
                    <Ionicons name={cat.icon as any} size={20} color={cat.color} />
                  </View>
                  <Text style={styles.categoryLabel}>{cat.label}</Text>
                </View>
                <View style={styles.categoryRight}>
                  <Text style={styles.categoryCount}>{cat.count}</Text>
                  <Ionicons name="chevron-forward" size={16} color={Colors.textLight} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Issues */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Issues</Text>
            <TouchableOpacity onPress={() => router.push('/(admin)/issues')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.recentList}>
            {recentIssues.map((issue) => {
              const statusConfig = ISSUE_STATUSES.find(s => s.value === issue.status);
              return (
                <TouchableOpacity
                  key={issue.id}
                  style={styles.recentItem}
                  onPress={() => router.push(`/(admin)/issue/${issue.id}`)}
                >
                  <View style={[styles.recentDot, { backgroundColor: statusConfig?.color }]} />
                  <View style={styles.recentContent}>
                    <Text style={styles.recentTitle} numberOfLines={1}>{issue.title}</Text>
                    <Text style={styles.recentMeta}>
                      {issue.createdByName || 'Unknown'} • {new Date(issue.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={Colors.textLight} />
                </TouchableOpacity>
              );
            })}
          </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
  },
  statCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    minWidth: '30%',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statCardLarge: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 16,
  },
  statIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
  },
  seeAll: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
  },
  categoryList: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.text,
  },
  categoryRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryCount: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  recentList: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  recentDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  recentContent: {
    flex: 1,
  },
  recentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  recentMeta: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});
