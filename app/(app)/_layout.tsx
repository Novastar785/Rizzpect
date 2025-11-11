import Colors from '../../constants/Colors'; // Corregido: Importación de Colors
import { supabase } from '../../lib/supabase'; // Corregido: Importación de supabase
import { Ionicons } from '@expo/vector-icons';
import { Link, Stack, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from 'react-native';

export default function AppLayout() {
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // app.json fuerza "light", así que colorScheme será "light"
  const colorScheme = useColorScheme() ?? 'light';
  const tintColor = Colors[colorScheme].tint;

  useFocusEffect(
    useCallback(() => {
      async function fetchProfile() {
        setLoading(true);
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('name, foto_url')
            .eq('id', user.id)
            .single();

          if (data) {
            setProfile(data);
          }
        }
        setLoading(false);
      }
      fetchProfile();
    }, [])
  );

  const handleLogout = async () => {
    setMenuVisible(false);
    await supabase.auth.signOut();
  };

  return (
    <>
      {/* --- El Menú Modal (Simplificado para apuntar a /profile de la pestaña) --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isMenuVisible}
        onRequestClose={() => setMenuVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.menuContainer,
                { backgroundColor: Colors[colorScheme].background },
              ]}>
              {/* Navegará a la pantalla de Profile dentro del Stack de Tabs */}
              <Link href="/(app)/(tabs)/profile" asChild>
                <Pressable
                  style={styles.menuButton}
                  onPress={() => setMenuVisible(false)}>
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color={Colors[colorScheme].text}
                  />
                  <Text
                    style={[
                      styles.menuButtonText,
                      { color: Colors[colorScheme].text },
                    ]}>
                    My Profile
                  </Text>
                </Pressable>
              </Link>
              <Pressable style={styles.menuButton} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
                <Text style={[styles.menuButtonText, { color: '#FF3B30' }]}>
                  Sign Out
                </Text>
              </Pressable>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* --- El "Stack Maestro" (Rutas eliminadas) --- */}
      <Stack
        screenOptions={{
          // Fondo de cabecera verde
          headerStyle: {
            backgroundColor: tintColor,
          },
          // Título y botón "atrás" en blanco
          headerTintColor: '#FFFFFF',
        }}>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: true,
            headerTitle: '',
            headerRight: () => (
              <Pressable
                onPress={() => setMenuVisible(true)}
                style={{ marginRight: 15 }}>
                <View style={styles.avatar}>
                  {loading ? (
                    <Ionicons
                      name="person-circle-outline"
                      size={30}
                      color={tintColor} // Icono de carga en verde
                    />
                  ) : profile?.foto_url ? (
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
              </Pressable>
            ),
          }}
        />
        {/*
          Rutas de Stack eliminadas:
          <Stack.Screen
            name="profile"
            options={{
              title: 'My Profile',
            }}
          />
          <Stack.Screen
            name="editProfile"
            options={{
              title: 'Edit Profile',
            }}
          />
        */}
      </Stack>
    </>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  menuContainer: {
    borderRadius: 12,
    padding: 10,
    marginRight: 10,
    marginTop: 60, // Ajustado para la cabecera
    width: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  menuButtonText: {
    fontSize: 16,
    marginLeft: 10,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF', // Fondo blanco
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarLetter: {
    color: Colors.light.tint, // Letra en verde
    fontSize: 16,
    fontWeight: 'bold',
  },
});