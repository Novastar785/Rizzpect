import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router'; // Import Link instead of Alert/Pressable
import React from 'react';
import {
  Pressable, // Keep Pressable for the <Link asChild> pattern
  ScrollView,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RizzScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const styles = getStyles(colorScheme);

  // No more mock alert function needed

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Social Assistant</Text>
        <Text style={styles.subtitle}>What can I help you with today?</Text>

        <View style={styles.buttonContainer}>
          {/* Use Link to navigate. href is relative to the layout (rizz/) */}
          <Link href="/(app)/(tabs)/rizz/startConversation" asChild>
            <Pressable style={styles.pillButton}>
              <Ionicons
                name="chatbubbles-outline"
                size={24}
                style={styles.pillButtonIcon}
              />
              <Text style={styles.pillButtonText}>Start a Conversation</Text>
            </Pressable>
          </Link>

          <Link href="/(app)/(tabs)/rizz/replySuggestions" asChild>
            <Pressable style={styles.pillButton}>
              <Ionicons
                name="arrow-undo-outline"
                size={24}
                style={styles.pillButtonIcon}
              />
              <Text style={styles.pillButtonText}>Get Reply Suggestions</Text>
            </Pressable>
          </Link>

          <Link href="/(app)/(tabs)/rizz/awkwardSituation" asChild>
            <Pressable style={styles.pillButton}>
              <Ionicons
                name="help-buoy-outline"
                size={24}
                style={styles.pillButtonIcon}
              />
              <Text style={styles.pillButtonText}>
                Help with Awkward Situation
              </Text>
            </Pressable>
          </Link>

          <Link href="/(app)/(tabs)/rizz/pickupLines" asChild>
            <Pressable style={styles.pillButton}>
              <Ionicons
                name="flame-outline"
                size={24}
                style={styles.pillButtonIcon}
              />
              <Text style={styles.pillButtonText}>Banger Pickup Lines</Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Styles are the same as before
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
      fontSize: 32,
      fontWeight: 'bold',
      color: Colors[theme].text,
      marginBottom: 5,
    },
    subtitle: {
      fontSize: 18,
      color: Colors[theme].icon,
      marginBottom: 30,
    },
    buttonContainer: {
      width: '100%',
    },
    pillButton: {
      backgroundColor: Colors[theme].card,
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 18,
      paddingHorizontal: 20,
      borderRadius: 999, // Pill shape
      marginBottom: 15,
      borderWidth: 1,
      borderColor: Colors[theme].border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    pillButtonIcon: {
      color: Colors[theme].tint,
      marginRight: 15,
    },
    pillButtonText: {
      color: Colors[theme].text,
      fontSize: 16,
      fontWeight: '600',
      flex: 1,
    },
  });