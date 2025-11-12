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
        <Text style={styles.likes}>❤️ {item.likes} likes</Text>
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
        <ActivityIndicator size="large" color="#6366f1" />
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
<Text style={styles.emptyText}>No posts yet. Go to Feed to create your first post!</Text>
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
listContent: {
paddingBottom: 20,
},
profileHeader: {
backgroundColor: '#fff',
padding: 20,
alignItems: 'center',
borderBottomWidth: 1,
borderBottomColor: '#e5e7eb',
},
avatarLarge: {
width: 80,
height: 80,
borderRadius: 40,
backgroundColor: '#6366f1',
justifyContent: 'center',
alignItems: 'center',
marginBottom: 15,
},
avatarTextLarge: {
color: '#fff',
fontSize: 36,
fontWeight: 'bold',
},
displayName: {
fontSize: 24,
fontWeight: 'bold',
color: '#111',
marginBottom: 5,
},
email: {
fontSize: 14,
color: '#6b7280',
marginBottom: 20,
},
statsContainer: {
flexDirection: 'row',
gap: 40,
marginBottom: 20,
},
statItem: {
alignItems: 'center',
},
statNumber: {
fontSize: 22,
fontWeight: 'bold',
color: '#6366f1',
},
statLabel: {
fontSize: 14,
color: '#6b7280',
marginTop: 5,
},
signOutButton: {
backgroundColor: '#ef4444',
paddingVertical: 12,
paddingHorizontal: 40,
borderRadius: 10,
marginBottom: 20,
},
signOutButtonText: {
color: '#fff',
fontSize: 16,
fontWeight: 'bold',
},
sectionHeader: {
width: '100%',
paddingVertical: 15,
borderTopWidth: 1,
borderTopColor: '#e5e7eb',
},
sectionTitle: {
fontSize: 18,
fontWeight: 'bold',
color: '#111',
},
postCard: {
backgroundColor: '#fff',
borderRadius: 10,
padding: 15,
marginHorizontal: 15,
marginTop: 15,
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
timestamp: {
fontSize: 12,
color: '#6b7280',
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
height: 250,
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