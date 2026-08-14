import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { EventItem } from '../../api/events';
import { colors, typography, spacing, radius, shadows } from '../../theme';

interface EventCardProps {
  item: EventItem;
  onPress: () => void;
}

const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleDateString('ar-SA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

export const EventCard: React.FC<EventCardProps> = ({ item, onPress }) => {
  const start = new Date(item.startAt);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.dateBadge}>
        <Text style={styles.day}>{start.getDate()}</Text>
        <Text style={styles.month}>
          {start.toLocaleDateString('ar-SA', { month: 'short' })}
        </Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{item.titleAr}</Text>
        {item.city && (
          <Text style={styles.meta}>📍 {item.city}</Text>
        )}
        <Text style={styles.meta}>🗓 {formatDateTime(item.startAt)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    marginBottom: spacing.base,
    flexDirection: 'row-reverse',
    overflow: 'hidden',
    ...shadows.md,
  },
  dateBadge: {
    width: 64,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  day: {
    fontSize: typography['2xl'],
    fontWeight: '800',
    color: colors.white,
    lineHeight: 28,
  },
  month: {
    fontSize: typography.xs,
    color: colors.primarySurface,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: spacing.base,
  },
  title: {
    fontSize: typography.base,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'right',
    marginBottom: spacing.xs,
    lineHeight: typography.base * 1.4,
  },
  meta: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    textAlign: 'right',
    marginTop: 2,
  },
});
