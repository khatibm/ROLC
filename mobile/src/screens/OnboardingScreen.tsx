import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../navigation/types';
import { Button } from '../components/ui/Button';
import { colors, typography, spacing, radius } from '../theme';

const { width } = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const slides = [
  {
    id: '1',
    emoji: '🌳',
    title: 'شجرة العائلة',
    subtitle: 'استكشف شجرة نسب قبيلة تميم التفاعلية\nوتعرّف على أجدادك وأقاربك',
    bg: colors.primary,
  },
  {
    id: '2',
    emoji: '📰',
    title: 'أخبار وفعاليات',
    subtitle: 'تابع آخر أخبار القبيلة والفعاليات القادمة\nوابقَ على تواصل مع أبناء عمومتك',
    bg: colors.gold,
  },
];

export const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const [current, setCurrent] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const finish = async () => {
    await AsyncStorage.setItem('onboarding_complete', 'true');
    navigation.replace('Main');
  };

  const next = () => {
    if (current < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: current + 1 });
      setCurrent(current + 1);
    } else {
      finish();
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrent(idx);
        }}
        renderItem={({ item }) => (
          <View style={[styles.slide, { backgroundColor: item.bg, width }]}>
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>
        )}
        keyExtractor={(i) => i.id}
      />

      <View style={styles.footer}>
        <View style={styles.dots}>
          {slides.map((_, i) => (
            <View key={i} style={[styles.dot, i === current && styles.dotActive]} />
          ))}
        </View>

        <Button
          label={current === slides.length - 1 ? 'ابدأ الآن' : 'التالي'}
          onPress={next}
          variant="gold"
          size="lg"
          fullWidth
        />

        <TouchableOpacity onPress={finish} style={styles.skip}>
          <Text style={styles.skipText}>تخطّي</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing['2xl'],
  },
  emoji: { fontSize: 100, marginBottom: spacing['2xl'] },
  title: {
    fontSize: typography['3xl'],
    fontWeight: '800',
    color: colors.white,
    textAlign: 'center',
    marginBottom: spacing.base,
  },
  subtitle: {
    fontSize: typography.base,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: 26,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing['2xl'],
    backgroundColor: 'transparent',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginHorizontal: 4,
  },
  dotActive: { backgroundColor: colors.white, width: 24 },
  skip: { alignItems: 'center', marginTop: spacing.base },
  skipText: { color: 'rgba(255,255,255,0.7)', fontSize: typography.base },
});
