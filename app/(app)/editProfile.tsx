import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { supabase } from '@/lib/supabase';
import { decode } from 'base64-arraybuffer';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
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
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

LogBox.ignoreLogs([
  '[expo-image-picker] `ImagePicker.MediaTypeOptions` have been deprecated',
]);

type Profile = {
  name: string | null;
  last_name: string | null;
  phone_number: string | null;
  contact_email: string | null;
  street_address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  foto_url: string | null;
};

export default function EditProfileScreen() {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [localImage, setLocalImage] =
    useState<ImagePicker.ImagePickerAsset | null>(null);

  const colorScheme = useColorScheme() ?? 'light';
  const styles = getStyles(colorScheme);
  const placeholderColor = Colors[colorScheme].icon;
  const tintColor = Colors[colorScheme].tint;

  useEffect(() => {
    async function fetchProfileAndPermissions() {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert('Error', 'No user session found.');
        return;
      }
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        Alert.alert('Error', 'Failed to load profile.');
      } else if (data) {
        setName(data.name || '');
        setLastName(data.last_name || '');
        setPhone(data.phone_number || '');
        setContactEmail(data.contact_email || '');
        setAddress(data.street_address || '');
        setCity(data.city || '');
        setState(data.state || '');
        setZip(data.zip_code || '');
        setEmergencyName(data.emergency_contact_name || '');
        setEmergencyPhone(data.emergency_contact_phone || '');
        setAvatarUrl(data.foto_url);
      }
      setLoading(false);
    }
    fetchProfileAndPermissions();
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Denied',
        'We need access to your photos to update your avatar.'
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

  async function handleUpdateProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    let newAvatarUrl = avatarUrl;

    if (localImage) {
      try {
        const fileExt = localImage.uri.split('.').pop();
        const fileName = `${user.id}.${fileExt}`;
        const base64 = localImage.base64;

        if (!base64) {
          throw new Error('Could not get base64 data from image');
        }

        const decodedData = decode(base64);

        const { data, error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, decodedData, {
            contentType: localImage.mimeType ?? 'image/jpeg',
            upsert: true,
          });

        if (uploadError) {
          throw uploadError;
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from('avatars').getPublicUrl(fileName);

        newAvatarUrl = `${publicUrl}?t=${new Date().getTime()}`;
      } catch (error: any) {
        Alert.alert('Upload Failed', error.message);
        return;
      }
    }

    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      name: name || null,
      last_name: lastName || null,
      phone_number: phone || null,
      contact_email: contactEmail || null,
      street_address: address || null,
      city: city || null,
      state: state || null,
      zip_code: zip || null,
      emergency_contact_name: emergencyName || null,
      emergency_contact_phone: emergencyPhone || null,
      updated_at: new Date(),
      foto_url: newAvatarUrl,
    });

    if (error) {
      Alert.alert('Error updating profile', error.message);
    } else {
      Alert.alert('Success!', 'Profile updated successfully.');
      router.back();
    }
  }

  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: tintColor }}
        edges={['bottom']}>
        <View style={styles.container}>
          <Text style={styles.title}>Loading Profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: tintColor }}
      edges={['bottom']}>
      {/* --- CAMBIO: Envolvemos el ScrollView --- */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView style={styles.container}>
          <View style={styles.avatarContainer}>
            <Pressable style={styles.avatar} onPress={pickImage}>
              {localImage ? (
                <Image
                  source={{ uri: localImage.uri }}
                  style={styles.avatarImage}
                />
              ) : avatarUrl ? (
                <Image
                  source={{ uri: avatarUrl }}
                  style={styles.avatarImage}
                />
              ) : (
                <Text style={styles.avatarLetter}>
                  {(name || 'L').charAt(0).toUpperCase()}
                </Text>
              )}

              <View style={styles.cameraButton}>
                <Text style={styles.cameraIcon}>📷</Text>
              </View>
            </Pressable>
          </View>

          {/* --- Formulario --- */}
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholderTextColor={placeholderColor}
          />
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
            placeholderTextColor={placeholderColor}
          />
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholderTextColor={placeholderColor}
          />
          <Text style={styles.label}>Contact Email</Text>
          <TextInput
            style={styles.input}
            value={contactEmail}
            onChangeText={setContactEmail}
            keyboardType="email-address"
            placeholderTextColor={placeholderColor}
          />
          <Text style={styles.label}>Street Address</Text>
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={setAddress}
            placeholderTextColor={placeholderColor}
          />
          <Text style={styles.label}>City</Text>
          <TextInput
            style={styles.input}
            value={city}
            onChangeText={setCity}
            placeholderTextColor={placeholderColor}
          />
          <Text style={styles.label}>State</Text>
          <TextInput
            style={styles.input}
            value={state}
            onChangeText={setState}
            placeholderTextColor={placeholderColor}
          />
          <Text style={styles.label}>Zip Code</Text>
          <TextInput
            style={styles.input}
            value={zip}
            onChangeText={setZip}
            keyboardType="numeric"
            placeholderTextColor={placeholderColor}
          />
          <Text style={styles.label}>Emergency Contact Name</Text>
          <TextInput
            style={styles.input}
            value={emergencyName}
            onChangeText={setEmergencyName}
            placeholderTextColor={placeholderColor}
          />
          <Text style={styles.label}>Emergency Contact Phone</Text>
          <TextInput
            style={styles.input}
            value={emergencyPhone}
            onChangeText={setEmergencyPhone}
            keyboardType="phone-pad"
            placeholderTextColor={placeholderColor}
          />

          <Pressable style={styles.button} onPress={handleUpdateProfile}>
            <Text style={styles.buttonText}>Save Changes</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Estilos dinámicos
const getStyles = (theme: 'light' | 'dark') =>
  StyleSheet.create({
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
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: Colors[theme].tint,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    },
    avatarImage: {
      width: '100%',
      height: '100%',
      borderRadius: 60,
    },
    avatarLetter: {
      color: 'white',
      fontSize: 60,
      fontWeight: 'bold',
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
      color: Colors[theme].text,
      marginBottom: 5,
      marginTop: 10,
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
    },
    button: {
      backgroundColor: Colors[theme].tint,
      padding: 15,
      borderRadius: 12,
      width: '100%',
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 50,
    },
    buttonText: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: Colors[theme].text,
      textAlign: 'center',
    },
  });