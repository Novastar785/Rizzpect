import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import LottieView from 'lottie-react-native';
import * as SplashScreen from 'expo-splash-screen';
import Colors from '@/constants/Colors';

const theme = Colors.dark;

type AnimatedSplashProps = {
  onAnimationFinish: () => void;
};

export default function AnimatedSplash({ onAnimationFinish }: AnimatedSplashProps) {
  const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    // 1. Oculta el splash nativo (el .png) para revelar este componente
    SplashScreen.hideAsync();

    // 2. Inicia la animación de Lottie
    // Usamos un pequeño retraso en Android para una transición más suave
    if (Platform.OS === 'android') {
      setTimeout(() => {
        animationRef.current?.play();
      }, 50);
    } else {
      animationRef.current?.play();
    }
  }, []);

  return (
    <View style={styles.container}>
      <LottieView
        ref={animationRef}
        // Apunta al archivo JSON que descargaste
        source={require('../assets/animations/splash-animation.json')}
        style={styles.lottie}
        autoPlay={false} // Lo controlamos manualmente con el ref
        loop={false} // Queremos que se reproduzca solo una vez
        resizeMode="cover"
        // Cuando la animación termina, llama a la función
        onAnimationFinish={onAnimationFinish}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject, // Cubre toda la pantalla
    backgroundColor: theme.background, // Mismo fondo que tu app
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: 250, // Ajusta el tamaño de tu animación
    height: 250,
  },
});