import { Button, Header, LoadingSpinner, StatusBadge } from '@/components';
import { API_CONFIG, getCategoryConfig, getPriorityConfig, ISSUE_PRIORITIES, ISSUE_STATUSES } from '@/constants';
import Colors from '@/constants/Colors';
import { useIssues } from '@/context';
import { issueService } from '@/services/issueService';
import { Issue, IssuePriority, IssueStatus } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function AdminIssueDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getIssueById, updateIssue, isLoading } = useIssues();

  const [issue, setIssue] = useState<Issue | undefined>();
  const [selectedStatus, setSelectedStatus] = useState<IssueStatus>('open');
  const [selectedPriority, setSelectedPriority] = useState<IssuePriority>('medium');
  const [remarks, setRemarks] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const loadIssue = async () => {
      if (!id) return;

      const cachedIssue = getIssueById(id);
      if (cachedIssue) {
        setIssue(cachedIssue);
        setSelectedStatus(cachedIssue.status);
        setSelectedPriority(cachedIssue.priority);
        setRemarks(cachedIssue.adminRemarks || '');
        return;
      }

      setIsFetching(true);
      try {
        const fetchedIssue = await issueService.getIssueById(id);
        setIssue(fetchedIssue);
        setSelectedStatus(fetchedIssue.status);
        setSelectedPriority(fetchedIssue.priority);
        setRemarks(fetchedIssue.adminRemarks || '');
      } catch (error) {
        console.error('Error fetching issue:', error);
        Alert.alert('Error', 'Failed to load issue details.');
      } finally {
        setIsFetching(false);
      }
    };

    loadIssue();
  }, [id, getIssueById]);

  const handleUpdate = async () => {
    if (!issue) return;

    setIsUpdating(true);
    try {
      await updateIssue(issue.id, {
        status: selectedStatus,
        priority: selectedPriority,
        adminRemarks: remarks || undefined,
      });

      Alert.alert('✅ Success', 'Issue updated successfully!');
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
                adminRemarks: remarks || 'Issue has been resolved.',
              });
              Alert.alert('✅ Success', 'Issue marked as resolved!');
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

  if (!issue || isFetching) {
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
        {/* Status Header */}
        <View style={styles.statusCard}>
          <LinearGradient
            colors={[categoryConfig.color + '18', categoryConfig.color + '08']}
            style={styles.statusGradient}
          >
            <View style={styles.statusRow}>
              <StatusBadge status={issue.status} size="large" />
              <View style={[styles.categoryBadge, { backgroundColor: categoryConfig.color + '20' }]}>
                <Ionicons name={categoryConfig.icon as any} size={16} color={categoryConfig.color} />
                <Text style={[styles.categoryText, { color: categoryConfig.color }]}>
                  {categoryConfig.label}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Issue Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.title}>{issue.title}</Text>
          <Text style={styles.description}>{issue.description}</Text>

          {/* Images */}
          {issue.images && issue.images.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagesContainer}>
              {issue.images.map((img, index) => (
                <Image
                  key={index}
                  source={{ uri: img.startsWith('http') ? img : `${API_CONFIG.baseUrl.replace('/api', '')}${img}` }}
                  style={styles.image}
                />
              ))}
            </ScrollView>
          ) : issue.imageUrl ? (
            <Image source={{ uri: issue.imageUrl }} style={styles.singleImage} />
          ) : null}

          {/* Meta info */}
          <View style={styles.metaGrid}>
            <View style={styles.metaItem}>
              <View style={styles.metaIconBg}>
                <Ionicons name="person" size={16} color={Colors.primary} />
              </View>
              <View>
                <Text style={styles.metaLabel}>Reported By</Text>
                <Text style={styles.metaValue}>{issue.reportedBy?.name || issue.createdByName || 'Unknown'}</Text>
              </View>
            </View>
            <View style={styles.metaItem}>
              <View style={styles.metaIconBg}>
                <Ionicons name="calendar" size={16} color={Colors.secondary} />
              </View>
              <View>
                <Text style={styles.metaLabel}>Reported On</Text>
                <Text style={styles.metaValue}>{formatDate(issue.createdAt)}</Text>
              </View>
            </View>
            {issue.location && (
              <View style={styles.metaItem}>
                <View style={styles.metaIconBg}>
                  <Ionicons name="location" size={16} color={Colors.warning} />
                </View>
                <View>
                  <Text style={styles.metaLabel}>Location</Text>
                  <Text style={styles.metaValue}>{issue.location}</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Update Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Update Status</Text>
          <View style={styles.optionsGrid}>
            {ISSUE_STATUSES.map((status) => (
              <TouchableOpacity
                key={status.value}
                style={[
                  styles.optionButton,
                  selectedStatus === status.value && {
                    backgroundColor: status.color,
                    borderColor: status.color,
                  },
                ]}
                onPress={() => setSelectedStatus(status.value)}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.optionDot,
                  { backgroundColor: selectedStatus === status.value ? Colors.textOnPrimary : status.color }
                ]} />
                <Text style={[
                  styles.optionText,
                  selectedStatus === status.value && { color: Colors.textOnPrimary }
                ]}>
                  {status.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Update Priority */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Update Priority</Text>
          <View style={styles.priorityGrid}>
            {ISSUE_PRIORITIES.map((priority) => (
              <TouchableOpacity
                key={priority.value}
                style={[
                  styles.priorityButton,
                  selectedPriority === priority.value && {
                    backgroundColor: priority.color,
                    borderColor: priority.color,
                  },
                ]}
                onPress={() => setSelectedPriority(priority.value)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="flag"
                  size={14}
                  color={selectedPriority === priority.value ? Colors.textOnPrimary : priority.color}
                />
                <Text style={[
                  styles.priorityText,
                  { color: selectedPriority === priority.value ? Colors.textOnPrimary : priority.color }
                ]}>
                  {priority.label}
                </Text>
              </TouchableOpacity>
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
          <Text style={styles.remarksHint}>
            This will be visible to the student who reported the issue
          </Text>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title="Save Changes"
            onPress={handleUpdate}
            loading={isUpdating}
            fullWidth
            size="large"
          />

          {issue.status !== 'resolved' && (
            <Button
              title="Mark as Resolved"
              onPress={handleMarkResolved}
              variant="secondary"
              loading={isUpdating}
              fullWidth
              icon={<Ionicons name="checkmark-circle" size={18} color={Colors.textOnPrimary} />}
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
  statusCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
  },
  statusGradient: {
    padding: 18,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 23,
    marginBottom: 16,
  },
  imagesContainer: {
    marginBottom: 16,
  },
  image: {
    width: 260,
    height: 160,
    borderRadius: 14,
    marginRight: 12,
  },
  singleImage: {
    width: '100%',
    height: 180,
    borderRadius: 14,
    marginBottom: 16,
  },
  metaGrid: {
    gap: 14,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metaIconBg: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: Colors.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 14,
    letterSpacing: -0.3,
  },
  optionsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  optionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    gap: 8,
  },
  optionDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  optionText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
  },
  priorityGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  priorityButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    gap: 6,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  remarksContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  remarksInput: {
    padding: 16,
    fontSize: 15,
    color: Colors.text,
    minHeight: 120,
  },
  remarksHint: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 8,
    marginLeft: 4,
  },
  actions: {
    gap: 12,
    marginTop: 8,
  },
});
