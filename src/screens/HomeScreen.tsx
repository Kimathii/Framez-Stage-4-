// src/screens/HomeScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function HomeScreen() {
  const { user, signOut } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Framez!</Text>
      <Text style={styles.subtitle}>Hello, {user?.displayName || user?.email}!</Text>
      
      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>Email:</Text>
        <Text style={styles.infoValue}>{user?.email}</Text>
        
        <Text style={styles.infoLabel}>User ID:</Text>
        <Text style={styles.infoValue}>{user?.uid}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={signOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#6366f1',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  infoCard: {
    backgroundColor: '#f3f4f6',
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 10,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
  },
  button: {
    backgroundColor: '#ef4444',
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});