/**
 * ديوان تميم — Tamim Diwan Mobile App
 * React Native (TypeScript) — RTL Arabic UI
 */
import React, { useEffect } from 'react';
import { I18nManager, StatusBar, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';
import { colors } from './src/theme';

// Suppress specific warnings in dev
LogBox.ignoreLogs(['Non-serializable values were found in the navigation state']);

// Force RTL layout
if (!I18nManager.isRTL) {
  I18nManager.forceRTL(true);
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar
            barStyle="light-content"
            backgroundColor={colors.primary}
          />
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
