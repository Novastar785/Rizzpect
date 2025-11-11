import { Stack } from 'expo-router';
import React from 'react';
import Colors from '@/constants/Colors'; // --- NUEVO: Importar colores ---

// Forzamos el tema oscuro
const themeColors = Colors.dark;

export default function RizzStackLayout() {
  return (
    <Stack
      // --- NUEVO: Opciones de pantalla para el Stack ---
      screenOptions={{
        headerStyle: {
          backgroundColor: themeColors.background, // Fondo oscuro
        },
        headerTintColor: themeColors.text, // Texto (y flecha) en blanco
        headerShadowVisible: false, // Ocultar sombra si se desea
        headerTitleStyle: {
          color: themeColors.text,
        },
      }}
      // --- FIN DEL CAMBIO ---
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="startConversation"
        options={{ title: 'Start a Conversation' }}
      />
      <Stack.Screen
        name="replySuggestions"
        options={{ title: 'Get Reply Suggestions' }}
      />
      <Stack.Screen
        name="awkwardSituation"
        options={{ title: 'Awkward Situations' }}
      />
      <Stack.Screen
        name="pickupLines"
        options={{ title: 'Banger Pickup Lines' }}
      />
    </Stack>
  );
}