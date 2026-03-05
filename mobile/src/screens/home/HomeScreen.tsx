import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../navigation/types';
import { newsApi } from '../../api/news';
import { eventsApi } from '../../api/events';
import { NewsCard } from '../../components/cards/NewsCard';
import { EventCard } from '../../components/cards/EventCard';
import { LoadingState, ErrorState } from '../../components/ui/LoadingState';
import { colors, typography, spacing, radius } from '../../theme';

type Props = NativeStackScreenProps<HomeStackParamList, 'Home'>;

const QuickLink = ({
  emoji,
  label,
  onPress,
}: {
  emoji: string;
  label: string;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.quickLink} onPress={onPress} activeOpacity={0.8}>
    <Text style={styles.quickLinkEmoji}>{emoji}</Text>
    <Text style={styles.quickLinkLabel}>{label}</Text>
  </TouchableOpacity>
);

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const {
    data: newsData,
    isLoading: newsLoading,
    refetch: refetchNews,
    isError: newsError,
  } = useQuery({
    queryKey: ['news', 'home'],
    queryFn: () => newsApi.getAll({ page: 1, limit: 3 }),
  });

  const {
    data: eventsData,
    isLoading: eventsLoading,
    refetch: refetchEvents,
  } = useQuery({
    queryKey: ['events', 'home'],
    queryFn: () => eventsApi.getAll({ page: 1, limit: 2 }),
  });

  const refreshing = newsLoading || eventsLoading;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={false}
          onRefresh={() => { refetchNews(); refetchEvents(); }}
          tintColor={colors.primary}
        />
      }
    >
      {/* Hero Banner */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>أهلاً وسهلاً</Text>
        <Text style={styles.heroSubtitle}>في ديوان قبيلة تميم العريقة</Text>
      </View>

      {/* Quick Links */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>روابط سريعة</Text>
        <View style={styles.quickLinks}>
          <QuickLink emoji="🌳" label="الشجرة" onPress={() => navigation.getParent()?.navigate('TreeTab')} />
          <QuickLink emoji="📰" label="الأخبار" onPress={() => navigation.getParent()?.navigate('NewsTab')} />
          <QuickLink emoji="📅" label="الفعاليات" onPress={() => navigation.getParent()?.navigate('EventsTab')} />
          <QuickLink emoji="📬" label="اقتراح" onPress={() => navigation.getParent()?.navigate('MoreTab')} />
        </View>
      </View>

      {/* Latest News */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>آخر الأخبار</Text>
          <TouchableOpacity onPress={() => navigation.getParent()?.navigate('NewsTab')}>
            <Text style={styles.seeAll}>عرض الكل ←</Text>
          </TouchableOpacity>
        </View>
        {newsLoading ? (
          <LoadingState message="جارٍ تحميل الأخبار..." />
        ) : newsError ? (
          <ErrorState onRetry={refetchNews} />
        ) : (
          newsData?.data?.map((item) => (
            <NewsCard
              key={item.id}
              item={item}
              onPress={() => navigation.navigate('NewsDetails', { id: item.id })}
              compact
            />
          ))
        )}
      </View>

      {/* Upcoming Events */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>الفعاليات القادمة</Text>
          <TouchableOpacity onPress={() => navigation.getParent()?.navigate('EventsTab')}>
            <Text style={styles.seeAll}>عرض الكل ←</Text>
          </TouchableOpacity>
        </View>
        {eventsLoading ? (
          <LoadingState message="جارٍ تحميل الفعاليات..." />
        ) : (
          eventsData?.data?.map((item) => (
            <EventCard
              key={item.id}
              item={item}
              onPress={() => navigation.navigate('EventDetails', { id: item.id })}
            />
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 40 },
  hero: {
    backgroundColor: colors.primary,
    padding: spacing['2xl'],
    paddingTop: spacing['3xl'],
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: typography['3xl'],
    fontWeight: '800',
    color: colors.white,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: typography.base,
    color: colors.goldLight,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  section: { padding: spacing.base, marginTop: spacing.md },
  sectionHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  sectionTitle: {
    fontSize: typography.xl,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  seeAll: {
    fontSize: typography.sm,
    color: colors.primary,
    fontWeight: '600',
  },
  quickLinks: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  quickLink: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.base,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickLinkEmoji: { fontSize: 28, marginBottom: 4 },
  quickLinkLabel: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
  },
});
