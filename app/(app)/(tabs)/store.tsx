import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import React from 'react';
import { StyleSheet, useColorScheme, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// --- Tipos definidos para corregir el error de TypeScript ---
type ThemeKey = 'light' | 'dark';
type Product = {
    id: string;
    flow?: number;
    name?: string;
    price: string;
    tag?: string;
    benefit?: string;
    icon?: any; // Usamos 'any' para el nombre del icono de Ionicons
};
// -----------------------------------------------------------

// --- Product Definitions (CORREGIDO) ---
const CREDIT_PACKS: Product[] = [
  { id: 'rizz_5', flow: 5, price: '0.99', tag: 'Starter' },
  { id: 'rizz_35', flow: 35, price: '3.99', tag: 'Best Value' },
  { id: 'rizz_70', flow: 70, price: '6.99', tag: 'Bulk Buy' },
];

const SUBSCRIPTIONS: Product[] = [
  { id: 'pro_weekly', name: 'Weekly Pro Access', price: '9.99', benefit: 'Unlimited Interactions', icon: 'flash-outline' },
  { id: 'monster_monthly', name: 'Monthly Monster Access', price: '29.99', benefit: 'Unlimited Interactions + Priority', icon: 'flame-outline' },
  // --- CAMBIO APLICADO AQUÍ ---
  { id: 'premium_yearly', name: 'Yearly Premium Access', price: '299.99', benefit: 'VIP Full Access', icon: 'sparkles' },
];
// -----------------------------

// --- Componente tipado correctamente ---
const ProductCard = ({ product, theme, isSubscription }: { product: Product, theme: ThemeKey, isSubscription: boolean }) => {
  const styles = getStyles(theme);
  const tintColor = Colors[theme].tint;

  const title = isSubscription ? product.name : `${product.flow} Rizzflow Credits`;
  const subtitle = isSubscription ? product.benefit : `Pay-as-you-go interactions`;

  return (
    <Pressable style={styles.cardContainer}>
      <View style={[styles.card, { backgroundColor: Colors[theme].card, borderColor: isSubscription ? tintColor : Colors[theme].border }]}>
        <View style={styles.cardHeader}>
          {isSubscription && product.icon && <Ionicons name={product.icon} size={24} color={tintColor} />}
          <Text style={[styles.cardTitle, { color: Colors[theme].text }]}>{title}</Text>
        </View>
        
        <Text style={[styles.cardSubtitle, { color: Colors[theme].icon }]}>
          {subtitle}
        </Text>

        <Text style={[styles.priceText, { color: tintColor }]}>
          ${product.price}
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
// ----------------------------------------

export default function StoreScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const styles = getStyles(colorScheme);
  const tintColor = Colors[colorScheme].tint;

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
        
        {/* --- Credit Packs Section --- */}
        <Text style={[styles.sectionTitle, { color: Colors[colorScheme].text }]}>Credit Packs (One-Time Purchase)</Text>
        <View style={styles.productGrid}>
          {CREDIT_PACKS.map((p) => (
            <ProductCard key={p.id} product={p} theme={colorScheme} isSubscription={false} />
          ))}
        </View>
        
        {/* --- Subscription Section --- */}
        <Text style={[styles.sectionTitle, { color: Colors[colorScheme].text, marginTop: 25 }]}>Unlimited Subscriptions</Text>
        <View style={styles.productGrid}>
          {SUBSCRIPTIONS.map((p) => (
            <ProductCard key={p.id} product={p} theme={colorScheme} isSubscription={true} />
          ))}
        </View>

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
      width: '48%', // Approx. half of the screen minus spacing
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
      marginTop: 'auto', // Push to the bottom
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
  });