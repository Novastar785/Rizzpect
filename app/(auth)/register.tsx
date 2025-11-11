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
  ActivityIndicator, 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient'; 

// Forzamos el tema oscuro
const theme = 'dark';
const themeColors = Colors[theme];

export default function RegisterScreen() {
  const [name, setName] = useState(''); // --- NUEVO: Estado para el nombre ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false); 

  const [nameFocused, setNameFocused] = useState(false); // --- NUEVO ---
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmFocused, setConfirmFocused] = useState(false);


  async function handleRegister() {
    // --- CAMBIO: Añadir !name a la validación ---
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
    setLoading(true); 
    
    // --- CAMBIO: Añadir 'options: { data: { name } }' ---
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          name: name, // Esto se pasará al trigger de Supabase
        }
      }
    });
    // --- FIN DEL CAMBIO ---
    
    setLoading(false); 

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
        <Text style={styles.subtitle}>
          Get started with
          <Text style={styles.link}> Rizzflows</Text>
        </Text>

        {/* --- NUEVO: Campo de Nombre --- */}
        <View style={[
          styles.inputContainer,
          { borderColor: nameFocused ? themeColors.tint : themeColors.border }
        ]}>
          <Ionicons
            name="person-outline"
            size={20}
            color={nameFocused ? themeColors.tint : themeColors.icon}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Your Name"
            placeholderTextColor={themeColors.icon}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            onFocus={() => setNameFocused(true)}
            onBlur={() => setNameFocused(false)}
            editable={!loading}
          />
        </View>
        {/* --- FIN DEL NUEVO CAMPO --- */}

        <View style={[
          styles.inputContainer,
          { borderColor: emailFocused ? themeColors.tint : themeColors.border }
        ]}>
          <Ionicons
            name="mail-outline"
            size={20}
            color={emailFocused ? themeColors.tint : themeColors.icon} 
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
            editable={!loading} 
          />
        </View>

        <View style={[
          styles.inputContainer,
          { borderColor: passwordFocused ? themeColors.tint : themeColors.border }
        ]}>
          <Ionicons
            name="lock-closed-outline"
            size={20}
            color={passwordFocused ? themeColors.tint : themeColors.icon} 
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
            editable={!loading} 
          />
        </View>

        <View style={[
          styles.inputContainer,
          { borderColor: confirmFocused ? themeColors.tint : themeColors.border }
        ]}>
          <Ionicons
            name="lock-closed-outline"
            size={20}
            color={confirmFocused ? themeColors.tint : themeColors.icon} 
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
            editable={!loading} 
          />
        </View>

        <Pressable 
          style={styles.buttonWrapper} 
          onPress={handleRegister}
          disabled={loading} 
        >
          <LinearGradient
            colors={[themeColors.tint, themeColors.secondary]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.buttonGradient}>
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Register</Text>
            )}
          </LinearGradient>
        </Pressable>

        <Pressable 
          style={styles.linkButton} 
          onPress={() => router.back()}
          disabled={loading} 
        >
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

// ... los estilos permanecen igual, solo añado el paddingRight al input ...
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
    marginBottom: 10, // Reducido
  },
  subtitle: {
    fontSize: 16,
    color: themeColors.icon,
    textAlign: 'center',
    marginBottom: 30, // Reducido
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
    paddingRight: 10,
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