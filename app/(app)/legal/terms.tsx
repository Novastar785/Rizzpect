import React from 'react';
import { ScrollView, StyleSheet, Linking } from 'react-native';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

const themeColors = Colors.dark;

export default function TermsScreen() {
  const { t } = useTranslation();

  return (
    <>
      <Stack.Screen options={{ title: t('legal.terms.title'), headerBackTitle: t('profile.title') || 'Profile' }} />
      <ScrollView 
        contentContainerStyle={styles.contentContainer} 
        style={[styles.container, { backgroundColor: themeColors.background }]}
      >
        <Text style={styles.title}>{t('legal.terms.title')}</Text>
        <Text style={styles.lastUpdated}>{t('legal.terms.lastUpdated')}</Text>

        <Text style={styles.paragraph}>
          {t('legal.terms.intro')} <Text style={styles.bold}>ADSEGOM LTD</Text>.
        </Text>

        <Text style={styles.heading}>{t('legal.terms.h1')}</Text>
        <Text style={styles.paragraph}>
          {t('legal.terms.p1')}
        </Text>

        <Text style={styles.heading}>{t('legal.terms.h2')}</Text>
        <Text style={styles.paragraph}>
          {t('legal.terms.p2')}
        </Text>

        <Text style={styles.heading}>{t('legal.terms.h3')}</Text>
        <View style={[styles.highlightBox, { borderColor: themeColors.tint, backgroundColor: `${themeColors.tint}15` }]}>
          <Text style={styles.paragraph}>
            {t('legal.terms.p3_intro')}
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>{t('legal.terms.p3_li1')}</Text>
            <Text style={styles.bulletItem}>{t('legal.terms.p3_li2')}</Text>
            <Text style={styles.bulletItem}>{t('legal.terms.p3_li3')}</Text>
          </View>
        </View>

        <Text style={styles.heading}>{t('legal.terms.h4')}</Text>
        <Text style={styles.paragraph}>
          {t('legal.terms.p4')}
        </Text>

        <Text style={styles.heading}>{t('legal.terms.h5')}</Text>
        <Text style={styles.paragraph}>
          {t('legal.terms.p5')}
        </Text>
        <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>{t('legal.terms.p5_li1')}</Text>
            <Text style={styles.bulletItem}>{t('legal.terms.p5_li2')}</Text>
            <Text style={styles.bulletItem}>{t('legal.terms.p5_li3')}</Text>
            <Text style={styles.bulletItem}>{t('legal.terms.p5_li4')}</Text>
        </View>

        <Text style={styles.heading}>{t('legal.terms.h6')}</Text>
        <Text style={styles.paragraph}>{t('legal.terms.p6')}</Text>
        <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>{t('legal.terms.p6_li1')}</Text>
            <Text style={styles.bulletItem}>{t('legal.terms.p6_li2')}</Text>
            <Text style={styles.bulletItem}>{t('legal.terms.p6_li3')}</Text>
            <Text style={styles.bulletItem}>{t('legal.terms.p6_li4')}</Text>
        </View>

        <Text style={styles.heading}>{t('legal.terms.h7')}</Text>
        <Text style={styles.paragraph}>
            {t('legal.terms.p7')}
        </Text>

        <Text style={styles.heading}>{t('legal.terms.h8')}</Text>
        <Text style={styles.paragraph}>
            {t('legal.terms.p8')}
        </Text>

        <Text style={styles.heading}>{t('legal.terms.h9')}</Text>
        <Text style={styles.paragraph}>
            {t('legal.terms.p9')}
        </Text>

        <Text style={styles.heading}>{t('legal.terms.h10')}</Text>
        <Text style={styles.paragraph}>
            {t('legal.terms.p10')}
        </Text>

        <Text style={styles.heading}>{t('legal.terms.h11')}</Text>
        <Text style={styles.paragraph}>
            {t('legal.terms.p11')}
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
    borderLeftColor: themeColors.secondary,
    paddingLeft: 12,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: themeColors.icon, // Using icon color for muted text
    marginBottom: 16,
  },
  bold: {
    fontWeight: 'bold',
    color: themeColors.text,
  },
  highlightBox: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
    marginBottom: 16,
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