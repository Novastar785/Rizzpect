import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

// ¡NUEVO! Importamos Platform
import { Platform } from 'react-native'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = "https://nmwscrnhsyfyidtowvbn.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5td3Njcm5oc3lmeWlkdG93dmJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4MDI2NzQsImV4cCI6MjA3ODM3ODY3NH0.E6zogP4ixkW2zSrfYNZcNGVNoboBMq5ozqqGltURz6g";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // --- ¡AQUÍ ESTÁ LA CORRECCIÓN! ---
    // Si la plataforma es 'web', no le pases nada (usará localStorage por defecto).
    // Si es nativa (ios/android), usa AsyncStorage.
    storage: Platform.OS === 'web' ? undefined : AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Esto es bueno para la web
  },
});