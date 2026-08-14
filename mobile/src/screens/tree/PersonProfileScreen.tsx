import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TreeStackParamList } from '../../navigation/types';
import { treeApi } from '../../api/tree';
import { LoadingState, ErrorState } from '../../components/ui/LoadingState';
import { Tag } from '../../components/ui/Tag';
import { colors, typography, spacing, radius, shadows } from '../../theme';

type Props = NativeStackScreenProps<TreeStackParamList, 'PersonProfile'>;

const RelativeRow = ({
  name,
  gender,
  role,
  onPress,
}: {
  name: string;
  gender: string;
  role: string;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.relativeRow} onPress={onPress}>
    <Text style={styles.relativeName}>{name}</Text>
    <Tag label={role} />
    <Text style={styles.relativeEmoji}>{gender === 'M' ? '👨' : '👩'}</Text>
  </TouchableOpacity>
);

export const PersonProfileScreen: React.FC<Props> = ({ route, navigation }) => {
  const { id } = route.params;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['tree-node-profile', id],
    queryFn: () => treeApi.getNode(id),
  });

  if (isLoading) return <LoadingState />;
  if (isError || !data) return <ErrorState onRetry={refetch} />;

  const { node, parents, children, spouses } = data;

  const formatDate = (d?: string) =>
    d ? new Date(d).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' }) : null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile header */}
      <View style={styles.header}>
        {node.photoUrl ? (
          <Image source={{ uri: node.photoUrl }} style={styles.photo} />
        ) : (
          <View style={[styles.photo, styles.photoFallback]}>
            <Text style={styles.photoEmoji}>{node.gender === 'M' ? '👨' : '👩'}</Text>
          </View>
        )}
        <Text style={styles.name}>{node.fullNameAr}</Text>
        {node.branch && (
          <View style={styles.branchBadge}>
            <Text style={styles.branchText}>{node.branch.nameAr}</Text>
          </View>
        )}
        {node.city && <Text style={styles.meta}>📍 {node.city}</Text>}

        {/* View in tree button */}
        <TouchableOpacity
          style={styles.treeBtn}
          onPress={() => navigation.navigate('FamilyTree', { rootPersonId: node.id })}
        >
          <Text style={styles.treeBtnText}>🌳 عرض في شجرة العائلة</Text>
        </TouchableOpacity>
      </View>

      {/* Bio section */}
      {(node.bio || node.birthDate || node.deathDate) && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>معلومات شخصية</Text>
          {node.birthDate && (
            <View style={styles.infoRow}>
              <Text style={styles.infoValue}>{formatDate(node.birthDate)}</Text>
              <Text style={styles.infoLabel}>تاريخ الميلاد</Text>
              <Text style={styles.infoIcon}>🎂</Text>
            </View>
          )}
          {node.deathDate && (
            <View style={styles.infoRow}>
              <Text style={styles.infoValue}>{formatDate(node.deathDate)}</Text>
              <Text style={styles.infoLabel}>تاريخ الوفاة</Text>
              <Text style={styles.infoIcon}>🕊️</Text>
            </View>
          )}
          {node.bio && <Text style={styles.bio}>{node.bio}</Text>}
        </View>
      )}

      {/* Family Relations */}
      {parents.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>الأب / الأم</Text>
          {parents.map((p) => (
            <RelativeRow
              key={p.id}
              name={p.fullNameAr}
              gender={p.gender}
              role={p.gender === 'M' ? 'أب' : 'أم'}
              onPress={() => navigation.replace('PersonProfile', { id: p.id })}
            />
          ))}
        </View>
      )}

      {spouses.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>الزوجة / الزوج</Text>
          {spouses.map((p) => (
            <RelativeRow
              key={p.id}
              name={p.fullNameAr}
              gender={p.gender}
              role={p.gender === 'M' ? 'زوج' : 'زوجة'}
              onPress={() => navigation.replace('PersonProfile', { id: p.id })}
            />
          ))}
        </View>
      )}

      {children.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>الأبناء ({children.length})</Text>
          {children.map((p) => (
            <RelativeRow
              key={p.id}
              name={p.fullNameAr}
              gender={p.gender}
              role={p.gender === 'M' ? 'ابن' : 'ابنة'}
              onPress={() => navigation.replace('PersonProfile', { id: p.id })}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 40 },
  header: {
    backgroundColor: colors.primary,
    padding: spacing['2xl'],
    alignItems: 'center',
    paddingBottom: spacing['3xl'],
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: colors.gold,
    marginBottom: spacing.base,
  },
  photoFallback: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoEmoji: { fontSize: 48 },
  name: {
    fontSize: typography['2xl'],
    fontWeight: '800',
    color: colors.white,
    textAlign: 'center',
  },
  branchBadge: {
    marginTop: spacing.sm,
    backgroundColor: colors.gold,
    paddingHorizontal: spacing.base,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  branchText: { fontSize: typography.sm, color: colors.white, fontWeight: '600' },
  meta: { color: 'rgba(255,255,255,0.8)', fontSize: typography.sm, marginTop: 4 },
  treeBtn: {
    marginTop: spacing.base,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  treeBtnText: { color: colors.white, fontSize: typography.sm, fontWeight: '600' },
  card: {
    margin: spacing.base,
    marginBottom: 0,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.base,
    ...shadows.sm,
  },
  cardTitle: {
    fontSize: typography.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'right',
    marginBottom: spacing.base,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey100,
  },
  infoRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  infoIcon: { fontSize: 18, width: 28 },
  infoLabel: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    width: 90,
    textAlign: 'right',
    marginRight: spacing.sm,
  },
  infoValue: {
    flex: 1,
    fontSize: typography.base,
    color: colors.textPrimary,
    textAlign: 'right',
  },
  bio: {
    fontSize: typography.base,
    color: colors.textPrimary,
    textAlign: 'right',
    lineHeight: typography.base * 1.7,
    marginTop: spacing.sm,
  },
  relativeRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey100,
    gap: spacing.sm,
  },
  relativeEmoji: { fontSize: 22, width: 32 },
  relativeName: {
    flex: 1,
    fontSize: typography.base,
    color: colors.textPrimary,
    textAlign: 'right',
    fontWeight: '600',
  },
});
