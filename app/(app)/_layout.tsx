import Colors from '../../constants/Colors';
import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, Text } from 'react-native';

const theme = 'dark';
const themeColors = Colors[theme];

export default function AppLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: themeColors.background },
        headerTintColor: themeColors.text,
        headerShadowVisible: false,
      }}>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerTitle: '',
          headerLeft: () => <Text style={styles.headerTitle}>Rizzflows</Text>,
          // Se ha eliminado la propiedad headerRight que contenía el botón de los 3 puntos
        }}
      />
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