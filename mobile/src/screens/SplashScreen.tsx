import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../navigation/types';
import { colors, typography, spacing } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const scaleAnim = React.useRef(new Animated.Value(0.6)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 60 }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(async () => {
      const onboardingDone = await AsyncStorage.getItem('onboarding_complete');
      navigation.replace(onboardingDone ? 'Main' : 'Onboarding');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, { transform: [{ scale: scaleAnim }], opacity: opacityAnim }]}>
        <Text style={styles.logoEmoji}>🌳</Text>
        <Text style={styles.appName}>ديوان تميم</Text>
        <Text style={styles.tagline}>موروث الأجداد — همّة الأبناء</Text>
      </Animated.View>
      <Text style={styles.version}>الإصدار 1.0.0</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: { alignItems: 'center' },
  logoEmoji: { fontSize: 80, marginBottom: spacing.base },
  appName: {
    fontSize: 42,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: 2,
    textAlign: 'center',
  },
  tagline: {
    fontSize: typography.base,
    color: colors.goldLight,
    marginTop: spacing.md,
    textAlign: 'center',
    letterSpacing: 1,
  },
  version: {
    position: 'absolute',
    bottom: 40,
    fontSize: typography.xs,
    color: 'rgba(255,255,255,0.5)',
  },
});
