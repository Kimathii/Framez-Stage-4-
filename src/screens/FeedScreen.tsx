// src/screens/FeedScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  RefreshControl,
  ActivityIndicator,
  Image
} from 'react-native';
import { usePosts } from '../contexts/PostContext';
import { useAuth } from '../contexts/AuthContext';
import { Post } from '../types';
import { pickImage, uploadToCloudinary } from '../utils/imagePicker';
import { CLOUDINARY_CONFIG } from '../../cloudinary.config';

export default function FeedScreen() {
  const { posts, loading, createPost, deletePost } = usePosts();
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handlePickImage = async () => {
    const uri = await pickImage();
    if (uri) {
      setSelectedImageUri(uri);
      console.log('🖼️  Image selected:', uri);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImageUri(null);
  };

  const handleCreatePost = async () => {
    if (!content.trim() && !selectedImageUri) {
      Alert.alert('Error', 'Please add some content or an image');
      return;
    }

    setIsCreating(true);
    try {
      let imageUrl: string | undefined;

      // Upload image to Cloudinary if selected
      if (selectedImageUri) {
        setIsUploading(true);
        imageUrl = await uploadToCloudinary(
          selectedImageUri,
          CLOUDINARY_CONFIG.cloudName,
          CLOUDINARY_CONFIG.uploadPreset
        );
        setIsUploading(false);
      }

      // Create post with text and optional image URL
      await createPost(content, imageUrl);
      
      // Reset form
      setContent('');
      setSelectedImageUri(null);
      Alert.alert('Success', 'Post created!');
    } catch (error: any) {
      Alert.alert('Error', error.message);
      setIsUploading(false);
    }
    setIsCreating(false);
  };

  const handleDeletePost = (postId: string, userId: string) => {
    if (userId !== user?.uid) {
      Alert.alert('Error', 'You can only delete your own posts');
      return;
    }

    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePost(postId);
              Alert.alert('Success', 'Post deleted');
            } catch (error: any) {
              Alert.alert('Error', error.message);
            }
          }
        }
      ]
    );
  };

  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {item.userDisplayName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View>
            <Text style={styles.userName}>{item.userDisplayName}</Text>
            <Text style={styles.timestamp}>
              {item.createdAt.toLocaleDateString()} at{' '}
              {item.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        </View>
        
        {item.userId === user?.uid && (
          <TouchableOpacity onPress={() => handleDeletePost(item.id, item.userId)}>
            <Text style={styles.deleteButton}>Delete</Text>
          </TouchableOpacity>
        )}
      </View>

      {item.content ? (
        <Text style={styles.postContent}>{item.content}</Text>
      ) : null}

      {item.imageUrl ? (
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.postImage}
          resizeMode="cover"
        />
      ) : null}

      <View style={styles.postFooter}>
        <Text style={styles.likes}>❤️ {item.likes} likes</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.createPostSection}>
        <TextInput
          style={styles.input}
          placeholder="What's on your mind?"
          value={content}
          onChangeText={setContent}
          multiline
          maxLength={500}
        />

        {selectedImageUri && (
          <View style={styles.imagePreviewContainer}>
            <Image
              source={{ uri: selectedImageUri }}
              style={styles.imagePreview}
              resizeMode="cover"
            />
            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={handleRemoveImage}
            >
              <Text style={styles.removeImageText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.imageButton}
            onPress={handlePickImage}
            disabled={isCreating}
          >
            <Text style={styles.imageButtonText}>📷 Add Image</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.postButton,
              (isCreating || isUploading) && styles.postButtonDisabled
            ]}
            onPress={handleCreatePost}
            disabled={isCreating || isUploading}
          >
            <Text style={styles.postButtonText}>
              {isUploading ? 'Uploading...' : isCreating ? 'Posting...' : 'Post'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.feed}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={() => {}} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No posts yet. Be the first to post!</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createPostSection: {
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  input: {
    backgroundColor: '#f3f4f6',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  imagePreviewContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  removeImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  imageButton: {
    flex: 1,
    backgroundColor: '#e5e7eb',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  imageButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  postButton: {
    flex: 1,
    backgroundColor: '#6366f1',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  postButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  postButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  feed: {
    padding: 15,
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  timestamp: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  deleteButton: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '600',
  },
  postContent: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginBottom: 12,
  },
  postFooter: {
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 10,
  },
  likes: {
    fontSize: 14,
    color: '#6b7280',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
  },
});