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

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'SpaceMono': require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [isSplashAnimationComplete, setSplashAnimationComplete] = useState(false);

  useEffect(() => {
    async function checkSubscription() {
      try {
        await SystemUI.setBackgroundColorAsync(appTheme.background);
        
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