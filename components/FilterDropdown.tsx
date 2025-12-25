import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface FilterOption {
    value: string;
    label: string;
    color?: string;
    icon?: string;
}

interface FilterDropdownProps {
    label: string;
    options: FilterOption[];
    selectedValue?: string;
    onSelect: (value: string | undefined) => void;
    placeholder?: string;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
    label,
    options,
    selectedValue,
    onSelect,
    placeholder = 'All',
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const selectedOption = options.find(opt => opt.value === selectedValue);

    const handleSelect = (value: string | undefined) => {
        onSelect(value);
        setIsOpen(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setIsOpen(true)}
                activeOpacity={0.7}
            >
                {selectedOption ? (
                    <View style={styles.selectedContent}>
                        {selectedOption.color && (
                            <View style={[styles.colorDot, { backgroundColor: selectedOption.color }]} />
                        )}
                        {selectedOption.icon && (
                            <Ionicons name={selectedOption.icon as any} size={16} color={selectedOption.color || Colors.text} />
                        )}
                        <Text style={[styles.selectedText, selectedOption.color && { color: selectedOption.color }]}>
                            {selectedOption.label}
                        </Text>
                    </View>
                ) : (
                    <Text style={styles.placeholderText}>{placeholder}</Text>
                )}
                <Ionicons name="chevron-down" size={18} color={Colors.textSecondary} />
            </TouchableOpacity>

            <Modal
                visible={isOpen}
                transparent
                animationType="fade"
                onRequestClose={() => setIsOpen(false)}
            >
                <Pressable style={styles.modalOverlay} onPress={() => setIsOpen(false)}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select {label}</Text>
                            <TouchableOpacity onPress={() => setIsOpen(false)}>
                                <Ionicons name="close" size={24} color={Colors.text} />
                            </TouchableOpacity>
                        </View>

                        {/* All / Clear option */}
                        <TouchableOpacity
                            style={[styles.optionItem, !selectedValue && styles.optionItemSelected]}
                            onPress={() => handleSelect(undefined)}
                        >
                            <Text style={[styles.optionText, !selectedValue && styles.optionTextSelected]}>
                                All
                            </Text>
                            {!selectedValue && (
                                <Ionicons name="checkmark" size={20} color={Colors.primary} />
                            )}
                        </TouchableOpacity>

                        <View style={styles.divider} />

                        <FlatList
                            data={options}
                            keyExtractor={(item) => item.value}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.optionItem,
                                        selectedValue === item.value && styles.optionItemSelected,
                                    ]}
                                    onPress={() => handleSelect(item.value)}
                                >
                                    <View style={styles.optionContent}>
                                        {item.color && (
                                            <View style={[styles.optionColorDot, { backgroundColor: item.color }]} />
                                        )}
                                        {item.icon && (
                                            <Ionicons name={item.icon as any} size={18} color={item.color || Colors.text} />
                                        )}
                                        <Text style={[
                                            styles.optionText,
                                            selectedValue === item.value && styles.optionTextSelected,
                                        ]}>
                                            {item.label}
                                        </Text>
                                    </View>
                                    {selectedValue === item.value && (
                                        <Ionicons name="checkmark" size={20} color={Colors.primary} />
                                    )}
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.textSecondary,
        marginBottom: 6,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    dropdownButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.surface,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: Colors.border,
        paddingHorizontal: 14,
        paddingVertical: 12,
        minHeight: 48,
    },
    selectedContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    colorDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    selectedText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text,
    },
    placeholderText: {
        fontSize: 14,
        color: Colors.textLight,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: Colors.overlay,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modalContent: {
        backgroundColor: Colors.surface,
        borderRadius: 20,
        width: '100%',
        maxHeight: '70%',
        overflow: 'hidden',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 18,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.border,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderLight,
    },
    optionItemSelected: {
        backgroundColor: Colors.primaryLight + '15',
    },
    optionContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    optionColorDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    optionText: {
        fontSize: 16,
        color: Colors.text,
    },
    optionTextSelected: {
        fontWeight: '600',
        color: Colors.primary,
    },
});

export default FilterDropdown;
