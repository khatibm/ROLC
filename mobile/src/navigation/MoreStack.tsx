import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MoreStackParamList } from './types';
import { MoreScreen } from '../screens/more/MoreScreen';
import { SuggestionsScreen } from '../screens/more/SuggestionsScreen';
import { SubmissionSuccessScreen } from '../screens/more/SubmissionSuccessScreen';
import { colors, typography } from '../theme';

const Stack = createNativeStackNavigator<MoreStackParamList>();

export const MoreStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: colors.primary },
      headerTintColor: colors.white,
      headerTitleStyle: { fontWeight: '700', fontSize: typography.lg },
      headerTitleAlign: 'center',
    }}
  >
    <Stack.Screen name="More" component={MoreScreen} options={{ title: 'المزيد' }} />
    <Stack.Screen name="Suggestions" component={SuggestionsScreen} options={{ title: 'المقترحات والشكاوى' }} />
    <Stack.Screen name="SubmissionSuccess" component={SubmissionSuccessScreen} options={{ title: 'تم الإرسال', headerBackVisible: false }} />
  </Stack.Navigator>
);
