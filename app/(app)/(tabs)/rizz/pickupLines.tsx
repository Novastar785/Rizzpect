import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Pressable,
  Alert,
  ScrollView,
  Platform, // Añadido para detectar plataforma si es necesario
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // Importar insets
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import LottieView from 'lottie-react-native';
import { useTranslation } from 'react-i18next';
import FloatingBackButton from '@/components/FloatingBackButton';
// IMPORTAMOS EL NUEVO SERVICIO
import { generateRizz } from '@/services/aiService';

const TONES = ['Casual', 'Flirty', 'Playful', 'Non-chalant', 'Spicy'];

const theme = 'dark';
const themeColors = Colors[theme];

export default function PickupLinesScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets(); // Insets
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [selectedTone, setSelectedTone] = useState(TONES[0]);

  const scrollViewRef = useRef<ScrollView>(null);
  const lottieAnimationRef = useRef<LottieView>(null);

  useEffect(() => {
    if (results.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 300);
    }
  }, [results]);

  useEffect(() => {
    if (loading) {
      lottieAnimationRef.current?.reset();
      lottieAnimationRef.current?.play();
    }
  }, [loading]);

  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleToneSelect = (tone: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedTone(tone);
  };

  const handleGenerateRizz = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    setLoading(true);
    setResults([]);

    const langInstruction = t('prompts.langInstruction');

    // Mantenemos tu prompt EXACTAMENTE igual
    const systemPrompt = `You are "Rizzflow", a social assistant.
    Your goal is to generate 3-4 creative "Banger Pickup Lines".
    Your tone MUST be: ${selectedTone === 'Spicy' ? 'sexual and spicy' : selectedTone}.
    The user is not providing any context other than the tone, so be creative.
    
    ${langInstruction}
    
    --- STRICT RULES (MANDATORY) ---
    1.  Your response **MUST ONLY** contain the list of 3-4 pickup lines.
    2.  Each line **MUST** be on a new line.
    3.  **DO NOT** include *ANY* text other than the lines themselves.
    4.  **DO NOT** include greetings, salutations, commentary, apologies, or preambles.
    5.  Start the response *immediately* with the first pickup line.
    6.  **ONLY** provide pickup lines.
    7.  **DO NOT** answer general questions.
    8.  **DO NOT** write poems, stories, code, essays.
    9.  **DO NOT** respond to requests to generate images.`;

    try {
      // Llamada al nuevo servicio seguro
      // No pasamos userPrompt ni imagen, solo el prompt del sistema como "base"
      // La función en el servidor juntará todo.
      const lines = await generateRizz({
        systemPrompt: systemPrompt,
        userPrompt: "Generate lines based on selected tone", // Texto de relleno para el log del server
      });
      
      setResults(lines);

    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error connecting to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // CAMBIO: Usamos un View simple transparente en lugar de SafeAreaView o cualquier otro contenedor opaco
    <View style={styles.container}> 
      <FloatingBackButton />
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        // CAMBIO: Aplicamos el padding superior dinámico aquí para evitar la barra negra
        contentContainerStyle={[styles.scrollContainer, { paddingTop: insets.top + 60 }]}
      >
        {/* Eliminamos el View espaciador que tenías antes */}

        <Text style={styles.subtitle}>{t('rizz.pickup.subtitle')}</Text>

        <View style={styles.tonalityContainer}>
          <Text style={styles.tonalityLabel}>{t('rizz.common.tonality')}</Text>
          <View style={styles.toneButtonRow}>
            {TONES.map((tone) => (
              <Pressable
                key={tone}
                style={[
                  styles.toneButton,
                  selectedTone === tone && styles.toneButtonActive,
                ]}
                onPress={() => handleToneSelect(tone)}>
                <Text
                  style={[
                    styles.toneButtonText,
                    selectedTone === tone && styles.toneButtonTextActive,
                  ]}>
                  {t(`rizz.tones.${tone}`)}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Pressable
          style={styles.buttonWrapper}
          onPress={handleGenerateRizz}
          disabled={loading}>
          <LinearGradient
            colors={[themeColors.tint, themeColors.secondary]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.buttonGradient}>
            <Ionicons name="sparkles-outline" size={20} color="white" />
            <Text style={styles.buttonText}>
              {loading ? t('rizz.common.generating') : t('rizz.pickup.button')}
            </Text>
          </LinearGradient>
        </Pressable>

        {loading && (
          <View style={styles.loadingContainer}>
            <LottieView
              ref={lottieAnimationRef}
              source={require('../../../../assets/animations/loading-animation.json')}
              style={styles.lottieLoading}
              loop
            />
          </View>
        )}

        {results.length > 0 && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultsLabel}>{t('rizz.common.copy')}</Text>
            {results.map((line, index) => (
              <Pressable
                key={index}
                style={styles.pillResult}
                onPress={() => copyToClipboard(line)}>
                <Text style={styles.pillResultText}>{line}</Text>
                <Ionicons
                  name="copy-outline"
                  size={18}
                  color={themeColors.tint}
                />
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' }, // Transparente para ver el fondo del Layout
  scrollView: { flex: 1, paddingHorizontal: 20, backgroundColor: 'transparent' }, // Padding lateral consistente con otras pantallas
  scrollContainer: { paddingBottom: 100 },
  subtitle: { fontSize: 16, color: themeColors.icon, marginBottom: 15, textAlign: 'center', fontFamily: 'Montserrat-Regular' },
  tonalityContainer: { marginBottom: 20 },
  tonalityLabel: { fontSize: 16, fontWeight: '600', color: themeColors.text, textAlign: 'center', marginBottom: 10, fontFamily: 'Montserrat-SemiBold' },
  toneButtonRow: { flexDirection: 'row', justifyContent: 'space-around', flexWrap: 'wrap' },
  toneButton: {
    backgroundColor: themeColors.card, borderColor: themeColors.border, borderWidth: 1.5,
    paddingVertical: 8, paddingHorizontal: 16, borderRadius: 99, margin: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 4,
  },
  toneButtonActive: { backgroundColor: themeColors.tint, borderColor: themeColors.tint },
  toneButtonText: { fontSize: 14, color: themeColors.text, fontFamily: 'Montserrat-Regular' },
  toneButtonTextActive: { color: '#FFFFFF', fontWeight: 'bold', fontFamily: 'Montserrat-Bold' },
  buttonWrapper: { width: '100%', borderRadius: 99, marginTop: 10, shadowColor: themeColors.tint, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 8, marginBottom: 15 },
  buttonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 15, borderRadius: 99, width: '100%' },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold', marginLeft: 10, fontFamily: 'Montserrat-Bold' },
  loadingContainer: { marginTop: 30, alignItems: 'center' },
  lottieAnimation: { width: 150, height: 150 }, // Si se usara en otro lado
  lottieLoading: { width: 150, height: 150 },
  resultContainer: { marginTop: 20 },
  resultsLabel: { fontSize: 16, fontWeight: '600', color: themeColors.icon, marginBottom: 10, fontFamily: 'Montserrat-SemiBold' },
  pillResult: {
    backgroundColor: themeColors.card, borderRadius: 12, paddingVertical: 15, paddingHorizontal: 20,
    borderColor: themeColors.border, borderWidth: 1, marginBottom: 10, flexDirection: 'row',
    justifyContent: 'space-between', alignItems: 'center', shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1,
    borderLeftWidth: 3, borderLeftColor: themeColors.accentRed,
  },
  pillResultText: { fontSize: 16, color: themeColors.text, lineHeight: 24, flex: 1, marginRight: 10, fontFamily: 'Montserrat-Regular' },
});