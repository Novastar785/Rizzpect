import Colors from '../../constants/Colors';
import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const theme = 'dark';
const themeColors = Colors[theme];

export default function AppLayout() {
  return (
    <Stack
      screenOptions={{
        // Hacemos el header del Stack padre completamente transparente
        headerStyle: { backgroundColor: 'transparent' }, 
        headerTintColor: themeColors.text,
        headerShadowVisible: false,
        // Hacemos el Stack contenedor transparente (útil para iOS)
        contentStyle: { backgroundColor: 'transparent' } 
      }}>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerTitle: '',
          // Forzamos la View del headerLeft a ser transparente para que el gradiente se vea
          headerLeft: () => <View style={{ backgroundColor: 'transparent' }}><Text style={styles.headerTitle}>Rizzflows</Text></View>,
        }}
      />
      {/* Las pantallas legales mantendrán la apariencia normal */}
    </Stack>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#FFF'
  },
});