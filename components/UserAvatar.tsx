import Colors from '@/constants/Colors';
import { User } from '@/types';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

interface UserAvatarProps {
  user?: User | null;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  showBorder?: boolean;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ user, size = 'medium', showBorder = false }) => {
  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return { container: styles.small, text: styles.smallText };
      case 'large':
        return { container: styles.large, text: styles.largeText };
      case 'xlarge':
        return { container: styles.xlarge, text: styles.xlargeText };
      default:
        return { container: styles.medium, text: styles.mediumText };
    }
  };

  const sizeStyle = getSizeStyle();
  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?';

  const getGradientColors = (): [string, string] => {
    if (user?.role === 'admin') {
      return [Colors.secondaryGradientStart, Colors.secondaryGradientEnd];
    }
    return [Colors.primaryGradientStart, Colors.primaryGradientEnd];
  };

  if (user?.avatar) {
    return (
      <View style={[styles.container, sizeStyle.container, showBorder && styles.border]}>
        <Image source={{ uri: user.avatar }} style={styles.image} />
      </View>
    );
  }

  return (
    <View style={[showBorder && styles.borderWrapper]}>
      <LinearGradient
        colors={getGradientColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.container, sizeStyle.container]}
      >
        <Text style={[styles.text, sizeStyle.text]}>{initials}</Text>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  borderWrapper: {
    padding: 3,
    borderRadius: 100,
    backgroundColor: Colors.surface,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  border: {
    borderWidth: 3,
    borderColor: Colors.surface,
  },
  small: {
    width: 36,
    height: 36,
    borderRadius: 12,
  },
  medium: {
    width: 48,
    height: 48,
    borderRadius: 16,
  },
  large: {
    width: 72,
    height: 72,
    borderRadius: 24,
  },
  xlarge: {
    width: 96,
    height: 96,
    borderRadius: 32,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  text: {
    color: Colors.textOnPrimary,
    fontWeight: '700',
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 18,
  },
  largeText: {
    fontSize: 26,
  },
  xlargeText: {
    fontSize: 34,
  },
});

export default UserAvatar;
