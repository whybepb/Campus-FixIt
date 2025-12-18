import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IssueStatus } from '@/types';
import { getStatusConfig } from '@/constants';
import Colors from '@/constants/Colors';

interface StatusBadgeProps {
  status: IssueStatus;
  size?: 'small' | 'medium' | 'large';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'medium' }) => {
  const config = getStatusConfig(status);

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { paddingHorizontal: 8, paddingVertical: 2, fontSize: 10, dotSize: 4 };
      case 'large':
        return { paddingHorizontal: 16, paddingVertical: 8, fontSize: 14, dotSize: 8 };
      default:
        return { paddingHorizontal: 12, paddingVertical: 4, fontSize: 12, dotSize: 6 };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: config.color + '20',
          paddingHorizontal: sizeStyles.paddingHorizontal,
          paddingVertical: sizeStyles.paddingVertical,
        },
      ]}
    >
      <View
        style={[
          styles.dot,
          {
            backgroundColor: config.color,
            width: sizeStyles.dotSize,
            height: sizeStyles.dotSize,
            borderRadius: sizeStyles.dotSize / 2,
          },
        ]}
      />
      <Text
        style={[
          styles.text,
          { color: config.color, fontSize: sizeStyles.fontSize },
        ]}
      >
        {config.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    gap: 6,
  },
  dot: {},
  text: {
    fontWeight: '600',
  },
});

export default StatusBadge;
