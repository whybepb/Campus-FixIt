import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { IssueCard, FilterChipGroup, EmptyState, LoadingSpinner, Header } from '@/components';
import { useIssues } from '@/context';
import Colors from '@/constants/Colors';
import { ISSUE_CATEGORIES, ISSUE_STATUSES, ISSUE_PRIORITIES } from '@/constants';
import { Issue, IssueCategory, IssueStatus, IssuePriority } from '@/types';

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

  const renderIssue = ({ item }: { item: Issue }) => (
    <View style={styles.cardContainer}>
      <IssueCard
        issue={item}
        onPress={() => router.push(`/(admin)/issue/${item.id}`)}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="All Issues" showBack subtitle={`${filteredIssues.length} issues`} />
      
      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search issues..."
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
      
      {/* Filters */}
      <View style={styles.filtersContainer}>
        <Text style={styles.filterLabel}>Status</Text>
        <FilterChipGroup
          options={ISSUE_STATUSES.map(s => ({ value: s.value, label: s.label, color: s.color }))}
          selectedValue={selectedStatus}
          onSelect={(val) => setSelectedStatus(val as IssueStatus | undefined)}
        />
        
        <Text style={[styles.filterLabel, { marginTop: 8 }]}>Category</Text>
        <FilterChipGroup
          options={ISSUE_CATEGORIES.map(c => ({ value: c.value, label: c.label, color: c.color }))}
          selectedValue={selectedCategory}
          onSelect={(val) => setSelectedCategory(val as IssueCategory | undefined)}
        />

        <Text style={[styles.filterLabel, { marginTop: 8 }]}>Priority</Text>
        <FilterChipGroup
          options={ISSUE_PRIORITIES.map(p => ({ value: p.value, label: p.label, color: p.color }))}
          selectedValue={selectedPriority}
          onSelect={(val) => setSelectedPriority(val as IssuePriority | undefined)}
        />
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
            <EmptyState
              icon="document-text-outline"
              title="No Issues Found"
              description="Try adjusting your filters or search query."
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
  filtersContainer: {
    paddingBottom: 12,
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
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    flexGrow: 1,
  },
  cardContainer: {
    marginBottom: 4,
  },
});
