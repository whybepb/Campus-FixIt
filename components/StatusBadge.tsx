import { getStatusConfig } from '@/constants';
import { IssueStatus } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface StatusBadgeProps {
  status: IssueStatus;
  size?: 'small' | 'medium' | 'large';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'medium' }) => {
  const config = getStatusConfig(status);

  const getIcon = (): keyof typeof Ionicons.glyphMap => {
    switch (status) {
      case 'open':
        return 'time-outline';
      case 'in_progress':
        return 'construct-outline';
      case 'resolved':
        return 'checkmark-circle';
      default:
        return 'help-circle-outline';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: styles.containerSmall,
          text: styles.textSmall,
          iconSize: 12,
        };
      case 'large':
        return {
          container: styles.containerLarge,
          text: styles.textLarge,
          iconSize: 18,
        };
      default:
        return {
          container: styles.containerMedium,
          text: styles.textMedium,
          iconSize: 14,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <View
      style={[
        styles.container,
        sizeStyles.container,
        {
          backgroundColor: config.color + '18',
          borderColor: config.color + '30',
        },
      ]}
    >
      <Ionicons name={getIcon()} size={sizeStyles.iconSize} color={config.color} />
      <Text style={[styles.text, sizeStyles.text, { color: config.color }]}>
        {config.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1.5,
    gap: 6,
  },
  containerSmall: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  containerMedium: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  containerLarge: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  textSmall: {
    fontSize: 11,
  },
  textMedium: {
    fontSize: 13,
  },
  textLarge: {
    fontSize: 15,
  },
});

export default StatusBadge;
