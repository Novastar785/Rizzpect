import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import RevenueCatUI from 'react-native-purchases-ui';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import { useTranslation } from 'react-i18next';

export default function PaywallScreen() {
  const { t } = useTranslation();
  
  const handleSuccess = () => {
    router.replace('/(app)/(tabs)/rizz');
  };

  return (
    <View style={styles.container}>
      <RevenueCatUI.Paywall
        onPurchaseCompleted={({ customerInfo }) => {
            if (customerInfo.entitlements.active['rizzflows_premium']) {
                handleSuccess();
            }
        }}
        onRestoreCompleted={({ customerInfo }) => {
            if (customerInfo.entitlements.active['rizzflows_premium']) {
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
});