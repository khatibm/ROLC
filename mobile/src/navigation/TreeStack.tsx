import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TreeStackParamList } from './types';
import { FamilyTreeScreen } from '../screens/tree/FamilyTreeScreen';
import { TreeSearchScreen } from '../screens/tree/TreeSearchScreen';
import { PersonProfileScreen } from '../screens/tree/PersonProfileScreen';
import { BranchesDirectoryScreen } from '../screens/tree/BranchesDirectoryScreen';
import { colors, typography } from '../theme';

const Stack = createNativeStackNavigator<TreeStackParamList>();

export const TreeStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: colors.primary },
      headerTintColor: colors.white,
      headerTitleStyle: { fontWeight: '700', fontSize: typography.lg },
      headerTitleAlign: 'center',
    }}
  >
    <Stack.Screen name="FamilyTree" component={FamilyTreeScreen} options={{ title: 'شجرة العائلة' }} />
    <Stack.Screen name="TreeSearch" component={TreeSearchScreen} options={{ title: 'بحث في الشجرة' }} />
    <Stack.Screen name="PersonProfile" component={PersonProfileScreen} options={{ title: 'الملف الشخصي' }} />
    <Stack.Screen name="BranchesDirectory" component={BranchesDirectoryScreen} options={{ title: 'دليل الفروع' }} />
  </Stack.Navigator>
);
