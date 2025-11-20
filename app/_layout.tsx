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
// Pon esto en 'true' para probar en Expo Go sin verificaciones de pago.
// Pon esto en 'false' para la versión de producción o para probar el flujo real de pagos.
const IS_DEV_MODE = true; 
// ------------------------------------

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'SpaceMono': require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [isSplashAnimationComplete, setSplashAnimationComplete] = useState(false);

  useEffect(() => {
    async function checkSubscription() {
      await SystemUI.setBackgroundColorAsync(appTheme.background);

      // --- LÓGICA DE BYPASS PARA DESARROLLO ---
      if (IS_DEV_MODE) {
        console.log("⚠️ MODO DESARROLLO ACTIVO: Saltando verificación de RevenueCat");
        // Intentamos inicializar para que no exploten otras pantallas, 
        // pero si falla no importa, vamos al home igual.
        try { await initRevenueCat(); } catch (e) { console.log("RevenueCat init skipped/failed in Dev Mode"); }
        
        router.replace('/(app)/(tabs)/home'); 
        return; 
      }
      // ----------------------------------------

      try {
        // 1. Initialize RevenueCat
        await initRevenueCat();

        // 2. Check Subscription Status
        const customerInfo = await Purchases.getCustomerInfo();
        const isPro = typeof customerInfo.entitlements.active['rizzflows_premium'] !== "undefined";

        // 3. Traffic Light Logic
        if (isPro) {
          router.replace('/(app)/(tabs)/home'); // Valid Subscription -> Go to App
        } else {
          router.replace('/paywall'); // No Subscription -> Go to Paywall
        }
      } catch (e) {
        console.warn("Subscription check failed:", e);
        // Fallback to paywall on error ensures we don't give free access accidentally
        // (Unless we are in dev mode handled above)
        router.replace('/paywall'); 
      }
    }

    // Only start checking once fonts are loaded or failed
    if (fontsLoaded || fontError) {
      checkSubscription();
    }
  }, [fontsLoaded, fontError]);

  return (
    <View style={{ flex: 1 }}>
      {(fontsLoaded || fontError) && <Slot />}
      {!isSplashAnimationComplete && (
        <AnimatedSplash onAnimationFinish={() => setSplashAnimationComplete(true)} />
      )}
    </View>
  );
}