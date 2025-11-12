// src/contexts/PostContext.tsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  increment,
  Timestamp
} from 'firebase/firestore';
import { db } from '../../firebase.config';
import { Post, PostContextType } from '../types';
import { useAuth } from './AuthContext';

// Helper function for Firestore error messages
const getFirestoreErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'permission-denied':
      return 'You don\'t have permission to perform this action.';
    case 'not-found':
      return 'The requested post was not found.';
    case 'already-exists':
      return 'This post already exists.';
    case 'resource-exhausted':
      return 'Too many requests. Please try again later.';
    case 'unauthenticated':
      return 'Please sign in to perform this action.';
    default:
      return 'An error occurred. Please try again.';
  }
};

// Create Context
const PostContext = createContext<PostContextType | undefined>(undefined);

// Provider Component
export const PostProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Real-time posts listener
  useEffect(() => {
    console.log('📡 Setting up posts listener...');
    
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const postsData: Post[] = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            userId: data.userId,
            userDisplayName: data.userDisplayName,
            userPhotoURL: data.userPhotoURL,
            content: data.content,
            imageUrl: data.imageUrl,
            createdAt: data.createdAt?.toDate() || new Date(),
            likes: data.likes || 0,
            likedBy: data.likedBy || []
          };
        });
        
        console.log(`📦 Loaded ${postsData.length} posts`);
        setPosts(postsData);
        setLoading(false);
      },
      (error) => {
        console.error('❌ Error loading posts:', error);
        setLoading(false);
      }
    );

    return () => {
      console.log('🔌 Cleaning up posts listener');
      unsubscribe();
    };
  }, []);

  // Create a new post
  const createPost = async (content: string, imageUrl?: string) => {
    if (!user) {
      throw new Error('Must be logged in to create post');
    }

    if (!content.trim() && !imageUrl) {
      throw new Error('Post must contain text or an image');
    }

    try {
      console.log('📝 Creating new post...');
      
      const postData = {
        userId: user.uid,
        userDisplayName: user.displayName || 'Anonymous',
        userPhotoURL: user.photoURL || '',
        content: content.trim(),
        imageUrl: imageUrl || '',
        createdAt: Timestamp.now(),
        likes: 0,
        likedBy: []
      };

      await addDoc(collection(db, 'posts'), postData);
      
      // Update user's post count
      await updateDoc(doc(db, 'users', user.uid), {
        postsCount: increment(1)
      });
      
      console.log('✅ Post created successfully!');
    } catch (error: any) {
      const errorMessage = getFirestoreErrorMessage(error.code);
      console.error('❌ Error creating post:', errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Delete a post
  const deletePost = async (postId: string) => {
    if (!user) {
      throw new Error('Must be logged in to delete post');
    }

    try {
      console.log('🗑️ Deleting post...');
      
      await deleteDoc(doc(db, 'posts', postId));
      
      // Update user's post count
      await updateDoc(doc(db, 'users', user.uid), {
        postsCount: increment(-1)
      });
      
      console.log('✅ Post deleted successfully!');
    } catch (error: any) {
      const errorMessage = getFirestoreErrorMessage(error.code);
      console.error('❌ Error deleting post:', errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Refresh posts (handled automatically by listener)
  const refreshPosts = async () => {
    console.log('🔄 Posts refresh requested (handled by real-time listener)');
    // The onSnapshot listener handles real-time updates automatically
    // This function exists for API compatibility but doesn't need to do anything
  };

  return (
    <PostContext.Provider 
      value={{ 
        posts, 
        loading, 
        createPost, 
        deletePost, 
        refreshPosts 
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

// Custom hook to use PostContext
export const usePosts = () => {
  const context = useContext(PostContext);
  if (context === undefined) {
    throw new Error('usePosts must be used within a PostProvider');
  }
  return context;
};