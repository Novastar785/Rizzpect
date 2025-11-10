import { Stack } from 'expo-router';

export default function ReportLayout() {
  return (
    <Stack>
      {/* La nueva pantalla de "lista" */}
      <Stack.Screen name="index" options={{ title: 'Select Pet for Report' }} />
      {/* La nueva pantalla de "generador de PDF" */}
      <Stack.Screen name="[id]" options={{ title: 'Pet Care Report' }} />
    </Stack>
  );
}