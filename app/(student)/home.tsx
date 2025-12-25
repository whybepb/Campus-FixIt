import { EmptyState, IssueCard, LoadingSpinner, UserAvatar } from '@/components';
import { ISSUE_CATEGORIES, ISSUE_STATUSES } from '@/constants';
import Colors from '@/constants/Colors';
import { useAuth, useIssues } from '@/context';
import { IssueCategory } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Dimensions, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { myIssues, isLoading, fetchMyIssues, filters, setFilters } = useIssues();

  useEffect(() => {
    fetchMyIssues();
  }, [fetchMyIssues]);

  const getStatusCounts = () => {
    return {
      open: myIssues.filter(i => i.status === 'open').length,
      in_progress: myIssues.filter(i => i.status === 'in_progress').length,
      resolved: myIssues.filter(i => i.status === 'resolved').length,
    };
  };

  const statusCounts = getStatusCounts();
  const recentIssues = myIssues.slice(0, 3);
  const totalIssues = myIssues.length;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={fetchMyIssues} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.userName}>{user?.name?.split(' ')[0] || 'Student'} 👋</Text>
          </View>
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={() => router.push('/(student)/profile')}
            activeOpacity={0.8}
          >
            <UserAvatar user={user} size="medium" />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        {/* Quick Action Card */}
        <TouchableOpacity
          style={styles.reportCardOuter}
          onPress={() => router.push('/(student)/create-issue')}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.reportCard}
          >
            <View style={styles.reportCardContent}>
              <View style={styles.reportCardIcon}>
                <Ionicons name="add" size={28} color={Colors.textOnPrimary} />
              </View>
              <View style={styles.reportCardText}>
                <Text style={styles.reportCardTitle}>Report New Issue</Text>
                <Text style={styles.reportCardSubtitle}>Let us know about any campus problems</Text>
              </View>
            </View>
            <View style={styles.reportCardArrow}>
              <Ionicons name="arrow-forward" size={20} color={Colors.textOnPrimary} />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Stats Overview */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Your Issues</Text>
            <TouchableOpacity
              onPress={() => router.push('/(student)/my-issues')}
              style={styles.viewAllButton}
            >
              <Text style={styles.viewAllText}>View All</Text>
              <Ionicons name="arrow-forward" size={14} color={Colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.statsGrid}>
            <TouchableOpacity
              style={styles.statCardTotal}
              onPress={() => router.push('/(student)/my-issues')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[Colors.surfaceVariant, Colors.surface]}
                style={styles.statCardTotalGradient}
              >
                <Text style={styles.statNumberLarge}>{totalIssues}</Text>
                <Text style={styles.statLabelLarge}>Total Issues</Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.statsColumn}>
              {ISSUE_STATUSES.map((status) => (
                <TouchableOpacity
                  key={status.value}
                  style={styles.statCardSmall}
                  onPress={() => {
                    setFilters({ ...filters, status: status.value });
                    router.push('/(student)/my-issues');
                  }}
                  activeOpacity={0.7}
                >
                  <View style={[styles.statIndicator, { backgroundColor: status.color }]} />
                  <Text style={styles.statNumber}>
                    {statusCounts[status.value as keyof typeof statusCounts]}
                  </Text>
                  <Text style={styles.statLabel}>{status.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Report</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {ISSUE_CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.value}
                style={styles.categoryCard}
                onPress={() => {
                  setFilters({ ...filters, category: category.value as IssueCategory });
                  router.push('/(student)/create-issue');
                }}
                activeOpacity={0.8}
              >
                <View style={[styles.categoryIconBg, { backgroundColor: category.color + '18' }]}>
                  <Ionicons name={category.icon as any} size={24} color={category.color} />
                </View>
                <Text style={styles.categoryLabel}>{category.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Recent Issues */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            {recentIssues.length > 0 && (
              <TouchableOpacity
                onPress={() => router.push('/(student)/my-issues')}
                style={styles.viewAllButton}
              >
                <Text style={styles.viewAllText}>See All</Text>
                <Ionicons name="arrow-forward" size={14} color={Colors.primary} />
              </TouchableOpacity>
            )}
          </View>

          {isLoading ? (
            <LoadingSpinner />
          ) : recentIssues.length > 0 ? (
            <View style={styles.recentIssuesList}>
              {recentIssues.map((issue) => (
                <IssueCard
                  key={issue.id}
                  issue={issue}
                  onPress={() => router.push(`/(student)/issue/${issue.id}`)}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <EmptyState
                icon="document-text-outline"
                title="No Issues Yet"
                description="You haven't reported any issues. Tap the button above to create your first report."
              />
            </View>
          )}
        </View>

        {/* Bottom spacing */}
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
  notificationDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.error,
    borderWidth: 2,
    borderColor: Colors.background,
  },
  reportCardOuter: {
    marginHorizontal: 20,
    borderRadius: 24,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  reportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 22,
    borderRadius: 24,
  },
  reportCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  reportCardIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  reportCardText: {
    flex: 1,
  },
  reportCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textOnPrimary,
    marginBottom: 4,
  },
  reportCardSubtitle: {
    fontSize: 13,
    color: Colors.textOnPrimary,
    opacity: 0.85,
  },
  reportCardArrow: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
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
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCardTotal: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  statCardTotalGradient: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  statNumberLarge: {
    fontSize: 42,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -1,
  },
  statLabelLarge: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
    fontWeight: '500',
  },
  statsColumn: {
    flex: 1.2,
    gap: 8,
  },
  statCardSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  statIndicator: {
    width: 4,
    height: 24,
    borderRadius: 2,
    marginRight: 12,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginRight: 8,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    flex: 1,
  },
  categoriesContainer: {
    gap: 12,
    paddingRight: 20,
  },
  categoryCard: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 18,
    padding: 16,
    width: 90,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  categoryIconBg: {
    width: 50,
    height: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
  },
  recentIssuesList: {
    gap: 0,
  },
  emptyContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
  },
});
