import React, { useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TextInput,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { NewsStackParamList } from '../../navigation/types';
import { newsApi } from '../../api/news';
import { NewsCard } from '../../components/cards/NewsCard';
import { Tag } from '../../components/ui/Tag';
import { LoadingState, EmptyState, ErrorState } from '../../components/ui/LoadingState';
import { colors, typography, spacing } from '../../theme';
import { ScrollView } from 'react-native';

type Props = NativeStackScreenProps<NewsStackParamList, 'NewsList'>;

const CATEGORIES = ['الكل', 'أخبار', 'مبادرات', 'تعليم', 'اجتماعي', 'رياضة'];

export const NewsListScreen: React.FC<Props> = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['news', 'list', search, category],
    queryFn: () => newsApi.getAll({ q: search || undefined, category: category || undefined, limit: 20 }),
  });

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="ابحث في الأخبار..."
          placeholderTextColor={colors.grey400}
          value={search}
          onChangeText={setSearch}
          textAlign="right"
        />
      </View>

      {/* Category filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categories}
        style={styles.categoriesRow}
      >
        {CATEGORIES.map((cat) => (
          <Tag
            key={cat}
            label={cat}
            active={category === (cat === 'الكل' ? '' : cat)}
            onPress={() => setCategory(cat === 'الكل' ? '' : cat)}
          />
        ))}
      </ScrollView>

      {/* List */}
      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <FlatList
          data={data?.data || []}
          keyExtractor={(i) => i.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<EmptyState icon="📰" title="لا توجد أخبار" subtitle="لم يتم نشر أي أخبار بعد" />}
          renderItem={({ item }) => (
            <NewsCard
              item={item}
              onPress={() => navigation.navigate('NewsDetails', { id: item.id })}
            />
          )}
          refreshing={isLoading}
          onRefresh={refetch}
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
  searchInput: {
    backgroundColor: colors.grey100,
    borderRadius: 10,
    paddingHorizontal: spacing.base,
    paddingVertical: 10,
    fontSize: typography.base,
    color: colors.textPrimary,
  },
  categoriesRow: { backgroundColor: colors.white, maxHeight: 52 },
  categories: {
    flexDirection: 'row-reverse',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  list: { padding: spacing.base, paddingBottom: 40 },
});
