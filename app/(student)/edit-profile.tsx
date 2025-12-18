import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Header, Input, Button, UserAvatar } from '@/components';
import { useAuth } from '@/context';
import Colors from '@/constants/Colors';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, updateUser, isLoading } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [studentId, setStudentId] = useState(user?.studentId || '');
  const [department, setDepartment] = useState(user?.department || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      // TODO: Implement API call to update profile
      const updatedUser = {
        ...user!,
        name,
        studentId: studentId || undefined,
        department: department || undefined,
        phone: phone || undefined,
        updatedAt: new Date(),
      };
      
      updateUser(updatedUser);
      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile.');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Edit Profile" showBack />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            <UserAvatar user={user} size="large" />
            <Text style={styles.changePhotoText}>Tap to change photo</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              value={name}
              onChangeText={setName}
              leftIcon="person-outline"
              error={errors.name}
            />

            <Input
              label="Email"
              value={user?.email || ''}
              editable={false}
              leftIcon="mail-outline"
              style={styles.disabledInput}
            />

            <Input
              label="Student ID"
              placeholder="Enter your student ID"
              value={studentId}
              onChangeText={setStudentId}
              leftIcon="card-outline"
            />

            <Input
              label="Department"
              placeholder="Enter your department"
              value={department}
              onChangeText={setDepartment}
              leftIcon="school-outline"
            />

            <Input
              label="Phone"
              placeholder="Enter your phone number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              leftIcon="call-outline"
            />
          </View>

          <Button
            title="Save Changes"
            onPress={handleSave}
            loading={isLoading}
            style={styles.saveButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  changePhotoText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
    marginTop: 12,
  },
  form: {
    marginBottom: 24,
  },
  disabledInput: {
    backgroundColor: Colors.surfaceVariant,
    color: Colors.textSecondary,
  },
  saveButton: {
    marginTop: 8,
  },
});
