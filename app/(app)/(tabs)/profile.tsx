import { StyleSheet, Pressable } from 'react-native';
import { supabase } from '@/lib/supabase'; // <<-- CORRECCIÓN APLICADA AQUÍ

import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  // Función para cerrar sesión
  const handleLogout = async () => {
    // Al llamar a signOut(), Supabase borra la sesión.
    // El _layout.tsx lo detectará y redirigirá al usuario a la pantalla de inicio de sesión.
    await supabase.auth.signOut();
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]}>
      <View style={[styles.container, { backgroundColor: themeColors.background }]}>
        <Text style={[styles.title, { color: themeColors.text }]}>My Profile</Text>

        {/* Contenido de Perfil (Placeholder) */}
        <View style={styles.content}>
            <Text style={[styles.infoText, { color: themeColors.text }]}>
                Tu información de usuario y configuraciones se mostrarán aquí.
            </Text>
        </View>

        {/* --- Botón de Cerrar Sesión --- */}
        <Pressable 
          onPress={handleLogout}
          style={({ pressed }) => [
            styles.logoutButton,
            { opacity: pressed ? 0.7 : 1 }
          ]}
        >
          <Text style={styles.logoutButtonText}>Sign Out</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoText: {
        fontSize: 16,
        textAlign: 'center',
    },
    logoutButton: {
        backgroundColor: '#FF3B30', // Rojo para la acción de salir
        padding: 15,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
        marginTop: 20,
    },
    logoutButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});