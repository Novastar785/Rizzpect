import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import * as ImagePicker from 'expo-image-picker';
import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  LogBox,
  Keyboard
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // Importamos hook
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import LottieView from 'lottie-react-native';
import { useTranslation } from 'react-i18next';
import FloatingBackButton from '@/components/FloatingBackButton';

LogBox.ignoreLogs([
  '[expo-image-picker] `ImagePicker.MediaTypeOptions` have been deprecated',
]);

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${GEMINI_API_KEY}`;
const MAX_PROMPT_LENGTH = 600;
const TONES = ['Casual', 'Flirty', 'Playful', 'Non-chalant', 'Spicy'];

const theme = 'dark';
const themeColors = Colors[theme];

export default function ReplySuggestionsScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets(); // Obtenemos insets para padding manual
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] =
    useState<ImagePicker.ImagePickerAsset | null>(null);
  const [selectedTone, setSelectedTone] = useState(TONES[0]);
  const [inputFocused, setInputFocused] = useState(false);

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
      setTimeout(() => {
         scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
      lottieAnimationRef.current?.play();
    }
  }, [loading]);

  const pickImage = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(t('rizz.common.permission'), t('rizz.common.permissionMsg'));
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
      setResults([]);
    }
  };

  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleToneSelect = (tone: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedTone(tone);
  };

  const handleGenerateRizz = async () => {
    Keyboard.dismiss();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (!GEMINI_API_KEY) {
      Alert.alert(t('rizz.common.apiMissing'), 'Check .env');
      return;
    }

    if (!prompt.trim() && !selectedImage) {
      Alert.alert(t('rizz.common.inputRequired'));
      return;
    }

    setLoading(true);
    setResults([]);

    const langInstruction = t('prompts.langInstruction');

    const systemPrompt = `You are "Rizzflow", a social assistant.
    Your goal is to generate 3-4 witty, clever, or engaging **replies** to a message the user received.
    Your tone MUST be: ${selectedTone === 'Spicy' ? 'sexual and spicy' : selectedTone}.
    If an image of a chat is provided, analyze the LAST MESSAGE in the screenshot and provide a reply for it.
    If text is also provided, use that as extra context about the conversation or the person.
    
    ${langInstruction}
    
    --- STRICT RULES (MANDATORY) ---
    1.  **DO NOT** include any greetings, salutations, commentary, or preambles.
    2.  Your response **MUST ONLY** contain the list of 3-4 reply suggestions.
    3.  Each reply **MUST** be on a new line.
    4.  **ONLY** provide replies, roasts, or social advice related to the user's input.
    5.  **DO NOT** answer general questions.
    6.  **DO NOT** write poems, stories, code, essays.
    7.  **DO NOT** respond to requests to generate images.
    8.  If the user asks for anything other than social advice, you **MUST** politely refuse and redirect them to the app's purpose.
        Example refusal: "My purpose is to help you with social situations, so I can't help with that. Let's focus on the situation!"`;

    const parts = [];

    if (prompt.trim()) {
      parts.push({ text: `Context/Last Message: "${prompt}"` });
    }

    if (selectedImage) {
      if (!selectedImage.base64) {
        setLoading(false);
        return;
      }
      if (!prompt.trim()) {
        parts.push({
          text: 'Analyze the last message in this screenshot and give me reply suggestions.',
        });
      }
      parts.push({
        inlineData: {
          mimeType: selectedImage.mimeType || 'image/jpeg',
          data: selectedImage.base64,
        },
      });
    }

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

      if (!response.ok) throw new Error(`API Error`);

      const data = await response.json();

      if (data.candidates && data.candidates.length > 0) {
        const text = data.candidates[0].content.parts[0].text;
        const parsedLines = text
          .split('\n')
          .map((line: string) => line.replace(/^(?:\d+\.|\*|\-)\s*/, '').trim())
          .filter((line: string) => line.length > 0);
        setResults(parsedLines);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // CAMBIO: View simple y transparente
    <View style={styles.container}>
      <FloatingBackButton />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 20}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          // CAMBIO: PaddingTop manual usando insets
          contentContainerStyle={[styles.scrollContainer, { paddingTop: insets.top + 60 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Pressable style={styles.buttonWrapper} onPress={pickImage} disabled={loading}>
            <LinearGradient
              colors={[themeColors.tint, themeColors.secondary]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.buttonGradient}>
              <Ionicons name="camera-outline" size={20} color="white" />
              <Text style={styles.buttonText}>{t('rizz.common.upload')}</Text>
            </LinearGradient>
          </Pressable>

          {selectedImage && (
            <View style={styles.previewContainer}>
              <Image
                source={{ uri: selectedImage.uri }}
                style={styles.previewImage}
              />
              <Pressable
                style={styles.removeImageButton}
                onPress={() => setSelectedImage(null)}>
                <Ionicons name="close-circle" size={24} color={themeColors.accentRed} />
              </Pressable>
            </View>
          )}

          <Text style={styles.orText}>{t('rizz.common.or')}</Text>

          <Text style={styles.subtitle}>{t('rizz.reply.prompt')}</Text>

          <View style={[
            styles.textInputContainer,
            { borderColor: inputFocused ? themeColors.tint : themeColors.border }
          ]}>
            <TextInput
              style={styles.textInput}
              placeholder={t('rizz.reply.placeholder')}
              placeholderTextColor={themeColors.icon}
              multiline
              value={prompt}
              onChangeText={setPrompt}
              maxLength={MAX_PROMPT_LENGTH}
              onFocus={() => {
                 setInputFocused(true);
                 setTimeout(() => scrollViewRef.current?.scrollTo({ y: 200, animated: true }), 100);
              }}
              onBlur={() => setInputFocused(false)}
            />
            <Text style={styles.charCounter}>
              {MAX_PROMPT_LENGTH - prompt.length} / {MAX_PROMPT_LENGTH}
            </Text>
          </View>

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
            style={styles.actionButtonWrapper}
            onPress={handleGenerateRizz}
            disabled={loading}>
            <LinearGradient
              colors={[themeColors.tint, themeColors.secondary]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.buttonGradient}>
              <Ionicons name="sparkles-outline" size={20} color="white" />
              <Text style={styles.buttonText}>
                {loading ? t('rizz.common.generating') : t('rizz.reply.button')}
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
                  <Ionicons name="copy-outline" size={18} color={themeColors.tint} />
                </Pressable>
              ))}
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  keyboardAvoidingView: { flex: 1 },
  scrollView: { flex: 1, paddingHorizontal: 20, backgroundColor: 'transparent' },
  scrollContainer: { paddingBottom: 40, flexGrow: 1 },
  orText: { fontSize: 16, color: themeColors.icon, textAlign: 'center', marginBottom: 15, fontWeight: 'bold', fontFamily: 'Montserrat-Bold' },
  previewContainer: { marginBottom: 15, alignItems: 'center', position: 'relative' },
  previewImage: { width: '100%', height: 200, borderRadius: 12, borderColor: themeColors.border, borderWidth: 1, resizeMode: 'contain' },
  removeImageButton: { position: 'absolute', top: 5, right: 5, backgroundColor: 'rgba(255, 255, 255, 0.7)', borderRadius: 12 },
  subtitle: { fontSize: 16, color: themeColors.icon, marginBottom: 15, textAlign: 'center', fontFamily: 'Montserrat-Regular' },
  textInputContainer: { marginBottom: 20, backgroundColor: themeColors.card, borderColor: themeColors.border, borderWidth: 1.5, borderRadius: 12 },
  textInput: { padding: 15, fontSize: 16, color: themeColors.text, minHeight: 120, textAlignVertical: 'top', fontFamily: 'Montserrat-Regular' },
  charCounter: { fontSize: 12, color: themeColors.icon, textAlign: 'right', paddingHorizontal: 15, paddingBottom: 10 },
  tonalityContainer: { marginBottom: 20 },
  tonalityLabel: { fontSize: 16, fontWeight: '600', color: themeColors.text, textAlign: 'center', marginBottom: 10, fontFamily: 'Montserrat-SemiBold' },
  toneButtonRow: { flexDirection: 'row', justifyContent: 'space-around', flexWrap: 'wrap' },
  toneButton: { backgroundColor: themeColors.card, borderColor: themeColors.border, borderWidth: 1.5, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 99, margin: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 4 },
  toneButtonActive: { backgroundColor: themeColors.tint, borderColor: themeColors.tint },
  toneButtonText: { fontSize: 14, color: themeColors.text, fontFamily: 'Montserrat-Regular' },
  toneButtonTextActive: { color: '#FFFFFF', fontWeight: 'bold', fontFamily: 'Montserrat-Bold' },
  buttonWrapper: { width: '100%', borderRadius: 99, marginTop: 10, shadowColor: themeColors.tint, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 8, marginBottom: 15 },
  actionButtonWrapper: { width: '100%', borderRadius: 99, marginTop: 10, shadowColor: themeColors.tint, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 8, marginBottom: 15 },
  buttonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 15, borderRadius: 99, width: '100%' },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold', marginLeft: 10, fontFamily: 'Montserrat-Bold' },
  loadingContainer: { marginTop: 30, alignItems: 'center' },
  lottieLoading: { width: 150, height: 150 },
  resultContainer: { marginTop: 20 },
  resultsLabel: { fontSize: 16, fontWeight: '600', color: themeColors.icon, marginBottom: 10, fontFamily: 'Montserrat-SemiBold' },
  pillResult: { backgroundColor: themeColors.card, borderRadius: 12, paddingVertical: 15, paddingHorizontal: 20, borderColor: themeColors.border, borderWidth: 1, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1, borderLeftWidth: 3, borderLeftColor: themeColors.secondary },
  pillResultText: { fontSize: 16, color: themeColors.text, lineHeight: 24, flex: 1, marginRight: 10, fontFamily: 'Montserrat-Regular' },
});