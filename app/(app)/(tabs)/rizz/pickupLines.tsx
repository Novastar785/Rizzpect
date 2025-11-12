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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import LottieView from 'lottie-react-native';

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${GEMINI_API_KEY}`;
const TONES = ['Casual', 'Flirty', 'Playful', 'Non-chalant', 'Spicy'];

const theme = 'dark';
const themeColors = Colors[theme];

export default function PickupLinesScreen() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [selectedTone, setSelectedTone] = useState(TONES[0]);

  const scrollViewRef = useRef<ScrollView>(null);
  const lottieAnimationRef = useRef<LottieView>(null);

  useEffect(() => {
    if (results.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
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

    if (!GEMINI_API_KEY) {
      Alert.alert(
        'API Key Missing',
        'Please add your EXPO_PUBLIC_GEMINI_API_KEY to the .env file and restart the app with `expo start -c`.'
      );
      return;
    }

    setLoading(true);
    setResults([]);

    // --- PROMPT PARA PICKUP LINES ---
    const systemPrompt = `You are "Rizzflow", a social assistant.
    Your goal is to generate 3-4 creative "Banger Pickup Lines".
    Your tone MUST be: ${selectedTone === 'Spicy' ? 'sexual and spicy' : selectedTone}.
    The user is not providing any context other than the tone, so be creative.
    
    --- STRICT RULES (MANDATORY) ---
    1.  Your response **MUST ONLY** contain the list of 3-4 pickup lines.
    2.  Each line **MUST** be on a new line.
    3.  **DO NOT** include *ANY* text other than the lines themselves.
    4.  **DO NOT** include greetings, salutations, commentary, apologies, or preambles (e.g., "Hello!", "Sure!", "Here are some options:").
    5.  Start the response *immediately* with the first pickup line.
    6.  **ONLY** provide pickup lines.
    7.  **DO NOT** answer general questions (like math, history, science, coding, trivia, etc.).
    8.  **DO NOT** write poems, stories, code, essays, or any long-form content.
    9.  **DO NOT** respond to requests to generate images.
    10. If the user asks for anything other than pickup lines, you **MUST** politely refuse and redirect them to the app's purpose.
        Example refusal: "My purpose is to generate pickup lines, so I can't help with that. Let's get you some lines!"`;

    const parts = [{ text: `Generate pickup lines.` }];

    try {
      const payload = {
        contents: [{ parts: parts }],
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `API Error ${response.status}: ${errorBody || response.statusText}`
        );
      }

      const data = await response.json();

      if (data.candidates && data.candidates.length > 0) {
        const text = data.candidates[0].content.parts[0].text;
        const parsedLines = text
          .split('\n')
          .map((line: string) => line.replace(/^(?:\d+\.|\*|\-)\s*/, '').trim())
          .filter((line: string) => line.length > 0);
        setResults(parsedLines);
      } else {
        throw new Error('No valid response from API.');
      }
    } catch (error: any) {
      Alert.alert('Generation Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.container}
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.subtitle}>
          Select a tone and get 3-4 banger pickup lines.
        </Text>

        <View style={styles.tonalityContainer}>
          <Text style={styles.tonalityLabel}>Tonality</Text>
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
                  {tone}
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
              {loading ? 'Generating...' : 'Generate Lines'}
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
            <Text style={styles.resultsLabel}>Tap to copy:</Text>
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
  scrollContainer: {
    paddingBottom: 100,
  },
  subtitle: {
    fontSize: 16,
    color: themeColors.icon,
    marginBottom: 15,
    textAlign: 'center',
  },
  tonalityContainer: {
    marginBottom: 20,
  },
  tonalityLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: themeColors.text,
    textAlign: 'center',
    marginBottom: 10,
  },
  toneButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  toneButton: {
    backgroundColor: themeColors.card,
    borderColor: themeColors.border,
    borderWidth: 1.5,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 99,
    margin: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  toneButtonActive: {
    backgroundColor: themeColors.tint,
    borderColor: themeColors.tint,
  },
  toneButtonText: {
    fontSize: 14,
    color: themeColors.text,
  },
  toneButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  buttonWrapper: {
    width: '100%',
    borderRadius: 99,
    marginTop: 10,
    shadowColor: themeColors.tint,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    marginBottom: 15,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 99,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  loadingContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  lottieLoading: {
    width: 150,
    height: 150,
  },
  resultContainer: {
    marginTop: 20,
  },
  resultsLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: themeColors.icon,
    marginBottom: 10,
  },
  pillResult: {
    backgroundColor: themeColors.card,
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderColor: themeColors.border,
    borderWidth: 1,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderLeftWidth: 3,
    borderLeftColor: themeColors.accentRed, // Rojo
  },
  pillResultText: {
    fontSize: 16,
    color: themeColors.text,
    lineHeight: 24,
    flex: 1,
    marginRight: 10,
  },
});