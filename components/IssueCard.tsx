import { API_CONFIG, getCategoryConfig, getPriorityConfig, getStatusConfig } from '@/constants';
import Colors from '@/constants/Colors';
import { Issue } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface IssueCardProps {
  issue: Issue;
  onPress: () => void;
  showStatus?: boolean;
  variant?: 'default' | 'compact';
}

const IssueCard: React.FC<IssueCardProps> = ({ issue, onPress, showStatus = true, variant = 'default' }) => {
  const categoryConfig = getCategoryConfig(issue.category);
  const statusConfig = getStatusConfig(issue.status);
  const priorityConfig = getPriorityConfig(issue.priority);

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;

    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getImageUri = () => {
    if (issue.images && issue.images.length > 0) {
      const img = issue.images[0];
      return img.startsWith('http') ? img : `${API_CONFIG.baseUrl.replace('/api', '')}${img}`;
    }
    return issue.imageUrl;
  };

  const imageUri = getImageUri();

  if (variant === 'compact') {
    return (
      <TouchableOpacity style={styles.compactCard} onPress={onPress} activeOpacity={0.7}>
        <View style={[styles.statusIndicator, { backgroundColor: statusConfig.color }]} />
        <View style={styles.compactContent}>
          <Text style={styles.compactTitle} numberOfLines={1}>{issue.title}</Text>
          <View style={styles.compactMeta}>
            <Ionicons name={categoryConfig.icon as any} size={12} color={categoryConfig.color} />
            <Text style={styles.compactMetaText}>{categoryConfig.label}</Text>
            <Text style={styles.compactDot}>•</Text>
            <Text style={styles.compactMetaText}>{formatDate(issue.createdAt)}</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={18} color={Colors.textLight} />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {/* Accent gradient line at top */}
      <LinearGradient
        colors={[categoryConfig.color, categoryConfig.color + '80']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.accentLine}
      />

      <View style={styles.cardContent}>
        {/* Header with badges */}
        <View style={styles.header}>
          <View style={[styles.categoryBadge, { backgroundColor: categoryConfig.color + '15' }]}>
            <View style={[styles.categoryIconBg, { backgroundColor: categoryConfig.color + '25' }]}>
              <Ionicons name={categoryConfig.icon as any} size={14} color={categoryConfig.color} />
            </View>
            <Text style={[styles.categoryText, { color: categoryConfig.color }]}>
              {categoryConfig.label}
            </Text>
          </View>

          {showStatus && (
            <View style={[styles.statusBadge, { backgroundColor: statusConfig.color + '15' }]}>
              <View style={[styles.statusDot, { backgroundColor: statusConfig.color }]} />
              <Text style={[styles.statusText, { color: statusConfig.color }]}>
                {statusConfig.label}
              </Text>
            </View>
          )}
        </View>

        {/* Title and Description */}
        <Text style={styles.title} numberOfLines={2}>{issue.title}</Text>
        <Text style={styles.description} numberOfLines={2}>{issue.description}</Text>

        {/* Image preview */}
        {imageUri && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: imageUri }} style={styles.image} />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.3)']}
              style={styles.imageOverlay}
            />
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            <View style={[styles.priorityBadge, { backgroundColor: priorityConfig.color + '12' }]}>
              <Ionicons name="flag" size={11} color={priorityConfig.color} />
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

          <View style={styles.dateContainer}>
            <Ionicons name="time-outline" size={12} color={Colors.textLight} />
            <Text style={styles.date}>{formatDate(issue.createdAt)}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: Colors.shadowStrong,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 5,
    overflow: 'hidden',
  },
  accentLine: {
    height: 4,
    width: '100%',
  },
  cardContent: {
    padding: 18,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 12,
    paddingVertical: 4,
    paddingLeft: 4,
    borderRadius: 20,
    gap: 8,
  },
  categoryIconBg: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
    lineHeight: 24,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 21,
    marginBottom: 14,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 14,
    borderRadius: 14,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 140,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
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
    paddingHorizontal: 10,
    paddingVertical: 4,
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
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  date: {
    fontSize: 12,
    color: Colors.textLight,
    fontWeight: '500',
  },
  // Compact variant styles
  compactCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  statusIndicator: {
    width: 4,
    height: 36,
    borderRadius: 2,
    marginRight: 14,
  },
  compactContent: {
    flex: 1,
  },
  compactTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  compactMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  compactMetaText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  compactDot: {
    color: Colors.textLight,
    fontSize: 12,
  },
});

export default IssueCard;
