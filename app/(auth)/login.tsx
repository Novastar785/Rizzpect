import { Text, View } from '@/components/Themed'; // ¡Usamos Themed!
import Colors from '@/constants/Colors';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView, // --- CAMBIO: Importado
  Platform, // --- CAMBIO: Importado
  Pressable,
  StyleSheet,
  TextInput,
  useColorScheme, // ¡Importamos useColorScheme!
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // Importamos SafeAreaView

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const colorScheme = useColorScheme() ?? 'light'; // Detectamos el tema

  // Determinamos los colores basados en el tema
  const styles = getStyles(colorScheme);
  const iconColor = Colors[colorScheme].icon;
  const textColor = Colors[colorScheme].text;
  const placeholderColor = Colors[colorScheme].icon;
  const tintColor = Colors[colorScheme].tint;

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password.');
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (error) {
      Alert.alert('Error Logging In', error.message);
    } else {
      router.replace('/(app)/(tabs)/home'); // ¡Cambiado! Apuntamos a la ruta de tabs
    }
  }

  return (
    // Usamos SafeAreaView para evitar el notch y View (Themed)
    <SafeAreaView style={styles.safeArea}>
      {/* --- CAMBIO: Envolvemos el View en un KeyboardAvoidingView --- */}
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        {/* --- CAMBIO: Imágenes de fondo eliminadas para un look más limpio --- */}
        {/* <Image
          source={require('../../assets/images/login-bg-top.png')}
          style={styles.bgTopImage}
        />
        <Image
          source={require('../../assets/images/login-bg-bottom.png')}
          style={styles.bgBottomImage}
        />
        */}

        <Image
          source={require('../../assets/images/login-placeholder.png')}
          style={styles.heroImage} // --- CAMBIO: renombrado de 'logo' a 'heroImage'
        />
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>
          By signing in you are agreeing our
          <Text style={styles.link}> Term and privacy policy</Text>
        </Text>

        {/* (Formulario) */}
        <View style={styles.inputContainer}>
          <Ionicons
            name="mail-outline"
            size={20}
            color={iconColor}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor={placeholderColor}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons
            name="lock-closed-outline"
            size={20}
            color={iconColor}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={placeholderColor}
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
            secureTextEntry
          />
        </View>
        <Pressable style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>
        <Pressable
          style={styles.linkButton}
          onPress={() => router.push('/register')}>
          <Text style={[styles.linkButtonText, { color: tintColor }]}>
            Don't have an account? Register
          </Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ¡Convertimos los estilos en una función que depende del tema!
const getStyles = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: Colors[theme].background,
    },
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      backgroundColor: Colors[theme].background, // Dinámico
      overflow: 'hidden',
    },
    // --- CAMBIO: Estilos de 'bg' eliminados ---
    /*
    bgTopImage: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: 150,
      height: 150,
      resizeMode: 'contain',
      opacity: theme === 'dark' ? 0.3 : 1, // Menos visible en modo oscuro
    },
    bgBottomImage: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: 150,
      height: 150,
      resizeMode: 'contain',
      opacity: theme === 'dark' ? 0.3 : 1, // Menos visible en modo oscuro
    },
    */
    heroImage: {
      // --- CAMBIO: renombrado de 'logo' a 'heroImage'
      width: 300, // --- CAMBIO: Tamaño ajustado
      height: 250, // --- CAMBIO: Tamaño ajustado
      resizeMode: 'contain',
      marginBottom: 30, // --- CAMBIO: Más espacio
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: Colors[theme].text, // Dinámico
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 16,
      color: Colors[theme].icon, // Dinámico
      textAlign: 'center',
      marginBottom: 40, // --- CAMBIO: Más espacio
    },
    link: {
      color: Colors[theme].tint, // Dinámico
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      backgroundColor: Colors[theme].card, // Dinámico
      borderWidth: 1,
      borderColor: Colors[theme].border, // Dinámico
      borderRadius: 12,
      marginBottom: 20,
    },
    inputIcon: {
      padding: 10,
    },
    input: {
      flex: 1,
      height: 50,
      fontSize: 16,
      color: Colors[theme].text, // Dinámico
    },
    button: {
      width: '100%',
      height: 50,
      backgroundColor: Colors[theme].tint, // Dinámico
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 12,
      marginTop: 10,
      // --- CAMBIO: Sombra añadida ---
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
    },
    buttonText: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
    },
    linkButton: {
      marginTop: 20,
    },
    linkButtonText: {
      // El color se aplica dinámicamente arriba
      fontSize: 16,
    },
  });