import { Text, View } from '@/components/Themed'; // ¡Usamos Themed!
import Colors from '@/constants/Colors';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient'; // --- NUEVO: Importar gradiente

// Forzamos el tema oscuro
const theme = 'dark';
const themeColors = Colors[theme];

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // --- NUEVO: Estado de "focus" para los inputs ---
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmFocused, setConfirmFocused] = useState(false);


  async function handleRegister() {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    if (error) {
      Alert.alert('Error Registering', error.message);
    } else {
      Alert.alert(
        'Success!',
        'User registered. Please check your email to confirm.'
      );
      router.back();
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        
        <Image
          source={require('../../assets/images/login-placeholder.png')}
          style={styles.heroImage}
        />
        <Text style={styles.title}>Create Account</Text>

        {/* --- CAMBIO: Input con estilo de focus --- */}
        <View style={[
          styles.inputContainer,
          { borderColor: emailFocused ? themeColors.tint : themeColors.border }
        ]}>
          <Ionicons
            name="mail-outline"
            size={20}
            color={themeColors.icon}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor={themeColors.icon}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
          />
        </View>

        {/* --- CAMBIO: Input con estilo de focus --- */}
        <View style={[
          styles.inputContainer,
          { borderColor: passwordFocused ? themeColors.tint : themeColors.border }
        ]}>
          <Ionicons
            name="lock-closed-outline"
            size={20}
            color={themeColors.icon}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={themeColors.icon}
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
            secureTextEntry
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
          />
        </View>

        {/* --- CAMBIO: Input con estilo de focus --- */}
        <View style={[
          styles.inputContainer,
          { borderColor: confirmFocused ? themeColors.tint : themeColors.border }
        ]}>
          <Ionicons
            name="lock-closed-outline"
            size={20}
            color={themeColors.icon}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor={themeColors.icon}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            autoCapitalize="none"
            secureTextEntry
            onFocus={() => setConfirmFocused(true)}
            onBlur={() => setConfirmFocused(false)}
          />
        </View>

        {/* --- CAMBIO: Botón con Gradiente --- */}
        <Pressable style={styles.buttonWrapper} onPress={handleRegister}>
          <LinearGradient
            colors={[themeColors.tint, themeColors.secondary]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.buttonGradient}>
            <Text style={styles.buttonText}>Register</Text>
          </LinearGradient>
        </Pressable>
        {/* --- FIN CAMBIO --- */}

        <Pressable style={styles.linkButton} onPress={() => router.back()}>
          <Text style={[styles.linkButtonText, { color: themeColors.icon }]}>
            Already have an account?{' '}
            <Text style={{ color: themeColors.tint, fontWeight: 'bold' }}>
              Login
            </Text>
          </Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Usamos los mismos estilos de Login para consistencia
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: themeColors.background,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: themeColors.background,
  },
  heroImage: {
    width: 200, // Ajustado
    height: 200, // Ajustado
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: themeColors.text,
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: themeColors.card,
    borderWidth: 1.5, // Ligeramente más grueso para el "glow"
    borderColor: themeColors.border, // Color por defecto
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
    color: themeColors.text,
  },
  // --- NUEVO: Estilos para el botón de gradiente ---
  buttonWrapper: {
    width: '100%',
    borderRadius: 12,
    marginTop: 10,
    shadowColor: themeColors.tint, // Sombra de color
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  buttonGradient: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  // --- FIN NUEVO ---
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: 20,
  },
  linkButtonText: {
    fontSize: 16,
    color: themeColors.icon, // Color base
  },
});