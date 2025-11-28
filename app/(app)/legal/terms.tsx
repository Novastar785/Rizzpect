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

        {/* Introduction */}
        <Text style={styles.paragraph}>
          {t('legal.terms.intro')}
        </Text>

        {/* 1. Agreement & Eligibility */}
        <Text style={styles.heading}>{t('legal.terms.h1')}</Text>
        <Text style={styles.paragraph}>{t('legal.terms.p1')}</Text>
        
        <Text style={styles.subHeading}>{t('legal.terms.h1_sub')}</Text>
        <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>{t('legal.terms.p1_li1')}</Text>
            <Text style={styles.bulletItem}>{t('legal.terms.p1_li2')}</Text>
            <Text style={styles.bulletItem}>{t('legal.terms.p1_li3')}</Text>
            <Text style={styles.bulletItem}>{t('legal.terms.p1_li4')}</Text>
        </View>

        {/* 2. Services & AI Disclaimer */}
        <Text style={styles.heading}>{t('legal.terms.h2')}</Text>
        <Text style={styles.paragraph}>{t('legal.terms.p2')}</Text>
        
        <View style={[styles.highlightBox, { borderColor: themeColors.tint, backgroundColor: `${themeColors.tint}15` }]}>
          <Text style={[styles.subHeading, { marginTop: 0 }]}>{t('legal.terms.h2_disclaimer_title')}</Text>
          <Text style={styles.paragraph}>
            {t('legal.terms.h2_disclaimer_text')}
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>{t('legal.terms.p2_li1')}</Text>
            <Text style={styles.bulletItem}>{t('legal.terms.p2_li2')}</Text>
            <Text style={styles.bulletItem}>{t('legal.terms.p2_li3')}</Text>
          </View>
        </View>

        {/* 3. Purchases & Payments */}
        <Text style={styles.heading}>{t('legal.terms.h3')}</Text>
        <Text style={styles.paragraph}>{t('legal.terms.p3')}</Text>
        
        <Text style={styles.subHeading}>{t('legal.terms.h3_sub1')}</Text>
        <Text style={styles.paragraph}>{t('legal.terms.p3_sub1_text')}</Text>

        <Text style={styles.subHeading}>{t('legal.terms.h3_sub2')}</Text>
        <Text style={styles.paragraph}>{t('legal.terms.p3_sub2_text')}</Text>

        <Text style={styles.subHeading}>{t('legal.terms.h3_sub3')}</Text>
        <Text style={styles.paragraph}>{t('legal.terms.p3_sub3_text')}</Text>

        {/* 4. Intellectual Property */}
        <Text style={styles.heading}>{t('legal.terms.h4')}</Text>
        <Text style={styles.paragraph}>{t('legal.terms.p4')}</Text>
        
        <Text style={styles.subHeading}>{t('legal.terms.h4_sub')}</Text>
        <Text style={styles.paragraph}>{t('legal.terms.p4_sub_text')}</Text>

        {/* 5. User Contributions */}
        <Text style={styles.heading}>{t('legal.terms.h5')}</Text>
        <Text style={styles.paragraph}>{t('legal.terms.p5')}</Text>
        
        <Text style={styles.subHeading}>{t('legal.terms.h5_sub')}</Text>
        <Text style={styles.paragraph}>{t('legal.terms.p5_sub_text')}</Text>

        {/* 6. Prohibited Activities */}
        <Text style={styles.heading}>{t('legal.terms.h6')}</Text>
        <Text style={styles.paragraph}>{t('legal.terms.p6')}</Text>
        <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>{t('legal.terms.p6_li1')}</Text>
            <Text style={styles.bulletItem}>{t('legal.terms.p6_li2')}</Text>
            <Text style={styles.bulletItem}>{t('legal.terms.p6_li3')}</Text>
            <Text style={styles.bulletItem}>{t('legal.terms.p6_li4')}</Text>
            <Text style={styles.bulletItem}>{t('legal.terms.p6_li5')}</Text>
            <Text style={styles.bulletItem}>{t('legal.terms.p6_li6')}</Text>
            <Text style={styles.bulletItem}>{t('legal.terms.p6_li7')}</Text>
            <Text style={styles.bulletItem}>{t('legal.terms.p6_li8')}</Text>
        </View>

        {/* 7. Third Party */}
        <Text style={styles.heading}>{t('legal.terms.h7')}</Text>
        <Text style={styles.paragraph}>{t('legal.terms.p7')}</Text>

        {/* 8. Service Management */}
        <Text style={styles.heading}>{t('legal.terms.h8')}</Text>
        <Text style={styles.paragraph}>{t('legal.terms.p8')}</Text>

        {/* 9. Modifications */}
        <Text style={styles.heading}>{t('legal.terms.h9')}</Text>
        <Text style={styles.paragraph}>{t('legal.terms.p9')}</Text>

        {/* 10. Disclaimer Warranties */}
        <Text style={styles.heading}>{t('legal.terms.h10')}</Text>
        <Text style={styles.paragraph}>{t('legal.terms.p10')}</Text>

        {/* 11. Limitations */}
        <Text style={styles.heading}>{t('legal.terms.h11')}</Text>
        <Text style={styles.paragraph}>{t('legal.terms.p11')}</Text>

        {/* 12. Indemnification */}
        <Text style={styles.heading}>{t('legal.terms.h12')}</Text>
        <Text style={styles.paragraph}>{t('legal.terms.p12')}</Text>

        {/* 13. Privacy */}
        <Text style={styles.heading}>{t('legal.terms.h13')}</Text>
        <Text style={styles.paragraph}>{t('legal.terms.p13')}</Text>

        {/* 14. Electronic Comms */}
        <Text style={styles.heading}>{t('legal.terms.h14')}</Text>
        <Text style={styles.paragraph}>{t('legal.terms.p14')}</Text>

        {/* 15. Governing Law */}
        <Text style={styles.heading}>{t('legal.terms.h15')}</Text>
        <Text style={styles.paragraph}>{t('legal.terms.p15')}</Text>

        {/* 16. Dispute */}
        <Text style={styles.heading}>{t('legal.terms.h16')}</Text>
        <Text style={styles.paragraph}>{t('legal.terms.p16')}</Text>

        {/* 17. Miscellaneous */}
        <Text style={styles.heading}>{t('legal.terms.h17')}</Text>
        <Text style={styles.paragraph}>{t('legal.terms.p17')}</Text>

        {/* 18. Contact */}
        <Text style={styles.heading}>{t('legal.terms.h18')}</Text>
        <Text style={styles.paragraph}>{t('legal.terms.p18')}</Text>
        <Text style={styles.link} onPress={() => Linking.openURL('mailto:info@rizzflows.com')}>info@rizzflows.com</Text>

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
  subHeading: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
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