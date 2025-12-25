import { EmptyState, FilterDropdown, Header, IssueCard, LoadingSpinner } from '@/components';
import { ISSUE_CATEGORIES, ISSUE_STATUSES } from '@/constants';
import Colors from '@/constants/Colors';
import { useIssues } from '@/context';
import { Issue, IssueCategory, IssueStatus } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MyIssuesScreen() {
  const router = useRouter();
  const { myIssues, isLoading, fetchMyIssues, filters, setFilters } = useIssues();

  const [selectedCategory, setSelectedCategory] = useState<IssueCategory | undefined>(filters.category);
  const [selectedStatus, setSelectedStatus] = useState<IssueStatus | undefined>(filters.status);

  useEffect(() => {
    fetchMyIssues();
  }, [fetchMyIssues]);

  const filteredIssues = myIssues.filter((issue) => {
    if (selectedCategory && issue.category !== selectedCategory) return false;
    if (selectedStatus && issue.status !== selectedStatus) return false;
    return true;
  });

  const hasFilters = selectedCategory || selectedStatus;

  const clearFilters = () => {
    setSelectedCategory(undefined);
    setSelectedStatus(undefined);
  };

  const renderIssue = ({ item }: { item: Issue }) => (
    <IssueCard
      issue={item}
      onPress={() => router.push(`/(student)/issue/${item.id || (item as any)._id}`)}
    />
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="My Issues" showBack />

      {/* Filters Section */}
      <View style={styles.filtersSection}>
        <View style={styles.filtersRow}>
          <FilterDropdown
            label="Status"
            options={ISSUE_STATUSES.map(s => ({
              value: s.value,
              label: s.label,
              color: s.color
            }))}
            selectedValue={selectedStatus}
            onSelect={(val) => setSelectedStatus(val as IssueStatus | undefined)}
            placeholder="All Statuses"
          />
          <FilterDropdown
            label="Category"
            options={ISSUE_CATEGORIES.map(c => ({
              value: c.value,
              label: c.label,
              color: c.color,
              icon: c.icon,
            }))}
            selectedValue={selectedCategory}
            onSelect={(val) => setSelectedCategory(val as IssueCategory | undefined)}
            placeholder="All Categories"
          />
        </View>
      </View>

      {/* Results Header */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {filteredIssues.length} issue{filteredIssues.length !== 1 ? 's' : ''} found
        </Text>
        {hasFilters && (
          <TouchableOpacity onPress={clearFilters} style={styles.clearButton}>
            <Ionicons name="close-circle" size={16} color={Colors.primary} />
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Issues List */}
      {isLoading ? (
        <LoadingSpinner fullScreen text="Loading issues..." />
      ) : (
        <FlatList
          data={filteredIssues}
          renderItem={renderIssue}
          keyExtractor={(item, index) => item.id || (item as any)._id || `issue-${index}`}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={fetchMyIssues} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <EmptyState
                icon="document-text-outline"
                title="No Issues Found"
                description={hasFilters
                  ? "Try adjusting your filters to see more results."
                  : "You haven't reported any issues yet."}
                actionLabel="Report Issue"
                onAction={() => router.push('/(student)/create-issue')}
              />
            </View>
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
  filtersSection: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filtersRow: {
    flexDirection: 'row',
    gap: 12,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  resultsCount: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  clearButtonText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 32,
    marginTop: 20,
  },
});
