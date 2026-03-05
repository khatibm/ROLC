import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../theme';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ message = 'جارٍ التحميل...' }) => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color={colors.primary} />
    <Text style={styles.text}>{message}</Text>
  </View>
);

interface EmptyStateProps {
  icon?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon = '📂', title, subtitle, action }) => (
  <View style={styles.container}>
    <Text style={styles.icon}>{icon}</Text>
    <Text style={styles.title}>{title}</Text>
    {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    {action && <View style={styles.action}>{action}</View>}
  </View>
);

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'حدث خطأ أثناء التحميل',
  onRetry,
}) => (
  <View style={styles.container}>
    <Text style={styles.icon}>⚠️</Text>
    <Text style={styles.title}>{message}</Text>
    {onRetry && (
      <Text style={styles.retry} onPress={onRetry}>
        إعادة المحاولة
      </Text>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing['2xl'],
  },
  icon: { fontSize: 48, marginBottom: spacing.base },
  text: {
    marginTop: spacing.md,
    fontSize: typography.base,
    color: colors.textSecondary,
  },
  title: {
    fontSize: typography.lg,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  action: { marginTop: spacing.base },
  retry: {
    marginTop: spacing.base,
    fontSize: typography.base,
    color: colors.primary,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
