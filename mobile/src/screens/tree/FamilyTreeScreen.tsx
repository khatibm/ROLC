import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TreeStackParamList } from '../../navigation/types';
import { treeApi, TreeNode } from '../../api/tree';
import { PersonCard } from '../../components/cards/PersonCard';
import { LoadingState, ErrorState } from '../../components/ui/LoadingState';
import { colors, typography, spacing, radius } from '../../theme';

type Props = NativeStackScreenProps<TreeStackParamList, 'FamilyTree'>;

// Root person ID for the tree — in production, fetch the root dynamically
const DEFAULT_ROOT = 'p1000000-0000-0000-0000-000000000001';

export const FamilyTreeScreen: React.FC<Props> = ({ route, navigation }) => {
  const rootId = route.params?.rootPersonId || DEFAULT_ROOT;
  const [currentId, setCurrentId] = useState(rootId);

  const { data, isLoading, isError, refetch } = useQuery<TreeNode>({
    queryKey: ['tree-node', currentId],
    queryFn: () => treeApi.getNode(currentId),
  });

  const navigate = (id: string) => setCurrentId(id);

  if (isLoading) return <LoadingState message="جارٍ تحميل الشجرة..." />;
  if (isError || !data) return <ErrorState onRetry={refetch} />;

  const { node, parents, children, spouses } = data;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Toolbar */}
      <View style={styles.toolbar}>
        <TouchableOpacity
          style={styles.toolbarBtn}
          onPress={() => navigation.navigate('TreeSearch')}
        >
          <Text style={styles.toolbarBtnText}>🔍 بحث</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.toolbarBtn}
          onPress={() => navigation.navigate('BranchesDirectory')}
        >
          <Text style={styles.toolbarBtnText}>🌿 الفروع</Text>
        </TouchableOpacity>
      </View>

      {/* Parents row */}
      {parents.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>الأجداد والآباء</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
            {parents.map((p) => (
              <View key={p.id} style={styles.personWrapper}>
                <PersonCard
                  person={p}
                  size="sm"
                  onPress={() => navigate(p.id)}
                />
                <View style={styles.lineDown} />
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Current node */}
      <View style={styles.currentContainer}>
        <View style={styles.currentCard}>
          <Text style={styles.currentEmoji}>{node.gender === 'M' ? '👨' : '👩'}</Text>
          <Text style={styles.currentName}>{node.fullNameAr}</Text>
          {node.branch && <Text style={styles.currentBranch}>{node.branch.nameAr}</Text>}
          {node.city && <Text style={styles.currentMeta}>📍 {node.city}</Text>}
          <TouchableOpacity
            style={styles.profileBtn}
            onPress={() => navigation.navigate('PersonProfile', { id: node.id })}
          >
            <Text style={styles.profileBtnText}>عرض الملف الشخصي</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Spouses row */}
      {spouses.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>الزوجات / الأزواج</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
            {spouses.map((p) => (
              <PersonCard
                key={p.id}
                person={p}
                size="sm"
                onPress={() => navigate(p.id)}
              />
            ))}
          </ScrollView>
        </View>
      )}

      {/* Children */}
      {children.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>الأبناء ({children.length})</Text>
          <View style={styles.lineUp} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
            {children.map((p) => (
              <PersonCard
                key={p.id}
                person={p}
                size="sm"
                onPress={() => navigate(p.id)}
              />
            ))}
          </ScrollView>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 40 },
  toolbar: {
    flexDirection: 'row-reverse',
    padding: spacing.base,
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  toolbarBtn: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primarySurface,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  toolbarBtnText: {
    fontSize: typography.sm,
    color: colors.primary,
    fontWeight: '600',
  },
  section: { paddingHorizontal: spacing.base, marginTop: spacing.md },
  sectionLabel: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    fontWeight: '600',
    textAlign: 'right',
    marginBottom: spacing.sm,
  },
  row: { flexDirection: 'row-reverse', gap: spacing.sm, paddingBottom: spacing.sm },
  personWrapper: { alignItems: 'center' },
  lineDown: { width: 2, height: 20, backgroundColor: colors.primary, marginTop: 4 },
  lineUp: { width: 2, height: 20, backgroundColor: colors.primary, alignSelf: 'center', marginBottom: 4 },
  currentContainer: {
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    marginVertical: spacing.sm,
  },
  currentCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
    minWidth: 200,
  },
  currentEmoji: { fontSize: 48, marginBottom: spacing.sm },
  currentName: {
    fontSize: typography.xl,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  currentBranch: {
    fontSize: typography.sm,
    color: colors.primary,
    marginTop: 4,
    textAlign: 'center',
  },
  currentMeta: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginTop: 4,
  },
  profileBtn: {
    marginTop: spacing.base,
    paddingVertical: 8,
    paddingHorizontal: spacing.base,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
  },
  profileBtnText: {
    color: colors.white,
    fontSize: typography.sm,
    fontWeight: '600',
  },
});
