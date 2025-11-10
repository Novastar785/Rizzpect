import Colors from '@/constants/Colors';
import { Stack } from 'expo-router';
import React from 'react';

/**
 * Este layout es para las rutas públicas (/(public)/...).
 * No tiene la barra de pestañas (Tabs) y usa un estilo simple.
 * Forzamos el modo claro para que coincida con el resto de la app.
 */
export default function PublicLayout() {
  const tintColor = Colors.light.tint;

  return (
    <Stack
      screenOptions={{
        // Usamos el mismo color verde para la cabecera pública
        headerStyle: {
          backgroundColor: tintColor,
        },
        headerTintColor: '#FFFFFF', // Texto de cabecera blanco
      }}>
      <Stack.Screen
        name="pet/[id]"
        options={{
          title: 'Pet Profile',
        }}
      />
    </Stack>
  );
}