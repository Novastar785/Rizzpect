import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';

// Forzamos el tema oscuro
const theme = 'dark';
const themeColors = Colors[theme];

// --- NUEVO: Componente de Ilustración SVG ---
function HeroIllustration() {
  return (
    <View style={styles.svgContainer}>
      <Svg height="150" width="100%" viewBox="0 0 300 150">
        <Defs>
          <LinearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor={themeColors.tint} stopOpacity="1" />
            <Stop offset="100%" stopColor={themeColors.secondary} stopOpacity="1" />
          </LinearGradient>
          <LinearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={themeColors.card} stopOpacity="0.1" />
            <Stop offset="100%" stopColor={themeColors.card} stopOpacity="0.3" />
          </LinearGradient>
        </Defs>
        {/* Forma Abstracta 1 (Fondo) */}
        <Path
          d="M-20 80 Q 50 20, 100 70 T 200 80 T 320 60 V 150 H -20 Z"
          fill="url(#grad2)"
        />
        {/* Forma Abstracta 2 (Principal) */}
        <Path
          d="M-10 100 Q 60 50, 110 90 T 210 100 T 310 80 V 150 H -10 Z"
          fill="url(#grad1)"
        />
      </Svg>
    </View>
  );
}
// --- FIN: Componente de Ilustración SVG ---

export default function HomeScreen() {
  const goToRizz = () => {
    router.navigate('/(app)/(tabs)/rizz');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* --- Ilustración Añadida --- */}
        <HeroIllustration />

        <Text style={styles.title}>Welcome to Rizzflow</Text>
        <Text style={styles.subtitle}>Your personal social assistant.</Text>

        <View style={[styles.infoCard, { backgroundColor: themeColors.card }]}>
          <Text style={[styles.cardTitle, { color: themeColors.tint }]}>
            <Ionicons name="sparkles" size={20} color={themeColors.tint} />
            {'  '}How it works:
          </Text>
          <Text style={styles.bulletPoint}>
            • **Upload any screenshot** (Tinder, Bumble, chat, etc.)
          </Text>
          <Text style={styles.bulletPoint}>
            • Rizzflow generates **3-4 clever replies** instantly.
          </Text>
          <Text style={styles.bulletPoint}>
            • **Tap** the reply to copy and paste it into your chat.
          </Text>
        </View>

        {/* --- Botón de Acción Principal --- */}
        <Pressable style={styles.buttonWrapper} onPress={goToRizz}>
          <ExpoLinearGradient
            colors={[themeColors.tint, themeColors.secondary]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.buttonGradient}>
            <Text style={styles.buttonText}>Start Rizzing!!</Text>
          </ExpoLinearGradient>
        </Pressable>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: themeColors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: themeColors.background,
  },
  // --- NUEVO: Estilo para el SVG ---
  svgContainer: {
    width: '100%',
    maxHeight: 150,
    marginBottom: 20,
    opacity: 0.8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: themeColors.text,
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: themeColors.icon,
    marginBottom: 30,
    textAlign: 'center',
  },
  infoCard: {
    width: '100%',
    padding: 20,
    borderRadius: 16, // Más redondeado
    backgroundColor: themeColors.card,
    borderColor: themeColors.border,
    borderWidth: 1,
    marginBottom: 30,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  bulletPoint: {
    fontSize: 16,
    color: themeColors.text,
    marginBottom: 8,
    lineHeight: 24,
  },
  buttonWrapper: {
    width: '100%',
    borderRadius: 12,
    marginTop: 10,
    shadowColor: themeColors.tint, // Sombra de color
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    marginBottom: 15,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 12,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});