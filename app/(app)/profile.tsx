import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors'; // Importamos Colors
import { supabase } from '@/lib/supabase';
import { Link, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  useColorScheme, // Importamos useColorScheme
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  const colorScheme = useColorScheme() ?? 'light';
  const styles = getStyles(colorScheme);
  const tintColor = Colors[colorScheme].tint; // Obtenemos el tintColor

  useFocusEffect(
    useCallback(() => {
      // Definición de la función que faltaba
      async function fetchProfile() {
        setLoading(true);
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          Alert.alert('Error', 'No user session found.');
          return;
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          Alert.alert('Error', 'Failed to load profile.');
        } else if (data) {
          setProfile(data);
        }
        setLoading(false);
      }

      fetchProfile(); // Ahora esta llamada es válida
    }, [])
  );

  // Definición de la función que faltaba
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: tintColor }}
        edges={['bottom']} // Aplicamos el fondo SOLO a la parte inferior
      >
        <View style={styles.container}>
          <Text style={styles.title}>Loading Profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: tintColor }}
      edges={['bottom']} // Aplicamos el fondo SOLO a la parte inferior
    >
      <ScrollView style={styles.container}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            {profile?.foto_url ? (
              <Image
                source={{ uri: profile.foto_url }}
                style={styles.avatarImage}
              />
            ) : (
              <Text style={styles.avatarLetter}>
                {(profile?.name || '?').charAt(0).toUpperCase()}
              </Text>
            )}
          </View>
        </View>

        <Text style={styles.title}>
          {profile?.name
            ? `${profile.name} ${profile.last_name || ''}`
            : profile?.contact_email || 'New User'}
        </Text>

        {/* --- ¡AQUÍ ESTÁ LA CORRECCIÓN! --- */}
        {/* La ruta correcta es "/editProfile", sin "/(app)" */}
        <Link href="/editProfile" style={styles.button} asChild>
          <Pressable>
            <Text style={styles.buttonText}>Edit Profile</Text>
          </Pressable>
        </Link>

        <Pressable style={styles.buttonLogout} onPress={handleLogout}>
          <Text style={styles.buttonText}>Sign Out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

// Definición de la función que faltaba
const getStyles = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: Colors[theme].background, // El fondo del contenido es blanco
    },
    avatarContainer: {
      alignItems: 'center',
      marginVertical: 20,
    },
    avatar: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: Colors[theme].tint,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    },
    avatarImage: {
      width: '100%',
      height: '100%',
    },
    avatarLetter: {
      color: 'white',
      fontSize: 60,
      fontWeight: 'bold',
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      color: Colors[theme].text,
      textAlign: 'center',
      marginBottom: 30,
    },
    button: {
      backgroundColor: Colors[theme].tint,
      padding: 15,
      borderRadius: 12,
      width: '100%',
      alignItems: 'center',
      marginBottom: 15,
    },
    buttonLogout: {
      backgroundColor: '#FF3B30', // Semántico
      padding: 15,
      borderRadius: 12,
      width: '100%',
      alignItems: 'center',
    },
    buttonText: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
    },
  });