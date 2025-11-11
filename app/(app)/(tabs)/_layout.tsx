import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native'; // Importar Platform

// Forzamos el tema oscuro como base del diseño
const theme = Colors.dark;

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false, // La cabecera ahora se maneja en el _layout.tsx superior
        tabBarStyle: {
          backgroundColor: theme.card, // Fondo de tarjeta oscuro
          // --- CORRECCIÓN: Usar insets.bottom en AMBAS plataformas ---
          paddingBottom: insets.bottom,
          paddingTop: 8, // Padding superior
          height: 60 + insets.bottom,
          // --- FIN DE LA CORRECCIÓN ---
          borderTopWidth: 1,
          borderTopColor: theme.border, // Borde sutil
        },
        tabBarActiveTintColor: theme.tint, // Ícono activo (Púrpura)
        tabBarInactiveTintColor: theme.tabIconDefault, // Ícono inactivo (Gris)
        tabBarShowLabel: false, // --- NUEVO: Ocultar etiquetas ---
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="rizz"
        options={{
          title: 'Rizz',
          // --- NUEVO: Ícono más grande y centrado ---
          tabBarIcon: ({ color, focused }) => (
            <View style={{ 
              backgroundColor: theme.tint, 
              padding: 12, 
              borderRadius: 30, 
              width: 60, 
              height: 60, 
              justifyContent: 'center', 
              alignItems: 'center', 
              bottom: 20, // Elevar el botón
              shadowColor: theme.tint,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.4,
              shadowRadius: 5,
              elevation: 8,
            }}>
              <Ionicons name={"sparkles"} size={30} color={"#FFFFFF"} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="store"
        options={{
          title: 'Store',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "cart" : "cart-outline"} size={26} color={color} />
          ),
        }}
      />
      {/* --- CAMBIO: Se elimina la pestaña de perfil, ahora está en el menú --- */}
      <Tabs.Screen
         name="profile"
         // Ocultar esta pestaña de la barra
         options={{
           href: null,
         }}
      />
    </Tabs>
  );
}

// --- NUEVO: View temporal para el ícono central ---
// (Podríamos moverlo a Themed.tsx si se usa más)
const View = (props: { style?: any, children: React.ReactNode }) => {
  return <React.Fragment>{props.children}</React.Fragment>;
};

// --- Añadir React ---
import React from 'react';