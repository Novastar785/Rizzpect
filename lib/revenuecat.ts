import { Platform } from 'react-native';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';

// ¡IMPORTANTE!: Usa las "Public SDK Keys" de RevenueCat.
// NUNCA uses las "Secret API Keys" aquí.
// Las claves públicas suelen empezar con 'appl_' (iOS) o 'goog_' (Android).

const API_KEYS = {
  // Clave real de Android que copiaste del dashboard (empieza por 'goog_')
  google: 'goog_hYhrIPKEIXHjqCydMEetJANwOpY', 
  
  // Si tienes la de iOS (empieza por 'appl_'), ponla aquí, si no, deja una cadena vacía o la de test por ahora
  apple: '', 
  
  // Clave de prueba (solo para desarrollo, si la necesitas en el futuro)
  test: 'test_hWpizedMvevsKewEprjxiQLtjzl',
};

export const initRevenueCat = async () => {
  // En producción, es mejor desactivar los logs detallados o ponerlos en WARN para no ensuciar la consola
  Purchases.setLogLevel(LOG_LEVEL.WARN);

  if (Platform.OS === 'ios') {
    // Usamos la clave de Apple (si la tuvieras configurada)
    if (API_KEYS.apple) {
        await Purchases.configure({ apiKey: API_KEYS.apple }); 
    }
  } else if (Platform.OS === 'android') {
    // Usamos la clave de Google
    await Purchases.configure({ apiKey: API_KEYS.google });
  }
};

// Función auxiliar para verificar si el usuario es Premium
export const checkPremiumEntitlement = async (): Promise<boolean> => {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    // 'rizzflows_premium' debe coincidir EXACTAMENTE con el ID de Entitlement 
    // que creaste en el dashboard de RevenueCat
    return customerInfo.entitlements.active['rizzflows_premium'] !== undefined;
  } catch (e) {
    console.error("Error verificando premium:", e);
    return false;
  }
};