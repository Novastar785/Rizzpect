import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import React, { useState } from 'react';
import {
  StyleSheet,
  useColorScheme,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- API Configuration ---
const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${GEMINI_API_KEY}`;
const MAX_PROMPT_LENGTH = 600;
const TONES = ['Casual', 'Flirty', 'Playful', 'Non-chalant']; // Tones constant

export default function AwkwardSituationScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const styles = getStyles(colorScheme);
  const tintColor = Colors[colorScheme].tint;

  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [selectedTone, setSelectedTone] = useState(TONES[0]);

  // Image picker functionality removed for this screen

  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
    Alert.alert('Copied!', 'The text has been copied to your clipboard.');
  };

  const handleGenerateRizz = async () => {
    if (!GEMINI_API_KEY) {
      Alert.alert(
        'API Key Missing',
        'Please add your EXPO_PUBLIC_GEMINI_API_KEY to the .env file and restart the app with `expo start -c`.'
      );
      return;
    }

    if (!prompt.trim()) {
      Alert.alert('Input Required', 'Please describe the awkward situation.');
      return;
    }

    setLoading(true);
    setResults([]);

    // --- UPDATED: System prompt for "Awkward Situations" ---
    const systemPrompt = `You are "Rizzflow", a social assistant.
    Your goal is to generate 3-4 short, actionable pieces of advice or specific phrases to help the user navigate an awkward social situation they describe.
    Your tone MUST be: ${selectedTone}.
    The user will provide text describing the situation. Give them clear, concise ways to handle it or escape it smoothly.

    --- STRICT RULES (MANDATORY) ---
    1.  **DO NOT** include any greetings, salutations, commentary, or preambles (e.g., "Hello!", "Sure!", "Here are some options:").
    2.  Your response **MUST ONLY** contain the list of 3-4 suggestions.
    3.  Each suggestion **MUST** be on a new line.
    4.  **ONLY** provide advice related to the user's social situation.
    5.  **DO NOT** answer general questions (like math, history, science, coding, trivia, etc.).
    6.  **DO NOT** write poems, stories, code, essays, or any long-form content.
    7.  **DO NOT** respond to requests to generate images.
    8.  If the user asks for anything other than social advice, you **MUST** politely refuse and redirect them to the app's purpose.
        Example refusal: "My purpose is to help you handle awkward situations, so I can't help with that. Let's focus on your situation!"`;

    const parts = [{ text: `Awkward Situation: "${prompt}"` }];

    // Image parts removed

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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={80}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          {/* Upload Button and Image Preview Removed */}

          <Text style={styles.subtitle}>
            Describe the awkward situation you need help with:
          </Text>

          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="e.g., 'I forgot someone's name right after they told me', 'I ran into my ex with her new partner', 'Accidentally sent a text to the wrong person...'"
              placeholderTextColor={Colors[colorScheme].icon}
              multiline
              value={prompt}
              onChangeText={setPrompt}
              maxLength={MAX_PROMPT_LENGTH}
            />
            <Text style={styles.charCounter}>
              {MAX_PROMPT_LENGTH - prompt.length} / {MAX_PROMPT_LENGTH}
            </Text>
          </View>

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
                  onPress={() => setSelectedTone(tone)}>
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
            style={[styles.button, { backgroundColor: tintColor }]}
            onPress={handleGenerateRizz}
            disabled={loading}>
            <Ionicons name="sparkles-outline" size={20} color="white" />
            <Text style={styles.buttonText}>
              {loading ? 'Generating...' : 'Get Advice'}
            </Text>
          </Pressable>

          {loading && (
            <ActivityIndicator
              size="large"
              color={tintColor}
              style={styles.loading}
            />
          )}

          {results.length > 0 && (
            <View style={styles.resultContainer}>
              {results.map((line, index) => (
                <Pressable
                  key={index}
                  style={styles.pillResult}
                  onPress={() => copyToClipboard(line)}>
                  <Text style={styles.pillResultText}>{line}</Text>
                  <Ionicons
                    name="copy-outline"
                    size={18}
                    color={tintColor}
                  />
                </Pressable>
              ))}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const getStyles = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: Colors[theme].background,
    },
    keyboardAvoidingView: {
      flex: 1,
    },
    container: {
      flex: 1,
      padding: 20,
    },
    scrollContainer: {
      flexGrow: 1,
    },
    subtitle: {
      fontSize: 16,
      color: Colors[theme].icon,
      marginBottom: 15,
      textAlign: 'center',
    },
    textInputContainer: {
      marginBottom: 20,
      backgroundColor: Colors[theme].card,
      borderColor: Colors[theme].border,
      borderWidth: 1,
      borderRadius: 12,
    },
    textInput: {
      padding: 15,
      fontSize: 16,
      color: Colors[theme].text,
      minHeight: 120,
      textAlignVertical: 'top',
    },
    charCounter: {
      fontSize: 12,
      color: Colors[theme].icon,
      textAlign: 'right',
      paddingHorizontal: 15,
      paddingBottom: 10,
    },
    tonalityContainer: {
      marginBottom: 20,
    },
    tonalityLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: Colors[theme].text,
      textAlign: 'center',
      marginBottom: 10,
    },
    toneButtonRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      flexWrap: 'wrap',
    },
    toneButton: {
      backgroundColor: Colors[theme].card,
      borderColor: Colors[theme].border,
      borderWidth: 1,
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 99,
      margin: 4,
    },
    toneButtonActive: {
      backgroundColor: Colors[theme].tint,
      borderColor: Colors[theme].tint,
    },
    toneButtonText: {
      fontSize: 14,
      color: Colors[theme].text,
    },
    toneButtonTextActive: {
      color: '#FFFFFF',
      fontWeight: 'bold',
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 15,
      borderRadius: 99, // Pill shape
      width: '100%',
    },
    buttonText: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
      marginLeft: 10,
    },
    loading: {
      marginTop: 30,
    },
    resultContainer: {
      marginTop: 20,
      marginBottom: 50, // Add space at the bottom
    },
    pillResult: {
      backgroundColor: Colors[theme].card,
      borderRadius: 12,
      paddingVertical: 15,
      paddingHorizontal: 20,
      borderColor: Colors[theme].border,
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
    },
    pillResultText: {
      fontSize: 16,
      color: Colors[theme].text,
      lineHeight: 24,
      flex: 1, // Ensure text wraps
      marginRight: 10, // Space before copy icon
    },
    // Styles for upload button and image preview are removed
  });