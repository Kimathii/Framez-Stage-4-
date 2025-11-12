// src/navigation/AppNavigator.tsx
import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import FeedScreen from '../screens/FeedScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CreatePostScreen from '../screens/CreatePostScreen';
import colors from '../constants/colors';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarStyle: {
            backgroundColor: colors.black,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            paddingBottom: Platform.OS === 'ios' ? 20 : 5,
            paddingTop: 5,
            height: Platform.OS === 'ios' ? 85 : 60,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
          headerStyle: {
            backgroundColor: colors.black,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          },
          headerTintColor: colors.primary,
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
          },
        }}
      >
        <Tab.Screen
          name="Feed"
          component={FeedScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <TabIcon emoji="🏠" color={color} />
            ),
            title: 'Framez',
          }}
        />
        <Tab.Screen
          name="CreatePost"
          component={CreatePostScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={styles.createButtonContainer}>
                <View style={[styles.createButton, focused && styles.createButtonFocused]}>
                  <Text style={styles.createButtonText}>+</Text>
                </View>
              </View>
            ),
            tabBarLabel: () => null,
            title: 'Create Post',
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <TabIcon emoji="👤" color={color} />
            ),
            title: 'My Profile',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const TabIcon: React.FC<{ emoji: string; color: string }> = ({ emoji, color }) => (
  <Text style={{ fontSize: 24, opacity: color === colors.primary ? 1 : 0.5 }}>
    {emoji}
  </Text>
);

const styles = StyleSheet.create({
  createButtonContainer: {
    position: 'absolute',
    top: -15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.black,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  createButtonFocused: {
    backgroundColor: colors.primaryDark,
    transform: [{ scale: 1.1 }],
  },
  createButtonText: {
    color: colors.black,
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
});