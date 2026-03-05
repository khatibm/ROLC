import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NewsStackParamList } from './types';
import { NewsListScreen } from '../screens/news/NewsListScreen';
import { NewsDetailsScreen } from '../screens/news/NewsDetailsScreen';
import { colors, typography } from '../theme';

const Stack = createNativeStackNavigator<NewsStackParamList>();

export const NewsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: colors.primary },
      headerTintColor: colors.white,
      headerTitleStyle: { fontWeight: '700', fontSize: typography.lg },
      headerTitleAlign: 'center',
    }}
  >
    <Stack.Screen name="NewsList" component={NewsListScreen} options={{ title: 'أخبار القبيلة' }} />
    <Stack.Screen name="NewsDetails" component={NewsDetailsScreen} options={{ title: 'تفاصيل الخبر' }} />
  </Stack.Navigator>
);
