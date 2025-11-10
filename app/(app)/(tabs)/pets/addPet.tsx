import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
// ¡YA NO SE USA useNavigation!
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { decode } from 'base64-arraybuffer';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView, // --- CAMBIO: Importado
  LogBox,
  Platform, // --- CAMBIO: Importado
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

LogBox.ignoreLogs([
  '[expo-image-picker] `ImagePicker.MediaTypeOptions` have been deprecated',
]);

type Especie = 'Gato' | 'Perro';
type Genero = 'Macho' | 'Hembra';

// Ya no necesitamos MascotasStackParamList

export default function AddPetScreen() {
  // Ya no usamos useNavigation()

  const [nombre, setNombre] = useState('');
  const [especie, setEspecie] = useState<Especie>('Gato');
  const [genero, setGenero] = useState<Genero | undefined>(undefined);
  const [fecha, setFecha] = useState(new Date());
  const [fechaTexto, setFechaTexto] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [numeroChip, setNumeroChip] = useState('');
  const [notas, setNotas] = useState('');
  const [localImage, setLocalImage] =
    useState<ImagePicker.ImagePickerAsset | null>(null);

  const colorScheme = useColorScheme() ?? 'light';
  const styles = getStyles(colorScheme);
  const placeholderColor = Colors[colorScheme].icon;
  const pickerColor = Colors[colorScheme].text;
  const tintColor = Colors[colorScheme].tint;

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFecha(selectedDate);
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setFechaTexto(formattedDate);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Denied',
        'We need access to your photos to add a pet photo.'
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled) {
      setLocalImage(result.assets[0]);
    }
  };

  async function handleAddPet() {
    if (!nombre || !especie) {
      Alert.alert('Incomplete Fields', 'Please fill in Name and Species.');
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    // --- Validación de Duplicados ---
    const trimmedName = nombre.trim();
    const { data: existingPet, error: checkError } = await supabase
      .from('pets')
      .select('id')
      .eq('user_id', user.id)
      .eq('nombre', trimmedName)
      .maybeSingle();

    if (checkError) {
      Alert.alert('Error checking pet name', checkError.message);
      return;
    }

    if (existingPet) {
      Alert.alert(
        'Duplicate Pet Name',
        'You already have a pet with this name. Please choose a different name.'
      );
      return;
    }
    // --- Fin Validación ---

    let newPetPhotoUrl: string | null = null;

    if (localImage) {
      try {
        const fileExt = localImage.uri.split('.').pop();
        const fileName = `${user.id}_${Date.now()}.${fileExt}`;
        const base64 = localImage.base64;

        if (!base64) {
          throw new Error('Could not get base64 data from image');
        }

        const decodedData = decode(base64);

        const { data, error: uploadError } = await supabase.storage
          .from('pet-photos')
          .upload(fileName, decodedData, {
            contentType: localImage.mimeType ?? 'image/jpeg',
            upsert: false,
          });

        if (uploadError) {
          throw uploadError;
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from('pet-photos').getPublicUrl(fileName);

        newPetPhotoUrl = publicUrl;
      } catch (error: any) {
        Alert.alert('Upload Failed', error.message);
        return;
      }
    }

    const { error } = await supabase.from('pets').insert({
      nombre: trimmedName,
      especie: especie,
      notas: notas || null,
      numero_chip: numeroChip || null,
      genero: genero || null,
      fecha_nacimiento: fechaTexto || null,
      foto_url: newPetPhotoUrl,
      user_id: user.id,
    });

    if (error) {
      Alert.alert('Error Saving', error.message);
    } else {
      Alert.alert('Success!', 'Pet added successfully.');
      // --- ¡NAVEGACIÓN CORREGIDA CON TU LÓGICA! ---
      router.replace('/(app)/(tabs)/pets');
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* --- CAMBIO: Envolvemos el ScrollView --- */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView style={styles.container}>
          <Text style={styles.title}>Add New Pet</Text>

          <View style={styles.avatarContainer}>
            <Pressable style={styles.avatar} onPress={pickImage}>
              {localImage ? (
                <Image
                  source={{ uri: localImage.uri }}
                  style={styles.avatarImage}
                />
              ) : (
                <Ionicons name="paw" size={60} color={tintColor} />
              )}
              <View style={styles.cameraButton}>
                <Text style={styles.cameraIcon}>📷</Text>
              </View>
            </Pressable>
          </View>

          <Text style={styles.label}>Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="E.g., Fido"
            placeholderTextColor={placeholderColor}
            value={nombre}
            onChangeText={setNombre}
          />

          <Text style={styles.label}>Species *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={especie}
              onValueChange={(itemValue) => setEspecie(itemValue as Especie)}
              style={styles.picker}
              dropdownIconColor={pickerColor}>
              <Picker.Item label="Cat" value="Gato" />
              <Picker.Item label="Dog" value="Perro" />
            </Picker>
          </View>

          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={styles.input}
            placeholder="Optional..."
            placeholderTextColor={placeholderColor}
            value={notas}
            onChangeText={setNotas}
            multiline
          />

          <Text style={styles.label}>Chip Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Optional..."
            placeholderTextColor={placeholderColor}
            value={numeroChip}
            onChangeText={setNumeroChip}
          />

          <Text style={styles.label}>Gender</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={genero}
              onValueChange={(itemValue) => setGenero(itemValue as Genero)}
              style={styles.picker}
              dropdownIconColor={pickerColor}>
              <Picker.Item label="Select gender (optional)" value={undefined} />
              <Picker.Item label="Male" value="Macho" />
              <Picker.Item label="Female" value="Hembra" />
            </Picker>
          </View>

          <Text style={styles.label}>Date of Birth</Text>
          <Pressable
            style={styles.input}
            onPress={() => setShowDatePicker(true)}>
            <Text style={styles.dateText}>
              {fechaTexto || 'Select date...'}
            </Text>
          </Pressable>
          {showDatePicker && (
            <DateTimePicker
              value={fecha}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}
          <Pressable style={styles.button} onPress={handleAddPet}>
            <Text style={styles.buttonText}>Save Pet</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
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
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
      color: Colors[theme].text,
    },
    avatarContainer: {
      alignItems: 'center',
      marginVertical: 20,
    },
    avatar: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: Colors[theme].card,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: Colors[theme].border,
    },
    avatarImage: {
      width: '100%',
      height: '100%',
      borderRadius: 60,
    },
    cameraButton: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      padding: 8,
      borderRadius: 15,
    },
    cameraIcon: {
      fontSize: 16,
      color: 'white',
    },
    label: {
      fontSize: 16,
      marginBottom: 5,
      marginTop: 10,
      color: Colors[theme].text,
    },
    input: {
      width: '100%',
      minHeight: 50,
      borderWidth: 1,
      borderColor: Colors[theme].border,
      backgroundColor: Colors[theme].card,
      borderRadius: 8,
      paddingHorizontal: 15,
      paddingVertical: 10,
      marginBottom: 15,
      fontSize: 16,
      color: Colors[theme].text,
      justifyContent: 'center',
    },
    pickerContainer: {
      borderWidth: 1,
      borderColor: Colors[theme].border,
      backgroundColor: Colors[theme].card,
      borderRadius: 8,
      marginBottom: 15,
    },
    picker: {
      color: Colors[theme].text,
      height: 50,
    },
    dateText: {
      color: Colors[theme].text,
      fontSize: 16,
    },
    button: {
      width: '100%',
      height: 50,
      backgroundColor: Colors[theme].tint,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
      marginTop: 20,
      marginBottom: 50,
    },
    buttonText: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
    },
  });