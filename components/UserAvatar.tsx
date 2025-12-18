import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { User } from '@/types';
import Colors from '@/constants/Colors';

interface UserAvatarProps {
  user: User | null;
  size?: 'small' | 'medium' | 'large';
  showName?: boolean;
  onPress?: () => void;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  size = 'medium',
  showName = false,
  onPress,
}) => {
  const getSize = () => {
    switch (size) {
      case 'small':
        return 32;
      case 'large':
        return 80;
      default:
        return 48;
    }
  };

  const avatarSize = getSize();
  const iconSize = avatarSize * 0.5;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container style={styles.container} onPress={onPress} activeOpacity={0.7}>
      {user?.avatar ? (
        <Image
          source={{ uri: user.avatar }}
          style={[styles.avatar, { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 }]}
        />
      ) : (
        <View
          style={[
            styles.placeholder,
            { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 },
          ]}
        >
          {user ? (
            <Text style={[styles.initials, { fontSize: iconSize }]}>
              {getInitials(user.name)}
            </Text>
          ) : (
            <Ionicons name="person" size={iconSize} color={Colors.textOnPrimary} />
          )}
        </View>
      )}
      {showName && user && (
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: Colors.surfaceVariant,
  },
  placeholder: {
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: Colors.textOnPrimary,
    fontWeight: '700',
  },
  nameContainer: {
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  email: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});

export default UserAvatar;
