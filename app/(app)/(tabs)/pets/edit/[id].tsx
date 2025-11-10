import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors'; // Importamos Colors
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { NavigationProp } from '@react-navigation/native';
import { decode } from 'base64-arraybuffer';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
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
  useColorScheme, // Importamos useColorScheme
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

LogBox.ignoreLogs([
  '[expo-image-picker] `ImagePicker.MediaTypeOptions` have been deprecated',
]);

type Especie = 'Cat' | 'Dog'; // Traducido
type Genero = 'Male' | 'Female'; // Traducido

export type MascotasStackParamList = {
  // ... (tipo sin cambios)
  index: undefined;
  '[id]': { id: string };
  addPet: undefined;
  'edit/[id]': { id: string };
};

export default function EditPetScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation<NavigationProp<MascotasStackParamList>>();

  const [loading, setLoading] = useState(true);
  // ... (otros estados sin cambios)
  const [nombre, setNombre] = useState('');
  const [especie, setEspecie] = useState<Especie>('Cat'); // Traducido
  const [genero, setGenero] = useState<Genero | undefined>(undefined);
  const [fecha, setFecha] = useState(new Date());
  const [fechaTexto, setFechaTexto] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [numeroChip, setNumeroChip] = useState('');
  const [notas, setNotas] = useState('');
  const [petPhotoUrl, setPetPhotoUrl] = useState<string | null>(null);
  const [localImage, setLocalImage] =
    useState<ImagePicker.ImagePickerAsset | null>(null);

  const colorScheme = useColorScheme() ?? 'light';
  const styles = getStyles(colorScheme);
  const placeholderColor = Colors[colorScheme].icon;
  const pickerColor = Colors[colorScheme].text;
  const tintColor = Colors[colorScheme].tint;

  useEffect(() => {
    // ... (lógica de useEffect sin cambios, alertas ya en inglés)
    ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!id) return;
    async function fetchPet() {
      setLoading(true);
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        Alert.alert('Error', 'Could not load pet data.');
      } else if (data) {
        setNombre(data.nombre);
        setEspecie(data.especie); // Se setea a 'Cat' o 'Dog'
        setGenero(data.genero || undefined); // Se setea a 'Male' o 'Female'
        setNumeroChip(data.numero_chip || '');
        setNotas(data.notas || '');
        if (data.fecha_nacimiento) {
          setFechaTexto(data.fecha_nacimiento);
          setFecha(new Date(data.fecha_nacimiento));
        }
        setPetPhotoUrl(data.foto_url);
      }
      setLoading(false);
    }
    fetchPet();
  }, [id]);

  const pickImage = async () => {
    // ... (lógica sin cambios)
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

  const onDateChange = (event: any, selectedDate?: Date) => {
    // ... (lógica sin cambios)
    setShowDatePicker(false);
    if (selectedDate) {
      setFecha(selectedDate);
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setFechaTexto(formattedDate);
    }
  };

  async function handleUpdatePet() {
    // ... (lógica sin cambios, alertas ya en inglés)
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    let updatedPhotoUrl = petPhotoUrl;

    if (localImage) {
      try {
        const fileExt = localImage.uri.split('.').pop();
        const fileName = `${user.id}_${Date.now()}.${fileExt}`;
        const base64 = localImage.base64;

        if (!base64) throw new Error('Could not get base64 data from image');
        const decodedData = decode(base64);

        const { data, error: uploadError } = await supabase.storage
          .from('pet-photos')
          .upload(fileName, decodedData, {
            contentType: localImage.mimeType ?? 'image/jpeg',
            upsert: true,
          });

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from('pet-photos').getPublicUrl(fileName);

        updatedPhotoUrl = publicUrl;
      } catch (error: any) {
        Alert.alert('Upload Failed', error.message);
        return;
      }
    }

    const { error } = await supabase
      .from('pets')
      .update({
        nombre: nombre,
        especie: especie,
        notas: notas || null,
        numero_chip: numeroChip || null,
        genero: genero || null,
        fecha_nacimiento: fechaTexto || null,
        foto_url: updatedPhotoUrl,
      })
      .eq('id', id);

    if (error) {
      Alert.alert('Error Updating', error.message);
    } else {
      Alert.alert('Success!', 'Pet updated successfully.');
      router.back();
    }
  }

  async function handleDeletePet() {
    // ... (lógica sin cambios, alertas ya en inglés)
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this pet? This action is irreversible.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, Delete',
          style: 'destructive',
          onPress: async () => {
            const { error } = await supabase
              .from('pets')
              .delete()
              .eq('id', id as string);
            if (error) {
              Alert.alert('Error Deleting', error.message);
            } else {
              Alert.alert('Success!', 'Pet deleted.');
              (navigation as any).popToTop();
            }
          },
        },
      ]
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.title}>Loading data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* --- CAMBIO: Envolvemos el ScrollView --- */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView style={styles.container}>
          <Text style={styles.title}>Edit {nombre}</Text>
          <View style={styles.avatarContainer}>
            <Pressable style={styles.avatar} onPress={pickImage}>
              {localImage ? (
                <Image
                  source={{ uri: localImage.uri }}
                  style={styles.avatarImage}
                />
              ) : petPhotoUrl ? (
                <Image
                  source={{ uri: petPhotoUrl }}
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
            value={nombre}
            onChangeText={setNombre}
            placeholderTextColor={placeholderColor}
          />
          <Text style={styles.label}>Species *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={especie}
              onValueChange={(itemValue) => setEspecie(itemValue as Especie)}
              style={styles.picker}
              dropdownIconColor={pickerColor}>
              <Picker.Item label="Cat" value="Cat" />
              <Picker.Item label="Dog" value="Dog" />
            </Picker>
          </View>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={styles.input}
            value={notas}
            onChangeText={setNotas}
            multiline
            placeholderTextColor={placeholderColor}
          />
          <Text style={styles.label}>Chip Number</Text>
          <TextInput
            style={styles.input}
            value={numeroChip}
            onChangeText={setNumeroChip}
            placeholderTextColor={placeholderColor}
          />
          <Text style={styles.label}>Gender</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={genero}
              onValueChange={(itemValue) => setGenero(itemValue as Genero)}
              style={styles.picker}
              dropdownIconColor={pickerColor}>
              <Picker.Item label="Select gender (optional)" value={undefined} />
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Female" value="Female" />
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
          <Pressable style={styles.button} onPress={handleUpdatePet}>
            <Text style={styles.buttonText}>Update Pet</Text>
          </Pressable>
          <Pressable style={styles.deleteButton} onPress={handleDeletePet}>
            <Text style={styles.buttonText}>Delete Pet</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Estilos dinámicos (idénticos a addPet.tsx)
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
    },
    buttonText: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
    },
    deleteButton: {
      width: '100%',
      height: 50,
      backgroundColor: '#FF3B30', // Semántico
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
      marginTop: 15,
      marginBottom: 50,
    },
  });