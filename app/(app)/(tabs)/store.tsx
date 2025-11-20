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

const theme = 'dark';
const themeColors = Colors[theme];

export default function StoreScreen() {
  const [offerings, setOfferings] = useState<PurchasesOffering | null>(null);
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentFlows, setCurrentFlows] = useState(0);

  // Recargar datos cada vez que la pantalla recibe el foco (el usuario entra)
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Obtener Ofertas de RevenueCat (Suscripciones y Productos)
      const offerings = await Purchases.getOfferings();
      if (offerings.current !== null) {
        setOfferings(offerings.current);
      }

      // 2. Verificar si el usuario ya es Premium
      const customerInfo = await Purchases.getCustomerInfo();
      if (customerInfo.entitlements.active['rizzflows_premium']) {
        setIsPro(true);
      }

      // 3. Obtener saldo de "Flows" desde Supabase
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

  // --- Mostrar Paywall para Suscripciones ---
  const presentPaywall = async () => {
    // RevenueCatUI muestra un Paywall nativo pre-diseñado
    const result = await RevenueCatUI.presentPaywall({
      displayCloseButton: true,
      offering: offerings || undefined 
    });

    switch (result) {
      case PAYWALL_RESULT.PURCHASED:
      case PAYWALL_RESULT.RESTORED:
        setIsPro(true);
        Alert.alert("¡Éxito!", "¡Bienvenido a Rizzflows Premium!");
        break;
      default:
        // Cancelado o Error
        break;
    }
  };

  // --- Comprar Pack de Créditos (Consumible) ---
  const purchaseFlowsPack = async (pkg: PurchasesPackage) => {
    try {
      // 1. Ejecutar compra en la tienda (Google Play / App Store)
      const { customerInfo } = await Purchases.purchasePackage(pkg);
      
      // 2. Si la compra fue exitosa, sumar créditos en Supabase
      let creditsToAdd = 0;
      if (pkg.product.identifier === 'rizz_40') creditsToAdd = 40;

      if (creditsToAdd > 0) {
        await addCreditsToSupabase(creditsToAdd);
        Alert.alert("¡Compra Exitosa!", `Se han añadido ${creditsToAdd} Flows a tu cuenta.`);
        fetchData(); // Actualizar saldo visualmente
      }

    } catch (e: any) {
      if (!e.userCancelled) {
        Alert.alert("Error en la compra", e.message);
      }
    }
  };

  const addCreditsToSupabase = async (amount: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Obtener saldo actual
    const { data: current } = await supabase
      .from('profiles')
      .select('flows_balance')
      .eq('id', user.id)
      .single();
    
    const newBalance = (current?.flows_balance || 0) + amount;

    // Actualizar saldo
    const { error } = await supabase
      .from('profiles')
      .update({ flows_balance: newBalance })
      .eq('id', user.id);

    if (error) console.error("Error actualizando base de datos:", error);
  };

  // Renderizar tarjeta manual para el consumible (40 Flows)
  const renderConsumables = () => {
    if (!offerings) return null;
    
    // Buscar el paquete 'rizz_40' dentro de las ofertas disponibles
    const flowPackage = offerings.availablePackages.find(p => 
      p.product.identifier === 'rizz_40'
    );

    if (!flowPackage) return (
       <Text style={{color: 'gray', textAlign: 'center', marginVertical: 10, padding: 20}}>
         (Producto 'rizz_40' no encontrado en RevenueCat. Asegúrate de configurarlo en el Offering 'Default'.)
       </Text>
    );

    return (
      <View style={styles.consumablesContainer}>
        <Text style={styles.sectionTitle}>Recarga Flows</Text>
        
        <Pressable 
            style={styles.consumableCard}
            onPress={() => purchaseFlowsPack(flowPackage)}
        >
            <View style={styles.iconBg}>
                <Ionicons name="flash" size={24} color={themeColors.secondary} />
            </View>
            <View style={{flex: 1, paddingHorizontal: 12}}>
                <Text style={styles.consumableTitle}>40 Flows</Text>
                <Text style={styles.consumableDesc}>Paga solo lo que usas</Text>
            </View>
            <View style={styles.priceButton}>
                <Text style={styles.priceText}>{flowPackage.product.priceString}</Text>
            </View>
        </Pressable>
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
        {/* Cabecera con saldo */}
        <View style={styles.header}>
            <Text style={styles.title}>Tienda</Text>
            <View style={styles.balanceContainer}>
                <Ionicons name="flash" size={16} color={themeColors.text} />
                <Text style={styles.balanceText}>{isPro ? '∞' : currentFlows} Flows</Text>
            </View>
        </View>

        {/* Banner Premium o Tarjeta de Venta */}
        {isPro ? (
          <View style={styles.proBanner}>
            <Ionicons name="checkmark-circle" size={28} color="#fff" />
            <View style={{marginLeft: 12}}>
                <Text style={styles.proText}>¡Eres Premium!</Text>
                <Text style={styles.proSubText}>Tienes Flows ilimitados.</Text>
            </View>
          </View>
        ) : (
          <Pressable onPress={presentPaywall} style={styles.premiumCard}>
             <View style={styles.premiumContent}>
                <View style={{flex: 1}}>
                  <Text style={styles.premiumTitle}>Rizzflows Premium</Text>
                  <Text style={styles.premiumDesc}>Desbloquea todo el poder de tu Rizz.</Text>
                  <View style={styles.benefitRow}>
                     <Ionicons name="infinite" size={16} color={themeColors.tint} />
                     <Text style={styles.benefitText}>Flows Ilimitados</Text>
                  </View>
                  <View style={styles.benefitRow}>
                     <Ionicons name="star" size={16} color={themeColors.tint} />
                     <Text style={styles.benefitText}>Sin anuncios</Text>
                  </View>
                </View>
                <Ionicons name="diamond-outline" size={60} color={themeColors.tint} style={{opacity: 0.8}} />
             </View>
             <View style={styles.ctaButton}>
                <Text style={styles.ctaText}>Ver Planes (Desde $6.99/sem)</Text>
             </View>
          </Pressable>
        )}

        <View style={styles.divider} />

        {/* Mostrar consumibles solo si no es Pro (o si quieres que los Pro compren más créditos para algo extra) */}
        {!isPro && renderConsumables()}

        {/* Botón Restaurar Compras */}
        <Pressable style={styles.restoreButton} onPress={async () => {
            try {
              const customerInfo = await Purchases.restorePurchases();
              if (customerInfo.entitlements.active['rizzflows_premium']) {
                setIsPro(true);
                Alert.alert("Restauración", "Tu acceso Premium ha sido restaurado.");
              } else {
                Alert.alert("Restauración", "No se encontraron suscripciones activas.");
              }
            } catch (e: any) {
              Alert.alert("Error", e.message);
            }
        }}>
          <Text style={styles.restoreText}>Restaurar Compras</Text>
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