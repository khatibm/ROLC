import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { TreePerson } from '../../api/tree';
import { colors, typography, spacing, radius, shadows } from '../../theme';

interface PersonCardProps {
  person: TreePerson;
  onPress?: () => void;
  size?: 'sm' | 'md';
  showBranch?: string;
}

export const PersonCard: React.FC<PersonCardProps> = ({
  person,
  onPress,
  size = 'md',
  showBranch,
}) => {
  const isMale = person.gender === 'M';
  const avatarBg = isMale ? colors.primarySurface : colors.goldSurface;
  const avatarBorder = isMale ? colors.primary : colors.gold;
  const avatarEmoji = isMale ? '👨' : '👩';

  const content = (
    <View style={[styles.card, size === 'sm' && styles.cardSm]}>
      {person.photoUrl ? (
        <Image source={{ uri: person.photoUrl }} style={[styles.avatar, { borderColor: avatarBorder }]} />
      ) : (
        <View style={[styles.avatar, styles.avatarFallback, { backgroundColor: avatarBg, borderColor: avatarBorder }]}>
          <Text style={styles.avatarEmoji}>{avatarEmoji}</Text>
        </View>
      )}
      <Text style={[styles.name, size === 'sm' && styles.nameSm]} numberOfLines={2}>
        {person.fullNameAr}
      </Text>
      {showBranch && <Text style={styles.branch}>{showBranch}</Text>}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {content}
      </TouchableOpacity>
    );
  }
  return content;
};

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    ...shadows.sm,
    minWidth: 100,
  },
  cardSm: { minWidth: 72, padding: spacing.sm },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    marginBottom: spacing.sm,
  },
  avatarFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: { fontSize: 32 },
  name: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  nameSm: { fontSize: typography.xs },
  branch: {
    fontSize: typography.xs,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
});
