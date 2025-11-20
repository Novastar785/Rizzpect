// Importar la configuración de i18n primero
import '../i18n';

import { router, Slot, SplashScreen } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import Colors from '@/constants/Colors';
import * as SystemUI from 'expo-system-ui';
import { useFonts } from 'expo-font'; 
import AnimatedSplash from '../components/AnimatedSplash';
import { initRevenueCat } from '@/lib/revenuecat'; 
import Purchases from 'react-native-purchases';

const appTheme = Colors.dark;
SplashScreen.preventAutoHideAsync();

// --- CONFIGURACIÓN DE MODO PRUEBA ---
// Cambia a false para probar el flujo real de producción (con Paywall)
// Cambia a true para saltar el Paywall y probar la app en desarrollo
const IS_DEV_MODE = true; 
// ------------------------------------

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'SpaceMono': require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [isSplashAnimationComplete, setSplashAnimationComplete] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepareApp() {
      try {
        await SystemUI.setBackgroundColorAsync(appTheme.background);
        
        // Inicializar RevenueCat
        // En modo dev, intentamos inicializar pero no bloqueamos si falla
        try {
            await initRevenueCat();
        } catch (e) {
            console.warn("RevenueCat init error (ignorable in dev mode):", e);
        }

      } catch (e) {
        console.warn("Error inicializando la app:", e);
      } finally {
        setIsReady(true);
      }
    }

    prepareApp();
  }, []);

  useEffect(() => {
    // Solo procedemos cuando las fuentes, la inicialización y el splash han terminado
    if (fontsLoaded && isReady && isSplashAnimationComplete) {
      checkSubscriptionAndNavigate();
    }
  }, [fontsLoaded, isReady, isSplashAnimationComplete]);


  const checkSubscriptionAndNavigate = async () => {
    // BYPASS PARA DESARROLLO
    if (IS_DEV_MODE) {
      console.log("⚠️ MODO DESARROLLO: Saltando Paywall y yendo a /rizz");
      router.replace('/(app)/(tabs)/rizz');
      return;
    }

    try {
      const customerInfo = await Purchases.getCustomerInfo();
      const isPro = typeof customerInfo.entitlements.active['rizzflows_premium'] !== "undefined";

      if (isPro) {
        // Usuario Premium -> Va directo a la funcionalidad principal
        router.replace('/(app)/(tabs)/rizz'); 
      } else {
        // Usuario nuevo o sin suscripción -> Paywall directo
        router.replace('/paywall'); 
      }
    } catch (e) {
      console.error("Error verificando suscripción:", e);
      // En caso de error en producción, por seguridad mandamos al paywall
      // A menos que estemos en dev mode (ya manejado arriba)
      router.replace('/paywall');
    }
  };

  // Si hay error de fuentes, retornamos null o un error
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <View style={{ flex: 1, backgroundColor: appTheme.background }}>
      <Slot />
      {!isSplashAnimationComplete && (
        <AnimatedSplash onAnimationFinish={() => setSplashAnimationComplete(true)} />
      )}
    </View>
  );
}