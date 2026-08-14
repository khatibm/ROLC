import React from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EventsStackParamList } from '../../navigation/types';
import { eventsApi } from '../../api/events';
import { EventCard } from '../../components/cards/EventCard';
import { LoadingState, EmptyState, ErrorState } from '../../components/ui/LoadingState';
import { colors, typography, spacing, radius } from '../../theme';

type Props = NativeStackScreenProps<EventsStackParamList, 'EventsList'>;

export const EventsListScreen: React.FC<Props> = ({ navigation }) => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['events'],
    queryFn: () => eventsApi.getAll({ limit: 20 } as any),
  });

  return (
    <View style={styles.container}>
      {/* Calendar toggle */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.calendarBtn}
          onPress={() => navigation.navigate('EventsCalendar')}
        >
          <Text style={styles.calendarBtnText}>📆 عرض التقويم</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <FlatList
          data={data?.data || []}
          keyExtractor={(i) => i.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <EmptyState icon="📅" title="لا توجد فعاليات" subtitle="لم يتم إضافة أي فعاليات بعد" />
          }
          renderItem={({ item }) => (
            <EventCard
              item={item}
              onPress={() => navigation.navigate('EventDetails', { id: item.id })}
            />
          )}
          refreshing={isLoading}
          onRefresh={refetch}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    padding: spacing.base,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    alignItems: 'flex-start',
  },
  calendarBtn: {
    backgroundColor: colors.primarySurface,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  calendarBtnText: {
    fontSize: typography.sm,
    color: colors.primary,
    fontWeight: '600',
  },
  list: { padding: spacing.base, paddingBottom: 40 },
});
