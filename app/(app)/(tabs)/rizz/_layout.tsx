import { Stack } from 'expo-router';
import React from 'react';

export default function RizzStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="startConversation"
        options={{ title: 'Start a Conversation' }}
      />
      <Stack.Screen
        name="replySuggestions"
        options={{ title: 'Get Reply Suggestions' }}
      />
      <Stack.Screen
        name="awkwardSituation"
        options={{ title: 'Awkward Situations' }}
      />
      <Stack.Screen
        name="pickupLines"
        options={{ title: 'Banger Pickup Lines' }}
      />
    </Stack>
  );
}