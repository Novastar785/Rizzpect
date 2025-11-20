import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React from 'react';
import { View } from 'react-native';

const theme = Colors.dark;

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.card,
          paddingBottom: insets.bottom,
          paddingTop: 8,
          height: 60 + insets.bottom,
          borderTopWidth: 1,
          borderTopColor: theme.border,
        },
        tabBarActiveTintColor: theme.tint,
        tabBarInactiveTintColor: theme.tabIconDefault,
        tabBarShowLabel: false,
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="rizz"
        options={{
          title: 'Rizz',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ 
              backgroundColor: theme.tint, 
              padding: 12, borderRadius: 30, width: 60, height: 60, 
              justifyContent: 'center', alignItems: 'center', bottom: 20,
              shadowColor: theme.tint, shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.4, shadowRadius: 5, elevation: 8,
            }}>
              <Ionicons name={"sparkles"} size={30} color={"#FFFFFF"} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "person" : "person-outline"} size={26} color={color} />
          ),
        }}
      />
      {/* Store Tab hidden */}
      <Tabs.Screen
         name="store"
         options={{ href: null }} 
      />
    </Tabs>
  );
}