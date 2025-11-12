// src/contexts/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase.config';
import { User, AuthContextType } from '../types';

const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please sign in instead.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/user-not-found':
      return 'No account found with this email.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection.';
    default:
      return 'An error occurred. Please try again.';
  }
};

// Update the signUp function
const signUp = async (email: string, password: string, displayName: string) => {
  try {
    console.log('📝 Creating user account...');
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    await updateProfile(userCredential.user, { displayName });
    
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      uid: userCredential.user.uid,
      email,
      displayName,
      photoURL: '',
      createdAt: new Date(),
      bio: '',
      postsCount: 0
    });
    
    console.log('✅ User created successfully!');
  } catch (error: any) {
    const errorMessage = getAuthErrorMessage(error.code);
    console.error('❌ Sign up error:', errorMessage);
    throw new Error(errorMessage);
  }
};

// Update the signIn function
const signIn = async (email: string, password: string) => {
  try {
    console.log('🔑 Signing in...');
    await signInWithEmailAndPassword(auth, email, password);
    console.log('✅ Signed in successfully!');
  } catch (error: any) {
    const errorMessage = getAuthErrorMessage(error.code);
    console.error('❌ Sign in error:', errorMessage);
    throw new Error(errorMessage);
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('🔐 Auth state changed:', firebaseUser?.email);
      
      if (firebaseUser) {
        // Fetch additional user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        const userData = userDoc.data();
        
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
          displayName: firebaseUser.displayName || userData?.displayName || '',
          photoURL: firebaseUser.photoURL || userData?.photoURL || '',
          createdAt: userData?.createdAt?.toDate() || new Date()
        });
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      console.log('📝 Creating user account...');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile
      await updateProfile(userCredential.user, { displayName });
      
      // Save additional user data to Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        email,
        displayName,
        photoURL: '',
        createdAt: new Date(),
        bio: '',
        postsCount: 0
      });
      
      console.log('✅ User created successfully!');
    } catch (error: any) {
      console.error('❌ Sign up error:', error.message);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔑 Signing in...');
      await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ Signed in successfully!');
    } catch (error: any) {
      console.error('❌ Sign in error:', error.message);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log('👋 Signing out...');
      await firebaseSignOut(auth);
      console.log('✅ Signed out successfully!');
    } catch (error: any) {
      console.error('❌ Sign out error:', error.message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};