// src/screens/CreatePostScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../contexts/AuthContext';
import { usePosts } from '../contexts/PostContext';
import colors from '../constants/colors';
import { useNavigation } from '@react-navigation/native';

export default function CreatePostScreen() {
  const [content, setContent] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();
  const { createPost } = usePosts();
  const navigation = useNavigation();

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need camera roll permissions to upload images.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const removeImage = () => {
    setImageUri(null);
  };

  const handleCreatePost = async () => {
    if (!content.trim() && !imageUri) {
      Alert.alert('Empty Post', 'Please add some content or an image.');
      return;
    }

    setUploading(true);

    try {
      await createPost(content.trim(), imageUri ?? undefined);


      Alert.alert('Success', 'Post created successfully!');
      setContent('');
      setImageUri(null);
      navigation.goBack();
    } catch (error: any) {
      console.error('Error creating post:', error);
      Alert.alert('Error', error.message || 'Failed to create post');
    } finally {
      setUploading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Post</Text>
          <TouchableOpacity
            onPress={handleCreatePost}
            disabled={uploading || (!content.trim() && !imageUri)}
          >
            <Text
              style={[
                styles.postButton,
                (uploading || (!content.trim() && !imageUri)) && styles.postButtonDisabled,
              ]}
            >
              Post
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.displayName?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <Text style={styles.userName}>{user?.displayName || 'Anonymous'}</Text>
        </View>

        <TextInput
          style={styles.textInput}
          placeholder="What's on your mind?"
          placeholderTextColor={colors.textMuted}
          multiline
          value={content}
          onChangeText={setContent}
          maxLength={500}
          editable={!uploading}
        />

        <Text style={styles.characterCount}>
          {content.length}/500
        </Text>

        {imageUri && (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={removeImage}
              disabled={uploading}
            >
              <Text style={styles.removeImageText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.addImageButton}
            onPress={pickImage}
            disabled={uploading || !!imageUri}
          >
            <Text style={styles.addImageIcon}>📷</Text>
            <Text style={styles.addImageText}>
              {imageUri ? 'Image Added' : 'Add Image'}
            </Text>
          </TouchableOpacity>
        </View>

        {uploading && (
          <View style={styles.uploadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.uploadingText}>Creating post...</Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  cancelButton: {
    color: colors.textMuted,
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  postButton: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  postButtonDisabled: {
    color: colors.textDark,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 2,
    borderColor: colors.black,
  },
  avatarText: {
    color: colors.black,
    fontSize: 18,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  textInput: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    color: colors.textPrimary,
    textAlignVertical: 'top',
    minHeight: 150,
  },
  characterCount: {
    textAlign: 'right',
    paddingHorizontal: 15,
    paddingBottom: 10,
    color: colors.textMuted,
    fontSize: 12,
  },
  imagePreviewContainer: {
    margin: 15,
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  removeImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  actionsContainer: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  addImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: colors.backgroundTertiary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  addImageIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  addImageText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  uploadingContainer: {
    alignItems: 'center',
    padding: 30,
  },
  uploadingText: {
    color: colors.textMuted,
    marginTop: 10,
    fontSize: 14,
  },
});