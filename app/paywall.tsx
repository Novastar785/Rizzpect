import React, { useState } from 'react';
import { View, StyleSheet, Alert, Pressable } from 'react-native';
import RevenueCatUI from 'react-native-purchases-ui';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import { useTranslation } from 'react-i18next';

export default function PaywallScreen() {
  // CAMBIO 1: Importar hook de traducción
  const { t } = useTranslation();
  const [secretTaps, setSecretTaps] = useState(0);
  
  const handleSuccess = () => {
    router.replace('/(app)/(tabs)/rizz');
  };

  const handleSecretTap = () => {
    const newTaps = secretTaps + 1;
    setSecretTaps(newTaps);
    
    if (newTaps >= 5) {
      // CAMBIO 2: Usar traducciones para el alert secreto
      Alert.alert(
        t('paywall.reviewerTitle'),
        t('paywall.reviewerMsg'),
        [
          { 
            text: t('paywall.enter'), 
            onPress: () => {
              setSecretTaps(0); 
              handleSuccess();
            }
          }
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <Pressable 
        style={styles.secretArea}
        onPress={handleSecretTap}
      />

      <RevenueCatUI.Paywall
        onPurchaseCompleted={({ customerInfo }) => {
            if (customerInfo.entitlements.active['rizzflows_premium']) {
                handleSuccess();
            }
        }}
        onRestoreCompleted={({ customerInfo }) => {
            if (customerInfo.entitlements.active['rizzflows_premium']) {
                // CAMBIO 3: Usar traducciones para mensajes de restauración
                Alert.alert(t('paywall.success'), t('paywall.restored'));
                handleSuccess();
            } else {
                Alert.alert(t('paywall.notice'), t('paywall.noActive'));
            }
        }}
        options={{ 
            displayCloseButton: false 
        }} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  secretArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 80,
    zIndex: 999,
  }
});