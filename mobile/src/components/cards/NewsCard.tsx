import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { NewsItem } from '../../api/news';
import { colors, typography, spacing, radius, shadows } from '../../theme';
import { Tag } from '../ui/Tag';

interface NewsCardProps {
  item: NewsItem;
  onPress: () => void;
  compact?: boolean;
}

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' });
};

export const NewsCard: React.FC<NewsCardProps> = ({ item, onPress, compact = false }) => (
  <TouchableOpacity style={[styles.card, compact && styles.compact]} onPress={onPress} activeOpacity={0.9}>
    {item.coverImageUrl && !compact && (
      <Image source={{ uri: item.coverImageUrl }} style={styles.image} resizeMode="cover" />
    )}
    <View style={styles.content}>
      <View style={styles.row}>
        <Tag label={item.category} color={colors.goldSurface} />
        <Text style={styles.date}>{formatDate(item.publishedAt)}</Text>
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {item.titleAr}
      </Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    marginBottom: spacing.base,
    overflow: 'hidden',
    ...shadows.md,
  },
  compact: { flexDirection: 'row', height: 90, alignItems: 'center' },
  image: { width: '100%', height: 180 },
  content: { padding: spacing.base, flex: 1 },
  row: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  date: {
    fontSize: typography.xs,
    color: colors.textHint,
  },
  title: {
    fontSize: typography.base,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'right',
    lineHeight: typography.base * 1.5,
  },
});
