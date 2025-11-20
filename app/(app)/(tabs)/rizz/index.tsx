import { Text, View } from '@/components/Themed';
import { Ionicons } from '@expo/vector-icons';
import { Link, Stack } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Platform,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming,
  interpolateColor
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient'; // Importamos LinearGradient

const neonColors = {
  purple: '#D946EF',
  blue: '#00BFFF',
  red: '#FF2E2E',
  yellow: '#FFD700',
};

// Colores para el fondo Premium
const GRADIENT_COLORS = ['#1a0b2e', '#000000', '#000000'] as const;

// Colores de tarjeta (Transparente por defecto)
const CARD_BG_DEFAULT = 'transparent'; 
const CARD_BG_PRESSED = '#111111'; 

const RizzButton = ({ href, icon, title, color }: { href: string, icon: any, title: string, color: string }) => {
  const scale = useSharedValue(1);
  const progress = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      ['rgba(0, 0, 0, 0)', 'rgba(30, 30, 30, 0.8)'] 
    );

    return {
      transform: [{ scale: scale.value }],
      borderColor: color, 
      backgroundColor: backgroundColor,
      shadowColor: color,
      shadowOpacity: 0.6, 
      shadowRadius: 12,   
      shadowOffset: { width: 0, height: 0 }, 
      elevation: 0, 
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 10, stiffness: 300 });
    progress.value = withTiming(1, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 12, stiffness: 300 });
    progress.value = withTiming(0, { duration: 200 });
  };

  return (
    <Link href={href as any} asChild>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.buttonWrapper}
      >
        <Animated.View style={[styles.cardInner, animatedStyle]}>
          <Ionicons
            name={icon}
            size={48}
            color={color}
            style={{
              marginBottom: 12,
              ...Platform.select({
                ios: {
                  textShadowColor: color,
                  textShadowRadius: 15,
                },
              })
            }}
          />
          <Text style={styles.cardTitle} numberOfLines={2} adjustsFontSizeToFit>
            {title}
          </Text>
        </Animated.View>
      </Pressable>
    </Link>
  );
};

export default function RizzScreen() {
  const { t } = useTranslation();
  
  return (
    <View style={styles.rootContainer}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* FONDO PREMIUM: Gradiente Sutil (Cubre todo el espacio absoluto) */}
      <LinearGradient
        colors={GRADIENT_COLORS}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0.8 }}
        style={StyleSheet.absoluteFill}
      />

      {/* SafeAreaView asegura que el contenido no toque el notch o barra de estado */}
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.headerContainer}>
              <Text style={styles.title}>{t('rizz.title')}</Text>
              <Text style={styles.subtitle}>{t('rizz.subtitle')}</Text>
          </View>

          <View style={styles.gridContainer}>
            <RizzButton
              href="/(app)/(tabs)/rizz/startConversation"
              icon="chatbubble-ellipses-outline"
              title={t('rizz.menu.start')} 
              color={neonColors.purple}
            />
            <RizzButton
              href="/(app)/(tabs)/rizz/replySuggestions"
              icon="arrow-undo-outline" 
              title={t('rizz.menu.reply')} 
              color={neonColors.blue}
            />
            <RizzButton
              href="/(app)/(tabs)/rizz/awkwardSituation"
              icon="alert-circle-outline"
              title={t('rizz.menu.awkward')} 
              color={neonColors.red}
            />
            <RizzButton
              href="/(app)/(tabs)/rizz/pickupLines"
              icon="flame-outline"
              title={t('rizz.menu.pickup')} 
              color={neonColors.yellow}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#000000', 
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent', // Permite que el gradiente se vea
  },
  scrollView: {
    backgroundColor: 'transparent',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 10, 
    paddingBottom: 20,
    justifyContent: 'center',
    backgroundColor: 'transparent', // CAMBIO CLAVE ADICIONAL
  },
  headerContainer: {
    marginBottom: 30,
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 32,
    fontFamily: 'Montserrat-Black', 
    color: '#FFFFFF',
    marginBottom: 5,
    textAlign: 'center',
    textTransform: 'uppercase', 
    letterSpacing: 1, 
    textShadowColor: 'rgba(255, 255, 255, 0.15)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: '#B3B3B3',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
    backgroundColor: 'transparent',
  },
  buttonWrapper: {
    width: '47%',
    aspectRatio: 1, 
    marginBottom: 15,
  },
  cardInner: {
    flex: 1,
    backgroundColor: 'transparent', 
    borderRadius: 24,
    borderWidth: 2.5, 
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    shadowColor: "transparent", 
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0, 
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 14, 
    fontFamily: 'Montserrat-Bold',
    fontWeight: '700', 
    textAlign: 'center',
    lineHeight: 18,
  },
});