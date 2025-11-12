// src/screens/AuthScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import colors from '../constants/colors';

export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const { signUp, signIn } = useAuth();

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (isSignUp && !displayName) {
      Alert.alert('Error', 'Please enter your display name');
      return;
    }

    try {
      if (isSignUp) {
        await signUp(email, password, displayName);
        Alert.alert('Success', 'Account created successfully!');
      } else {
        await signIn(email, password);
        Alert.alert('Success', 'Signed in successfully!');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.formContainer}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>✨</Text>
          <Text style={styles.title}>Framez</Text>
        </View>
        <Text style={styles.subtitle}>
          {isSignUp ? 'Create your account' : 'Welcome back'}
        </Text>

        {isSignUp && (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Display Name"
              placeholderTextColor={colors.textMuted}
              value={displayName}
              onChangeText={setDisplayName}
              autoCapitalize="words"
            />
          </View>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={colors.textMuted}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={colors.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleAuth}>
          <Text style={styles.buttonText}>
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)} style={styles.toggleContainer}>
          <Text style={styles.toggleText}>
            {isSignUp
              ? 'Already have an account? '
              : "Don't have an account? "}
          </Text>
          <Text style={styles.toggleLink}>
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    fontSize: 64,
    marginBottom: 10,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.primary,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    color: colors.textMuted,
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    backgroundColor: colors.backgroundTertiary,
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
    borderWidth: 2,
    borderColor: colors.black,
  },
  buttonText: {
    color: colors.black,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },
  toggleText: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: 14,
  },
  toggleLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});