import { supabase } from '@/lib/supabase';
import { router, Slot, SplashScreen } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

import Colors from '@/constants/Colors';
import * as SystemUI from 'expo-system-ui';
import { useFonts } from 'expo-font'; 
import AnimatedSplash from '../components/AnimatedSplash';
import { initRevenueCat } from '@/lib/revenuecat'; // Importamos nuestra config

const appTheme = Colors.dark;
// Mantiene el splash screen nativo visible hasta que le digamos que se oculte
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Cargar fuentes personalizadas
  const [fontsLoaded, fontError] = useFonts({
    'SpaceMono': require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [isAppReady, setAppReady] = useState(false);
  const [isSplashAnimationComplete, setSplashAnimationComplete] = useState(false);

  useEffect(() => {
    async function prepareApp() {
      try {
        // Establecer color de fondo del sistema
        await SystemUI.setBackgroundColorAsync(appTheme.background);
        
        // 1. Inicializar RevenueCat (Compras)
        await initRevenueCat();
        console.log("RevenueCat inicializado");

        // 2. Verificar Sesión de Usuario (Supabase)
        const { data: { session } } = await supabase.auth.getSession();
        
        // Redirección inicial basada en si hay usuario logueado
        if (session) {
          router.replace('/(app)/(tabs)/home'); 
        } else {
          router.replace('/(auth)/login'); 
        }
        
        // Escuchar cambios en la autenticación (Login/Logout)
        supabase.auth.onAuthStateChange((_event, session) => {
          if (session) {
            router.replace('/(app)/(tabs)/home'); 
          } else {
            router.replace('/(auth)/login'); 
          }
        });

      } catch (e) {
        console.warn("Error al iniciar la app:", e);
      } finally {
        setAppReady(true);
      }
    }

    // Solo iniciar preparación si las fuentes cargaron (o fallaron)
    if (fontsLoaded || fontError) {
      prepareApp();
    }

  }, [fontsLoaded, fontError]); 

  return (
    <View style={{ flex: 1 }}>
      {/* Renderiza la app (Slot) solo cuando las fuentes estén listas */}
      {(fontsLoaded || fontError) && <Slot />}
      
      {/* Muestra el Splash Animado encima hasta que termine */}
      {!isSplashAnimationComplete && (
        <AnimatedSplash
          onAnimationFinish={() => {
            setSplashAnimationComplete(true);
          }}
        />
      )}
    </View>
  );
}