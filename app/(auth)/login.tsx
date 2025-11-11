import { Text, View } from '@/components/Themed'; 
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
  ActivityIndicator, // --- NUEVO: Importar ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient'; 

// Forzamos el tema oscuro
const theme = 'dark';
const themeColors = Colors[theme];

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // --- NUEVO: Estado de carga ---
  
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password.');
      return;
    }
    setLoading(true); // --- NUEVO: Iniciar carga ---
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    
    setLoading(false); // --- NUEVO: Finalizar carga ---

    if (error) {
      Alert.alert('Error Logging In', error.message);
    } else {
      // El listener en _layout.tsx se encargará de la redirección
      // router.replace('/(app)/(tabs)/home');
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
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>
          Sign in to continue your
          <Text style={styles.link}> Rizzflows</Text>
        </Text>

        <View style={[
          styles.inputContainer,
          { borderColor: emailFocused ? themeColors.tint : themeColors.border }
        ]}>
          <Ionicons
            name="mail-outline"
            size={20}
            color={emailFocused ? themeColors.tint : themeColors.icon} // --- CAMBIO: Color de ícono dinámico ---
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
            editable={!loading} // --- NUEVO: Deshabilitar mientras carga ---
          />
        </View>
        
        <View style={[
          styles.inputContainer,
          { borderColor: passwordFocused ? themeColors.tint : themeColors.border }
        ]}>
          <Ionicons
            name="lock-closed-outline"
            size={20}
            color={passwordFocused ? themeColors.tint : themeColors.icon} // --- CAMBIO: Color de ícono dinámico ---
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
            editable={!loading} // --- NUEVO: Deshabilitar mientras carga ---
          />
        </View>

        <Pressable 
          style={styles.buttonWrapper} 
          onPress={handleLogin} 
          disabled={loading} // --- NUEVO: Deshabilitar botón mientras carga ---
        >
          <LinearGradient
            colors={[themeColors.tint, themeColors.secondary]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.buttonGradient}>
            {/* --- NUEVO: Mostrar ActivityIndicator si está cargando --- */}
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </LinearGradient>
        </Pressable>

        <Pressable
          style={styles.linkButton}
          onPress={() => router.push('/(auth)/register')}
          disabled={loading} // --- NUEVO: Deshabilitar botón mientras carga ---
        >
          <Text style={[styles.linkButtonText, { color: themeColors.icon }]}>
            Don't have an account?{' '}
            <Text style={{ color: themeColors.tint, fontWeight: 'bold' }}>
              Register
            </Text>
          </Text>
        </Pressable>
      </KeyboardAvoidingView>
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: themeColors.background,
  },
  heroImage: {
    width: 150, // Más pequeño
    height: 150, // Más pequeño
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: themeColors.text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: themeColors.icon,
    textAlign: 'center',
    marginBottom: 40,
  },
  link: {
    color: themeColors.tint,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: themeColors.card,
    borderWidth: 1.5, 
    borderColor: themeColors.border, 
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
    paddingRight: 10, // Añadir padding
  },
  buttonWrapper: {
    width: '100%',
    borderRadius: 99, // --- CAMBIO: Pill shape ---
    marginTop: 10,
    shadowColor: themeColors.tint, 
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
    borderRadius: 99, // --- CAMBIO: Pill shape ---
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
    fontSize: 16,
    color: themeColors.icon,
  },
});