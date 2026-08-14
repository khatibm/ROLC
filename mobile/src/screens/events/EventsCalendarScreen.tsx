import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EventsStackParamList } from '../../navigation/types';
import { eventsApi, EventItem } from '../../api/events';
import { EventCard } from '../../components/cards/EventCard';
import { LoadingState } from '../../components/ui/LoadingState';
import { colors, typography, spacing, radius } from '../../theme';

type Props = NativeStackScreenProps<EventsStackParamList, 'EventsCalendar'>;

const MONTHS_AR = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
];
const DAYS_AR = ['أح', 'إث', 'ث', 'أر', 'خ', 'ج', 'س'];

export const EventsCalendarScreen: React.FC<Props> = ({ navigation }) => {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const fromDate = new Date(year, month, 1).toISOString();
  const toDate = new Date(year, month + 1, 0).toISOString();

  const { data, isLoading } = useQuery({
    queryKey: ['events', 'calendar', year, month],
    queryFn: () => eventsApi.getAll({ from: fromDate, to: toDate, limit: 50 } as any),
  });

  const events = data?.data || [];

  // Build calendar grid
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const eventDays = new Set(
    events.map((e) => new Date(e.startAt).getDate()),
  );

  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const filteredEvents = selectedDay
    ? events.filter((e) => new Date(e.startAt).getDate() === selectedDay)
    : events;

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
    setSelectedDay(null);
  };

  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
    setSelectedDay(null);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Month navigation */}
      <View style={styles.monthNav}>
        <TouchableOpacity onPress={nextMonth} style={styles.navBtn}>
          <Text style={styles.navBtnText}>→</Text>
        </TouchableOpacity>
        <Text style={styles.monthTitle}>{MONTHS_AR[month]} {year}</Text>
        <TouchableOpacity onPress={prevMonth} style={styles.navBtn}>
          <Text style={styles.navBtnText}>←</Text>
        </TouchableOpacity>
      </View>

      {/* Day headers */}
      <View style={styles.dayHeaders}>
        {DAYS_AR.map((d) => (
          <Text key={d} style={styles.dayHeader}>{d}</Text>
        ))}
      </View>

      {/* Calendar grid */}
      <View style={styles.grid}>
        {cells.map((day, i) => (
          <TouchableOpacity
            key={i}
            style={[
              styles.cell,
              day === today.getDate() && month === today.getMonth() && year === today.getFullYear() && styles.today,
              day && eventDays.has(day) && styles.hasEvent,
              day === selectedDay && styles.selected,
            ]}
            onPress={() => day && setSelectedDay(day === selectedDay ? null : day)}
            disabled={!day}
          >
            <Text style={[
              styles.cellText,
              day === selectedDay && styles.selectedText,
              !day && { opacity: 0 },
            ]}>
              {day ?? ''}
            </Text>
            {day && eventDays.has(day) && <View style={styles.eventDot} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Events for selected day / all events */}
      <View style={styles.eventsList}>
        <Text style={styles.eventsListTitle}>
          {selectedDay ? `فعاليات يوم ${selectedDay}` : 'فعاليات الشهر'}
        </Text>
        {isLoading ? (
          <LoadingState />
        ) : (
          filteredEvents.map((item) => (
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

const CELL_SIZE = 44;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  monthNav: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.base,
    backgroundColor: colors.primary,
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBtnText: { fontSize: 18, color: colors.white, fontWeight: '700' },
  monthTitle: {
    fontSize: typography.xl,
    fontWeight: '700',
    color: colors.white,
  },
  dayHeaders: {
    flexDirection: 'row-reverse',
    backgroundColor: colors.primarySurface,
    paddingVertical: spacing.sm,
  },
  dayHeader: {
    flex: 1,
    textAlign: 'center',
    fontSize: typography.xs,
    fontWeight: '600',
    color: colors.primary,
  },
  grid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    backgroundColor: colors.white,
    padding: spacing.sm,
  },
  cell: {
    width: `${100 / 7}%`,
    height: CELL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.full,
    marginVertical: 2,
  },
  today: { backgroundColor: colors.primarySurface },
  hasEvent: { borderWidth: 1, borderColor: colors.gold },
  selected: { backgroundColor: colors.primary },
  cellText: { fontSize: typography.sm, color: colors.textPrimary },
  selectedText: { color: colors.white, fontWeight: '700' },
  eventDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.gold,
    position: 'absolute',
    bottom: 4,
  },
  eventsList: { padding: spacing.base, paddingBottom: 40 },
  eventsListTitle: {
    fontSize: typography.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'right',
    marginBottom: spacing.base,
  },
});
