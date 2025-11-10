import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors'; // Importamos Colors
import { supabase } from '@/lib/supabase';
import { Link, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  useColorScheme, // Importamos useColorScheme
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Pet = {
  id: string;
  nombre: string;
};

export default function SelectPetScreen() {
  const [pets, setPets] = useState<Pet[]>([]);
  const colorScheme = useColorScheme() ?? 'light';
  const styles = getStyles(colorScheme);

  useFocusEffect(
    useCallback(() => {
      async function fetchPets() {
        const { data, error } = await supabase.from('pets').select('id, nombre');
        if (error) {
          Alert.alert('Error', 'Could not load pets.');
        } else {
          setPets(data);
        }
      }
      fetchPets();
    }, [])
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.infoText}>
          Select the pet you want to generate a poster for:
        </Text>
        <FlatList
          data={pets}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Link href={`/(app)/(tabs)/care/lostPetPoster/${item.id}`} asChild>
              <Pressable style={styles.petItem}>
                <Text style={styles.petName}>{item.nombre}</Text>
                <Text style={styles.arrow}>→</Text>
              </Pressable>
            </Link>
          )}
          ListEmptyComponent={() => (
            <Text style={styles.emptyText}>No pets found.</Text>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

// Estilos idénticos a generateReport/index.tsx
const getStyles = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: Colors[theme].background,
    },
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: Colors[theme].background,
    },
    infoText: {
      fontSize: 16,
      color: Colors[theme].icon,
      textAlign: 'center',
      marginBottom: 20,
    },
    petItem: {
      padding: 20,
      backgroundColor: Colors[theme].card,
      borderRadius: 12,
      marginBottom: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: Colors[theme].border,
    },
    petName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: Colors[theme].text,
    },
    arrow: {
      fontSize: 18,
      color: Colors[theme].tint,
    },
    emptyText: {
      textAlign: 'center',
      marginTop: 50,
      fontSize: 16,
      color: Colors[theme].icon,
    },
  });