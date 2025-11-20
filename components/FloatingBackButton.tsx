import React from 'react';
import { Pressable, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function FloatingBackButton() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <Animated.View entering={FadeIn.duration(300)} style={[styles.wrapper, { top: insets.top + 10 }]}>
      <Pressable 
        style={({ pressed }) => [
          styles.container,
          { opacity: pressed ? 0.8 : 1, transform: [{ scale: pressed ? 0.95 : 1 }] }
        ]} 
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 20,
    zIndex: 100, // Asegura que flote sobre todo
  },
  container: {
    backgroundColor: 'rgba(30, 30, 30, 0.7)', // Fondo semitransparente oscuro
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
});