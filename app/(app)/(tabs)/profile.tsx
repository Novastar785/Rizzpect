import { StyleSheet, Pressable, Alert, View } from 'react-native';
import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import RevenueCatUI from 'react-native-purchases-ui';

const theme = 'dark';
const themeColors = Colors[theme];

const SettingsRow = ({ icon, label, onPress, color = themeColors.tint }: { icon: any, label: string, onPress: () => void, color?: string }) => (
  <Pressable style={styles.settingsRow} onPress={onPress}>
    <View style={[styles.settingsIconContainer, { backgroundColor: `${color}20` }]}>
      <Ionicons name={icon} size={20} color={color} />
    </View>
    <Text style={styles.settingsLabel}>{label}</Text>
    <Ionicons name="chevron-forward-outline" size={20} color={themeColors.icon} />
  </Pressable>
);

export default function ProfileScreen() {
  
  // 1. Manage Subscription (Cancel, Billing history)
  const openCustomerCenter = async () => {
    try {
      await RevenueCatUI.presentCustomerCenter();
    } catch (e) {
      Alert.alert("Info", "You can manage your subscription in your device Settings.");
    }
  };

  // 2. Upgrade Plan (Switch from Weekly to Annual, etc.)
  const openUpgradePaywall = async () => {
    try {
        // Presenting the paywall to a subscribed user allows them to switch plans.
        // displayCloseButton: true allows them to cancel the upgrade attempt.
        await RevenueCatUI.presentPaywall({
            displayCloseButton: true 
        });
    } catch (e) {
        console.log("Paywall closed or failed", e);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.profileHeader}>
            <View style={styles.avatar}>
               <Ionicons name="person" size={40} color={themeColors.tint} />
            </View>
            <Text style={styles.username}>Premium Member</Text>
            <View style={[styles.badge, { backgroundColor: themeColors.accentGreen }]}>
                <Ionicons name="infinite" size={14} color="#fff" />
                <Text style={[styles.badgeText, { color: "#fff" }]}>Active Subscription</Text>
            </View>
        </View>

        <Text style={styles.sectionTitle}>Subscription</Text>
        <View style={styles.settingsContainer}>
            <SettingsRow 
                icon="card-outline" 
                label="Manage Subscription" 
                onPress={openCustomerCenter} 
            />
             {/* LOGIC FOR UPGRADE: Showing the paywall again allows users to select a different product */}
            <SettingsRow 
                icon="rocket-outline" 
                label="Change Plan / Upgrade" 
                color={themeColors.secondary}
                onPress={openUpgradePaywall} 
            />
        </View>

        <Text style={styles.sectionTitle}>Legal</Text>
        <View style={styles.settingsContainer}>
            <SettingsRow 
                icon="document-text-outline" 
                label="Terms of Service" 
                color={themeColors.icon}
                onPress={() => {}} 
            />
            <SettingsRow 
                icon="shield-checkmark-outline" 
                label="Privacy Policy" 
                color={themeColors.icon}
                onPress={() => {}} 
            />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: themeColors.background },
  container: { flex: 1, padding: 20 },
  profileHeader: { alignItems: 'center', marginBottom: 30, marginTop: 10 },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: themeColors.card, justifyContent: 'center', alignItems: 'center',
    marginBottom: 15, borderWidth: 2, borderColor: themeColors.tint,
  },
  username: { fontSize: 24, fontWeight: 'bold', color: themeColors.text, marginBottom: 10 },
  badge: {
      flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6,
      borderRadius: 12,
  },
  badgeText: { fontWeight: 'bold', marginLeft: 6, fontSize: 14 },
  sectionTitle: {
    fontSize: 14, fontWeight: 'bold', color: themeColors.icon, marginBottom: 10, marginLeft: 5, textTransform: 'uppercase'
  },
  settingsContainer: {
    backgroundColor: themeColors.card, borderRadius: 16, overflow: 'hidden', marginBottom: 25
  },
  settingsRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 15,
    borderBottomWidth: 1, borderBottomColor: themeColors.border,
  },
  settingsIconContainer: {
    width: 32, height: 32, borderRadius: 8, 
    justifyContent: 'center', alignItems: 'center', marginRight: 15,
  },
  settingsLabel: { flex: 1, fontSize: 16, color: themeColors.text },
});