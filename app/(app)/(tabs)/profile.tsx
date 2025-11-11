import { StyleSheet, Pressable } from 'react-native';
import { supabase } from '@/lib/supabase';

import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { SafeAreaView } from 'react-native-safe-area-context';

// Forzamos el tema oscuro
const theme = 'dark';
const themeColors = Colors[theme];

export default function ProfileScreen() {
  const styles = getStyles(theme);

  // Función para cerrar sesión
  const handleLogout = async () => {
    // Al llamar a signOut(), Supabase borra la sesión.
    // El _layout.tsx lo detectará y redirigirá al usuario a la pantalla de inicio de sesión.
    await supabase.auth.signOut();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>My Profile</Text>

        {/* Contenido de Perfil (Placeholder) */}
        <View style={styles.content}>
          {/* --- CAMBIO: Texto traducido a inglés --- */}
          <Text style={styles.infoText}>
            Your user information and settings will be displayed here.
          </Text>
        </View>

        {/* --- Botón de Cerrar Sesión --- */}
        <Pressable
          onPress={handleLogout}
          style={({ pressed }) => [
            styles.logoutButton,
            { 
              backgroundColor: themeColors.accentRed, // Usamos el color rojo pasión
              opacity: pressed ? 0.7 : 1 
            }
          ]}
        >
          <Text style={styles.logoutButtonText}>Sign Out</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const getStyles = (theme: 'light' | 'dark') => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: themeColors.background,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: themeColors.background,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: themeColors.text,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    fontSize: 16,
    textAlign: 'center',
    color: themeColors.icon, // Color de ícono (gris claro)
  },
  logoutButton: {
    // El color de fondo se aplica arriba
    padding: 15,
    borderRadius: 12, // Redondeado
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
    // --- NUEVA SOMBRA ---
    shadowColor: themeColors.accentRed,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});