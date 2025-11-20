// Importar la configuración de i18n primero
import '../i18n';

import { router, Slot, SplashScreen } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import Colors from '@/constants/Colors';
import * as SystemUI from 'expo-system-ui';
import { useFonts } from 'expo-font'; 
// Importamos Montserrat desde el paquete de google fonts
import { 
  Montserrat_400Regular, 
  Montserrat_600SemiBold, 
  Montserrat_700Bold, 
  Montserrat_900Black 
} from '@expo-google-fonts/montserrat';

import AnimatedSplash from '../components/AnimatedSplash';
import { initRevenueCat } from '@/lib/revenuecat'; 
import Purchases from 'react-native-purchases';

const appTheme = Colors.dark;
SplashScreen.preventAutoHideAsync();

// --- CONFIGURACIÓN DE MODO PRUEBA ---
const IS_DEV_MODE = true; 
// ------------------------------------

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'SpaceMono': require('../assets/fonts/SpaceMono-Regular.ttf'), // Mantenemos por si acaso
    'Montserrat-Regular': Montserrat_400Regular,
    'Montserrat-SemiBold': Montserrat_600SemiBold,
    'Montserrat-Bold': Montserrat_700Bold,
    'Montserrat-Black': Montserrat_900Black,
  });
  
  const [isSplashAnimationComplete, setSplashAnimationComplete] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepareApp() {
      try {
        await SystemUI.setBackgroundColorAsync(appTheme.background);
        
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
    if (fontsLoaded && isReady && isSplashAnimationComplete) {
      checkSubscriptionAndNavigate();
    }
  }, [fontsLoaded, isReady, isSplashAnimationComplete]);


  const checkSubscriptionAndNavigate = async () => {
    if (IS_DEV_MODE) {
      console.log("⚠️ MODO DESARROLLO: Saltando Paywall y yendo a /rizz");
      router.replace('/(app)/(tabs)/rizz');
      return;
    }

    try {
      const customerInfo = await Purchases.getCustomerInfo();
      const isPro = typeof customerInfo.entitlements.active['rizzflows_premium'] !== "undefined";

      if (isPro) {
        router.replace('/(app)/(tabs)/rizz'); 
      } else {
        router.replace('/paywall'); 
      }
    } catch (e) {
      console.error("Error verificando suscripción:", e);
      router.replace('/paywall');
    }
  };

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