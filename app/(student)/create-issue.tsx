import { Button, Header, Input } from '@/components';
import { ISSUE_CATEGORIES, ISSUE_PRIORITIES, VALIDATION } from '@/constants';
import Colors from '@/constants/Colors';
import { useIssues } from '@/context';
import { IssueCategory, IssuePriority } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Dimensions, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
// Calculate card width: (screen width - padding*2 - gaps) / 3 columns
const categoryCardWidth = (width - 40 - 24) / 3; // 40 = padding, 24 = 2 gaps of 12px

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
      mediaTypes: ['images'],
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

    if (!location.trim()) {
      newErrors.location = 'Location is required';
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
        location: location,
        imageUrl: image || undefined,
      });

      Alert.alert(
        '✅ Success!',
        'Your issue has been reported successfully. We\'ll get back to you soon.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create issue. Please try again.');
    }
  };

  const selectedCategory = ISSUE_CATEGORIES.find(c => c.value === category);

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
          {/* Progress Indicator */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[
                styles.progressFill,
                { width: `${Math.min(100, ((title ? 20 : 0) + (description ? 20 : 0) + (category ? 20 : 0) + (location ? 20 : 0) + (image ? 20 : 0)))}%` }
              ]} />
            </View>
            <Text style={styles.progressText}>Fill in the details to report an issue</Text>
          </View>

          {/* Category Selection */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>What type of issue? *</Text>
              {errors.category && <Text style={styles.errorBadge}>Required</Text>}
            </View>
            <View style={styles.categoryGrid}>
              {ISSUE_CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.value}
                  style={[
                    styles.categoryCard,
                    category === cat.value && styles.categoryCardSelected,
                    category === cat.value && { borderColor: cat.color },
                  ]}
                  onPress={() => setCategory(cat.value as IssueCategory)}
                  activeOpacity={0.7}
                >
                  <View style={[
                    styles.categoryIcon,
                    { backgroundColor: cat.color + '20' },
                    category === cat.value && { backgroundColor: cat.color + '30' },
                  ]}>
                    <Ionicons name={cat.icon as any} size={26} color={cat.color} />
                  </View>
                  <Text style={[
                    styles.categoryLabel,
                    category === cat.value && { color: cat.color, fontWeight: '700' }
                  ]}>
                    {cat.label}
                  </Text>
                  {category === cat.value && (
                    <View style={[styles.categoryCheck, { backgroundColor: cat.color }]}>
                      <Ionicons name="checkmark" size={12} color={Colors.textOnPrimary} />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Title */}
          <View style={styles.section}>
            <Input
              label="Issue Title *"
              placeholder="Brief title describing the problem"
              value={title}
              onChangeText={setTitle}
              error={errors.title}
              maxLength={VALIDATION.title.maxLength}
              leftIcon={<Ionicons name="text" size={20} color={Colors.textSecondary} />}
            />
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.inputLabel}>Description *</Text>
            <View style={[styles.textAreaContainer, errors.description && styles.textAreaError]}>
              <Input
                placeholder="Describe the issue in detail. Include any relevant information that might help us resolve it faster..."
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={5}
                style={styles.textAreaInput}
                maxLength={VALIDATION.description.maxLength}
              />
            </View>
            <View style={styles.textAreaFooter}>
              {errors.description && (
                <Text style={styles.errorText}>{errors.description}</Text>
              )}
              <Text style={styles.charCount}>{description.length}/{VALIDATION.description.maxLength}</Text>
            </View>
          </View>

          {/* Priority */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Priority Level</Text>
            <View style={styles.priorityContainer}>
              {ISSUE_PRIORITIES.map((p) => (
                <TouchableOpacity
                  key={p.value}
                  style={[
                    styles.priorityChip,
                    priority === p.value && styles.priorityChipSelected,
                    priority === p.value && { backgroundColor: p.color, borderColor: p.color },
                  ]}
                  onPress={() => setPriority(p.value as IssuePriority)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="flag"
                    size={16}
                    color={priority === p.value ? Colors.textOnPrimary : p.color}
                  />
                  <Text
                    style={[
                      styles.priorityText,
                      { color: priority === p.value ? Colors.textOnPrimary : p.color },
                    ]}
                  >
                    {p.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Location */}
          <View style={styles.section}>
            <Input
              label="Location *"
              placeholder="e.g., Building A, Room 201"
              value={location}
              onChangeText={setLocation}
              leftIcon={<Ionicons name="location" size={20} color={Colors.textSecondary} />}
              error={errors.location}
            />
          </View>

          {/* Image Upload */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Photo (Optional)</Text>
            <Text style={styles.photoSubtitle}>A photo helps us identify the issue faster</Text>

            {image ? (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: image }} style={styles.imagePreview} />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.5)']}
                  style={styles.imageOverlay}
                />
                <View style={styles.imageActions}>
                  <TouchableOpacity
                    style={styles.imageActionBtn}
                    onPress={showImageOptions}
                  >
                    <Ionicons name="camera" size={18} color={Colors.textOnPrimary} />
                    <Text style={styles.imageActionText}>Change</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.imageActionBtn, styles.imageActionBtnDanger]}
                    onPress={() => setImage(null)}
                  >
                    <Ionicons name="trash" size={18} color={Colors.textOnPrimary} />
                    <Text style={styles.imageActionText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity style={styles.uploadButton} onPress={showImageOptions} activeOpacity={0.8}>
                <View style={styles.uploadIconContainer}>
                  <Ionicons name="camera-outline" size={36} color={Colors.primary} />
                </View>
                <Text style={styles.uploadText}>Add a photo</Text>
                <Text style={styles.uploadHint}>Tap to take a photo or choose from library</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Submit Button */}
          <View style={styles.submitSection}>
            <Button
              title="Submit Report"
              onPress={handleSubmit}
              loading={isLoading}
              fullWidth
              size="large"
            />
            <Text style={styles.submitHint}>
              Your report will be reviewed by the admin team
            </Text>
          </View>
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
  progressContainer: {
    marginBottom: 24,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.surfaceVariant,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: -8,
    marginBottom: 14,
  },
  photoSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 10,
  },
  errorBadge: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.error,
    backgroundColor: Colors.errorLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: categoryCardWidth,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
    position: 'relative',
  },
  categoryCardSelected: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  categoryIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
  },
  categoryCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textAreaContainer: {
    backgroundColor: Colors.surfaceVariant,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  textAreaError: {
    borderColor: Colors.error,
    backgroundColor: Colors.errorLight + '30',
  },
  textAreaInput: {
    minHeight: 120,
    textAlignVertical: 'top',
    paddingTop: 14,
  },
  textAreaFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  charCount: {
    fontSize: 12,
    color: Colors.textLight,
    marginLeft: 'auto',
  },
  errorText: {
    fontSize: 13,
    color: Colors.error,
    fontWeight: '500',
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  priorityChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    gap: 6,
  },
  priorityChipSelected: {
    borderWidth: 2,
  },
  priorityText: {
    fontSize: 13,
    fontWeight: '600',
  },
  uploadButton: {
    backgroundColor: Colors.surface,
    borderRadius: 18,
    padding: 28,
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Colors.primary + '40',
  },
  uploadIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: Colors.primaryLight + '25',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  uploadText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  uploadHint: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  imagePreviewContainer: {
    position: 'relative',
    borderRadius: 18,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: 220,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  imageActions: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    right: 14,
    flexDirection: 'row',
    gap: 10,
  },
  imageActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  imageActionBtnDanger: {
    backgroundColor: Colors.error + 'CC',
  },
  imageActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textOnPrimary,
  },
  submitSection: {
    marginTop: 12,
  },
  submitHint: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 14,
  },
});
