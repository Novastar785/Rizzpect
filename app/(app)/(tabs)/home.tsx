import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Link, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Reminder = {
  id: string;
  title: string;
  start_datetime: string;
  pets: { nombre: string } | null;
};

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const styles = getStyles(colorScheme);
  const iconColor = Colors[colorScheme].tint;
  const cardColor = Colors[colorScheme].card;
  const faintIconColor = Colors[colorScheme].icon; // Para el estado vacío

  const [userName, setUserName] = useState('');
  const [reminders, setReminders] = useState<Reminder[]>([]);

    return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Welcome, {userName || 'User'}!</Text>
        <Text style={styles.subtitle}>What would you like to do?</Text>

        {/* Quick Actions Grid */}
        <View style={styles.quickActionsContainer}>
          <Link href="/(app)/(tabs)/pets/addPet" asChild>
            <Pressable style={styles.quickAction}>
              <Ionicons name="paw" size={28} color={iconColor} />
              <Text style={styles.quickActionText}>Add Pet</Text>
            </Pressable>
          </Link>
          <Link href="/(app)/(tabs)/reminders/create" asChild>
            <Pressable style={styles.quickAction}>
              <Ionicons name="calendar" size={28} color={iconColor} />
              <Text style={styles.quickActionText}>Add Reminder</Text>
            </Pressable>
          </Link>
        </View>

        {/* Upcoming Reminders Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Upcoming Reminders</Text>
          {reminders.length > 0 ? (
            reminders.map((r) => (
              <ReminderCard key={r.id} reminder={r} cardColor={cardColor} />
            ))
          ) : (
            // --- ¡ESTADO VACÍO MEJORADO! ---
            <View
              style={[
                styles.reminderCard,
                styles.emptyReminderCard, // Nuevo estilo
                { backgroundColor: cardColor },
              ]}>
              <Ionicons
                name="calendar-outline"
                size={24}
                color={faintIconColor}
              />
              <Text style={styles.reminderEmptyText}>
                No pending reminders.
              </Text>
            </View>
            // --- FIN DEL ESTADO VACÍO ---
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Componente de tarjeta de recordatorio
const ReminderCard = ({
  reminder,
  cardColor,
}: {
  reminder: Reminder;
  cardColor: string;
}) => {
  const styles = getStyles('light'); // 'light' es placeholder
  const colorScheme = useColorScheme() ?? 'light';

  const date = new Date(reminder.start_datetime);
  const formattedDate = date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
  const formattedTime = date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={[styles.reminderCard, { backgroundColor: cardColor }]}>
      <View style={styles.reminderDate}>
        <Text style={styles.reminderDateText}>{formattedDate}</Text>
        <Text style={styles.reminderTimeText}>{formattedTime}</Text>
      </View>
      <View style={styles.reminderDetails}>
        <Text style={styles.reminderTitle}>{reminder.title}</Text>
        <Text style={styles.reminderPet}>
          {reminder.pets?.nombre || 'General'}
        </Text>
      </View>
    </View>
  );
};

// Estilos dinámicos
const getStyles = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: Colors[theme].background,
    },
    container: {
      flex: 1,
      padding: 20,
    },
    title: {
      fontSize: 32, // --- CAMBIO: Tamaño aumentado
      fontWeight: 'bold',
      color: Colors[theme].text,
      marginBottom: 5,
    },
    subtitle: {
      fontSize: 18, // --- CAMBIO: Tamaño aumentado
      color: Colors[theme].icon,
      marginBottom: 30, // --- CAMBIO: Más espacio
    },
    quickActionsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 30,
    },
    quickAction: {
      backgroundColor: Colors[theme].card,
      flex: 1,
      marginHorizontal: 5,
      padding: 20,
      borderRadius: 12,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: Colors[theme].border,
      // --- CAMBIO: Sombra añadida ---
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    quickActionText: {
      color: Colors[theme].text,
      marginTop: 10,
      fontSize: 16,
      fontWeight: '600',
    },
    sectionContainer: {
      marginBottom: 30,
    },
    sectionTitle: {
      fontSize: 24, // --- CAMBIO: Tamaño aumentado
      fontWeight: 'bold',
      color: Colors[theme].text,
      marginBottom: 15,
    },
    reminderCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 15,
      borderRadius: 12,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: Colors[theme].border,
      // --- CAMBIO: Sombra añadida (más sutil) ---
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    // --- NUEVO ESTILO ---
    emptyReminderCard: {
      flexDirection: 'column',
      alignItems: 'center',
      paddingVertical: 30,
      justifyContent: 'center',
    },
    reminderDate: {
      alignItems: 'center',
      marginRight: 15,
      paddingRight: 15,
      borderRightWidth: 1,
      borderRightColor: Colors[theme].border,
      minWidth: 70,
    },
    reminderDateText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: Colors[theme].tint,
    },
    reminderTimeText: {
      fontSize: 14,
      color: Colors[theme].icon,
    },
    reminderDetails: {
      flex: 1,
    },
    reminderTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: Colors[theme].text,
    },
    reminderPet: {
      fontSize: 14,
      color: Colors[theme].icon,
      marginTop: 3,
    },
    reminderEmptyText: {
      color: Colors[theme].icon,
      fontStyle: 'italic',
      marginTop: 10, // Añadido
    },
  });