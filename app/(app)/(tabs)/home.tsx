import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Pressable, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';

const theme = 'dark';
const themeColors = Colors[theme];

function MockupPreview() {
  return (
    <View style={styles.mockupContainer}>
      <View style={styles.mockupProfileCard}>
        <Image
          source={require('../../../assets/images/mock_profile.png')}
          style={styles.mockupImage}
          onError={(e) => console.log('Error loading local image', e.nativeEvent.error)}
        />
        <Text style={styles.mockupName}>Amanda, 24</Text>
        <Text style={styles.mockupBio}>
          "Loves hiking, pineapple on pizza, and bad jokes."
        </Text>
      </View>

      <View style={styles.mockupRizzBubble}>
        <Text style={styles.mockupRizzLabel}>
          <Ionicons name="sparkles" size={16} color={themeColors.tint} />
          {' '}Rizzflow Suggestion
        </Text>
        <Text style={styles.mockupRizzText}>
          "Are you a national park? Because I'd love to get lost exploring with you."
        </Text>
      </View>

      <View style={styles.mockupMatchBubble}>
        <Text style={styles.mockupMatchText}>
          <Ionicons name="heart" size={16} color={themeColors.accentRed} />
          {' '}New Match!
        </Text>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const { t } = useTranslation();

  const goToRizz = () => {
    router.navigate('/(app)/(tabs)/rizz');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.scrollContainer} 
        contentContainerStyle={styles.contentContainer}
      >
        <MockupPreview />

        <Text style={styles.title}>{t('home.welcome')}</Text>
        <Text style={styles.subtitle}>{t('home.subtitle')}</Text>

        <View style={[styles.infoCard, { backgroundColor: themeColors.card }]}>
          <Text style={[styles.cardTitle, { color: themeColors.tint }]}>
            <Ionicons name="flash" size={20} color={themeColors.tint} />
            {'  '}{t('home.howWorks')}
          </Text>
          <Text style={styles.bulletPoint}>
            • {t('home.step1')}
          </Text>
          <Text style={styles.bulletPoint}>
            • {t('home.step2')}
          </Text>
          <Text style={styles.bulletPoint}>
            • {t('home.step3')}
          </Text>
        </View>

        <Pressable style={styles.buttonWrapper} onPress={goToRizz}>
          <ExpoLinearGradient
            colors={[themeColors.tint, themeColors.secondary]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.buttonGradient}>
            <Text style={styles.buttonText}>{t('home.getStarted')}</Text>
            <Ionicons name="arrow-forward" size={20} color="white" style={{ marginLeft: 8 }}/>
          </ExpoLinearGradient>
        </Pressable>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: themeColors.background,
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: themeColors.background,
    paddingTop: 10,
    paddingBottom: 40, 
  },
  mockupContainer: {
    width: '100%',
    backgroundColor: themeColors.card,
    borderRadius: 24,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: themeColors.border,
  },
  mockupProfileCard: {
    backgroundColor: themeColors.background,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    width: '90%',
  },
  mockupImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: themeColors.tint,
  },
  mockupName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: themeColors.text,
  },
  mockupBio: {
    fontSize: 14,
    color: themeColors.icon,
    textAlign: 'center',
    marginTop: 4,
  },
  mockupRizzBubble: {
    backgroundColor: 'rgba(192, 57, 255, 0.15)', 
    borderRadius: 12,
    padding: 12,
    width: '100%',
    marginTop: 12,
    borderWidth: 1,
    borderColor: themeColors.tint,
  },
  mockupRizzLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: themeColors.tint,
    marginBottom: 4,
  },
  mockupRizzText: {
    fontSize: 14,
    color: themeColors.text,
    fontStyle: 'italic',
  },
  mockupMatchBubble: {
    backgroundColor: 'rgba(255, 59, 48, 0.15)', 
    borderRadius: 99,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: themeColors.accentRed,
  },
  mockupMatchText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: themeColors.accentRed,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: themeColors.text,
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: themeColors.icon,
    marginBottom: 25,
    textAlign: 'center',
  },
  infoCard: {
    width: '100%',
    padding: 20,
    borderRadius: 16,
    backgroundColor: themeColors.card,
    borderColor: themeColors.border,
    borderWidth: 1,
    marginBottom: 25,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  bulletPoint: {
    fontSize: 16,
    color: themeColors.text,
    marginBottom: 8,
    lineHeight: 24,
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
  },
});