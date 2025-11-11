import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router'; // Importamos router para la navegación
import React from 'react';
import { StyleSheet, useColorScheme, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const styles = getStyles(colorScheme);
  const tintColor = Colors[colorScheme].tint;
  const cardColor = Colors[colorScheme].card;

  // Función para navegar a la pestaña Rizz
  const goToRizz = () => {
    // Navega a la ruta principal de la pestaña 'rizz'
    router.navigate('/(app)/(tabs)/rizz');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to Rizzflow</Text>
        <Text style={styles.subtitle}>Your personal social assistant.</Text>

        {/* --- Card de Presentación (Inspirado en la imagen) --- */}
        <View style={[styles.infoCard, { backgroundColor: cardColor, borderColor: tintColor }]}>
          <Text style={[styles.cardTitle, { color: tintColor }]}>
            <Ionicons name="sparkles" size={20} color={tintColor} />
            {'  '}How it works:
          </Text>
          <Text style={styles.bulletPoint}>
            • **Capture any chat screen** (Tinder, Bumble, etc.)
          </Text>
          <Text style={styles.bulletPoint}>
            • Rizzflow generates **3-4 clever replies** instantly.
          </Text>
          <Text style={styles.bulletPoint}>
            • **Tap** the reply to copy and paste it into your chat.
          </Text>
        </View>
        {/* --- END Card --- */}

        {/* --- Botón de Acción Principal --- */}
        <Pressable
          style={[styles.mainButton, { backgroundColor: tintColor }]}
          onPress={goToRizz}>
          <Text style={styles.mainButtonText}>Start Rizzing!!</Text>
        </Pressable>
        {/* --- END Botón --- */}

        {/* Placeholder para contenido futuro (ej. historial o créditos) */}
        <View style={styles.footerPlaceholder}>
          <Text style={styles.footerText}>
            Check the Store tab to get more Rizz Credits!
          </Text>
        </View>

      </View>
    </SafeAreaView>
  );
}

// Styles are now customized for the new layout
const getStyles = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: Colors[theme].background,
    },
    container: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 30, // Más espacio arriba
      alignItems: 'center',
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: Colors[theme].text,
      marginBottom: 5,
    },
    subtitle: {
      fontSize: 18,
      color: Colors[theme].icon,
      marginBottom: 40,
    },
    infoCard: {
      width: '100%',
      padding: 20,
      borderRadius: 12,
      borderWidth: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 5,
      marginBottom: 40,
    },
    cardTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 15,
      textAlign: 'center',
    },
    bulletPoint: {
      fontSize: 16,
      color: Colors[theme].text,
      marginBottom: 8,
      lineHeight: 24,
    },
    mainButton: {
      width: '80%',
      paddingVertical: 18,
      borderRadius: 99, // Botón tipo píldora
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 5,
      elevation: 6,
    },
    mainButtonText: {
      color: 'white',
      fontSize: 20,
      fontWeight: '900',
      textTransform: 'uppercase',
    },
    footerPlaceholder: {
      marginTop: 40,
      alignItems: 'center',
    },
    footerText: {
      fontSize: 14,
      color: Colors[theme].icon,
    },
  });