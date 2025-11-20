import { Stack } from 'expo-router';
import React from 'react';
import Colors from '@/constants/Colors'; 

const themeColors = Colors.dark;

export default function RizzStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Ocultamos el header en todas las pantallas
        headerStyle: {
          backgroundColor: themeColors.background,
        },
        contentStyle: {
          backgroundColor: themeColors.background,
        },
        // Animación suave al navegar
        animation: 'slide_from_right', 
      }}
    >
      <Stack.Screen name="index" options={{ title: "app/(app)/(tabs)/rizz/index.tsx" }}/>
      <Stack.Screen name="startConversation" options={{ title: "app/(app)/(tabs)/rizz/startConversation.tsx" }}/>
      <Stack.Screen name="replySuggestions" options={{ title: "app/(app)/(tabs)/rizz/replySuggestions.tsx" }}/>
      <Stack.Screen name="awkwardSituation" options={{ title: "app/(app)/(tabs)/rizz/awkwardSituation.tsx" }}/>
      <Stack.Screen name="pickupLines" options={{ title: "app/(app)/(tabs)/rizz/pickupLines.tsx" }}/>
    </Stack>
  );
}