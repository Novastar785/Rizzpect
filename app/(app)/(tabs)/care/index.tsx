import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors'; // Importamos Colors
import { Ionicons } from '@expo/vector-icons'; // --- CAMBIO: Importar Ionicons
import { Link } from 'expo-router';
import { Pressable, StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CareMenuScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const styles = getStyles(colorScheme);
  const tintColor = Colors[colorScheme].tint;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Care & Services</Text>
        <Text style={styles.subtitle}>
          Generate reports and posters for your pets.
        </Text>

        <Link href="/(app)/(tabs)/care/generateReport" style={styles.button} asChild>
          <Pressable>
            {/* --- CAMBIO: Icono añadido --- */}
            <Ionicons name="document-text-outline" size={20} color="white" />
            <Text style={styles.buttonText}>Generate PDF Care Report</Text>
          </Pressable>
        </Link>

        <Link href="/(app)/(tabs)/care/lostPetPoster" style={styles.buttonLost} asChild>
          <Pressable>
            {/* --- CAMBIO: Icono añadido --- */}
            <Ionicons name="search-outline" size={20} color="white" />
            <Text style={styles.buttonText}>Create Lost Pet Poster</Text>
          </Pressable>
        </Link>
      </View>
    </SafeAreaView>
  );
}

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
      backgroundColor: Colors[theme].background,
    },
    title: {
      fontSize: 32, // --- CAMBIO: Tamaño aumentado
      fontWeight: 'bold',
      color: Colors[theme].text,
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 18, // --- CAMBIO: Tamaño aumentado
      color: Colors[theme].icon,
      textAlign: 'center',
      marginBottom: 30,
    },
    button: {
      backgroundColor: Colors[theme].tint,
      padding: 15,
      borderRadius: 12,
      width: '100%',
      alignItems: 'center',
      marginBottom: 20,
      // --- CAMBIO: Sombra, flexDirection ---
      flexDirection: 'row',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
    },
    buttonLost: {
      backgroundColor: '#FF3B30', // Color semántico de "alerta"
      padding: 15,
      borderRadius: 12,
      width: '100%',
      alignItems: 'center',
      marginBottom: 20,
      // --- CAMBIO: Sombra, flexDirection ---
      flexDirection: 'row',
      justifyContent: 'center',
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
      marginLeft: 10, // --- CAMBIO: Espacio para el icono
    },
  });