// Importamos el SDK de Google desde npm vía CDN de Deno
import { GoogleGenerativeAI } from "npm:@google/generative-ai";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// IMPORTANTE: La API Key se toma de las variables de entorno seguras (Secrets)
const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // 1. Manejo de CORS (Permite que tu app llame a esta función)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (!GEMINI_API_KEY) {
      throw new Error("La API Key de Gemini no está configurada en el servidor.");
    }

    // 2. Recibimos los datos desde la App
    const { systemPrompt, userPrompt, imageBase64 } = await req.json();

    // 3. Inicializamos Gemini con la clave segura
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    
    // Usamos EL MISMO MODELO que tienes en tu app actualmente
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-09-2025" });

    // Construimos el prompt final combinando sistema + usuario
    const finalPrompt = `${systemPrompt}\n\nInput del usuario: ${userPrompt || '(Solo imagen)'}`;
    
    let result;

    if (imageBase64) {
        // Si hay imagen, enviamos el prompt + la imagen
        const imagePart = {
            inlineData: {
                data: imageBase64,
                mimeType: "image/jpeg", 
            },
        };
        result = await model.generateContent([finalPrompt, imagePart]);
    } else {
        // Solo texto
        result = await model.generateContent(finalPrompt);
    }

    const responseText = result.response.text();

    // 4. Respondemos a la App con el texto generado
    return new Response(
      JSON.stringify({ result: responseText }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error("Error en Edge Function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Error interno del servidor" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});