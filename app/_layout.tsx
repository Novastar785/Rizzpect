import { supabase } from '@/lib/supabase';
import { router, Slot, SplashScreen } from 'expo-router';
import React, { useEffect, useState } from 'react'; // --- 1. Importar useState ---
import { Platform, View } from 'react-native';

import Colors from '@/constants/Colors';
import * as SystemUI from 'expo-system-ui';
import { useFonts } from 'expo-font'; 
import AnimatedSplash from '../components/AnimatedSplash'; // --- 2. Importar el nuevo componente ---

const appTheme = Colors.dark;
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'SpaceMono': require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // --- 3. Nuevos estados ---
  const [isAppReady, setAppReady] = useState(false);
  const [isSplashAnimationComplete, setSplashAnimationComplete] = useState(false);
  // --- Fin de nuevos estados ---

  useEffect(() => {
    async function prepareApp() {
      try {
        await SystemUI.setBackgroundColorAsync(appTheme.background); 
        
        // --- 4. La lógica de carga de la app ---
        // (La dejamos casi igual, pero sin ocultar el splash)
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          router.replace('/(app)/(tabs)/home'); 
        } else {
          router.replace('/(auth)/login'); 
        }
        
        const { data: listener } = supabase.auth.onAuthStateChange(
          (_event, session) => {
            if (session) {
              router.replace('/(app)/(tabs)/home'); 
            } else {
              router.replace('/(auth)/login'); 
            }
          }
        );

        // No retornamos el 'unsubscribe' aquí, lo manejamos de otra forma si es necesario
        // Pero para el layout raíz, suele estar bien así.

      } catch (e) {
        console.warn(e);
      } finally {
        // 5. Avisar que la app está lista (fuentes y sesión)
        setAppReady(true);
      }
    }

    // Esperar a que las fuentes carguen antes de preparar la app
    if (fontsLoaded || fontError) {
      prepareApp();
    }

  }, [fontsLoaded, fontError]); 

  // --- 6. Lógica de renderizado ---
  // El <Slot> (tu app) se renderiza "debajo" de la animación
  // para que esté lista para mostrarse.
  return (
    <View style={{ flex: 1 }}>
      {/* Renderiza la app tan pronto como las fuentes estén listas.
        Estará oculta por el Splash Nativo, y luego por el Splash Animado.
      */}
      {(fontsLoaded || fontError) && <Slot />}
      
      {/* Muestra la animación encima de la app (que está cargando).
        'isSplashAnimationComplete' se volverá 'true' cuando la animación termine.
      */}
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