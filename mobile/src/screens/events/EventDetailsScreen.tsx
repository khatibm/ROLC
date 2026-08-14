import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EventsStackParamList } from '../../navigation/types';
import { eventsApi } from '../../api/events';
import { LoadingState, ErrorState } from '../../components/ui/LoadingState';
import { Button } from '../../components/ui/Button';
import { colors, typography, spacing, radius } from '../../theme';

type Props = NativeStackScreenProps<EventsStackParamList, 'EventDetails'>;

const InfoRow = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoValue}>{value}</Text>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoIcon}>{icon}</Text>
  </View>
);

export const EventDetailsScreen: React.FC<Props> = ({ route }) => {
  const { id } = route.params;
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['event', id],
    queryFn: () => eventsApi.getById(id),
  });

  if (isLoading) return <LoadingState />;
  if (isError || !data) return <ErrorState onRetry={refetch} />;

  const formatDateTime = (iso: string) =>
    new Date(iso).toLocaleString('ar-SA', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{data.titleAr}</Text>
        <View style={styles.dateBadge}>
          <Text style={styles.dateText}>
            {new Date(data.startAt).getDate()}
          </Text>
          <Text style={styles.monthText}>
            {new Date(data.startAt).toLocaleDateString('ar-SA', { month: 'long' })}
          </Text>
        </View>
      </View>

      {/* Info */}
      <View style={styles.card}>
        <InfoRow icon="🗓" label="البداية" value={formatDateTime(data.startAt)} />
        <InfoRow icon="🏁" label="النهاية" value={formatDateTime(data.endAt)} />
        {data.city && <InfoRow icon="📍" label="المدينة" value={data.city} />}
        {data.locationText && <InfoRow icon="🏛" label="الموقع" value={data.locationText} />}
        {data.contactName && <InfoRow icon="👤" label="التواصل" value={data.contactName} />}
        {data.contactPhone && (
          <TouchableOpacity onPress={() => Linking.openURL(`tel:${data.contactPhone}`)}>
            <InfoRow icon="📞" label="الهاتف" value={data.contactPhone} />
          </TouchableOpacity>
        )}
      </View>

      {/* Description */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>تفاصيل الفعالية</Text>
        <Text style={styles.description}>{data.descriptionAr}</Text>
      </View>

      {/* Map button */}
      {data.mapUrl && (
        <Button
          label="📍 عرض على الخريطة"
          onPress={() => Linking.openURL(data.mapUrl!)}
          variant="outline"
          fullWidth
          style={{ margin: spacing.base }}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 40 },
  header: {
    backgroundColor: colors.primary,
    padding: spacing['2xl'],
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    flex: 1,
    fontSize: typography.xl,
    fontWeight: '800',
    color: colors.white,
    textAlign: 'right',
    lineHeight: typography.xl * 1.4,
  },
  dateBadge: {
    backgroundColor: colors.gold,
    width: 60,
    height: 60,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.base,
  },
  dateText: { fontSize: typography['2xl'], fontWeight: '800', color: colors.white, lineHeight: 28 },
  monthText: { fontSize: 9, color: 'rgba(255,255,255,0.9)' },
  card: {
    margin: spacing.base,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey100,
  },
  infoIcon: { fontSize: 20, width: 32 },
  infoLabel: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    width: 60,
    textAlign: 'right',
    marginRight: spacing.sm,
  },
  infoValue: {
    flex: 1,
    fontSize: typography.base,
    color: colors.textPrimary,
    textAlign: 'right',
    fontWeight: '500',
  },
  section: { padding: spacing.base },
  sectionTitle: {
    fontSize: typography.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'right',
    marginBottom: spacing.base,
  },
  description: {
    fontSize: typography.base,
    color: colors.textPrimary,
    textAlign: 'right',
    lineHeight: typography.base * 1.8,
  },
});
