import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IssueCategory } from '@/types';
import { getCategoryConfig } from '@/constants';
import Colors from '@/constants/Colors';

interface CategoryCardProps {
  category: IssueCategory;
  count?: number;
  onPress: () => void;
  selected?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  count,
  onPress,
  selected = false,
  size = 'medium',
}) => {
  const config = getCategoryConfig(category);

  const getSize = () => {
    switch (size) {
      case 'small':
        return { width: 80, height: 80, iconSize: 24 };
      case 'large':
        return { width: 150, height: 150, iconSize: 40 };
      default:
        return { width: 100, height: 100, iconSize: 32 };
    }
  };

  const sizeConfig = getSize();

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { width: sizeConfig.width, height: sizeConfig.height },
        selected && { borderColor: config.color, borderWidth: 2 },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: config.color + '20' }]}>
        <Ionicons name={config.icon as any} size={sizeConfig.iconSize} color={config.color} />
      </View>
      <Text style={styles.label} numberOfLines={1}>{config.label}</Text>
      {count !== undefined && (
        <Text style={styles.count}>{count} issues</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
  },
  count: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});

export default CategoryCard;
