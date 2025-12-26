import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode | string;
  rightIcon?: React.ReactNode | string;
  containerStyle?: ViewStyle;
  helperText?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  containerStyle,
  helperText,
  style,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const getBorderColor = () => {
    if (error) return Colors.error;
    if (isFocused) return Colors.primary;
    return Colors.border;
  };

  // Helper to render icon - handles both string names and React elements
  const renderIcon = (icon: React.ReactNode | string | undefined) => {
    if (!icon) return null;
    if (typeof icon === 'string') {
      return <Ionicons name={icon as any} size={20} color={Colors.textSecondary} />;
    }
    return icon;
  };

  return (
    <View style={containerStyle}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.inputContainer,
          {
            borderColor: getBorderColor(),
            backgroundColor: isFocused ? Colors.surface : Colors.surfaceVariant,
          },
          error && styles.inputError,
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{renderIcon(leftIcon)}</View>}

        <TextInput
          style={[styles.input, leftIcon ? styles.inputWithLeftIcon : undefined, style]}
          placeholderTextColor={Colors.textLight}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />

        {rightIcon && <View style={styles.rightIcon}>{renderIcon(rightIcon)}</View>}
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={14} color={Colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {helperText && !error && (
        <Text style={styles.helperText}>{helperText}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 14,
    paddingHorizontal: 14,
    minHeight: 54,
    backgroundColor: Colors.surfaceVariant,
  },
  inputError: {
    borderColor: Colors.error,
    backgroundColor: Colors.errorLight + '50',
  },
  leftIcon: {
    marginRight: 12,
  },
  rightIcon: {
    marginLeft: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    paddingVertical: 14,
    fontWeight: '500',
  },
  inputWithLeftIcon: {
    paddingLeft: 0,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  errorText: {
    fontSize: 13,
    color: Colors.error,
    fontWeight: '500',
  },
  helperText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 8,
  },
});

export default Input;
