import { Platform } from 'react-native';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';

// CLAVES DE API DE REVENUECAT
// Usa las "Public SDK Keys" (empiezan con 'appl_' o 'goog_').
// Para desarrollo local/Expo Go, usa la clave de TEST si la nativa falla.

const API_KEYS = {
  google: 'goog_hYhrIPKEIXHjqCydMEetJANwOpY', 
  apple: '', 
  /// Clave de prueba (solo para desarrollo, si la necesitas en el futuro)
  test: 'test_hWpizedMvevsKewEprjxiQLtjzl',
};

export const initRevenueCat = async () => {
  Purchases.setLogLevel(LOG_LEVEL.WARN);

  if (Platform.OS === 'ios') {
    if (API_KEYS.apple) {
        await Purchases.configure({ apiKey: API_KEYS.apple }); 
    } else {
        // Fallback a test si no hay key de Apple
        await Purchases.configure({ apiKey: API_KEYS.test });
    }
  } else if (Platform.OS === 'android') {
    // Intentamos usar la clave de Google. 
    // Si falla en Expo Go, RevenueCat lanzará un error que capturamos en _layout.tsx
    // Puedes cambiar esto temporalmente a API_KEYS.test para probar en Expo Go
    await Purchases.configure({ apiKey: API_KEYS.google }); 
  }

  // --- LIMPIEZA DE SUPABASE ---
  // Anteriormente, aquí podríamos haber tenido código como:
  // const user = supabase.auth.user();
  // if (user) Purchases.logIn(user.id);
  
  // Como ya no usamos Supabase Auth, dejamos que RevenueCat genere un ID anónimo
  // automáticamente. No necesitamos llamar a Purchases.logIn() a menos que
  // implementes tu propio sistema de usuarios en el futuro.
};

export const checkPremiumEntitlement = async (): Promise<boolean> => {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo.entitlements.active['rizzflows_premium'] !== undefined;
  } catch (e) {
    console.error("Error verificando premium:", e);
    return false;
  }
};