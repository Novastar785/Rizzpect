import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import RevenueCatUI from 'react-native-purchases-ui';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';

export default function PaywallScreen() {
  
  const handleSuccess = () => {
    // Redirect to Home after successful purchase
    router.replace('/(app)/(tabs)/home');
  };

  return (
    <View style={styles.container}>
      <RevenueCatUI.Paywall
        onPurchaseCompleted={({ customerInfo }) => {
            // Verify entitlement is active before redirecting
            if (customerInfo.entitlements.active['rizzflows_premium']) {
                handleSuccess();
            }
        }}
        onRestoreCompleted={({ customerInfo }) => {
            if (customerInfo.entitlements.active['rizzflows_premium']) {
                Alert.alert("Success", "Your subscription has been restored.");
                handleSuccess();
            } else {
                Alert.alert("Notice", "No active subscriptions found to restore.");
            }
        }}
        options={{ 
            // Mandatory: User cannot close this screen without subscribing
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