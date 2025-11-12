// src/components/NetworkStatus.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

export const NetworkStatus: React.FC = () => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? true);
    });

    return () => unsubscribe();
  }, []);

  if (isConnected) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>⚠️ No internet connection</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ef4444',
    padding: 10,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});