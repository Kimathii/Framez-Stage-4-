// src/navigation/AppNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import FeedScreen from '../screens/FeedScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#6366f1',
          tabBarInactiveTintColor: '#9ca3af',
          tabBarStyle: {
            backgroundColor: '#fff',
            borderTopWidth: 1,
            borderTopColor: '#e5e7eb',
            paddingBottom: 5,
            paddingTop: 5,
            height: 60,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
          headerStyle: {
            backgroundColor: '#6366f1',
          },
          headerTintColor: '#fff',
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
            tabBarIcon: ({ color, size }) => (
              <TabIcon emoji="🏠" color={color} />
            ),
            title: 'Framez Feed',
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <TabIcon emoji="👤" color={color} />
            ),
            title: 'My Profile',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// Simple emoji-based tab icon component
const TabIcon: React.FC<{ emoji: string; color: string }> = ({ emoji, color }) => (
  <Text style={{ fontSize: 24, opacity: color === '#6366f1' ? 1 : 0.5 }}>
    {emoji}
  </Text>
);

// Need to import Text
import { Text } from 'react-native';
