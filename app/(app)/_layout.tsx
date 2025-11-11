import Colors from '../../constants/Colors';
import { supabase } from '../../lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { Link, Stack, useFocusEffect, router } from 'expo-router'; // Importar router
import React, { useCallback, useState, useEffect } from 'react';
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

// Forzamos el tema oscuro
const theme = 'dark';
const themeColors = Colors[theme];

export default function AppLayout() {
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // --- NUEVO: Hook de Supabase Auth ---
  // Escucha cambios de autenticación para actualizar el perfil
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          fetchProfile(session.user.id);
        }
        if (event === 'SIGNED_OUT') {
          setProfile(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // --- MODIFICADO: useFocusEffect ---
  // Ahora solo obtiene el perfil si no lo tenemos
  useFocusEffect(
    useCallback(() => {
      async function getInitialProfile() {
        if (profile) return; // No volver a cargar si ya lo tenemos

        setLoading(true);
        const {
          data: { user },
        } = await supabase.auth.getUser();
        
        if (user) {
          await fetchProfile(user.id);
        }
        setLoading(false);
      }
      getInitialProfile();
    }, [profile]) // Depende de 'profile'
  );

  // --- NUEVO: Función de fetch separada ---
  async function fetchProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('name, foto_url')
      .eq('id', userId)
      .single();

    if (data) {
      setProfile(data);
    } else if (error) {
      console.log('Error fetching profile:', error.message);
    }
    setLoading(false);
  }


  const handleLogout = async () => {
    setMenuVisible(false);
    await supabase.auth.signOut();
    // El listener en _layout.tsx (raíz) se encargará de la redirección
  };

  return (
    <>
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
                { backgroundColor: themeColors.card }, // Color de tarjeta
              ]}>
              {/* --- CAMBIO: Navegar a la pestaña de perfil --- */}
              <Pressable
                style={styles.menuButton}
                onPress={() => {
                  setMenuVisible(false);
                  router.navigate('/(app)/(tabs)/profile'); // Navegar a la pestaña
                }}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={themeColors.text}
                />
                <Text
                  style={[
                    styles.menuButtonText,
                    { color: themeColors.text },
                  ]}>
                  My Profile
                </Text>
              </Pressable>
              
              {/* --- CAMBIO: Navegar a la pestaña de tienda --- */}
              <Pressable
                style={styles.menuButton}
                onPress={() => {
                  setMenuVisible(false);
                  router.navigate('/(app)/(tabs)/store'); // Navegar a la pestaña
                }}>
                <Ionicons
                  name="cart-outline"
                  size={20}
                  color={themeColors.text}
                />
                <Text
                  style={[
                    styles.menuButtonText,
                    { color: themeColors.text },
                  ]}>
                  Store
                </Text>
              </Pressable>

              <View style={styles.menuDivider} />

              <Pressable style={styles.menuButton} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={20} color={themeColors.accentRed} />
                <Text style={[styles.menuButtonText, { color: themeColors.accentRed }]}>
                  Sign Out
                </Text>
              </Pressable>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: themeColors.background, // Fondo oscuro
          },
          headerTintColor: themeColors.text, // Flecha blanca
          headerShadowVisible: false, // Ocultar línea
        }}>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: true, // Mostrar cabecera
            headerTitle: '', // Sin título
            headerTransparent: false,
            headerStyle: {
              backgroundColor: themeColors.background,
            },
            headerLeft: () => (
              <Text style={styles.headerTitle}>Rizzflows</Text>
            ),
            headerRight: () => (
              <Pressable
                onPress={() => setMenuVisible(true)}
                style={{ marginRight: 15 }}>
                <View style={styles.avatar}>
                  {loading ? (
                    <Ionicons
                      name="person-circle-outline"
                      size={30}
                      color={themeColors.tint}
                    />
                  ) : profile?.foto_url ? (
                    <Image
                      source={{ uri: profile.foto_url }}
                      style={styles.avatarImage}
                    />
                  ) : (
                    <Ionicons
                      name="person-circle"
                      size={32}
                      color={themeColors.icon} // Icono gris si no hay foto
                    />
                  )}
                </View>
              </Pressable>
            ),
          }}
        />
        {/*
          El stack de Rizz (dentro de tabs) definirá sus propios títulos
          en app/(app)/(tabs)/rizz/_layout.tsx
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
    marginTop: 80, // Ajustado para la nueva cabecera
    width: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    borderColor: themeColors.border,
    borderWidth: 1,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'transparent',
  },
  menuButtonText: {
    fontSize: 16,
    marginLeft: 10,
  },
  menuDivider: {
    height: 1,
    backgroundColor: themeColors.border,
    marginVertical: 5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: themeColors.text,
    marginLeft: 10,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: themeColors.card, // Fondo de tarjeta
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
});