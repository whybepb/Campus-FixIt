import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Header, StatusBadge, Button, LoadingSpinner } from '@/components';
import { useIssues } from '@/context';
import { getCategoryConfig, getPriorityConfig, ISSUE_STATUSES, ISSUE_PRIORITIES } from '@/constants';
import Colors from '@/constants/Colors';
import { Issue, IssueStatus, IssuePriority } from '@/types';

export default function AdminIssueDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getIssueById, updateIssue, isLoading } = useIssues();
  
  const [issue, setIssue] = useState<Issue | undefined>();
  const [selectedStatus, setSelectedStatus] = useState<IssueStatus>('open');
  const [selectedPriority, setSelectedPriority] = useState<IssuePriority>('medium');
  const [remarks, setRemarks] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (id) {
      const foundIssue = getIssueById(id);
      if (foundIssue) {
        setIssue(foundIssue);
        setSelectedStatus(foundIssue.status);
        setSelectedPriority(foundIssue.priority);
        setRemarks(foundIssue.remarks || '');
      }
    }
  }, [id]);

  const handleUpdate = async () => {
    if (!issue) return;
    
    setIsUpdating(true);
    try {
      await updateIssue(issue.id, {
        status: selectedStatus,
        priority: selectedPriority,
        remarks: remarks || undefined,
      });
      
      Alert.alert('Success', 'Issue updated successfully!');
      router.back();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update issue.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleMarkResolved = () => {
    Alert.alert(
      'Mark as Resolved',
      'Are you sure you want to mark this issue as resolved?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Resolve',
          onPress: async () => {
            setIsUpdating(true);
            try {
              await updateIssue(issue!.id, {
                status: 'resolved',
                remarks: remarks || 'Issue has been resolved.',
              });
              Alert.alert('Success', 'Issue marked as resolved!');
              router.back();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to update issue.');
            } finally {
              setIsUpdating(false);
            }
          },
        },
      ]
    );
  };

  if (!issue) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header title="Issue Details" showBack />
        <LoadingSpinner fullScreen text="Loading issue..." />
      </SafeAreaView>
    );
  }

  const categoryConfig = getCategoryConfig(issue.category);
  const priorityConfig = getPriorityConfig(issue.priority);

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Manage Issue" showBack />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Current Status */}
        <View style={styles.currentStatus}>
          <StatusBadge status={issue.status} size="large" />
          <View style={[styles.categoryBadge, { backgroundColor: categoryConfig.color + '20' }]}>
            <Ionicons name={categoryConfig.icon as any} size={16} color={categoryConfig.color} />
            <Text style={[styles.categoryText, { color: categoryConfig.color }]}>
              {categoryConfig.label}
            </Text>
          </View>
        </View>

        {/* Issue Info */}
        <View style={styles.infoCard}>
          <Text style={styles.title}>{issue.title}</Text>
          <Text style={styles.description}>{issue.description}</Text>
          
          {issue.imageUrl && (
            <Image source={{ uri: issue.imageUrl }} style={styles.image} />
          )}

          <View style={styles.metaGrid}>
            <View style={styles.metaItem}>
              <Ionicons name="person" size={16} color={Colors.textSecondary} />
              <Text style={styles.metaText}>{issue.createdByName || 'Unknown'}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="calendar" size={16} color={Colors.textSecondary} />
              <Text style={styles.metaText}>{formatDate(issue.createdAt)}</Text>
            </View>
            {issue.location && (
              <View style={styles.metaItem}>
                <Ionicons name="location" size={16} color={Colors.textSecondary} />
                <Text style={styles.metaText}>{issue.location}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Update Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Update Status</Text>
          <View style={styles.optionsGrid}>
            {ISSUE_STATUSES.map((status) => (
              <Button
                key={status.value}
                title={status.label}
                onPress={() => setSelectedStatus(status.value)}
                variant={selectedStatus === status.value ? 'primary' : 'outline'}
                size="small"
                style={[
                  styles.optionButton,
                  selectedStatus === status.value && { backgroundColor: status.color },
                ]}
              />
            ))}
          </View>
        </View>

        {/* Update Priority */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Update Priority</Text>
          <View style={styles.optionsGrid}>
            {ISSUE_PRIORITIES.map((priority) => (
              <Button
                key={priority.value}
                title={priority.label}
                onPress={() => setSelectedPriority(priority.value)}
                variant={selectedPriority === priority.value ? 'primary' : 'outline'}
                size="small"
                style={[
                  styles.optionButton,
                  selectedPriority === priority.value && { backgroundColor: priority.color },
                ]}
              />
            ))}
          </View>
        </View>

        {/* Add Remarks */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Admin Remarks</Text>
          <View style={styles.remarksContainer}>
            <TextInput
              style={styles.remarksInput}
              placeholder="Add remarks or notes about this issue..."
              value={remarks}
              onChangeText={setRemarks}
              multiline
              numberOfLines={4}
              placeholderTextColor={Colors.textLight}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title="Save Changes"
            onPress={handleUpdate}
            loading={isUpdating}
          />
          
          {issue.status !== 'resolved' && (
            <Button
              title="Mark as Resolved"
              onPress={handleMarkResolved}
              variant="secondary"
              loading={isUpdating}
              style={styles.resolveButton}
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
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  currentStatus: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 16,
  },
  metaGrid: {
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    minWidth: 90,
  },
  remarksContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  remarksInput: {
    padding: 16,
    fontSize: 15,
    color: Colors.text,
    minHeight: 100,
  },
  actions: {
    gap: 12,
    marginTop: 8,
  },
  resolveButton: {
    marginTop: 4,
  },
});
