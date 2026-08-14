import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MoreStackParamList } from '../../navigation/types';
import { ticketsApi } from '../../api/tickets';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Tag } from '../../components/ui/Tag';
import { colors, typography, spacing, radius } from '../../theme';

type Props = NativeStackScreenProps<MoreStackParamList, 'Suggestions'>;

const schema = z.object({
  type: z.enum(['SUGGESTION', 'COMPLAINT']),
  title: z.string().min(5, 'العنوان قصير جداً').max(200, 'العنوان طويل جداً'),
  message: z.string().min(20, 'الرسالة قصيرة جداً').max(2000, 'الرسالة طويلة جداً'),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email('بريد إلكتروني غير صحيح').optional().or(z.literal('')),
});

type FormData = z.infer<typeof schema>;

export const SuggestionsScreen: React.FC<Props> = ({ navigation }) => {
  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { type: 'SUGGESTION' },
  });

  const type = watch('type');

  const mutation = useMutation({
    mutationFn: ticketsApi.create,
    onSuccess: (data) => {
      navigation.replace('SubmissionSuccess', { ticketNumber: data.ticketNumber });
    },
    onError: (error: Error) => {
      Alert.alert('خطأ', error.message);
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.heading}>أرسل مقترحاً أو شكوى</Text>
      <Text style={styles.subheading}>رأيك يهمنا — سيتم مراجعة طلبك والرد عليك في أقرب وقت</Text>

      {/* Type selector */}
      <View style={styles.typeSelector}>
        <Tag
          label="اقتراح 💡"
          active={type === 'SUGGESTION'}
          onPress={() => setValue('type', 'SUGGESTION')}
        />
        <Tag
          label="شكوى 📢"
          active={type === 'COMPLAINT'}
          onPress={() => setValue('type', 'COMPLAINT')}
        />
      </View>

      <Controller
        control={control}
        name="title"
        render={({ field: { onChange, value } }) => (
          <Input
            label="العنوان *"
            placeholder="عنوان مختصر ودال..."
            value={value}
            onChangeText={onChange}
            error={errors.title?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="message"
        render={({ field: { onChange, value } }) => (
          <Input
            label="الرسالة *"
            placeholder="اكتب رسالتك هنا..."
            value={value}
            onChangeText={onChange}
            error={errors.message?.message}
            multiline
            numberOfLines={6}
            style={{ minHeight: 120 }}
          />
        )}
      />

      <Text style={styles.optionalLabel}>معلومات التواصل (اختياري)</Text>

      <Controller
        control={control}
        name="contactPhone"
        render={({ field: { onChange, value } }) => (
          <Input
            label="رقم الجوال"
            placeholder="05xxxxxxxx"
            value={value}
            onChangeText={onChange}
            keyboardType="phone-pad"
            error={errors.contactPhone?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="contactEmail"
        render={({ field: { onChange, value } }) => (
          <Input
            label="البريد الإلكتروني"
            placeholder="example@email.com"
            value={value}
            onChangeText={onChange}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.contactEmail?.message}
          />
        )}
      />

      <Button
        label={mutation.isPending ? 'جارٍ الإرسال...' : 'إرسال'}
        onPress={handleSubmit(onSubmit)}
        loading={mutation.isPending}
        variant="primary"
        size="lg"
        fullWidth
        style={{ marginTop: spacing.base }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.base, paddingBottom: 60 },
  heading: {
    fontSize: typography['2xl'],
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'right',
    marginBottom: spacing.sm,
  },
  subheading: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    textAlign: 'right',
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  typeSelector: {
    flexDirection: 'row-reverse',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  optionalLabel: {
    fontSize: typography.base,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'right',
    marginBottom: spacing.base,
    marginTop: spacing.sm,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
});
