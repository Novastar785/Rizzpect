import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Forzamos el tema oscuro
const theme = 'dark';
const themeColors = Colors[theme];

export default function RizzScreen() {

  // --- NUEVO: Colores de íconos para dar vida a la lista ---
  const iconColors = {
    start: themeColors.tint, // Púrpura
    reply: themeColors.secondary, // Azul
    awkward: '#5AB198', // Verde (El original)
    pickup: themeColors.accentRed, // Rojo (Reemplaza al rosa)
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Social Assistant</Text>
        <Text style={styles.subtitle}>What can I help you with today?</Text>

        <View style={styles.buttonContainer}>
          {/* --- CAMBIO: Ícono con color personalizado --- */}
          <Link href="/(app)/(tabs)/rizz/startConversation" asChild>
            <Pressable style={styles.pillButton}>
              <Ionicons
                name="chatbubbles-outline"
                size={24}
                style={[styles.pillButtonIcon, { color: iconColors.start }]}
              />
              <Text style={styles.pillButtonText}>Start a Conversation</Text>
            </Pressable>
          </Link>

          {/* --- CAMBIO: Ícono con color personalizado --- */}
          <Link href="/(app)/(tabs)/rizz/replySuggestions" asChild>
            <Pressable style={styles.pillButton}>
              <Ionicons
                name="arrow-undo-outline"
                size={24}
                style={[styles.pillButtonIcon, { color: iconColors.reply }]}
              />
              <Text style={styles.pillButtonText}>Get Reply Suggestions</Text>
            </Pressable>
          </Link>

          {/* --- CAMBIO: Ícono con color personalizado --- */}
          <Link href="/(app)/(tabs)/rizz/awkwardSituation" asChild>
            <Pressable style={styles.pillButton}>
              <Ionicons
                name="help-buoy-outline"
                size={24}
                style={[styles.pillButtonIcon, { color: iconColors.awkward }]}
              />
              <Text style={styles.pillButtonText}>
                Help with Awkward Situation
              </Text>
            </Pressable>
          </Link>

          {/* --- CAMBIO: Ícono con color personalizado --- */}
          <Link href="/(app)/(tabs)/rizz/pickupLines" asChild>
            <Pressable style={styles.pillButton}>
              <Ionicons
                name="flame-outline"
                size={24}
                style={[styles.pillButtonIcon, { color: iconColors.pickup }]}
              />
              <Text style={styles.pillButtonText}>Banger Pickup Lines</Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Estilos actualizados para el tema oscuro
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: themeColors.background,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: themeColors.background,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: themeColors.text,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: themeColors.icon,
    marginBottom: 30,
  },
  buttonContainer: {
    width: '100%',
  },
  pillButton: {
    backgroundColor: themeColors.card,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 16, // Ligeramente menos redondeado, más "tarjeta"
    marginBottom: 15,
    borderWidth: 1,
    borderColor: themeColors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, // Sombra más sutil
    shadowRadius: 4,
    elevation: 3,
  },
  pillButtonIcon: {
    // El color se aplica dinámicamente arriba
    marginRight: 15,
  },
  pillButtonText: {
    color: themeColors.text,
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
});