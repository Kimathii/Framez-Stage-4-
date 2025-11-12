// App.tsx - Updated with Black & Gold Theme
import React from 'react';
import { ActivityIndicator, View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { PostProvider } from './src/contexts/PostContext';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { NetworkStatus } from './src/components/NetworkStatus';
import AuthScreen from './src/screens/AuthScreen';
import AppNavigator from './src/navigation/AppNavigator';
import colors from './src/constants/colors';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor={colors.black} />
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!user) {
    return (
      <>
        <StatusBar barStyle="light-content" backgroundColor={colors.black} />
        <NetworkStatus />
        <AuthScreen />
      </>
    );
  }

  return (
    <PostProvider>
      <StatusBar barStyle="light-content" backgroundColor={colors.black} />
      <NetworkStatus />
      <AppNavigator />
    </PostProvider>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.black,
  },
});