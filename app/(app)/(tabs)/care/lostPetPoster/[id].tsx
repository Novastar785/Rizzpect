import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors'; // Importamos Colors
import { supabase } from '@/lib/supabase';
import * as Print from 'expo-print';
import { Stack, useLocalSearchParams } from 'expo-router';
import * as Sharing from 'expo-sharing';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  useColorScheme, // Importamos useColorScheme
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Pet = {
// ... (tipo sin cambios)
  id: string;
  nombre: string;
  especie: 'Gato' | 'Perro';
  numero_chip: string | null;
  foto_url: string | null;
};

export default function PetPosterScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [pet, setPet] = useState<Pet | null>(null);
  const [userEmail, setUserEmail] = useState<string | undefined>('');

  const colorScheme = useColorScheme() ?? 'light';
  const styles = getStyles(colorScheme);

  useEffect(() => {
// ... (lógica de useEffect sin cambios)
    if (!id) return;
    async function fetchUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setUserEmail(user.email);
    }
    async function fetchPet() {
      const { data, error } = await supabase
        .from('pets')
        .select('id, nombre, especie, numero_chip, foto_url')
        .eq('id', id)
        .single();
      if (error) {
        Alert.alert('Error', 'Could not load pet data.');
      } else {
        setPet(data);
      }
    }
    fetchUser();
    fetchPet();
  }, [id]);

  const generateAndSharePdf = async () => {
    if (!pet) return;

    // TODO: Usar pet.foto_url en el HTML
    const photoHtml = pet.foto_url
      ? `<img src="${pet.foto_url}" style="width: 100%; height: 300px; object-fit: cover;" />`
      : `<div class="photo-placeholder">(Pet Photo Here)</div>`;

    const htmlContent = `
      <html>
        <head>
          <style>
            body { 
              font-family: sans-serif; 
              text-align: center; 
              padding: 40px;
            }
            .poster { 
              border: 10px solid #FF3B30; /* Borde rojo de alerta */
              padding: 20px; 
              height: 90%;
            }
            h1 { 
              font-size: 72px; 
              color: #FF3B30; 
              margin: 20px 0; 
            }
            .photo {
              width: 80%;
              height: 300px;
              margin: 20px auto;
            }
            .photo-placeholder {
              border: 2px dashed #AAA;
              background-color: #EEE;
              height: 300px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 24px;
              color: #AAA;
            }
            h2 {
              font-size: 96px;
              color: #000;
              margin: 40px 0;
            }
            .info { font-size: 24px; margin: 10px; }
            .contact { margin-top: 50px; }
            .label { font-size: 32px; font-weight: bold; }
            .email { font-size: 28px; }
          </style>
        </head>
        <body>
          <div class="poster">
            <h1>LOST PET</h1>
            
            <div class="photo">
              ${photoHtml}
            </div>
            
            <h2>${pet.nombre.toUpperCase()}</h2>
            
            <p class="info"><b>SPECIES:</b> ${pet.especie}</p>
            <p class="info"><b>CHIP:</b> ${pet.numero_chip || 'N/A'}</p>
            
            <div class="contact">
              <p class="label">IF FOUND, PLEASE CONTACT:</p>
              <p class="email">${userEmail || 'Contact info unavailable'}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    try {
// ... (lógica de try/catch sin cambios, ya estaba en inglés)
      const { uri } = await Print.printToFileAsync({ html: htmlContent });

      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert('Error', 'Sharing is not available on this device.');
        return;
      }

      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Share Lost Pet Poster',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to generate PDF poster.');
      console.error(error);
    }
  };

  if (!pet) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.title}>Loading poster data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Stack.Screen options={{ title: `Poster for ${pet.nombre}` }} />

        <Text style={styles.title}>Generate Poster for {pet.nombre}</Text>
        <Text style={styles.subtitle}>
          This will generate a print-ready PDF poster (A4/Letter) for your lost
          pet.
        </Text>

        <Pressable style={styles.button} onPress={generateAndSharePdf}>
          <Text style={styles.buttonText}>Generate & Share Poster PDF</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

// Estilos dinámicos (idénticos a generateReport/[id].tsx pero con botón rojo)
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
      fontSize: 22,
      fontWeight: 'bold',
      color: Colors[theme].text,
      textAlign: 'center',
      marginBottom: 15,
    },
    subtitle: {
      fontSize: 16,
      color: Colors[theme].icon,
      textAlign: 'center',
      marginBottom: 30,
    },
    button: {
      backgroundColor: '#FF3B30', // Botón rojo para "Lost Pet"
      padding: 15,
      borderRadius: 12,
      width: '100%',
      alignItems: 'center',
    },
    buttonText: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
    },
  });