// src/screens/FeedScreen.tsx
import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
  Image
} from 'react-native';
import { usePosts } from '../contexts/PostContext';
import { useAuth } from '../contexts/AuthContext';
import { Post } from '../types';
import colors from '../constants/colors';

export default function FeedScreen() {
  const { posts, loading, deletePost } = usePosts();
  const { user } = useAuth();

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
        <View style={styles.likeContainer}>
          <Text style={styles.likeIcon}>❤️</Text>
          <Text style={styles.likes}>{item.likes} likes</Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.feed}
        refreshControl={
          <RefreshControl 
            refreshing={loading} 
            onRefresh={() => {}}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📝</Text>
            <Text style={styles.emptyText}>No posts yet.</Text>
            <Text style={styles.emptySubtext}>Tap the + button to create your first post!</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  feed: {
    padding: 15,
    paddingBottom: 100, // Extra space for FAB
  },
  postCard: {
    backgroundColor: colors.backgroundTertiary,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colors.border,
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
  timestamp: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  deleteButton: {
    color: colors.error,
    fontSize: 14,
    fontWeight: '600',
  },
  postContent: {
    fontSize: 16,
    color: colors.textPrimary,
    lineHeight: 24,
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  postFooter: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10,
  },
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeIcon: {
    fontSize: 16,
    marginRight: 5,
  },
  likes: {
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 60,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    color: colors.textPrimary,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
  },
});