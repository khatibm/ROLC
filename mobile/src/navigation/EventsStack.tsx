import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { EventsStackParamList } from './types';
import { EventsListScreen } from '../screens/events/EventsListScreen';
import { EventsCalendarScreen } from '../screens/events/EventsCalendarScreen';
import { EventDetailsScreen } from '../screens/events/EventDetailsScreen';
import { colors, typography } from '../theme';

const Stack = createNativeStackNavigator<EventsStackParamList>();

export const EventsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: colors.primary },
      headerTintColor: colors.white,
      headerTitleStyle: { fontWeight: '700', fontSize: typography.lg },
      headerTitleAlign: 'center',
    }}
  >
    <Stack.Screen name="EventsList" component={EventsListScreen} options={{ title: 'الفعاليات' }} />
    <Stack.Screen name="EventsCalendar" component={EventsCalendarScreen} options={{ title: 'تقويم الفعاليات' }} />
    <Stack.Screen name="EventDetails" component={EventDetailsScreen} options={{ title: 'تفاصيل الفعالية' }} />
  </Stack.Navigator>
);
