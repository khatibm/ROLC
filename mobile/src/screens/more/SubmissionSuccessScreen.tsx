import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MoreStackParamList } from '../../navigation/types';
import { Button } from '../../components/ui/Button';
import { colors, typography, spacing, radius } from '../../theme';

type Props = NativeStackScreenProps<MoreStackParamList, 'SubmissionSuccess'>;

export const SubmissionSuccessScreen: React.FC<Props> = ({ route, navigation }) => {
  const { ticketNumber } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.checkmark}>✅</Text>
        <Text style={styles.title}>تم الإرسال بنجاح!</Text>
        <Text style={styles.subtitle}>
          شكراً لتواصلك معنا، سيتم مراجعة طلبك والرد عليك في أقرب وقت ممكن.
        </Text>

        <View style={styles.ticketBadge}>
          <Text style={styles.ticketLabel}>رقم تذكرتك</Text>
          <Text style={styles.ticketNumber}>{ticketNumber}</Text>
          <Text style={styles.ticketHint}>احتفظ بهذا الرقم للمتابعة</Text>
        </View>

        <Button
          label="العودة للرئيسية"
          onPress={() => navigation.navigate('More')}
          variant="primary"
          size="lg"
          fullWidth
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing['2xl'],
    alignItems: 'center',
    width: '100%',
  },
  checkmark: { fontSize: 72, marginBottom: spacing.base },
  title: {
    fontSize: typography['2xl'],
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.base,
  },
  subtitle: {
    fontSize: typography.base,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  ticketBadge: {
    backgroundColor: colors.primarySurface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    width: '100%',
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  ticketLabel: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  ticketNumber: {
    fontSize: typography['2xl'],
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 1,
  },
  ticketHint: {
    fontSize: typography.xs,
    color: colors.textHint,
    marginTop: spacing.sm,
  },
});
