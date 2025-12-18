import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { IssueCard, FilterChipGroup, EmptyState, LoadingSpinner, Header } from '@/components';
import { useIssues } from '@/context';
import Colors from '@/constants/Colors';
import { ISSUE_CATEGORIES, ISSUE_STATUSES } from '@/constants';
import { Issue, IssueCategory, IssueStatus } from '@/types';

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

  const handleCategoryChange = (value: string | undefined) => {
    setSelectedCategory(value as IssueCategory | undefined);
  };

  const handleStatusChange = (value: string | undefined) => {
    setSelectedStatus(value as IssueStatus | undefined);
  };

  const renderIssue = ({ item }: { item: Issue }) => (
    <View style={styles.cardContainer}>
      <IssueCard
        issue={item}
        onPress={() => router.push(`/(student)/issue/${item.id || (item as any)._id}`)}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="My Issues" showBack />
      
      {/* Filters */}
      <View style={styles.filtersContainer}>
        <Text style={styles.filterLabel}>Category</Text>
        <FilterChipGroup
          options={ISSUE_CATEGORIES.map(c => ({ value: c.value, label: c.label, color: c.color }))}
          selectedValue={selectedCategory}
          onSelect={handleCategoryChange}
        />
        
        <Text style={[styles.filterLabel, { marginTop: 8 }]}>Status</Text>
        <FilterChipGroup
          options={ISSUE_STATUSES.map(s => ({ value: s.value, label: s.label, color: s.color }))}
          selectedValue={selectedStatus}
          onSelect={handleStatusChange}
        />
      </View>

      {/* Results count */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {filteredIssues.length} issue{filteredIssues.length !== 1 ? 's' : ''}
        </Text>
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
            <EmptyState
              icon="document-text-outline"
              title="No Issues Found"
              description={selectedCategory || selectedStatus 
                ? "Try adjusting your filters to see more results."
                : "You haven't reported any issues yet."}
              actionLabel="Report Issue"
              onAction={() => router.push('/(student)/create-issue')}
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
  filtersContainer: {
    paddingTop: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    paddingHorizontal: 20,
    marginBottom: 4,
  },
  resultsHeader: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  resultsCount: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexGrow: 1,
  },
  cardContainer: {
    marginBottom: 4,
  },
});
