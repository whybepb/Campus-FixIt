import { Button, Header, LoadingSpinner, StatusBadge } from '@/components';
import { API_CONFIG, getCategoryConfig, getPriorityConfig } from '@/constants';
import Colors from '@/constants/Colors';
import { useIssues } from '@/context';
import { issueService } from '@/services/issueService';
import { Issue } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function IssueDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getIssueById, deleteIssue, isLoading } = useIssues();

  const [issue, setIssue] = useState<Issue | undefined>();
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const loadIssue = async () => {
      if (!id) return;

      const cachedIssue = getIssueById(id);
      if (cachedIssue) {
        setIssue(cachedIssue);
        return;
      }

      setIsFetching(true);
      try {
        const fetchedIssue = await issueService.getIssueById(id);
        setIssue(fetchedIssue);
      } catch (error) {
        console.error('Error fetching issue:', error);
        Alert.alert('Error', 'Failed to load issue details.');
      } finally {
        setIsFetching(false);
      }
    };

    loadIssue();
  }, [id, getIssueById]);

  const handleDelete = () => {
    Alert.alert(
      'Delete Issue',
      'Are you sure you want to delete this issue? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (!issue) return;
            try {
              await deleteIssue(issue.id);
              Alert.alert('Deleted', 'Issue has been deleted successfully.');
              router.back();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete issue.');
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

  const getImageUri = () => {
    if (issue.images && issue.images.length > 0) {
      const img = issue.images[0];
      return img.startsWith('http') ? img : `${API_CONFIG.baseUrl.replace('/api', '')}${img}`;
    }
    return issue.imageUrl;
  };

  const getStatusIcon = () => {
    switch (issue.status) {
      case 'open': return 'time-outline';
      case 'in_progress': return 'construct-outline';
      case 'resolved': return 'checkmark-circle-outline';
      default: return 'help-circle-outline';
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Issue Details" showBack />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Status Header Card */}
        <View style={styles.statusCard}>
          <LinearGradient
            colors={[categoryConfig.color + '15', categoryConfig.color + '05']}
            style={styles.statusGradient}
          >
            <View style={styles.statusRow}>
              <StatusBadge status={issue.status} size="large" />
              <View style={[styles.priorityBadge, { backgroundColor: priorityConfig.color + '18' }]}>
                <Ionicons name="flag" size={14} color={priorityConfig.color} />
                <Text style={[styles.priorityText, { color: priorityConfig.color }]}>
                  {priorityConfig.label} Priority
                </Text>
              </View>
            </View>

            <View style={styles.categoryRow}>
              <View style={[styles.categoryIconBg, { backgroundColor: categoryConfig.color + '25' }]}>
                <Ionicons name={categoryConfig.icon as any} size={20} color={categoryConfig.color} />
              </View>
              <Text style={[styles.categoryLabel, { color: categoryConfig.color }]}>
                {categoryConfig.label}
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* Issue Content */}
        <View style={styles.contentCard}>
          <Text style={styles.title}>{issue.title}</Text>

          {/* Location */}
          {issue.location && (
            <View style={styles.locationRow}>
              <Ionicons name="location" size={18} color={Colors.primary} />
              <Text style={styles.locationText}>{issue.location}</Text>
            </View>
          )}

          {/* Date */}
          <View style={styles.dateRow}>
            <Ionicons name="calendar-outline" size={16} color={Colors.textSecondary} />
            <Text style={styles.dateText}>Reported on {formatDate(issue.createdAt)}</Text>
          </View>
        </View>

        {/* Images */}
        {issue.images && issue.images.length > 0 ? (
          <View style={styles.imagesSection}>
            <Text style={styles.sectionTitle}>Photos</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.imagesContainer}>
              {issue.images.map((img, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image
                    source={{ uri: img.startsWith('http') ? img : `${API_CONFIG.baseUrl.replace('/api', '')}${img}` }}
                    style={styles.image}
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        ) : issue.imageUrl ? (
          <View style={styles.imagesSection}>
            <Text style={styles.sectionTitle}>Photo</Text>
            <View style={styles.imageWrapper}>
              <Image source={{ uri: issue.imageUrl }} style={styles.singleImage} />
            </View>
          </View>
        ) : null}

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <View style={styles.descriptionCard}>
            <Text style={styles.description}>{issue.description}</Text>
          </View>
        </View>

        {/* Admin Remarks */}
        {issue.adminRemarks && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Admin Response</Text>
            <View style={styles.remarksCard}>
              <View style={styles.remarksHeader}>
                <View style={styles.adminBadge}>
                  <Ionicons name="shield-checkmark" size={14} color={Colors.primary} />
                  <Text style={styles.adminBadgeText}>Admin</Text>
                </View>
              </View>
              <Text style={styles.remarksText}>{issue.adminRemarks}</Text>
            </View>
          </View>
        )}

        {/* Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status Timeline</Text>
          <View style={styles.timeline}>
            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, { backgroundColor: Colors.statusOpen }]} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>Issue Reported</Text>
                <Text style={styles.timelineDate}>{formatDate(issue.createdAt)}</Text>
              </View>
            </View>

            {(issue.status === 'in_progress' || issue.status === 'resolved') && (
              <>
                <View style={styles.timelineLine} />
                <View style={styles.timelineItem}>
                  <View style={[styles.timelineDot, { backgroundColor: Colors.statusInProgress }]} />
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineTitle}>Under Review</Text>
                    <Text style={styles.timelineDate}>Being addressed by admin team</Text>
                  </View>
                </View>
              </>
            )}

            {issue.status === 'resolved' && issue.resolvedAt && (
              <>
                <View style={styles.timelineLine} />
                <View style={styles.timelineItem}>
                  <View style={[styles.timelineDot, { backgroundColor: Colors.statusResolved }]} />
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineTitle}>Issue Resolved</Text>
                    <Text style={styles.timelineDate}>{formatDate(issue.resolvedAt)}</Text>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Delete Button - Only for open issues */}
        {issue.status === 'open' && (
          <View style={styles.deleteSection}>
            <Button
              title="Delete Issue"
              onPress={handleDelete}
              variant="danger"
              loading={isLoading}
              fullWidth
              icon={<Ionicons name="trash-outline" size={18} color={Colors.textOnPrimary} />}
            />
            <Text style={styles.deleteHint}>
              You can only delete issues that haven't been reviewed yet
            </Text>
          </View>
        )}
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
    padding: 20,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    gap: 6,
  },
  priorityText: {
    fontSize: 13,
    fontWeight: '600',
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  categoryIconBg: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  contentCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 14,
    lineHeight: 30,
    letterSpacing: -0.3,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  locationText: {
    fontSize: 15,
    color: Colors.text,
    fontWeight: '500',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  imagesSection: {
    marginBottom: 16,
  },
  imagesContainer: {
    gap: 12,
    paddingRight: 20,
  },
  imageWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  image: {
    width: 280,
    height: 180,
    borderRadius: 16,
  },
  singleImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  descriptionCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 18,
  },
  description: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  remarksCard: {
    backgroundColor: Colors.primaryLight + '15',
    borderRadius: 16,
    padding: 18,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  remarksHeader: {
    marginBottom: 10,
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    gap: 6,
    alignSelf: 'flex-start',
  },
  adminBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  remarksText: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 24,
  },
  timeline: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 18,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timelineDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginTop: 4,
    marginRight: 14,
  },
  timelineLine: {
    width: 2,
    height: 24,
    backgroundColor: Colors.border,
    marginLeft: 6,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 12,
  },
  timelineTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  timelineDate: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  deleteSection: {
    marginTop: 16,
  },
  deleteHint: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 12,
  },
});
