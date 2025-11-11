import { StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { supabase } from '@/lib/supabase';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import React, { useState, useCallback } from 'react'; // --- NUEVO: Importar React y hooks ---

// Forzamos el tema oscuro
const theme = 'dark';
const themeColors = Colors[theme];

// ... (Componentes StatCard y SettingsRow sin cambios) ...
const StatCard = ({ icon, label, value, color }: { icon: any, label: string, value: string, color: string }) => (
  <View style={styles.statCard}>
    <Ionicons name={icon} size={28} color={color} />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);
const SettingsRow = ({ icon, label, onPress }: { icon: any, label: string, onPress: () => void }) => (
  <Pressable style={styles.settingsRow} onPress={onPress}>
    <View style={styles.settingsIconContainer}>
      <Ionicons name={icon} size={20} color={themeColors.tint} />
    </View>
    <Text style={styles.settingsLabel}>{label}</Text>
    <Ionicons name="chevron-forward-outline" size={20} color={themeColors.icon} />
  </Pressable>
);

export default function ProfileScreen() {
  // --- NUEVO: Estados para los datos del perfil ---
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);

  // --- NUEVO: Hook para cargar datos cuando la pantalla entra en foco ---
  useFocusEffect(
    useCallback(() => {
      const fetchUserData = async () => {
        setLoading(true);
        // 1. Obtener el usuario autenticado
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          // 2. Establecer el email desde 'auth'
          setEmail(user.email || 'No email found');
          
          // 3. Obtener el nombre desde la tabla 'profiles'
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('name')
            .eq('id', user.id)
            .single();

          if (error) {
            console.log('Error fetching profile name:', error.message);
            setName('Error loading name');
          } else if (profile) {
            setName(profile.name || 'No name set');
          }
        } else {
          // Esto no debería pasar si están en esta pantalla, pero por si acaso
          setName('Not logged in');
          setEmail('Not logged in');
        }
        setLoading(false);
      };

      fetchUserData();
    }, [])
  );

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // router.replace() no es necesario aquí, el _layout raíz se encargará
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={themeColors.tint} />
          </View>
        ) : (
          <>
            {/* --- CAMBIO: Cabecera de Perfil con datos reales --- */}
            <View style={styles.profileHeader}>
              <View style={styles.avatar}>
                <Ionicons name="person-outline" size={40} color={themeColors.tint} />
              </View>
              <Text style={styles.username}>{name}</Text>
              <Text style={styles.userEmail}>{email}</Text>
            </View>
            
            {/* --- (Contenido estático sin cambios) --- */}
            <View style={styles.statsContainer}>
              <StatCard icon="sparkles-outline" label="Rizz Generated" value="42" color={themeColors.tint} />
              <StatCard icon="heart-outline" label="Success Stories" value="5" color={themeColors.accentRed} />
              <StatCard icon="flame-outline" label="Current Streak" value="3" color={themeColors.secondary} />
            </View>

            <View style={styles.settingsContainer}>
              <SettingsRow 
                icon="star-outline" 
                label="Manage Subscription" 
                onPress={() => router.push('/(app)/(tabs)/store')} 
              />
              <SettingsRow 
                icon="person-circle-outline" 
                label="Edit Profile" 
                onPress={() => {}} 
              />
              <SettingsRow 
                icon="notifications-outline" 
                label="Notifications" 
                onPress={() => {}} 
              />
            </View>
            {/* --- (Fin contenido estático) --- */}

            <Pressable
              onPress={handleLogout}
              style={({ pressed }) => [
                styles.logoutButton,
                { 
                  backgroundColor: themeColors.card, 
                  opacity: pressed ? 0.7 : 1 
                }
              ]}
            >
              <Ionicons name="log-out-outline" size={20} color={themeColors.accentRed} style={{ marginRight: 10 }} />
              <Text style={styles.logoutButtonText}>Sign Out</Text>
            </Pressable>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: themeColors.background,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: themeColors.background,
  },
  // --- NUEVO: Contenedor de carga ---
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: themeColors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: themeColors.tint,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: themeColors.text,
  },
  userEmail: {
    fontSize: 16,
    color: themeColors.icon,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: themeColors.card,
    borderRadius: 16,
    padding: 15,
    alignItems: 'center',
    width: '30%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: themeColors.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: themeColors.icon,
    marginTop: 2,
  },
  settingsContainer: {
    backgroundColor: themeColors.card,
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden', // Para recortar los bordes de las filas
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 12,
    backgroundColor: 'transparent', // El contenedor padre tiene el color
    borderBottomWidth: 1,
    borderBottomColor: themeColors.border,
  },
  settingsIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(192, 57, 255, 0.15)', // Fondo Púrpura
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingsLabel: {
    flex: 1,
    fontSize: 16,
    color: themeColors.text,
  },
  // --- Fin Nuevos Estilos ---
  logoutButton: {
    flexDirection: 'row', // Para alinear ícono y texto
    padding: 15,
    borderRadius: 12, 
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center', // Centrar contenido
    marginTop: 'auto', // Empujar al fondo
    borderWidth: 1, // Borde sutil
    borderColor: themeColors.accentRed, // Borde rojo
  },
  logoutButtonText: {
    color: themeColors.accentRed, // Texto rojo
    fontSize: 18,
    fontWeight: 'bold',
  },
});