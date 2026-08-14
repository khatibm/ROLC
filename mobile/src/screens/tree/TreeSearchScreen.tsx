import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TreeStackParamList } from '../../navigation/types';
import { treeApi, TreePerson } from '../../api/tree';
import { LoadingState, EmptyState } from '../../components/ui/LoadingState';
import { colors, typography, spacing, radius } from '../../theme';

type Props = NativeStackScreenProps<TreeStackParamList, 'TreeSearch'>;

const PersonRow = ({
  person,
  onPress,
}: {
  person: TreePerson & { branch?: { nameAr: string } };
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.8}>
    <View style={styles.rowContent}>
      <Text style={styles.name}>{person.fullNameAr}</Text>
      {person.branch && <Text style={styles.branch}>{person.branch.nameAr}</Text>}
    </View>
    <View style={[styles.avatar, { backgroundColor: person.gender === 'M' ? colors.primarySurface : colors.goldSurface }]}>
      <Text style={styles.avatarText}>{person.gender === 'M' ? '👨' : '👩'}</Text>
    </View>
  </TouchableOpacity>
);

export const TreeSearchScreen: React.FC<Props> = ({ navigation }) => {
  const [query, setQuery] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['tree-search', query],
    queryFn: () => treeApi.search({ q: query }),
    enabled: query.length > 0,
  });

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder="ابحث باسم الشخص..."
          placeholderTextColor={colors.grey400}
          value={query}
          onChangeText={setQuery}
          textAlign="right"
          autoFocus
        />
      </View>

      {!query ? (
        <EmptyState icon="🔍" title="ابحث في شجرة العائلة" subtitle="اكتب اسم الشخص للبحث عنه" />
      ) : isLoading ? (
        <LoadingState />
      ) : (
        <FlatList
          data={data || []}
          keyExtractor={(i) => i.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <EmptyState icon="🔍" title="لم يتم العثور على نتائج" subtitle={`لا يوجد شخص بالاسم "${query}"`} />
          }
          renderItem={({ item }) => (
            <PersonRow
              person={item as any}
              onPress={() => navigation.navigate('PersonProfile', { id: item.id })}
            />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  searchBar: {
    padding: spacing.base,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  input: {
    backgroundColor: colors.grey100,
    borderRadius: 10,
    paddingHorizontal: spacing.base,
    paddingVertical: 10,
    fontSize: typography.base,
    color: colors.textPrimary,
  },
  list: { padding: spacing.base },
  row: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.base,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.base,
  },
  avatarText: { fontSize: 24 },
  rowContent: { flex: 1 },
  name: {
    fontSize: typography.base,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'right',
  },
  branch: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    textAlign: 'right',
    marginTop: 2,
  },
});
