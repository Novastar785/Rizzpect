import { Stack } from 'expo-router';
import React from 'react';
import { View, StyleSheet } from 'react-native'; // Importamos View y StyleSheet
import { LinearGradient } from 'expo-linear-gradient'; // Importamos el Gradiente
import Colors from '@/constants/Colors'; 

const themeColors = Colors.dark;
const GRADIENT_COLORS = ['#1a0b2e', '#000000', '#000000'] as const; // Definimos colores aquí

export default function RizzStackLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: themeColors.background }}>
      {/* FONDO GLOBAL: Se mantiene estático entre transiciones, eliminando el flicker */}
      <LinearGradient
        colors={GRADIENT_COLORS}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0.8 }}
        style={StyleSheet.absoluteFill}
      />
      
      <Stack
        screenOptions={{
          headerShown: false,
          headerStyle: {
            backgroundColor: 'transparent',
          },
          contentStyle: {
            backgroundColor: 'transparent', // Las pantallas serán transparentes para ver el fondo
          },
          animation: 'slide_from_right', 
        }}
      >
        <Stack.Screen name="index" options={{ title: "app/(app)/(tabs)/rizz/index.tsx" }}/>
        <Stack.Screen name="startConversation" options={{ title: "app/(app)/(tabs)/rizz/startConversation.tsx" }}/>
        <Stack.Screen name="replySuggestions" options={{ title: "app/(app)/(tabs)/rizz/replySuggestions.tsx" }}/>
        <Stack.Screen name="awkwardSituation" options={{ title: "app/(app)/(tabs)/rizz/awkwardSituation.tsx" }}/>
        <Stack.Screen name="pickupLines" options={{ title: "app/(app)/(tabs)/rizz/pickupLines.tsx" }}/>
      </Stack>
    </View>
  );
}