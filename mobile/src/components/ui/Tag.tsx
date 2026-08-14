import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, radius } from '../../theme';

interface TagProps {
  label: string;
  active?: boolean;
  onPress?: () => void;
  color?: string;
}

export const Tag: React.FC<TagProps> = ({ label, active = false, onPress, color }) => {
  const content = (
    <View style={[styles.tag, active && styles.active, color ? { backgroundColor: color } : null]}>
      <Text style={[styles.label, active && styles.activeLabel]}>{label}</Text>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }
  return content;
};

const styles = StyleSheet.create({
  tag: {
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: radius.full,
    backgroundColor: colors.grey200,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  active: {
    backgroundColor: colors.primarySurface,
    borderColor: colors.primary,
  },
  label: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  activeLabel: {
    color: colors.primary,
    fontWeight: '700',
  },
});
