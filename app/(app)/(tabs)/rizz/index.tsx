import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

const theme = 'dark';
const themeColors = Colors[theme];

const iconColors = {
  start: themeColors.tint,
  reply: themeColors.secondary,
  awkward: themeColors.accentGreen,
  pickup: themeColors.accentRed,
};

const RizzCard = ({ href, icon, title, description, color }: { href: string, icon: any, title: string, description: string, color: string }) => {
  return (
    <Link href={href as any} asChild>
      <Pressable style={styles.card}>
        <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
          <Ionicons
            name={icon}
            size={24}
            style={[styles.cardIcon, { color: color }]}
          />
        </View>
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardDescription}>{description}</Text>
        </View>
        <Ionicons name="chevron-forward-outline" size={20} color={themeColors.icon} />
      </Pressable>
    </Link>
  );
};

export default function RizzScreen() {
  const { t } = useTranslation();
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>{t('rizz.title')}</Text>
        <Text style={styles.subtitle}>{t('rizz.subtitle')}</Text>

        <View style={styles.buttonContainer}>
          <RizzCard
            href="/(app)/(tabs)/rizz/startConversation"
            icon="chatbubbles-outline"
            title={t('rizz.menu.start')}
            description={t('rizz.menu.startDesc')}
            color={iconColors.start}
          />
          <RizzCard
            href="/(app)/(tabs)/rizz/replySuggestions"
            icon="arrow-undo-outline"
            title={t('rizz.menu.reply')}
            description={t('rizz.menu.replyDesc')}
            color={iconColors.reply}
          />
          <RizzCard
            href="/(app)/(tabs)/rizz/awkwardSituation"
            icon="help-buoy-outline"
            title={t('rizz.menu.awkward')}
            description={t('rizz.menu.awkwardDesc')}
            color={iconColors.awkward}
          />
          <RizzCard
            href="/(app)/(tabs)/rizz/pickupLines"
            icon="flame-outline"
            title={t('rizz.menu.pickup')}
            description={t('rizz.menu.pickupDesc')}
            color={iconColors.pickup}
          />
        </View>
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
    backgroundColor: themeColors.background,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: themeColors.text,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: themeColors.icon,
    marginBottom: 30,
  },
  buttonContainer: {
    width: '100%',
  },
  card: {
    backgroundColor: themeColors.card,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16, 
    marginBottom: 15,
    borderWidth: 1,
    borderColor: themeColors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, 
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardIcon: {
  },
  cardTextContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  cardTitle: {
    color: themeColors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  cardDescription: {
    color: themeColors.icon,
    fontSize: 14,
    marginTop: 2,
  },
});