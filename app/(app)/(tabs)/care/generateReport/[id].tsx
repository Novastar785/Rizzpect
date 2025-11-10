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
  genero: 'Macho' | 'Hembra' | null;
  fecha_nacimiento: string | null;
  numero_chip: string | null;
  notas: string | null;
};

export default function PDFReportScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [pet, setPet] = useState<Pet | null>(null);
  const [userEmail, setUserEmail] = useState<string | undefined>('');

  const colorScheme = useColorScheme() ?? 'light';
  const styles = getStyles(colorScheme);

  useEffect(() => {
// ... (lógica de useEffect sin cambios)
    if (!id) return;

    async function fetchData() {
      // Busca la mascota
      const { data: petData, error: petError } = await supabase
        .from('pets')
        .select('*')
        .eq('id', id)
        .single();

      if (petError) {
        Alert.alert('Error', 'Could not load pet data.');
      } else {
        setPet(petData);
      }

      // Busca el email del usuario
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email);
      }
    }
    fetchData();
  }, [id]);

  const generateAndSharePdf = async () => {
// ... (lógica de generateAndSharePdf sin cambios, ya estaba en inglés)
    if (!pet) return;

    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: sans-serif; padding: 20px; }
            h1 { color: ${Colors.light.tint}; text-align: center; }
            h2 { border-bottom: 2px solid #eee; padding-bottom: 5px; }
            .section { margin-bottom: 20px; }
            .label { font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>Pet Care Report</h1>
          
          <div class="section">
            <h2>Pet Information</h2>
            <p><span class="label">Name:</span> ${pet.nombre}</p>
            <p><span class="label">Species:</span> ${pet.especie}</p>
            <p><span class="label">Gender:</span> ${pet.genero || 'N/A'}</p>
            <p><span class="label">Date of Birth:</span> ${
              pet.fecha_nacimiento || 'N/A'
            }</p>
            <p><span class="label">Chip Number:</span> ${
              pet.numero_chip || 'N/A'
            }</p>
          </div>

          <div class="section">
            <h2>Important Notes</h2>
            <p>${pet.notas || 'No notes provided.'}</p>
          </div>
          
          <div class="section">
            <h2>Owner Contact</h2>
            <p><span class="label">Email:</span> ${userEmail || 'N/A'}</p>
            <p>In case of emergency, please contact the owner at the email above.</p>
          </div>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });

      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert('Error', 'Sharing is not available on this device.');
        return;
      }

      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Share Pet Report',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to generate PDF.');
      console.error(error);
    }
  };

  if (!pet) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.title}>Loading Report Data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Stack.Screen options={{ title: `Report for ${pet.nombre}` }} />

        <Text style={styles.title}>Generate Report for {pet.nombre}</Text>
        <Text style={styles.subtitle}>
          This tool will generate a PDF document with your pet's key information,
          ready to be shared with a vet or caregiver.
        </Text>

        <Pressable style={styles.button} onPress={generateAndSharePdf}>
          <Text style={styles.buttonText}>Generate & Share PDF</Text>
        </Pressable>
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
      backgroundColor: Colors[theme].tint,
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