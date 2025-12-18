import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Colors from '@/constants/Colors';

interface FilterChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  color?: string;
}

export const FilterChip: React.FC<FilterChipProps> = ({ label, selected, onPress, color }) => {
  const activeColor = color || Colors.primary;
  
  return (
    <TouchableOpacity
      style={[
        styles.chip,
        selected && { backgroundColor: activeColor, borderColor: activeColor },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.chipText,
          selected && styles.chipTextSelected,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

interface FilterChipGroupProps {
  options: { value: string; label: string; color?: string }[];
  selectedValue?: string;
  onSelect: (value: string | undefined) => void;
  showAll?: boolean;
  allLabel?: string;
}

const FilterChipGroup: React.FC<FilterChipGroupProps> = ({
  options,
  selectedValue,
  onSelect,
  showAll = true,
  allLabel = 'All',
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {showAll && (
        <FilterChip
          label={allLabel}
          selected={!selectedValue}
          onPress={() => onSelect(undefined)}
        />
      )}
      {options.map((option) => (
        <FilterChip
          key={option.value}
          label={option.label}
          selected={selectedValue === option.value}
          onPress={() => onSelect(option.value)}
          color={option.color}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    marginRight: 8,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  chipTextSelected: {
    color: Colors.textOnPrimary,
  },
});

export default FilterChipGroup;
