import { useThemeColor } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PetProfileScreen() {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [pet, setPet] = useState<any>(null);
  const [isQrModalVisible, setIsQrModalVisible] = useState(false);

  const colorScheme = useColorScheme() ?? 'light';
  const styles = getStyles(colorScheme);
  const tintColor = Colors[colorScheme].tint;
  const avatarBg = useThemeColor({ light: '#eee', dark: '#333' }, 'background');
  const cardColor = Colors[colorScheme].card;
  const textColor = Colors[colorScheme].text;

  useFocusEffect(
    useCallback(() => {
      async function fetchPetProfile() {
        setLoading(true);
        if (!id) {
          Alert.alert('Error', 'Pet ID not found.');
          setLoading(false);
          return;
        }
        const { data, error } = await supabase
          .from('pets')
          .select('*')
          .eq('id', id as string)
          .single();

        if (error) {
          Alert.alert('Error', 'Failed to load pet profile: ' + error.message);
        } else if (data) {
          setPet(data);
        }
        setLoading(false);
      }
      fetchPetProfile();
    }, [id])
  );

  const handleDeletePet = async () => {
    Alert.alert(
      'Delete Pet',
      'Are you sure you want to delete this pet? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (!id) return;
            const { error } = await supabase
              .from('pets')
              .delete()
              .eq('id', id as string);

            if (error) {
              Alert.alert('Error', 'Failed to delete pet: ' + error.message);
            } else {
              Alert.alert('Success!', 'Pet deleted successfully.');
              router.replace('/(app)/(tabs)/pets');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading Pet Profile...</Text>
      </View>
    );
  }

  if (!pet) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Pet not found.</Text>
        <Pressable
          style={[styles.button, { backgroundColor: tintColor }]}
          onPress={() => router.back()}>
          <Text style={styles.buttonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const displayEspecie = pet.especie === 'Gato' ? 'Cat' : 'Dog';
  const displayGenero =
    pet.genero === 'Macho'
      ? 'Male'
      : pet.genero === 'Hembra'
      ? 'Female'
      : null;

  // --- ¡AQUÍ ESTÁ EL CAMBIO! ---
  // Usamos una URL placeholder. En producción, la cambiarías por tu URL real.
  const publicPetUrl = `https://petid.app/pet/${pet.id}`;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* --- MODAL DEL CÓDIGO QR --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isQrModalVisible}
        onRequestClose={() => setIsQrModalVisible(false)}>
        <Pressable
          style={styles.modalContainer}
          onPress={() => setIsQrModalVisible(false)}>
          <View
            style={[styles.modalContent, { backgroundColor: cardColor }]}
            onStartShouldSetResponder={() => true}>
            <Text style={styles.modalTitle}>Pet ID: {pet.nombre}</Text>
            <View style={styles.qrContainer}>
              <QRCode
                // ¡AQUÍ SE USA LA URL PÚBLICA!
                value={publicPetUrl}
                size={250}
                backgroundColor="white"
                color={textColor}
              />
            </View>
            <Text style={styles.modalSubtitle}>
              Scan this QR to see the public pet profile.
            </Text>
            <Pressable
              style={[styles.button, { backgroundColor: tintColor }]}
              onPress={() => setIsQrModalVisible(false)}>
              <Text style={styles.buttonText}>Close</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      {/* --- Contenido de la Pantalla --- */}
      <ScrollView style={styles.container}>
        <View style={styles.avatarContainer}>
          <View
            style={[
              styles.avatar,
              { backgroundColor: avatarBg, borderColor: tintColor },
            ]}>
            {pet.foto_url ? (
              <Image source={{ uri: pet.foto_url }} style={styles.avatarImage} />
            ) : (
              <Ionicons name="paw" size={80} color={tintColor} />
            )}
          </View>
        </View>
        <Text style={styles.title}>{pet.nombre}</Text>

        <View style={styles.detailsContainer}>
          {pet.especie && (
            <Text style={styles.detailText}>Species: {displayEspecie}</Text>
          )}
          {displayGenero && (
            <Text style={styles.detailText}>Gender: {displayGenero}</Text>
          )}
          {pet.fecha_nacimiento && (
            <Text style={styles.detailText}>Born: {pet.fecha_nacimiento}</Text>
          )}
          {pet.numero_chip && (
            <Text style={styles.detailText}>Chip: {pet.numero_chip}</Text>
          )}
          {pet.notas && (
            <Text style={styles.detailText}>Notes: {pet.notas}</Text>
          )}
        </View>

        {/* --- Botones --- */}
        <Pressable
          style={[styles.button, { backgroundColor: tintColor }]}
          onPress={() => setIsQrModalVisible(true)}>
          <View style={styles.buttonContent}>
            <Ionicons name="qr-code-outline" size={20} color="white" />
            <Text style={styles.buttonText}>Show Pet ID (QR)</Text>
          </View>
        </Pressable>

        <Pressable
          style={[styles.button, { backgroundColor: tintColor }]}
          onPress={() => router.push(`/(app)/(tabs)/pets/edit/${pet.id}`)}>
          <View style={styles.buttonContent}>
            <Ionicons name="pencil-outline" size={20} color="white" />
            <Text style={styles.buttonText}>Edit Pet</Text>
          </View>
        </Pressable>

        <Pressable style={styles.deleteButton} onPress={handleDeletePet}>
          <View style={styles.buttonContent}>
            <Ionicons name="trash-outline" size={20} color="white" />
            <Text style={styles.buttonText}>Delete Pet</Text>
          </View>
        </Pressable>
      </ScrollView>
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
      padding: 20,
      backgroundColor: Colors[theme].background,
    },
    avatarContainer: {
      alignItems: 'center',
      marginVertical: 20,
    },
    avatar: {
      width: 150,
      height: 150,
      borderRadius: 75,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      borderWidth: 3,
      // --- CAMBIO: Sombra añadida ---
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 5,
      elevation: 5,
    },
    avatarImage: {
      width: '100%',
      height: '100%',
    },
    title: {
      fontSize: 32, // --- CAMBIO: Tamaño aumentado
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
      color: Colors[theme].text,
    },
    detailsContainer: {
      backgroundColor: Colors[theme].card,
      borderRadius: 12,
      padding: 20,
      marginBottom: 30,
      borderWidth: 1,
      borderColor: Colors[theme].border,
      // --- CAMBIO: Sombra añadida ---
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    detailText: {
      fontSize: 18,
      color: Colors[theme].text,
      marginBottom: 10,
    },
    button: {
      padding: 15,
      borderRadius: 12,
      width: '100%',
      alignItems: 'center',
      marginBottom: 15,
      // --- CAMBIO: Sombra añadida ---
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
    },
    buttonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'transparent',
    },
    buttonText: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
      marginLeft: 10,
    },
    deleteButton: {
      backgroundColor: '#FF3B30',
      padding: 15,
      borderRadius: 12,
      width: '100%',
      alignItems: 'center',
      marginBottom: 50,
      // --- CAMBIO: Sombra añadida ---
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modalContent: {
      padding: 20,
      borderRadius: 12,
      width: '85%',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: Colors[theme].text,
      marginBottom: 20,
    },
    qrContainer: {
      padding: 20,
      backgroundColor: 'white',
      borderRadius: 8,
      marginBottom: 20,
    },
    modalSubtitle: {
      fontSize: 14,
      color: Colors[theme].icon,
      textAlign: 'center',
      marginBottom: 25,
    },
  });