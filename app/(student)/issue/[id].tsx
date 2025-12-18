import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Header, StatusBadge, Button, LoadingSpinner } from '@/components';
import { useIssues } from '@/context';
import { getCategoryConfig, getPriorityConfig } from '@/constants';
import Colors from '@/constants/Colors';
import { Issue } from '@/types';

export default function IssueDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getIssueById, deleteIssue, isLoading } = useIssues();
  
  const [issue, setIssue] = useState<Issue | undefined>();

  useEffect(() => {
    if (id) {
      const foundIssue = getIssueById(id);
      setIssue(foundIssue);
    }
  }, [id]);

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
            try {
              await deleteIssue(id);
              router.back();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete issue.');
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
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Issue Details" showBack />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Status & Category Header */}
        <View style={styles.headerBadges}>
          <StatusBadge status={issue.status} size="large" />
          <View style={[styles.categoryBadge, { backgroundColor: categoryConfig.color + '20' }]}>
            <Ionicons name={categoryConfig.icon as any} size={16} color={categoryConfig.color} />
            <Text style={[styles.categoryText, { color: categoryConfig.color }]}>
              {categoryConfig.label}
            </Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>{issue.title}</Text>

        {/* Priority & Location */}
        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Ionicons name="flag" size={16} color={priorityConfig.color} />
            <Text style={[styles.metaText, { color: priorityConfig.color }]}>
              {priorityConfig.label} Priority
            </Text>
          </View>
          
          {issue.location && (
            <View style={styles.metaItem}>
              <Ionicons name="location" size={16} color={Colors.textSecondary} />
              <Text style={styles.metaText}>{issue.location}</Text>
            </View>
          )}
        </View>

        {/* Image */}
        {issue.imageUrl && (
          <Image source={{ uri: issue.imageUrl }} style={styles.image} />
        )}

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{issue.description}</Text>
        </View>

        {/* Admin Remarks */}
        {issue.remarks && (
          <View style={styles.remarksContainer}>
            <View style={styles.remarksHeader}>
              <Ionicons name="chatbubble-ellipses" size={20} color={Colors.primary} />
              <Text style={styles.remarksTitle}>Admin Remarks</Text>
            </View>
            <Text style={styles.remarksText}>{issue.remarks}</Text>
          </View>
        )}

        {/* Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Timeline</Text>
          
          <View style={styles.timelineItem}>
            <View style={[styles.timelineDot, { backgroundColor: Colors.statusOpen }]} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineLabel}>Created</Text>
              <Text style={styles.timelineDate}>{formatDate(issue.createdAt)}</Text>
            </View>
          </View>

          {issue.status !== 'open' && (
            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, { backgroundColor: Colors.statusInProgress }]} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineLabel}>In Progress</Text>
                <Text style={styles.timelineDate}>{formatDate(issue.updatedAt)}</Text>
              </View>
            </View>
          )}

          {issue.status === 'resolved' && issue.resolvedAt && (
            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, { backgroundColor: Colors.statusResolved }]} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineLabel}>Resolved</Text>
                <Text style={styles.timelineDate}>{formatDate(issue.resolvedAt)}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Actions */}
        {issue.status === 'open' && (
          <View style={styles.actions}>
            <Button
              title="Delete Issue"
              onPress={handleDelete}
              variant="danger"
              loading={isLoading}
            />
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
  headerBadges: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
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
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 20,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 24,
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
  description: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  remarksContainer: {
    backgroundColor: Colors.primaryLight + '20',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  remarksHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  remarksTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  remarksText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 22,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
  },
  timelineLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  timelineDate: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  actions: {
    marginTop: 8,
  },
});
