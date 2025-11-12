// src/types/index.ts
export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
  bio?: string;
  postsCount?: number;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export interface Post {
  id: string;
  userId: string;
  userDisplayName: string;
  userPhotoURL?: string;
  content: string;
  imageUrl?: string;
  createdAt: Date;
  likes: number;
  likedBy: string[];
}

export interface PostContextType {
  posts: Post[];
  loading: boolean;
  createPost: (content: string, imageUrl?: string) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  refreshPosts: () => Promise<void>;
}