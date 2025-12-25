import { EmptyState, FilterDropdown, Header, IssueCard, LoadingSpinner } from '@/components';
import { ISSUE_CATEGORIES, ISSUE_PRIORITIES, ISSUE_STATUSES } from '@/constants';
import Colors from '@/constants/Colors';
import { useIssues } from '@/context';
import { Issue, IssueCategory, IssuePriority, IssueStatus } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AdminIssuesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ status?: string; category?: string }>();
  const { issues, isLoading, fetchIssues } = useIssues();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<IssueCategory | undefined>(
    params.category as IssueCategory | undefined
  );
  const [selectedStatus, setSelectedStatus] = useState<IssueStatus | undefined>(
    params.status as IssueStatus | undefined
  );
  const [selectedPriority, setSelectedPriority] = useState<IssuePriority | undefined>();

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  const filteredIssues = issues.filter((issue) => {
    if (selectedCategory && issue.category !== selectedCategory) return false;
    if (selectedStatus && issue.status !== selectedStatus) return false;
    if (selectedPriority && issue.priority !== selectedPriority) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        issue.title.toLowerCase().includes(query) ||
        issue.description.toLowerCase().includes(query) ||
        issue.createdByName?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const hasFilters = selectedCategory || selectedStatus || selectedPriority || searchQuery;

  const clearFilters = () => {
    setSelectedCategory(undefined);
    setSelectedStatus(undefined);
    setSelectedPriority(undefined);
    setSearchQuery('');
  };

  const renderIssue = ({ item }: { item: Issue }) => (
    <IssueCard
      issue={item}
      onPress={() => router.push(`/(admin)/issue/${item.id}`)}
    />
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="All Issues" showBack />

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={Colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search issues..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={Colors.textLight}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filters */}
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
            placeholder="All"
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
            placeholder="All"
          />
          <FilterDropdown
            label="Priority"
            options={ISSUE_PRIORITIES.map(p => ({
              value: p.value,
              label: p.label,
              color: p.color,
            }))}
            selectedValue={selectedPriority}
            onSelect={(val) => setSelectedPriority(val as IssuePriority | undefined)}
            placeholder="All"
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
            <Text style={styles.clearButtonText}>Clear all</Text>
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
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={fetchIssues} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <EmptyState
                icon="document-text-outline"
                title="No Issues Found"
                description="Try adjusting your filters or search query."
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
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    borderRadius: 14,
    gap: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: Colors.text,
  },
  filtersSection: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filtersRow: {
    flexDirection: 'row',
    gap: 10,
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
