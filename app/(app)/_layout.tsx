import Colors from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import RevenueCatUI from 'react-native-purchases-ui';

const theme = 'dark';
const themeColors = Colors[theme];

export default function AppLayout() {
  const [isMenuVisible, setMenuVisible] = useState(false);

  return (
    <>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isMenuVisible}
        onRequestClose={() => setMenuVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.menuContainer, { backgroundColor: themeColors.card }]}>
              
              <Pressable
                style={styles.menuButton}
                onPress={() => {
                  setMenuVisible(false);
                  router.navigate('/(app)/(tabs)/profile');
                }}>
                <Ionicons name="person-outline" size={20} color={themeColors.text} />
                <Text style={[styles.menuButtonText, { color: themeColors.text }]}>Profile</Text>
              </Pressable>
              
              <View style={styles.menuDivider} />

              <Pressable style={styles.menuButton} onPress={async () => {
                  setMenuVisible(false);
                  // Opens native subscription management
                  await RevenueCatUI.presentCustomerCenter();
              }}>
                <Ionicons name="settings-outline" size={20} color={themeColors.text} />
                <Text style={[styles.menuButtonText, { color: themeColors.text }]}>Manage Subscription</Text>
              </Pressable>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: themeColors.background },
          headerTintColor: themeColors.text,
          headerShadowVisible: false,
        }}>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerTitle: '',
            headerLeft: () => <Text style={styles.headerTitle}>Rizzflows</Text>,
            headerRight: () => (
              <Pressable onPress={() => setMenuVisible(true)} style={{ marginRight: 15 }}>
                 <Ionicons name="ellipsis-vertical" size={24} color={themeColors.text} />
              </Pressable>
            ),
          }}
        />
      </Stack>
    </>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  menuContainer: {
    borderRadius: 12,
    padding: 10,
    marginRight: 10,
    marginTop: 80,
    width: 220,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#333'
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  menuButtonText: {
    fontSize: 16,
    marginLeft: 10,
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#333',
    marginVertical: 5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#FFF'
  },
});