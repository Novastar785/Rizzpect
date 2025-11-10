import Colors from '@/constants/Colors';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Linking,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * ESTA ES LA PÁGINA PÚBLICA
 * Cualquiera con el enlace puede ver esto, sin iniciar sesión.
 */
export default function PublicPetProfile() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [pet, setPet] = useState<any>(null);
  const [owner, setOwner] = useState<any>(null);

  const styles = getStyles(); // Usamos estilos fijos (modo claro)
  const tintColor = Colors.light.tint;

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    async function fetchPublicData() {
      // 1. Obtener la información de la mascota
      const { data: petData, error: petError } = await supabase
        .from('pets')
        .select('nombre, especie, foto_url, user_id') // Obtenemos el user_id
        .eq('id', id)
        .single();

      if (petError || !petData) {
        console.error('Error fetching pet:', petError);
        setPet(null);
        setLoading(false);
        return;
      }
      setPet(petData);

      // 2. Usar el user_id de la mascota para buscar la info de emergencia del dueño
      const { data: ownerData, error: ownerError } = await supabase
        .from('profiles')
        .select('emergency_contact_name, emergency_contact_phone') // ¡Solo info de emergencia!
        .eq('id', petData.user_id)
        .single();

      if (ownerError) {
        console.error('Error fetching owner:', ownerError);
      } else if (ownerData) {
        setOwner(ownerData);
      }

      setLoading(false);
    }

    fetchPublicData();
  }, [id]);

  const handleCall = () => {
    if (owner?.emergency_contact_phone) {
      Linking.openURL(`tel:${owner.emergency_contact_phone}`);
    } else {
      // Ahora 'Alert' es válido
      Alert.alert('Error', 'No contact phone is available.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={tintColor} />
        <Text style={styles.loaderText}>Loading pet info...</Text>
      </View>
    );
  }

  if (!pet) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Stack.Screen options={{ title: 'Error' }} />
        <View style={styles.container}>
          <Ionicons name="alert-circle-outline" size={60} color="#FF3B30" />
          <Text style={styles.title}>Pet Not Found</Text>
          <Text style={styles.subtitle}>
            This Pet ID is invalid or the pet may have been removed.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const displayEspecie = pet.especie === 'Gato' ? 'Cat' : 'Dog';

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ title: `Profile: ${pet.nombre}` }} />
      <ScrollView style={styles.container}>
        <View style={styles.avatarContainer}>
          <View
            style={[
              styles.avatar,
              { backgroundColor: Colors.light.border, borderColor: tintColor },
            ]}>
            {pet.foto_url ? (
              <Image source={{ uri: pet.foto_url }} style={styles.avatarImage} />
            ) : (
              <Ionicons name="paw" size={80} color={tintColor} />
            )}
          </View>
        </View>
        <Text style={styles.title}>I'm {pet.nombre}!</Text>
        <Text style={styles.subtitle}>
          I'm a lost {displayEspecie}. Please contact my owner.
        </Text>

        {/* --- Información de Contacto --- */}
        {owner?.emergency_contact_name || owner?.emergency_contact_phone ? (
          <View style={styles.contactCard}>
            <Text style={styles.contactTitle}>Owner Contact Info</Text>
            {owner.emergency_contact_name && (
              <Text style={styles.contactInfo}>
                Name: {owner.emergency_contact_name}
              </Text>
            )}
            {owner.emergency_contact_phone && (
              <Text style={styles.contactInfo}>
                Phone: {owner.emergency_contact_phone}
              </Text>
            )}
            <Pressable
              style={[styles.callButton, { backgroundColor: tintColor }]}
              onPress={handleCall}>
              <Ionicons name="call" size={20} color="white" />
              <Text style={styles.callButtonText}>Call Owner</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.contactCard}>
            <Text style={styles.contactTitle}>Owner Contact Info</Text>
            <Text style={styles.contactInfo}>
              The owner has not provided public emergency contact information.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// Estilos (Modo Claro Fijo)
const getStyles = () =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: Colors.light.background,
    },
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: Colors.light.background,
    },
    loaderContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.light.background,
    },
    loaderText: {
      marginTop: 10,
      fontSize: 16,
      color: Colors.light.icon,
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
    },
    avatarImage: {
      width: '100%',
      height: '100%',
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 10,
      textAlign: 'center',
      color: Colors.light.text,
    },
    subtitle: {
      fontSize: 18,
      color: Colors.light.icon,
      textAlign: 'center',
      marginBottom: 30,
    },
    contactCard: {
      backgroundColor: Colors.light.card,
      borderRadius: 12,
      padding: 20,
      marginBottom: 30,
      borderWidth: 1,
      borderColor: Colors.light.border,
    },
    contactTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: Colors.light.text,
      marginBottom: 15,
    },
    contactInfo: {
      fontSize: 18,
      color: Colors.light.text,
      marginBottom: 10,
    },
    callButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 15,
      borderRadius: 12,
      width: '100%',
      marginTop: 10,
    },
    callButtonText: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
      marginLeft: 10,
    },
  });