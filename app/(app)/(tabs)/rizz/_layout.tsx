import { Stack } from 'expo-router';
import React from 'react';
import Colors from '@/constants/Colors'; 

// Forzamos el tema oscuro
const themeColors = Colors.dark;

export default function RizzStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: themeColors.background, // Fondo oscuro
        },
        headerTintColor: themeColors.text, // Texto (y flecha) en blanco
        headerShadowVisible: false, // Ocultar sombra 
        headerTitleStyle: {
          color: themeColors.text,
          fontWeight: 'bold', // Título en negrita
        },
        // --- ERROR CORREGIDO ---
        // 'headerBackTitleVisible: false' puede causar errores de TS en algunas configuraciones.
        // Usar 'headerBackTitle: ''' es la forma recomendada de ocultar el texto de retroceso en iOS.
        headerBackTitle: '', 
        // headerBackTitleVisible: false, // Ocultar texto "atrás" en iOS
        // --- FIN DE LA CORRECCIÓN ---
      }}
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