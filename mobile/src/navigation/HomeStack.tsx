import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeStackParamList } from './types';
import { HomeScreen } from '../screens/home/HomeScreen';
import { NewsDetailsScreen } from '../screens/news/NewsDetailsScreen';
import { EventDetailsScreen } from '../screens/events/EventDetailsScreen';
import { colors, typography } from '../theme';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export const HomeStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: colors.primary },
      headerTintColor: colors.white,
      headerTitleStyle: { fontWeight: '700', fontSize: typography.lg },
      headerTitleAlign: 'center',
    }}
  >
    <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'ديوان تميم' }} />
    <Stack.Screen name="NewsDetails" component={NewsDetailsScreen} options={{ title: 'تفاصيل الخبر' }} />
    <Stack.Screen name="EventDetails" component={EventDetailsScreen} options={{ title: 'تفاصيل الفعالية' }} />
  </Stack.Navigator>
);
