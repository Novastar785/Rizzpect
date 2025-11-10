import { supabase } from '@/lib/supabase';
import { router, Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';

// ¡NUEVA IMPORTACIÓN!
import Colors from '@/constants/Colors';
import * as SystemUI from 'expo-system-ui';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    async function initApp() {
      // --- ¡NUEVO CAMBIO! ---
      // 1. Hacemos que la app sea "edge-to-edge"
      // Le decimos a la barra de Android que sea transparente
      // y que use nuestro color de fondo (blanco).
      if (Platform.OS === 'android') {
        SystemUI.setBackgroundColorAsync(Colors.light.background);
      }
      // --- FIN DEL CAMBIO ---

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        router.replace('/(app)/(tabs)/home'); // --- CAMBIO: Ruta corregida
      } else {
        router.replace('/(auth)/login'); // --- CAMBIO: Ruta corregida
      }
      SplashScreen.hideAsync();

      const { data: listener } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          if (session) {
            router.replace('/(app)/(tabs)/home'); // --- CAMBIO: Ruta corregida
          } else {
            router.replace('/(auth)/login'); // --- CAMBIO: Ruta corregida
          }
        }
      );

      return () => {
        listener.subscription.unsubscribe();
      };
    }
    initApp();

  }, []);

  // (Esto no cambia)
  return <Slot />;
}