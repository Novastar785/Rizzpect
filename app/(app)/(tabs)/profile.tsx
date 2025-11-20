import { StyleSheet, Pressable, ActivityIndicator, Alert } from 'react-native';
import { supabase } from '@/lib/supabase';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import React, { useState, useCallback } from 'react';
import RevenueCatUI from 'react-native-purchases-ui';
import Purchases from 'react-native-purchases';

const theme = 'dark';
const themeColors = Colors[theme];

const StatCard = ({ icon, label, value, color }: { icon: any, label: string, value: string, color: string }) => (
  <View style={styles.statCard}>
    <Ionicons name={icon} size={24} color={color} />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const SettingsRow = ({ icon, label, onPress }: { icon: any, label: string, onPress: () => void }) => (
  <Pressable style={styles.settingsRow} onPress={onPress}>
    <View style={styles.settingsIconContainer}>
      <Ionicons name={icon} size={20} color={themeColors.tint} />
    </View>
    <Text style={styles.settingsLabel}>{label}</Text>
    <Ionicons name="chevron-forward-outline" size={20} color={themeColors.icon} />
  </Pressable>
);

export default function ProfileScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [flowsBalance, setFlowsBalance] = useState(0);
  const [isPro, setIsPro] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchUserData = async () => {
        setLoading(true);
        
        // 1. Verificar estado Pro
        try {
           const customerInfo = await Purchases.getCustomerInfo();
           if (customerInfo.entitlements.active['rizzflows_premium']) {
             setIsPro(true);
           }
        } catch (e) {
            // ignorar error
        }

        // 2. Obtener datos del usuario y flows
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          setEmail(user.email || 'Sin email');
          
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('name, flows_balance')
            .eq('id', user.id)
            .single();

          if (profile) {
            setName(profile.name || 'Sin nombre');
            setFlowsBalance(profile.flows_balance || 0);
          }
        }
        setLoading(false);
      };

      fetchUserData();
    }, [])
  );

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // Abre el Customer Center para gestionar suscripciones
  const openCustomerCenter = async () => {
    try {
      await RevenueCatUI.presentCustomerCenter();
    } catch (e) {
      Alert.alert("Info", "Gestiona tu suscripción desde los ajustes de tu dispositivo.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={themeColors.tint} />
          </View>
        ) : (
          <>
            <View style={styles.profileHeader}>
              <View style={styles.avatar}>
                <Ionicons name="person-outline" size={40} color={themeColors.tint} />
              </View>
              <Text style={styles.username}>{name}</Text>
              <Text style={styles.userEmail}>{email}</Text>
              
              <View style={[styles.badge, { backgroundColor: isPro ? themeColors.accentGreen : themeColors.card }]}>
                 <Ionicons name={isPro ? "infinite" : "flash"} size={14} color={isPro ? "#fff" : themeColors.icon} />
                 <Text style={[styles.badgeText, { color: isPro ? "#fff" : themeColors.icon }]}>
                    {isPro ? "Premium Activo" : `${flowsBalance} Flows`}
                 </Text>
              </View>
            </View>
            
            <View style={styles.statsContainer}>
              <StatCard icon="wallet-outline" label="Flows" value={isPro ? "∞" : flowsBalance.toString()} color={themeColors.secondary} />
              <StatCard icon="heart-outline" label="Éxitos" value="5" color={themeColors.accentRed} />
              <StatCard icon="flame-outline" label="Racha" value="3" color={themeColors.tint} />
            </View>

            <View style={styles.settingsContainer}>
              <SettingsRow 
                icon="card-outline" 
                label="Gestionar Suscripción" 
                onPress={openCustomerCenter} 
              />
              <SettingsRow 
                icon="cart-outline" 
                label="Comprar Flows" 
                onPress={() => router.navigate('/(app)/(tabs)/store')} 
              />
              <SettingsRow 
                icon="person-circle-outline" 
                label="Editar Perfil" 
                onPress={() => {}} 
              />
            </View>

            <Pressable
              onPress={handleLogout}
              style={({ pressed }) => [
                styles.logoutButton,
                { 
                  backgroundColor: themeColors.card, 
                  opacity: pressed ? 0.7 : 1 
                }
              ]}
            >
              <Ionicons name="log-out-outline" size={20} color={themeColors.accentRed} style={{ marginRight: 10 }} />
              <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
            </Pressable>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: themeColors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: themeColors.tint,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: themeColors.text,
  },
  userEmail: {
    fontSize: 16,
    color: themeColors.icon,
    marginBottom: 8,
  },
  badge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: themeColors.border,
  },
  badgeText: {
      fontWeight: 'bold',
      marginLeft: 6,
      fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: themeColors.card,
    borderRadius: 16,
    padding: 15,
    alignItems: 'center',
    width: '30%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: themeColors.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: themeColors.icon,
    marginTop: 2,
  },
  settingsContainer: {
    backgroundColor: themeColors.card,
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 12,
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: themeColors.border,
  },
  settingsIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(192, 57, 255, 0.15)', 
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingsLabel: {
    flex: 1,
    fontSize: 16,
    color: themeColors.text,
  },
  logoutButton: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 12, 
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
    borderWidth: 1,
    borderColor: themeColors.accentRed,
  },
  logoutButtonText: {
    color: themeColors.accentRed,
    fontSize: 18,
    fontWeight: 'bold',
  },
});