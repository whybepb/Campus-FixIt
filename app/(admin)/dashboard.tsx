import { EmptyState, IssueCard, LoadingSpinner, UserAvatar } from '@/components';
import { ISSUE_CATEGORIES, ISSUE_STATUSES } from '@/constants';
import Colors from '@/constants/Colors';
import { useAuth, useIssues } from '@/context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Dimensions, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function AdminDashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { issues, isLoading, fetchIssues, filters, setFilters } = useIssues();

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  const getStatusCounts = () => {
    return {
      open: issues.filter(i => i.status === 'open').length,
      in_progress: issues.filter(i => i.status === 'in_progress').length,
      resolved: issues.filter(i => i.status === 'resolved').length,
    };
  };

  const getCategoryCounts = () => {
    return ISSUE_CATEGORIES.reduce((acc, cat) => {
      acc[cat.value] = issues.filter(i => i.category === cat.value).length;
      return acc;
    }, {} as Record<string, number>);
  };

  const statusCounts = getStatusCounts();
  const categoryCounts = getCategoryCounts();
  const recentIssues = issues.slice(0, 4);
  const pendingCount = statusCounts.open + statusCounts.in_progress;

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
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>Admin Dashboard</Text>
            <Text style={styles.userName}>Welcome back 👋</Text>
          </View>
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={() => router.push('/(admin)/settings')}
            activeOpacity={0.8}
          >
            <UserAvatar user={user} size="medium" />
          </TouchableOpacity>
        </View>

        {/* Overview Stats */}
        <View style={styles.overviewSection}>
          <TouchableOpacity
            style={styles.overviewCardMain}
            onPress={() => router.push('/(admin)/issues')}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.overviewGradient}
            >
              <View style={styles.overviewContent}>
                <View style={styles.overviewIconContainer}>
                  <Ionicons name="layers" size={28} color={Colors.textOnPrimary} />
                </View>
                <View style={styles.overviewTextContainer}>
                  <Text style={styles.overviewNumber}>{issues.length}</Text>
                  <Text style={styles.overviewLabel}>Total Issues</Text>
                </View>
              </View>
              <View style={styles.overviewBadge}>
                <Text style={styles.overviewBadgeText}>{pendingCount} pending</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Status Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status Overview</Text>
          <View style={styles.statusGrid}>
            {ISSUE_STATUSES.map((status) => (
              <TouchableOpacity
                key={status.value}
                style={styles.statusCard}
                onPress={() => {
                  setFilters({ ...filters, status: status.value });
                  router.push('/(admin)/issues');
                }}
                activeOpacity={0.8}
              >
                <View style={[styles.statusIndicatorLarge, { backgroundColor: status.color }]} />
                <View style={styles.statusCardContent}>
                  <Text style={styles.statusCardNumber}>
                    {statusCounts[status.value as keyof typeof statusCounts]}
                  </Text>
                  <Text style={styles.statusCardLabel}>{status.label}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={Colors.textLight} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/(admin)/issues')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[Colors.warning + '20', Colors.warning + '08']}
                style={styles.actionCardGradient}
              >
                <View style={[styles.actionIconBg, { backgroundColor: Colors.warning + '25' }]}>
                  <Ionicons name="alert-circle" size={22} color={Colors.warning} />
                </View>
                <Text style={styles.actionCardTitle}>Pending</Text>
                <Text style={styles.actionCardNumber}>{statusCounts.open}</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => {
                setFilters({ ...filters, status: 'in_progress' });
                router.push('/(admin)/issues');
              }}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[Colors.info + '20', Colors.info + '08']}
                style={styles.actionCardGradient}
              >
                <View style={[styles.actionIconBg, { backgroundColor: Colors.info + '25' }]}>
                  <Ionicons name="construct" size={22} color={Colors.info} />
                </View>
                <Text style={styles.actionCardTitle}>In Progress</Text>
                <Text style={styles.actionCardNumber}>{statusCounts.in_progress}</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/(admin)/users')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[Colors.secondary + '20', Colors.secondary + '08']}
                style={styles.actionCardGradient}
              >
                <View style={[styles.actionIconBg, { backgroundColor: Colors.secondary + '25' }]}>
                  <Ionicons name="people" size={22} color={Colors.secondary} />
                </View>
                <Text style={styles.actionCardTitle}>Users</Text>
                <Text style={styles.actionCardSubtitle}>Manage</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/(admin)/settings')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[Colors.textSecondary + '20', Colors.textSecondary + '08']}
                style={styles.actionCardGradient}
              >
                <View style={[styles.actionIconBg, { backgroundColor: Colors.textSecondary + '25' }]}>
                  <Ionicons name="settings" size={22} color={Colors.textSecondary} />
                </View>
                <Text style={styles.actionCardTitle}>Settings</Text>
                <Text style={styles.actionCardSubtitle}>Configure</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Category Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>By Category</Text>
          <View style={styles.categoryList}>
            {ISSUE_CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.value}
                style={styles.categoryRow}
                onPress={() => {
                  setFilters({ ...filters, category: category.value as any });
                  router.push('/(admin)/issues');
                }}
                activeOpacity={0.7}
              >
                <View style={styles.categoryRowLeft}>
                  <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
                  <Text style={styles.categoryRowLabel}>{category.label}</Text>
                </View>
                <View style={styles.categoryRowRight}>
                  <Text style={styles.categoryRowCount}>{categoryCounts[category.value] || 0}</Text>
                  <Ionicons name="chevron-forward" size={16} color={Colors.textLight} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Issues */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Recent Issues</Text>
            {recentIssues.length > 0 && (
              <TouchableOpacity
                onPress={() => router.push('/(admin)/issues')}
                style={styles.viewAllButton}
              >
                <Text style={styles.viewAllText}>View All</Text>
                <Ionicons name="arrow-forward" size={14} color={Colors.primary} />
              </TouchableOpacity>
            )}
          </View>

          {isLoading ? (
            <LoadingSpinner />
          ) : recentIssues.length > 0 ? (
            <View style={styles.issuesList}>
              {recentIssues.map((issue) => (
                <IssueCard
                  key={issue.id}
                  issue={issue}
                  onPress={() => router.push(`/(admin)/issue/${issue.id}`)}
                  variant="compact"
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <EmptyState
                icon="checkmark-done"
                title="All Clear!"
                description="No issues have been reported yet."
              />
            </View>
          )}
        </View>

        <View style={{ height: 24 }} />
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
    paddingTop: 8,
    paddingBottom: 20,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
    fontWeight: '500',
  },
  userName: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -0.5,
  },
  avatarContainer: {
    position: 'relative',
  },
  overviewSection: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  overviewCardMain: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  overviewGradient: {
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  overviewContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  overviewIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 18,
  },
  overviewTextContainer: {},
  overviewNumber: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.textOnPrimary,
    letterSpacing: -1,
  },
  overviewLabel: {
    fontSize: 14,
    color: Colors.textOnPrimary,
    opacity: 0.9,
    marginTop: 2,
  },
  overviewBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  overviewBadgeText: {
    color: Colors.textOnPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  section: {
    marginTop: 28,
    paddingHorizontal: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: -0.3,
    marginBottom: 16,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  statusGrid: {
    gap: 10,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  statusIndicatorLarge: {
    width: 6,
    height: 40,
    borderRadius: 3,
    marginRight: 16,
  },
  statusCardContent: {
    flex: 1,
  },
  statusCardNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  statusCardLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: (width - 52) / 2,
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  actionCardGradient: {
    padding: 18,
    minHeight: 120,
  },
  actionIconBg: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  actionCardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  actionCardNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -0.5,
  },
  actionCardSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  categoryList: {
    backgroundColor: Colors.surface,
    borderRadius: 18,
    overflow: 'hidden',
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  categoryRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  categoryRowLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.text,
  },
  categoryRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryRowCount: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  issuesList: {
    gap: 0,
  },
  emptyContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
  },
});
