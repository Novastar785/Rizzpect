import { Stack } from 'expo-router';

export default function CareLayout() {
  return (
    // ¡CAMBIO CLAVE!
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: 'Care & Services' }} />
      <Stack.Screen name="generateReport" options={{ headerShown: false }} />
      <Stack.Screen name="lostPetPoster" options={{ headerShown: false }} />
    </Stack>
  );
}