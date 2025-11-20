import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';

const { width } = Dimensions.get('window');
const themeColors = Colors.dark;

export const BackgroundGlow = () => {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* Orbe Superior Izquierdo (Púrpura) */}
      <View style={[styles.orb, styles.orbTop]} >
        <LinearGradient
          colors={[themeColors.tint, 'transparent']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 1, y: 1 }}
        />
      </View>

      {/* Orbe Inferior Derecho (Azul/Secundario) */}
      <View style={[styles.orb, styles.orbBottom]} >
        <LinearGradient
          colors={[themeColors.secondary, 'transparent']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 0, y: 0 }}
        />
      </View>
      
      {/* Capa oscura para que no sature el texto (Fondo 'Deep Black') */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: '#050505', opacity: 0.85 }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  orb: {
    position: 'absolute',
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: width,
    opacity: 0.35, // Ajusta la intensidad del glow aquí
  },
  orbTop: {
    top: -width * 0.5,
    left: -width * 0.3,
    transform: [{ scaleX: 1.5 }], 
  },
  orbBottom: {
    bottom: -width * 0.5,
    right: -width * 0.3,
    transform: [{ scaleX: 1.5 }], 
  },
});