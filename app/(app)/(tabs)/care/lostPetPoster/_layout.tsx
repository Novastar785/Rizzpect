import { Stack } from 'expo-router';

export default function LostPetLayout() {
  return (
    <Stack>
      {/* La nueva pantalla de "lista" */}
      <Stack.Screen name="index" options={{ title: 'Select a Pet' }} />
      {/* La nueva pantalla de "plantilla de póster" */}
      <Stack.Screen name="[id]" options={{ title: 'Lost Pet Poster' }} />
    </Stack>
  );
}