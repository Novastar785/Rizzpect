import React from 'react';
import { ScrollView, StyleSheet, Linking } from 'react-native';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

const themeColors = Colors.dark;

export default function PrivacyScreen() {
  const { t } = useTranslation();

  return (
    <>
      <Stack.Screen options={{ title: t('legal.privacy.title'), headerBackTitle: t('profile.title') || 'Profile' }} />
      <ScrollView 
        contentContainerStyle={styles.contentContainer} 
        style={[styles.container, { backgroundColor: themeColors.background }]}
      >
        <Text style={styles.title}>{t('legal.privacy.title')}</Text>
        <Text style={styles.lastUpdated}>{t('legal.privacy.lastUpdated')}</Text>

        <Text style={styles.paragraph}>
          {t('legal.privacy.intro')}
        </Text>

        <Text style={styles.heading}>{t('legal.privacy.h1')}</Text>
        
        <Text style={styles.subHeading}>{t('legal.privacy.sh1a')}</Text>
        <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>{t('legal.privacy.sh1a_li1')}</Text>
            <Text style={styles.bulletItem}>{t('legal.privacy.sh1a_li2')}</Text>
        </View>

        <Text style={styles.subHeading}>{t('legal.privacy.sh1b')}</Text>
        <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>{t('legal.privacy.sh1b_li1')}</Text>
            <Text style={styles.bulletItem}>{t('legal.privacy.sh1b_li2')}</Text>
        </View>

        <Text style={styles.heading}>{t('legal.privacy.h2')}</Text>
        <Text style={styles.paragraph}>{t('legal.privacy.p2')}</Text>
        <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>{t('legal.privacy.p2_li1')}</Text>
            <Text style={styles.bulletItem}>{t('legal.privacy.p2_li2')}</Text>
            <Text style={styles.bulletItem}>{t('legal.privacy.p2_li3')}</Text>
            <Text style={styles.bulletItem}>{t('legal.privacy.p2_li4')}</Text>
        </View>

        <Text style={styles.heading}>{t('legal.privacy.h3')}</Text>
        <Text style={styles.paragraph}>{t('legal.privacy.p3')}</Text>
        <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>{t('legal.privacy.p3_li1')}</Text>
            <Text style={styles.bulletItem}>{t('legal.privacy.p3_li2')}</Text>
            <Text style={styles.bulletItem}>{t('legal.privacy.p3_li3')}</Text>
        </View>

        <Text style={styles.heading}>{t('legal.privacy.h4')}</Text>
        <Text style={styles.paragraph}>{t('legal.privacy.p4')}</Text>
        <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>{t('legal.privacy.p4_li1')}</Text>
            <Text style={styles.bulletItem}>{t('legal.privacy.p4_li2')}</Text>
            <Text style={styles.bulletItem}>{t('legal.privacy.p4_li3')}</Text>
        </View>

        <Text style={styles.heading}>{t('legal.privacy.h5')}</Text>
        <Text style={styles.paragraph}>
            {t('legal.privacy.p5')}
        </Text>

        <Text style={styles.heading}>{t('legal.privacy.h6')}</Text>
        <Text style={styles.paragraph}>
            {t('legal.privacy.p6')} <Text style={styles.link} onPress={() => Linking.openURL('mailto:info@rizzflows.com')}>info@rizzflows.com</Text>.
        </Text>

        <Text style={styles.heading}>{t('legal.privacy.h7')}</Text>
        <Text style={styles.paragraph}>
            {t('legal.privacy.p7')}
        </Text>

        <Text style={styles.heading}>{t('legal.privacy.h8')}</Text>
        <Text style={styles.paragraph}>
            {t('legal.privacy.p8')}
        </Text>

        <Text style={styles.heading}>{t('legal.privacy.h9')}</Text>
        <Text style={styles.paragraph}>
            {t('legal.privacy.p9')}
        </Text>
        <Text style={styles.link} onPress={() => Linking.openURL('mailto:info@rizzflows.com')}>info@rizzflows.com</Text>
        <Text style={styles.paragraph}><Text style={styles.bold}>Company:</Text> ADSEGOM LTD</Text>

        <View style={styles.footer}>
            <Text style={styles.footerText}>© 2025 ADSEGOM LTD</Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
    color: themeColors.text,
  },
  lastUpdated: {
    fontSize: 14,
    color: themeColors.icon,
    marginBottom: 24,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 12,
    color: themeColors.text,
    borderLeftWidth: 4,
    borderLeftColor: themeColors.tint, // Different accent color for privacy
    paddingLeft: 12,
  },
  subHeading: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    color: themeColors.text,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: themeColors.icon,
    marginBottom: 16,
  },
  bold: {
    fontWeight: 'bold',
    color: themeColors.text,
  },
  bulletList: {
    paddingLeft: 10,
    marginBottom: 16,
  },
  bulletItem: {
    fontSize: 16,
    lineHeight: 24,
    color: themeColors.icon,
    marginBottom: 8,
  },
  link: {
    fontSize: 16,
    color: themeColors.secondary,
    marginBottom: 4, // Slight adjustment for inline link flow
    textDecorationLine: 'underline',
  },
  footer: {
    marginTop: 40,
    borderTopWidth: 1,
    borderTopColor: themeColors.border,
    paddingTop: 20,
    alignItems: 'center',
  },
  footerText: {
    color: themeColors.icon,
    fontSize: 14,
  }
});