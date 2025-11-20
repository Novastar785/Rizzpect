import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import RevenueCatUI from 'react-native-purchases-ui';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';

export default function PaywallScreen() {
  
  const handleSuccess = () => {
    // MODIFICADO: Redirigir a Rizz (Index) después de una compra exitosa o restauración
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
                Alert.alert("Éxito", "Tu suscripción ha sido restaurada.");
                handleSuccess();
            } else {
                Alert.alert("Aviso", "No se encontraron suscripciones activas para restaurar.");
            }
        }}
        options={{ 
            // OBLIGATORIO: El usuario no puede cerrar esta pantalla sin suscribirse
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