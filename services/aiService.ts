import { Alert } from 'react-native';

// Obtenemos las credenciales seguras desde el entorno
// Asegúrate de que estas variables estén en tu archivo .env
const FUNCTION_URL = process.env.EXPO_PUBLIC_SUPABASE_FUNCTION_URL;
const ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

interface GenerateRizzParams {
  systemPrompt: string;
  userPrompt?: string;
  imageBase64?: string | null; // Base64 puro, sin el prefijo data:image...
}

/**
 * Llama a la Edge Function de Supabase para generar contenido de forma segura.
 */
export const generateRizz = async ({ systemPrompt, userPrompt = '', imageBase64 }: GenerateRizzParams): Promise<string[]> => {
  
  if (!FUNCTION_URL || !ANON_KEY) {
    console.error("Faltan variables de entorno de Supabase");
    throw new Error("Error de configuración: Faltan credenciales de conexión (URL o ANON KEY).");
  }

  try {
    console.log("📡 Conectando con Supabase Edge Function...");
    
    const response = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ANON_KEY}`, // Autenticación estándar de Supabase
      },
      body: JSON.stringify({
        systemPrompt,
        userPrompt,
        imageBase64,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error del servidor:", errorText);
      throw new Error(`El servidor respondió con error: ${response.status}`);
    }

    const data = await response.json();
    
    // Si la función devolvió un error explícito
    if (data.error) {
        throw new Error(data.error);
    }

    const rawText = data.result;

    // Limpiamos el texto (quitamos asteriscos, números de lista, etc.) para que quede limpio en la UI
    const parsedLines = rawText
      .split('\n')
      .map((line: string) => line.replace(/^(?:\d+\.|\*|\-)\s*/, '').trim()) // Quita "1. ", "* ", "- " al inicio
      .filter((line: string) => line.length > 0); // Quita líneas vacías

    return parsedLines;

  } catch (error: any) {
    console.error("❌ Error generando Rizz:", error);
    throw error; // Re-lanzamos el error para que la pantalla muestre la alerta
  }
};