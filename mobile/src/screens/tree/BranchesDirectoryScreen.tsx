import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { branchesApi, Branch } from '../../api/branches';
import { LoadingState, ErrorState, EmptyState } from '../../components/ui/LoadingState';
import { colors, typography, spacing, radius } from '../../theme';

const BranchNode = ({ branch, depth = 0 }: { branch: Branch; depth?: number }) => {
  const [expanded, setExpanded] = useState(depth === 0);
  const hasChildren = branch.children && branch.children.length > 0;

  return (
    <View style={[styles.node, { marginRight: depth * 16 }]}>
      <TouchableOpacity
        style={[styles.nodeHeader, depth === 0 && styles.rootNode]}
        onPress={() => hasChildren && setExpanded(!expanded)}
        activeOpacity={hasChildren ? 0.7 : 1}
      >
        {hasChildren && (
          <Text style={styles.toggle}>{expanded ? '▼' : '◀'}</Text>
        )}
        <Text style={[styles.nodeName, depth === 0 && styles.rootName]}>
          {branch.nameAr}
        </Text>
        <Text style={styles.nodeEmoji}>{depth === 0 ? '🌳' : hasChildren ? '🌿' : '🍃'}</Text>
      </TouchableOpacity>

      {expanded && hasChildren && (
        <View style={styles.children}>
          {branch.children!.map((child) => (
            <BranchNode key={child.id} branch={child} depth={depth + 1} />
          ))}
        </View>
      )}
    </View>
  );
};

export const BranchesDirectoryScreen = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['branches'],
    queryFn: () => branchesApi.getTree(),
  });

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState onRetry={refetch} />;
  if (!data || data.length === 0) return <EmptyState icon="🌿" title="لا توجد فروع مضافة" />;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>دليل فروع قبيلة تميم</Text>
      {data.map((branch) => (
        <BranchNode key={branch.id} branch={branch} depth={0} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.base, paddingBottom: 40 },
  title: {
    fontSize: typography.xl,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'right',
    marginBottom: spacing.xl,
  },
  node: { marginBottom: spacing.sm },
  nodeHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.base,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  rootNode: {
    backgroundColor: colors.primarySurface,
    borderColor: colors.primary,
  },
  nodeEmoji: { fontSize: 20 },
  nodeName: {
    flex: 1,
    fontSize: typography.base,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'right',
  },
  rootName: {
    fontSize: typography.lg,
    fontWeight: '700',
    color: colors.primary,
  },
  toggle: {
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
  children: { paddingRight: spacing.base, marginTop: spacing.xs },
});
