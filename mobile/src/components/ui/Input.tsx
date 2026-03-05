import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { colors, typography, spacing, radius } from '../../theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  containerStyle,
  ...rest
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          focused && styles.focused,
          error ? styles.inputError : null,
        ]}
        placeholderTextColor={colors.grey400}
        textAlign="right"
        writingDirection="rtl"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...rest}
      />
      {error && <Text style={styles.error}>{error}</Text>}
      {hint && !error && <Text style={styles.hint}>{hint}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: spacing.base },
  label: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 6,
    textAlign: 'right',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: typography.base,
    color: colors.textPrimary,
    backgroundColor: colors.white,
    minHeight: 48,
    textAlignVertical: 'top',
  },
  focused: { borderColor: colors.primary, borderWidth: 1.5 },
  inputError: { borderColor: colors.error },
  error: {
    fontSize: typography.xs,
    color: colors.error,
    marginTop: 4,
    textAlign: 'right',
  },
  hint: {
    fontSize: typography.xs,
    color: colors.textHint,
    marginTop: 4,
    textAlign: 'right',
  },
});
