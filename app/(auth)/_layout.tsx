import { Stack } from 'expo-router';

export default function AuthLayout() {
  // Este "plano" solo define la navegación para
  // las pantallas de login y registro.
  // No necesita 'useEffect' ni 'SystemUI'.
  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
    </Stack>
  );
}