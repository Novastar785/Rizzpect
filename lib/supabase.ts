import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

// ¡NUEVO! Importamos el "cajón" (AsyncStorage)
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tus llaves (estas no cambian)
const supabaseUrl = "https://nmwscrnhsyfyidtowvbn.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5td3Njcm5oc3lmeWlkdG93dmJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4MDI2NzQsImV4cCI6MjA3ODM3ODY3NH0.E6zogP4ixkW2zSrfYNZcNGVNoboBMq5ozqqGltURz6g";

// ¡ACTUALIZADO!
// Ahora le pasamos una opción a createClient
// para decirle que use AsyncStorage como "storage".
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage, // Le decimos a Supabase que use este "cajón"
    autoRefreshToken: true,
    persistSession: true, // Nos aseguramos de que la sesión persista
    detectSessionInUrl: false,
  },
});