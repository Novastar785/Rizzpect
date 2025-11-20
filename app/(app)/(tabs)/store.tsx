import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import RevenueCatUI from 'react-native-purchases-ui';
import Colors from '@/constants/Colors';

export default function StoreScreen() {

  return (
    <View style={styles.container}>
      <RevenueCatUI.Paywall
        onPurchaseCompleted={({ customerInfo }) => {
          Alert.alert("Success", "Welcome to Rizzflows Premium!");
        }}
        onRestoreCompleted={({ customerInfo }) => {
          if (customerInfo.entitlements.active['rizzflows_premium']) {
            Alert.alert("Success", "Your subscription has been restored.");
          } else {
            Alert.alert("Notice", "No active subscriptions found to restore.");
          }
        }}
        options={{
          // Al estar incrustado en una pestaña, no queremos botón de cerrar
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