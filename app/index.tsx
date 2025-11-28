import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import Colors from '@/constants/Colors';

// Esta pantalla actúa como "Landing" inicial.
// Evita que Expo Router muestre el 404 mientras verificamos la suscripción.
export default function Index() {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.dark.background, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color={Colors.dark.tint} />
    </View>
  );
}