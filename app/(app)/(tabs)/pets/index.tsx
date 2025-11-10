import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { Link, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Pet = {
  id: string;
  nombre: string;
  especie: 'Gato' | 'Perro';
  foto_url: string | null;
};

export default function MascotasScreen() {
  const [pets, setPets] = useState<Pet[]>([]);
  const colorScheme = useColorScheme() ?? 'light';
  const styles = getStyles(colorScheme);

  useFocusEffect(
    useCallback(() => {
      async function fetchPets() {
        const { data, error } = await supabase
          .from('pets')
          .select('id, nombre, especie, foto_url');

        if (error) {
          Alert.alert('Error', 'Could not load pets.');
        } else {
          setPets(data);
        }
      }
      fetchPets();
    }, [])
  );

  const renderPetCard = ({ item }: { item: Pet }) => (
    <Link href={`/(app)/(tabs)/pets/${item.id}`} asChild>
      <Pressable style={styles.petCard}>
        <View style={styles.petAvatar}>
          {item.foto_url ? (
            <Image source={{ uri: item.foto_url }} style={styles.petImage} />
          ) : (
            <Ionicons
              name="paw"
              size={40}
              color={Colors[colorScheme].tint}
            />
          )}
        </View>
        <View style={styles.petInfo}>
          <Text style={styles.petName}>{item.nombre}</Text>
          <Text style={styles.petSpecies}>{item.especie}</Text>
        </View>
        <Ionicons
          name="chevron-forward"
          size={24}
          color={Colors[colorScheme].icon}
        />
      </Pressable>
    </Link>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <FlatList
          data={pets}
          keyExtractor={(item) => item.id}
          renderItem={renderPetCard}
          contentContainerStyle={{ paddingHorizontal: 20, flexGrow: 1 }} // Añadido flexGrow
          ListEmptyComponent={() => (
            // --- ¡ESTADO VACÍO MEJORADO! ---
            <View style={styles.emptyContainer}>
              <Ionicons
                name="paw-outline"
                size={60}
                style={styles.emptyIcon}
              />
              <Text style={styles.emptyTitle}>No Pets Added</Text>
              <Text style={styles.emptyText}>
                Tap the '+' button above to add your first pet.
              </Text>
            </View>
            // --- FIN DEL ESTADO VACÍO ---
          )}
          ListHeaderComponent={() => (
            <View style={styles.headerContainer}>
              <Text style={styles.title}>My Pets</Text>
              <Link href="/(app)/(tabs)/pets/addPet" asChild>
                <Pressable style={styles.addButton}>
                  <Ionicons name="add" size={24} color="white" />
                </Pressable>
              </Link>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

// Estilos dinámicos
const getStyles = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: Colors[theme].background,
    },
    container: {
      flex: 1,
    },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 5, // --- CAMBIO: Ajustado para padding de contentContainer
      paddingTop: 15, // --- CAMBIO: Añadido
      marginBottom: 15, // --- CAMBIO: Añadido
    },
    title: {
      fontSize: 32, // --- CAMBIO: Tamaño aumentado
      fontWeight: 'bold',
      color: Colors[theme].text,
    },
    addButton: {
      backgroundColor: Colors[theme].tint,
      padding: 10, // --- CAMBIO: Más padding
      borderRadius: 25, // --- CAMBIO: Círculo perfecto
      // --- CAMBIO: Sombra añadida ---
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 4,
    },
    petCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors[theme].card,
      padding: 15,
      borderRadius: 12,
      marginBottom: 15,
      borderWidth: 1,
      borderColor: Colors[theme].border,
      // --- CAMBIO: Sombra añadida ---
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    petAvatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: Colors[theme].border,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 15,
      overflow: 'hidden',
    },
    petImage: {
      width: '100%',
      height: '100%',
    },
    petInfo: {
      flex: 1,
    },
    petName: {
      fontSize: 20, // --- CAMBIO: Tamaño aumentado
      fontWeight: 'bold',
      color: Colors[theme].text,
    },
    petSpecies: {
      fontSize: 16, // --- CAMBIO: Tamaño aumentado
      color: Colors[theme].icon,
      marginTop: 4,
    },
    // --- NUEVOS ESTILOS PARA ESTADO VACÍO ---
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      marginTop: 50,
    },
    emptyIcon: {
      color: Colors[theme].icon,
      marginBottom: 15,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: Colors[theme].text,
      marginBottom: 10,
    },
    emptyText: {
      fontSize: 16,
      color: Colors[theme].icon,
      textAlign: 'center',
    },
  });