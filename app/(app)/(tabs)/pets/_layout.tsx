import { Stack } from 'expo-router';

export default function MascotasLayout() {
  return (
    // ¡CAMBIO CLAVE!
    // Le decimos a este Stack "hijo" que NO
    // dibuje su propia barra de cabecera.
    <Stack screenOptions={{ headerShown: false }}>
      {/* (El resto de tus definiciones de pantalla está perfecto) */}
      <Stack.Screen name="index" options={{ title: 'My Pets' }} />
      <Stack.Screen name="addPet" options={{ title: 'Add New Pet' }} />
      <Stack.Screen name="[id]" options={{ title: 'Profile' }} />
      <Stack.Screen name="edit/[id]" options={{ title: 'Edit Pet' }} />
    </Stack>
  );
}