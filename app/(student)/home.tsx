import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { IssueCard, CategoryCard, LoadingSpinner, EmptyState, UserAvatar } from '@/components';
import { useAuth, useIssues } from '@/context';
import Colors from '@/constants/Colors';
import { ISSUE_CATEGORIES, ISSUE_STATUSES } from '@/constants';
import { IssueCategory } from '@/types';

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
          <View>
            <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0] || 'Student'}! 👋</Text>
            <Text style={styles.subtitle}>What would you like to report today?</Text>
          </View>
          <UserAvatar user={user} size="medium" onPress={() => router.push('/(student)/profile')} />
        </View>

        {/* Quick Action */}
        <TouchableOpacity
          style={styles.reportCard}
          onPress={() => router.push('/(student)/create-issue')}
          activeOpacity={0.9}
        >
          <View style={styles.reportCardContent}>
            <View style={styles.reportCardIcon}>
              <Ionicons name="add-circle" size={32} color={Colors.textOnPrimary} />
            </View>
            <View style={styles.reportCardText}>
              <Text style={styles.reportCardTitle}>Report an Issue</Text>
              <Text style={styles.reportCardSubtitle}>Let us know about any campus problems</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color={Colors.textOnPrimary} />
        </TouchableOpacity>

        {/* Status Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Issues Overview</Text>
          <View style={styles.statsContainer}>
            {ISSUE_STATUSES.map((status) => (
              <TouchableOpacity
                key={status.value}
                style={styles.statCard}
                onPress={() => {
                  setFilters({ ...filters, status: status.value });
                  router.push('/(student)/my-issues');
                }}
              >
                <View style={[styles.statDot, { backgroundColor: status.color }]} />
                <Text style={styles.statCount}>
                  {statusCounts[status.value as keyof typeof statusCounts]}
                </Text>
                <Text style={styles.statLabel}>{status.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContainer}>
            {ISSUE_CATEGORIES.map((category) => (
              <CategoryCard
                key={category.value}
                category={category.value as IssueCategory}
                onPress={() => {
                  setFilters({ ...filters, category: category.value as IssueCategory });
                  router.push('/(student)/my-issues');
                }}
                size="small"
              />
            ))}
          </ScrollView>
        </View>

        {/* Recent Issues */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Issues</Text>
            <TouchableOpacity onPress={() => router.push('/(student)/my-issues')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {isLoading ? (
            <LoadingSpinner />
          ) : recentIssues.length > 0 ? (
            recentIssues.map((issue) => (
              <IssueCard
                key={issue.id}
                issue={issue}
                onPress={() => router.push(`/(student)/issue/${issue.id}`)}
              />
            ))
          ) : (
            <EmptyState
              icon="document-text-outline"
              title="No Issues Yet"
              description="You haven't reported any issues. Tap the button above to create your first report."
            />
          )}
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
  reportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.primary,
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  reportCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  reportCardIcon: {
    width: 56,
    height: 56,
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
  },
  reportCardSubtitle: {
    fontSize: 12,
    color: Colors.textOnPrimary,
    opacity: 0.8,
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
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  statCount: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  categoriesContainer: {
    gap: 12,
    paddingRight: 20,
  },
});
