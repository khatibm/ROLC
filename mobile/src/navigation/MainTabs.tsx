import React from 'react';
import { Text, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabParamList } from './types';
import { HomeStack } from './HomeStack';
import { NewsStack } from './NewsStack';
import { EventsStack } from './EventsStack';
import { TreeStack } from './TreeStack';
import { MoreStack } from './MoreStack';
import { colors, typography } from '../theme';

const Tab = createBottomTabNavigator<TabParamList>();

const TabIcon = (emoji: string, focused: boolean) => (
  <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.6 }}>{emoji}</Text>
);

export const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.grey500,
      tabBarStyle: {
        backgroundColor: colors.white,
        borderTopColor: colors.border,
        paddingBottom: Platform.OS === 'ios' ? 20 : 6,
        height: Platform.OS === 'ios' ? 84 : 64,
      },
      tabBarLabelStyle: {
        fontSize: typography.xs,
        fontWeight: '600',
        marginBottom: 2,
      },
    }}
  >
    <Tab.Screen
      name="HomeTab"
      component={HomeStack}
      options={{
        title: 'الرئيسية',
        tabBarIcon: ({ focused }) => TabIcon('🏠', focused),
      }}
    />
    <Tab.Screen
      name="TreeTab"
      component={TreeStack}
      options={{
        title: 'شجرة العائلة',
        tabBarIcon: ({ focused }) => TabIcon('🌳', focused),
      }}
    />
    <Tab.Screen
      name="NewsTab"
      component={NewsStack}
      options={{
        title: 'الأخبار',
        tabBarIcon: ({ focused }) => TabIcon('📰', focused),
      }}
    />
    <Tab.Screen
      name="EventsTab"
      component={EventsStack}
      options={{
        title: 'الفعاليات',
        tabBarIcon: ({ focused }) => TabIcon('📅', focused),
      }}
    />
    <Tab.Screen
      name="MoreTab"
      component={MoreStack}
      options={{
        title: 'المزيد',
        tabBarIcon: ({ focused }) => TabIcon('☰', focused),
      }}
    />
  </Tab.Navigator>
);
