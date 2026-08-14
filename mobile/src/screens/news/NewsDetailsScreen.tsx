import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Share,
  TouchableOpacity,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { NewsStackParamList } from '../../navigation/types';
import { newsApi } from '../../api/news';
import { Tag } from '../../components/ui/Tag';
import { LoadingState, ErrorState } from '../../components/ui/LoadingState';
import { colors, typography, spacing, radius } from '../../theme';

type Props = NativeStackScreenProps<NewsStackParamList, 'NewsDetails'>;

export const NewsDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { id } = route.params;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['news', id],
    queryFn: () => newsApi.getById(id),
  });

  React.useLayoutEffect(() => {
    if (data?.titleAr) {
      navigation.setOptions({ title: data.titleAr.slice(0, 20) + '...' });
    }
  }, [data]);

  const handleShare = async () => {
    if (!data) return;
    await Share.share({
      message: `${data.titleAr}\n\n${data.contentAr?.slice(0, 200)}...\n\n— ديوان تميم`,
      title: data.titleAr,
    });
  };

  if (isLoading) return <LoadingState />;
  if (isError || !data) return <ErrorState onRetry={refetch} />;

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {data.coverImageUrl && (
        <Image source={{ uri: data.coverImageUrl }} style={styles.cover} resizeMode="cover" />
      )}

      <View style={styles.body}>
        <View style={styles.meta}>
          <Tag label={data.category} />
          <Text style={styles.date}>{formatDate(data.publishedAt)}</Text>
        </View>

        <Text style={styles.title}>{data.titleAr}</Text>
        <Text style={styles.articleText}>{data.contentAr}</Text>

        {/* Gallery */}
        {data.galleryJson && data.galleryJson.length > 0 && (
          <View style={styles.gallery}>
            <Text style={styles.galleryTitle}>معرض الصور</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {data.galleryJson.map((url, i) => (
                <Image key={i} source={{ uri: url }} style={styles.galleryImage} resizeMode="cover" />
              ))}
            </ScrollView>
          </View>
        )}

        <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
          <Text style={styles.shareBtnText}>📤 مشاركة الخبر</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 40 },
  cover: { width: '100%', height: 240 },
  body: { padding: spacing.base },
  meta: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  date: { fontSize: typography.sm, color: colors.textHint },
  title: {
    fontSize: typography['2xl'],
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'right',
    lineHeight: typography['2xl'] * 1.4,
    marginBottom: spacing.base,
  },
  articleText: {
    fontSize: typography.base,
    color: colors.textPrimary,
    textAlign: 'right',
    lineHeight: typography.base * 1.8,
  },
  gallery: { marginTop: spacing.xl },
  galleryTitle: {
    fontSize: typography.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'right',
    marginBottom: spacing.base,
  },
  galleryImage: {
    width: 200,
    height: 140,
    borderRadius: radius.md,
    marginLeft: spacing.sm,
  },
  shareBtn: {
    marginTop: spacing.xl,
    padding: spacing.base,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
  },
  shareBtnText: {
    fontSize: typography.base,
    color: colors.primary,
    fontWeight: '600',
  },
});
