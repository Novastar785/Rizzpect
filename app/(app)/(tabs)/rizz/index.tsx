import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Forzamos el tema oscuro
const theme = 'dark';
const themeColors = Colors[theme];

// --- NUEVO: Colores de íconos para dar vida a la lista ---
const iconColors = {
  start: themeColors.tint, // Púrpura
  reply: themeColors.secondary, // Azul
  awkward: themeColors.accentGreen, // Verde
  pickup: themeColors.accentRed, // Rojo
};

// --- NUEVO: Componente de tarjeta de Rizz ---
const RizzCard = ({ href, icon, title, description, color }: { href: string, icon: any, title: string, description: string, color: string }) => {
  return (
    <Link href={href as any} asChild>
      <Pressable style={styles.card}>
        <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
          <Ionicons
            name={icon}
            size={24}
            style={[styles.cardIcon, { color: color }]}
          />
        </View>
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardDescription}>{description}</Text>
        </View>
        <Ionicons name="chevron-forward-outline" size={20} color={themeColors.icon} />
      </Pressable>
    </Link>
  );
};

export default function RizzScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Social Assistant</Text>
        <Text style={styles.subtitle}>What can I help you with today?</Text>

        <View style={styles.buttonContainer}>
          <RizzCard
            href="/(app)/(tabs)/rizz/startConversation"
            icon="chatbubbles-outline"
            title="Start a Conversation"
            description="Break the ice with a perfect opener."
            color={iconColors.start}
          />
          <RizzCard
            href="/(app)/(tabs)/rizz/replySuggestions"
            icon="arrow-undo-outline"
            title="Get Reply Suggestions"
            description="Analyze a screenshot and get clever replies."
            color={iconColors.reply}
          />
          <RizzCard
            href="/(app)/(tabs)/rizz/awkwardSituation"
            icon="help-buoy-outline"
            title="Awkward Situation"
            description="Navigate tricky social moments smoothly."
            color={iconColors.awkward}
          />
          <RizzCard
            href="/(app)/(tabs)/rizz/pickupLines"
            icon="flame-outline"
            title="Banger Pickup Lines"
            description="Generate lines that actually work."
            color={iconColors.pickup}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Estilos actualizados para el tema oscuro
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: themeColors.background,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: themeColors.background,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: themeColors.text,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: themeColors.icon,
    marginBottom: 30,
  },
  buttonContainer: {
    width: '100%',
  },
  // --- NUEVOS Estilos de Tarjeta ---
  card: {
    backgroundColor: themeColors.card,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16, 
    marginBottom: 15,
    borderWidth: 1,
    borderColor: themeColors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, 
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardIcon: {
    // El color se aplica dinámicamente
  },
  cardTextContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  cardTitle: {
    color: themeColors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  cardDescription: {
    color: themeColors.icon,
    fontSize: 14,
    marginTop: 2,
  },
  // --- FIN Estilos de Tarjeta ---
});