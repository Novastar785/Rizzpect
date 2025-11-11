import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import React, { useState, useEffect } from 'react';
import { StyleSheet, useColorScheme, ScrollView, Pressable, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase'; // Para el fulfillment

// NOTA IMPORTANTE: Para que este código funcione, debes instalar:
// npx expo install expo-in-app-purchases

// --- Tipos definidos ---
type ThemeKey = 'light' | 'dark';

// El tipo de Producto REAL de Expo
type ExpoProduct = {
    productId: string;
    title: string;
    price: string; // Ejemplo: "$0.99"
    description: string;
    // Otros campos como isSubscription, localizedPrice, etc.
};

// Nuestra definición de Producto para renderizar
type ProductDefinition = {
    id: string;
    flow?: number;
    name?: string;
    tag?: string;
    benefit?: string;
    icon?: any;
    isSubscription: boolean;
    // Campo para guardar los datos reales del store
    storeDetails: ExpoProduct | null; 
};
// -----------------------

// --- Product IDs que debes registrar en App Store Connect y Google Play Console ---
const PRODUCT_IDS = [
    'rizz_5',        // Consumible
    'rizz_35',       // Consumible
    'rizz_70',       // Consumible
    'pro_weekly',    // Suscripción
    'monster_monthly', // Suscripción
    'premium_yearly',  // Suscripción
];

// --- Definiciones Lógicas ---
const DEFINITIONS: ProductDefinition[] = [
    // Packs de Créditos
    { id: 'rizz_5', flow: 5, tag: 'Starter', isSubscription: false, storeDetails: null },
    { id: 'rizz_35', flow: 35, tag: 'Best Value', isSubscription: false, storeDetails: null },
    { id: 'rizz_70', flow: 70, tag: 'Bulk Buy', isSubscription: false, storeDetails: null },
    // Suscripciones
    { id: 'pro_weekly', name: 'Weekly Pro Access', benefit: 'Unlimited Interactions', icon: 'flash-outline', isSubscription: true, storeDetails: null },
    { id: 'monster_monthly', name: 'Monthly Monster Access', benefit: 'Unlimited Interactions + Priority', icon: 'flame-outline', isSubscription: true, storeDetails: null },
    { id: 'premium_yearly', name: 'Yearly Premium Access', benefit: 'VIP Full Access', icon: 'sparkles', isSubscription: true, storeDetails: null },
];
// -----------------------------

/**
 * Función (placeholder) para el Fulfillment:
 * ESTO DEBE HACERSE EN TU BACKEND (SUPABASE EDGE FUNCTION) POR SEGURIDAD.
 */
const fulfillPurchase = async (purchase: any, isSubscription: boolean) => {
    // 1. Obtener el recibo (receipt) de la compra de Expo
    const receipt = JSON.stringify(purchase);
    
    try {
        // 2. ENVIAR EL RECIBO A UN ENDPOINT SEGURO (Supabase Edge Function)
        // Este endpoint es el único que debe hablar con las APIs de Apple/Google
        // para verificar que el pago es 100% legítimo.
        const { data, error } = await supabase.functions.invoke('verify-iap', {
            body: {
                receipt,
                platform: 'ios' // o 'android', dependiendo de la plataforma
            }
        });

        if (error) throw new Error(error.message);

        // 3. Si la verificación es exitosa, el backend actualiza los créditos del usuario en la BD.
        Alert.alert("Success", `Purchase verified and ${isSubscription ? 'access granted' : 'credits added'}!`);

    } catch (error: any) {
        console.error("Fulfillment Error:", error);
        Alert.alert("Error", "Could not verify purchase. Contact support.");
    }
};


// --- Lógica REAL de Compra IAP ---
const handlePurchase = async (product: ProductDefinition) => {
    if (!product.storeDetails) {
        return Alert.alert("Error", "Product details not loaded yet.");
    }
    
    // Inicia el proceso de compra de la tienda
    try {
        // ** INTEGRACIÓN REAL DE EXPO IAP **
        // const purchase = await InAppPurchases.purchaseItemAsync(product.id);
        
        // ** SIMULACIÓN DE ÉXITO para la estructura **
        const purchase = { productId: product.id, receipt: "FAKE_RECEIPT_DATA..." }; 
        
        if (purchase) {
            // Llama a la función de cumplimiento con el objeto de compra
            await fulfillPurchase(purchase, product.isSubscription);
        }

    } catch (error) {
        console.error("Purchase Error:", error);
        Alert.alert("Purchase Failed", "Could not complete the transaction.");
    }
};
// ---------------------------------


const ProductCard = ({ product, theme }: { product: ProductDefinition, theme: ThemeKey }) => {
  const styles = getStyles(theme);
  const tintColor = Colors[theme].tint;
  
  const title = product.isSubscription ? product.name : `${product.flow} Rizzflow Credits`;
  const subtitle = product.isSubscription ? product.benefit : `Pay-as-you-go interactions`;

  // Muestra el precio real del store, si está disponible
  const priceDisplay = product.storeDetails ? product.storeDetails.price : '...';

  return (
    <Pressable 
        style={styles.cardContainer}
        onPress={() => product.storeDetails && handlePurchase(product)} // Solo activo si los detalles están cargados
        disabled={!product.storeDetails}
    >
      <View style={[styles.card, { 
          backgroundColor: Colors[theme].card, 
          borderColor: product.isSubscription ? tintColor : Colors[theme].border,
          opacity: product.storeDetails ? 1 : 0.6 // Opacidad si no está cargado
      }]}>
        <View style={styles.cardHeader}>
          {product.isSubscription && product.icon && <Ionicons name={product.icon} size={24} color={tintColor} />}
          <Text style={[styles.cardTitle, { color: Colors[theme].text }]}>{title}</Text>
        </View>
        
        <Text style={[styles.cardSubtitle, { color: Colors[theme].icon }]}>
          {subtitle}
        </Text>

        <Text style={[styles.priceText, { color: tintColor }]}>
          {priceDisplay}
        </Text>
        
        {product.tag && (
          <View style={[styles.tag, { backgroundColor: tintColor }]}>
            <Text style={styles.tagText}>{product.tag}</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
};


export default function StoreScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const styles = getStyles(colorScheme);
  const tintColor = Colors[colorScheme].tint;
  
  // Estado para los productos con los detalles reales del store
  const [products, setProducts] = useState<ProductDefinition[]>(DEFINITIONS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadIAP = async () => {
        setLoading(true);
        // ** Lógica real: Inicializar IAP y obtener detalles **
        
        // 1. Inicializar la conexión
        // await InAppPurchases.connectAsync();
        
        // 2. Obtener productos de las tiendas
        // const { responseCode, results } = await InAppPurchases.getProductsAsync(PRODUCT_IDS);
        
        // ** SIMULACIÓN DE DATOS CARGADOS (Reemplazar con Expo IAP) **
        const results: ExpoProduct[] = [
            { productId: 'rizz_5', title: '5 Rizzflows', price: '$0.99', description: '' },
            { productId: 'rizz_35', title: '35 Rizzflows', price: '$3.99', description: '' },
            { productId: 'rizz_70', title: '70 Rizzflows', price: '$6.99', description: '' },
            { productId: 'pro_weekly', title: 'Weekly Pro Access', price: '$9.99', description: '' },
            { productId: 'monster_monthly', title: 'Monthly Monster Access', price: '$29.99', description: '' },
            { productId: 'premium_yearly', title: 'Yearly Premium Access', price: '$299.99', description: '' },
        ];
        // ** FIN SIMULACIÓN **

        if (results && results.length > 0) {
            setProducts(prev => 
                prev.map(p => {
                    const storeData = results.find(r => r.productId === p.id);
                    return storeData ? { ...p, storeDetails: storeData } : p;
                })
            );
        } else {
            Alert.alert("Error", "Could not load store products. Check IDs and app configuration.");
        }

        // 3. Configurar el listener de compras (Para pagos asíncronos)
        // const listener = InAppPurchases.setPurchaseListener(({ responseCode, results, cancelled, error }) => {
        //     if (responseCode === InAppPurchases.IAPResponseCode.OK) {
        //         results.forEach(purchase => {
        //             if (purchase.acknowledged) return; // Ya procesado
        //             fulfillPurchase(purchase, purchase.type === 'Subscription');
        //             InAppPurchases.finishTransactionAsync(purchase, true); // Finalizar transacción
        //         });
        //     }
        // });

        setLoading(false);
        
        // Cleanup function for the listener
        // return () => InAppPurchases.removePurchaseListener(listener);
    };

    loadIAP();
  }, []); // Se ejecuta solo una vez al montar

  const creditPacks = products.filter(p => !p.isSubscription);
  const subscriptions = products.filter(p => p.isSubscription);


  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Rizzflow Store</Text>
        
        {/* --- Credit Explanation --- */}
        <View style={[styles.explanationBox, { borderColor: tintColor, backgroundColor: Colors[colorScheme].card }]}>
          <Text style={[styles.explanationText, { color: Colors[colorScheme].text }]}>
            <Ionicons name="information-circle-outline" size={16} color={tintColor} /> 
            {' '}1 Rizzflow credit = 1 AI interaction. Buy packs or subscribe for unlimited access!
          </Text>
        </View>
        
        {/* --- Loading State --- */}
        {loading ? (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={tintColor} />
                <Text style={[styles.sectionTitle, { color: Colors[colorScheme].text, marginTop: 15 }]}>
                    Loading store products...
                </Text>
            </View>
        ) : (
            <>
                {/* --- Credit Packs Section --- */}
                <Text style={[styles.sectionTitle, { color: Colors[colorScheme].text }]}>Credit Packs (One-Time Purchase)</Text>
                <View style={styles.productGrid}>
                    {creditPacks.map((p) => (
                        <ProductCard key={p.id} product={p} theme={colorScheme} />
                    ))}
                </View>
                
                {/* --- Subscription Section --- */}
                <Text style={[styles.sectionTitle, { color: Colors[colorScheme].text, marginTop: 25 }]}>Unlimited Subscriptions</Text>
                <View style={styles.productGrid}>
                    {subscriptions.map((p) => (
                        <ProductCard key={p.id} product={p} theme={colorScheme} />
                    ))}
                </View>
            </>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

// --- Función de estilos tipada correctamente ---
const getStyles = (theme: ThemeKey) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: Colors[theme].background,
    },
    container: {
      flex: 1,
      paddingHorizontal: 20,
    },
    scrollContent: {
      paddingBottom: 50,
    },
    title: {
      fontSize: 30,
      fontWeight: 'bold',
      color: Colors[theme].text,
      marginBottom: 10,
      textAlign: 'center',
    },
    explanationBox: {
      borderWidth: 1,
      borderRadius: 8,
      padding: 12,
      marginBottom: 20,
    },
    explanationText: {
      fontSize: 14,
      fontWeight: '500',
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 15,
    },
    productGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    cardContainer: {
      width: '48%', 
      marginBottom: 15,
    },
    card: {
      padding: 15,
      borderRadius: 12,
      borderWidth: 1.5,
      minHeight: 150,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginLeft: 5,
      flexShrink: 1,
    },
    cardSubtitle: {
      fontSize: 12,
      marginBottom: 10,
    },
    priceText: {
      fontSize: 24,
      fontWeight: '900',
      marginTop: 'auto', 
    },
    tag: {
      position: 'absolute',
      top: -1,
      right: -1,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderBottomLeftRadius: 8,
      borderTopRightRadius: 10,
    },
    tagText: {
      color: 'white',
      fontSize: 10,
      fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50,
    }
  });