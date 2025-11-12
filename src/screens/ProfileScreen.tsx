// src/screens/ProfileScreen.tsx
import React, { useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { usePosts } from '../contexts/PostContext';
import { Post } from '../types';
import colors from '../constants/colors';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { posts, loading, deletePost } = usePosts();

  // Filter posts by current user
  const userPosts = useMemo(() => {
    return posts.filter(post => post.userId === user?.uid);
  }, [posts, user]);

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: signOut
        }
      ]
    );
  };

  const handleDeletePost = (postId: string) => {
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
        <Text style={styles.timestamp}>
          {item.createdAt.toLocaleDateString()} at{' '}
          {item.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
        
        <TouchableOpacity onPress={() => handleDeletePost(item.id)}>
          <Text style={styles.deleteButton}>Delete</Text>
        </TouchableOpacity>
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

  const ListHeader = () => (
    <View style={styles.profileHeader}>
      <View style={styles.avatarLarge}>
        <Text style={styles.avatarTextLarge}>
          {user?.displayName?.charAt(0).toUpperCase() || 'U'}
        </Text>
      </View>
      
      <Text style={styles.displayName}>{user?.displayName || 'Anonymous'}</Text>
      <Text style={styles.email}>{user?.email}</Text>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{userPosts.length}</Text>
          <Text style={styles.statLabel}>Posts</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {userPosts.reduce((sum, post) => sum + post.likes, 0)}
          </Text>
          <Text style={styles.statLabel}>Likes</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutButtonText}>Sign Out</Text>
      </TouchableOpacity>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>My Posts</Text>
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
        data={userPosts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listContent}
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
  listContent: {
    paddingBottom: 100, // Extra space for FAB
  },
  profileHeader: {
    backgroundColor: colors.backgroundSecondary,
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 3,
    borderColor: colors.black,
  },
  avatarTextLarge: {
    color: colors.black,
    fontSize: 48,
    fontWeight: 'bold',
  },
  displayName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: colors.backgroundTertiary,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 5,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  signOutButton: {
    backgroundColor: colors.error,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 20,
  },
  signOutButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionHeader: {
    width: '100%',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  postCard: {
    backgroundColor: colors.backgroundTertiary,
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 15,
    marginTop: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  timestamp: {
    fontSize: 12,
    color: colors.textMuted,
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
    height: 250,
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