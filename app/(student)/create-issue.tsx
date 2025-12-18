import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Button, Input, Header } from '@/components';
import { useIssues } from '@/context';
import Colors from '@/constants/Colors';
import { ISSUE_CATEGORIES, ISSUE_PRIORITIES, VALIDATION } from '@/constants';
import { IssueCategory, IssuePriority } from '@/types';

export default function CreateIssueScreen() {
  const router = useRouter();
  const { createIssue, isLoading } = useIssues();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<IssueCategory | null>(null);
  const [priority, setPriority] = useState<IssuePriority>('medium');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Please allow access to your photos to upload an image.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Please allow access to your camera to take a photo.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImage(result.assets[0].uri);
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      'Add Photo',
      'Choose how to add a photo',
      [
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Library', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length < VALIDATION.title.minLength) {
      newErrors.title = `Title must be at least ${VALIDATION.title.minLength} characters`;
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required';
    } else if (description.length < VALIDATION.description.minLength) {
      newErrors.description = `Description must be at least ${VALIDATION.description.minLength} characters`;
    }

    if (!category) {
      newErrors.category = 'Please select a category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      await createIssue({
        title,
        description,
        category: category!,
        priority,
        location: location || undefined,
        imageUrl: image || undefined,
      });
      
      // Clear form data
      setTitle('');
      setDescription('');
      setCategory(null);
      setPriority('medium');
      setLocation('');
      setImage(null);
      setErrors({});
      
      Alert.alert(
        'Success',
        'Your issue has been reported successfully!',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create issue. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Report Issue" showBack />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Category Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Category *</Text>
            {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
            <View style={styles.categoryGrid}>
              {ISSUE_CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.value}
                  style={[
                    styles.categoryCard,
                    category === cat.value && { borderColor: cat.color, backgroundColor: cat.color + '15' },
                  ]}
                  onPress={() => setCategory(cat.value as IssueCategory)}
                >
                  <View style={[styles.categoryIcon, { backgroundColor: cat.color + '20' }]}>
                    <Ionicons name={cat.icon as any} size={24} color={cat.color} />
                  </View>
                  <Text style={[styles.categoryLabel, category === cat.value && { color: cat.color }]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Title */}
          <Input
            label="Title *"
            placeholder="Brief title for your issue"
            value={title}
            onChangeText={setTitle}
            error={errors.title}
            maxLength={VALIDATION.title.maxLength}
          />

          {/* Description */}
          <View style={styles.textAreaContainer}>
            <Text style={styles.label}>Description *</Text>
            <View style={[styles.textArea, errors.description && styles.textAreaError]}>
              <Input
                placeholder="Describe the issue in detail..."
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                style={styles.textAreaInput}
                maxLength={VALIDATION.description.maxLength}
              />
            </View>
            {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
            <Text style={styles.charCount}>{description.length}/{VALIDATION.description.maxLength}</Text>
          </View>

          {/* Priority */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Priority</Text>
            <View style={styles.priorityContainer}>
              {ISSUE_PRIORITIES.map((p) => (
                <TouchableOpacity
                  key={p.value}
                  style={[
                    styles.priorityChip,
                    priority === p.value && { backgroundColor: p.color, borderColor: p.color },
                  ]}
                  onPress={() => setPriority(p.value as IssuePriority)}
                >
                  <Ionicons
                    name="flag"
                    size={14}
                    color={priority === p.value ? Colors.textOnPrimary : p.color}
                  />
                  <Text
                    style={[
                      styles.priorityText,
                      priority === p.value && { color: Colors.textOnPrimary },
                    ]}
                  >
                    {p.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Location */}
          <Input
            label="Location (Optional)"
            placeholder="e.g., Building A, Room 201"
            value={location}
            onChangeText={setLocation}
            leftIcon="location-outline"
          />

          {/* Image Upload */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Photo (Optional)</Text>
            {image ? (
              <View style={styles.imageContainer}>
                <Image source={{ uri: image }} style={styles.image} />
                <TouchableOpacity
                  style={styles.removeImage}
                  onPress={() => setImage(null)}
                >
                  <Ionicons name="close-circle" size={28} color={Colors.error} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.uploadButton} onPress={showImageOptions}>
                <Ionicons name="camera-outline" size={32} color={Colors.textSecondary} />
                <Text style={styles.uploadText}>Add a photo</Text>
                <Text style={styles.uploadHint}>This helps us identify the issue faster</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Submit Button */}
          <Button
            title="Submit Report"
            onPress={handleSubmit}
            loading={isLoading}
            style={styles.submitButton}
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
  },
  textAreaContainer: {
    marginBottom: 16,
  },
  textArea: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  textAreaError: {
    borderColor: Colors.error,
    borderWidth: 1,
  },
  textAreaInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'right',
    marginTop: 4,
  },
  priorityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  priorityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.border,
    gap: 6,
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  uploadButton: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Colors.border,
  },
  uploadText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 12,
  },
  uploadHint: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  removeImage: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: Colors.surface,
    borderRadius: 14,
  },
  submitButton: {
    marginTop: 24,
  },
  errorText: {
    fontSize: 12,
    color: Colors.error,
    marginTop: 4,
    marginBottom: 8,
  },
});
