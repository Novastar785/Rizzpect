import { supabase } from '@/lib/supabase';
import { router, Slot, SplashScreen } from 'expo-router';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';

import Colors from '@/constants/Colors';
import * as SystemUI from 'expo-system-ui';
import { useFonts } from 'expo-font'; // Importar useFonts

// Forzamos el tema oscuro desde el inicio
const appTheme = Colors.dark;

// Prevenir que el splash se oculte automáticamente
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Cargar fuentes
  const [fontsLoaded, fontError] = useFonts({
    'SpaceMono': require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    async function initApp() {
      // 1. Configurar color de UI del sistema
      try {
        // Esta línea es correcta y funciona en todas las plataformas
        await SystemUI.setBackgroundColorAsync(appTheme.background); 
        
        // --- ERROR CORREGIDO ---
        // La siguiente línea causaba el error y no es necesaria
        // para el modo edge-to-edge.
        /*
        if (Platform.OS === 'android') {
          await SystemUI.setNavigationBarColorAsync(appTheme.background);
        }
        */
        // --- FIN DE LA CORRECCIÓN ---

      } catch (e) {
        console.warn('SystemUI setting failed:', e);
      }

      // 2. Esperar a que las fuentes carguen
      if (!fontsLoaded && !fontError) {
        return; // Esperar al siguiente render
      }

      // 3. Revisar la sesión de Supabase
      const {
        data: { session },
      } = await supabase.auth.getSession();
      
      if (session) {
        router.replace('/(app)/(tabs)/home'); 
      } else {
        router.replace('/(auth)/login'); 
      }
      
      // 4. Ocultar el Splash Screen AHORA que todo está listo
      SplashScreen.hideAsync();

      // 5. Configurar el listener de autenticación
      const { data: listener } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          if (session) {
            router.replace('/(app)/(tabs)/home'); 
          } else {
            router.replace('/(auth)/login'); 
          }
        }
      );

      return () => {
        listener.subscription.unsubscribe();
      };
    }
    
    initApp();

  }, [fontsLoaded, fontError]); // Depender de la carga de fuentes

  // Si las fuentes no han cargado, no renderizar nada (el Splash sigue visible)
  if (!fontsLoaded && !fontError) {
    return null;
  }

  // Renderizar el layout de la app
  return <Slot />;
}