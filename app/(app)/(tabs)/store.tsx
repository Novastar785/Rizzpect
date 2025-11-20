import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, ScrollView, Pressable, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Purchases, { PurchasesPackage, PurchasesOffering } from 'react-native-purchases';
import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui';
import { supabase } from '@/lib/supabase';
import { useFocusEffect } from 'expo-router';
import { useTranslation } from 'react-i18next';

const theme = 'dark';
const themeColors = Colors[theme];

export default function StoreScreen() {
  const { t } = useTranslation();
  const [offerings, setOfferings] = useState<PurchasesOffering | null>(null);
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentFlows, setCurrentFlows] = useState(0);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const fetchData = async () => {
    setLoading(true);
    try {
      const offerings = await Purchases.getOfferings();
      if (offerings.current !== null) {
        setOfferings(offerings.current);
      }

      const customerInfo = await Purchases.getCustomerInfo();
      if (customerInfo.entitlements.active['rizzflows_premium']) {
        setIsPro(true);
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('flows_balance')
          .eq('id', user.id)
          .single();
        
        if (data) {
          setCurrentFlows(data.flows_balance || 0);
        }
      }

    } catch (e) {
      console.error("Error cargando datos de la tienda", e);
    } finally {
      setLoading(false);
    }
  };

  const presentPaywall = async () => {
    const result = await RevenueCatUI.presentPaywall({
      displayCloseButton: true,
      offering: offerings || undefined 
    });

    switch (result) {
      case PAYWALL_RESULT.PURCHASED:
      case PAYWALL_RESULT.RESTORED:
        setIsPro(true);
        Alert.alert("Success", "Welcome to Rizzflows Premium!");
        break;
      default:
        break;
    }
  };

  const purchaseFlowsPack = async (pkg: PurchasesPackage) => {
    try {
      const { customerInfo } = await Purchases.purchasePackage(pkg);
      
      let creditsToAdd = 0;
      if (pkg.product.identifier === 'rizz_40') creditsToAdd = 40;

      if (creditsToAdd > 0) {
        await addCreditsToSupabase(creditsToAdd);
        Alert.alert("Success!", `Added ${creditsToAdd} Flows to your account.`);
        fetchData(); 
      }

    } catch (e: any) {
      if (!e.userCancelled) {
        Alert.alert("Error", e.message);
      }
    }
  };

  const addCreditsToSupabase = async (amount: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: current } = await supabase
      .from('profiles')
      .select('flows_balance')
      .eq('id', user.id)
      .single();
    
    const newBalance = (current?.flows_balance || 0) + amount;

    const { error } = await supabase
      .from('profiles')
      .update({ flows_balance: newBalance })
      .eq('id', user.id);

    if (error) console.error("DB Error:", error);
  };

  const renderConsumables = () => {
    if (!offerings) return null;
    
    const consumablePackages = offerings.availablePackages.filter(p => 
      p.product.identifier.startsWith('rizz_')
    );

    if (consumablePackages.length === 0) return null;

    return (
      <View style={styles.consumablesContainer}>
        <Text style={styles.sectionTitle}>{t('store.refill')}</Text>
        {consumablePackages.map((pkg) => (
            <Pressable 
                key={pkg.identifier}
                style={styles.consumableCard}
                onPress={() => purchaseFlowsPack(pkg)}
            >
                <View style={styles.iconBg}>
                    <Ionicons name="flash" size={24} color={themeColors.secondary} />
                </View>
                <View style={{flex: 1, paddingHorizontal: 12}}>
                    <Text style={styles.consumableTitle}>{pkg.product.title}</Text>
                    <Text style={styles.consumableDesc}>{pkg.product.description}</Text>
                </View>
                <View style={styles.priceButton}>
                    <Text style={styles.priceText}>{pkg.product.priceString}</Text>
                </View>
            </Pressable>
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={themeColors.tint} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.title}>{t('store.title')}</Text>
            <View style={styles.balanceContainer}>
                <Ionicons name="flash" size={16} color={themeColors.text} />
                <Text style={styles.balanceText}>{isPro ? '∞' : currentFlows} {t('store.balance')}</Text>
            </View>
        </View>

        {isPro ? (
          <View style={styles.proBanner}>
            <Ionicons name="checkmark-circle" size={28} color="#fff" />
            <View style={{marginLeft: 12}}>
                <Text style={styles.proText}>{t('store.youArePro')}</Text>
                <Text style={styles.proSubText}>{t('store.unlimited')}</Text>
            </View>
          </View>
        ) : (
          <Pressable onPress={presentPaywall} style={styles.premiumCard}>
             <View style={styles.premiumContent}>
                <View style={{flex: 1}}>
                  <Text style={styles.premiumTitle}>{t('store.proTitle')}</Text>
                  <Text style={styles.premiumDesc}>{t('store.proDesc')}</Text>
                  <View style={styles.benefitRow}>
                     <Ionicons name="infinite" size={16} color={themeColors.tint} />
                     <Text style={styles.benefitText}>{t('store.benefit1')}</Text>
                  </View>
                  <View style={styles.benefitRow}>
                     <Ionicons name="star" size={16} color={themeColors.tint} />
                     <Text style={styles.benefitText}>{t('store.benefit2')}</Text>
                  </View>
                </View>
                <Ionicons name="diamond-outline" size={60} color={themeColors.tint} style={{opacity: 0.8}} />
             </View>
             <View style={styles.ctaButton}>
                <Text style={styles.ctaText}>{t('store.viewPlans')}</Text>
             </View>
          </Pressable>
        )}

        <View style={styles.divider} />

        {!isPro && renderConsumables()}

        <Pressable style={styles.restoreButton} onPress={async () => {
            try {
              await Purchases.restorePurchases();
              Alert.alert("Restore", "Purchases restored.");
            } catch (e: any) {
              Alert.alert("Error", e.message);
            }
        }}>
          <Text style={styles.restoreText}>{t('store.restore')}</Text>
        </Pressable>

      </ScrollView>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: themeColors.text,
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: themeColors.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: themeColors.border,
  },
  balanceText: {
    color: themeColors.text,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: themeColors.background,
  },
  proBanner: {
    backgroundColor: themeColors.accentGreen,
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  proText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  proSubText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
  },
  premiumCard: {
    backgroundColor: themeColors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: themeColors.tint,
    overflow: 'hidden',
    marginBottom: 20,
  },
  premiumContent: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  premiumTitle: {
    color: themeColors.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  premiumDesc: {
    color: themeColors.icon,
    fontSize: 14,
    marginBottom: 12,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  benefitText: {
    color: themeColors.text,
    fontSize: 14,
    marginLeft: 6,
  },
  ctaButton: {
    backgroundColor: themeColors.tint,
    paddingVertical: 12,
    alignItems: 'center',
  },
  ctaText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: themeColors.border,
    marginVertical: 10,
  },
  consumablesContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: themeColors.text,
    marginBottom: 15,
  },
  consumableCard: {
    backgroundColor: themeColors.card,
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: themeColors.border,
  },
  iconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,122,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  consumableTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: themeColors.text,
  },
  consumableDesc: {
    fontSize: 12,
    color: themeColors.icon,
  },
  priceButton: {
    backgroundColor: themeColors.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: themeColors.tint,
  },
  priceText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: themeColors.tint,
  },
  restoreButton: {
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  restoreText: {
    color: themeColors.icon,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});