import Colors from '@/constants/Colors';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  fullScreen?: boolean;
  text?: string;
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  fullScreen = false,
  text,
  color = Colors.primary,
}) => {
  const content = (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <View style={styles.spinnerContainer}>
        <ActivityIndicator size={size} color={color} />
      </View>
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );

  if (fullScreen) {
    return <View style={styles.fullScreenWrapper}>{content}</View>;
  }

  return content;
};

const styles = StyleSheet.create({
  fullScreenWrapper: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  fullScreen: {
    flex: 1,
  },
  spinnerContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    marginTop: 16,
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
});

export default LoadingSpinner;
