import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Issue } from '@/types';
import { getCategoryConfig, getStatusConfig, getPriorityConfig } from '@/constants';
import Colors from '@/constants/Colors';

interface IssueCardProps {
  issue: Issue;
  onPress: () => void;
  showStatus?: boolean;
}

const IssueCard: React.FC<IssueCardProps> = ({ issue, onPress, showStatus = true }) => {
  const categoryConfig = getCategoryConfig(issue.category);
  const statusConfig = getStatusConfig(issue.status);
  const priorityConfig = getPriorityConfig(issue.priority);

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={[styles.categoryBadge, { backgroundColor: categoryConfig.color + '20' }]}>
          <Ionicons name={categoryConfig.icon as any} size={14} color={categoryConfig.color} />
          <Text style={[styles.categoryText, { color: categoryConfig.color }]}>
            {categoryConfig.label}
          </Text>
        </View>
        
        {showStatus && (
          <View style={[styles.statusBadge, { backgroundColor: statusConfig.color + '20' }]}>
            <View style={[styles.statusDot, { backgroundColor: statusConfig.color }]} />
            <Text style={[styles.statusText, { color: statusConfig.color }]}>
              {statusConfig.label}
            </Text>
          </View>
        )}
      </View>

      <Text style={styles.title} numberOfLines={2}>{issue.title}</Text>
      <Text style={styles.description} numberOfLines={2}>{issue.description}</Text>

      {issue.imageUrl && (
        <Image source={{ uri: issue.imageUrl }} style={styles.image} />
      )}

      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <View style={[styles.priorityBadge, { backgroundColor: priorityConfig.color + '20' }]}>
            <Ionicons name="flag" size={12} color={priorityConfig.color} />
            <Text style={[styles.priorityText, { color: priorityConfig.color }]}>
              {priorityConfig.label}
            </Text>
          </View>
          
          {issue.location && (
            <View style={styles.locationContainer}>
              <Ionicons name="location" size={12} color={Colors.textSecondary} />
              <Text style={styles.locationText} numberOfLines={1}>{issue.location}</Text>
            </View>
          )}
        </View>
        
        <Text style={styles.date}>{formatDate(issue.createdAt)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 4,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    gap: 4,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '600',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  locationText: {
    fontSize: 12,
    color: Colors.textSecondary,
    flex: 1,
  },
  date: {
    fontSize: 12,
    color: Colors.textLight,
  },
});

export default IssueCard;
