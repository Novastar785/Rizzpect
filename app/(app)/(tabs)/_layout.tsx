import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Forzamos el tema oscuro como base del diseño
const theme = Colors.dark;

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          // --- CAMBIO: Barra de pestañas oscura y minimalista ---
          backgroundColor: theme.card, // Fondo de tarjeta oscuro
          paddingBottom: insets.bottom,
          height: 60 + insets.bottom,
          borderTopWidth: 1,
          borderTopColor: theme.border, // Borde sutil
        },
        tabBarActiveTintColor: theme.tint, // Ícono activo (Púrpura)
        tabBarInactiveTintColor: theme.tabIconDefault, // Ícono inactivo (Gris)
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="rizz"
        options={{
          title: 'Rizz',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "sparkles" : "sparkles-outline"} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="store"
        options={{
          title: 'Store',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "cart" : "cart-outline"} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "person" : "person-outline"} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}