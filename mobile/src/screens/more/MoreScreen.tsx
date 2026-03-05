import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Linking,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MoreStackParamList } from '../../navigation/types';
import { colors, typography, spacing, radius } from '../../theme';

type Props = NativeStackScreenProps<MoreStackParamList, 'More'>;

const MenuRow = ({
  icon,
  label,
  onPress,
  right,
}: {
  icon: string;
  label: string;
  onPress?: () => void;
  right?: React.ReactNode;
}) => (
  <TouchableOpacity style={styles.menuRow} onPress={onPress} activeOpacity={onPress ? 0.7 : 1}>
    <View style={styles.menuRowLeft}>{right}</View>
    <Text style={styles.menuLabel}>{label}</Text>
    <Text style={styles.menuIcon}>{icon}</Text>
  </TouchableOpacity>
);

export const MoreScreen: React.FC<Props> = ({ navigation }) => {
  const [notifications, setNotifications] = useState(true);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* App header */}
      <View style={styles.appHeader}>
        <Text style={styles.appIcon}>🌳</Text>
        <Text style={styles.appName}>ديوان تميم</Text>
        <Text style={styles.appVersion}>الإصدار 1.0.0</Text>
      </View>

      {/* Suggestions & Complaints */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>التواصل</Text>
        <MenuRow
          icon="💡"
          label="المقترحات والشكاوى"
          onPress={() => navigation.navigate('Suggestions')}
        />
      </View>

      {/* Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>الإعدادات</Text>
        <MenuRow
          icon="🔔"
          label="الإشعارات"
          right={
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ true: colors.primary }}
            />
          }
        />
      </View>

      {/* Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>معلومات</Text>
        <MenuRow
          icon="ℹ️"
          label="عن التطبيق"
          onPress={() =>
            Alert.alert(
              'ديوان تميم',
              'تطبيق توثيق وتواصل لأبناء قبيلة تميم الكريمة.\nالإصدار 1.0.0',
            )
          }
        />
        <MenuRow
          icon="🔒"
          label="سياسة الخصوصية"
          onPress={() => Alert.alert('سياسة الخصوصية', 'جميع البيانات محمية ولا تُشارك مع أي طرف ثالث.')}
        />
        <MenuRow
          icon="📤"
          label="شارك التطبيق"
          onPress={() =>
            Linking.openURL('https://play.google.com/store')
          }
        />
      </View>

      <Text style={styles.footer}>جميع الحقوق محفوظة لقبيلة تميم © 2025</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 40 },
  appHeader: {
    backgroundColor: colors.primary,
    padding: spacing['2xl'],
    alignItems: 'center',
  },
  appIcon: { fontSize: 52, marginBottom: spacing.sm },
  appName: {
    fontSize: typography['2xl'],
    fontWeight: '800',
    color: colors.white,
    textAlign: 'center',
  },
  appVersion: {
    fontSize: typography.sm,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
  },
  section: { margin: spacing.base, marginBottom: 0 },
  sectionTitle: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colors.textHint,
    textAlign: 'right',
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  menuRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey100,
  },
  menuIcon: { fontSize: 22, width: 36 },
  menuLabel: {
    flex: 1,
    fontSize: typography.base,
    color: colors.textPrimary,
    textAlign: 'right',
    marginRight: spacing.sm,
    fontWeight: '500',
  },
  menuRowLeft: { minWidth: 60, alignItems: 'flex-end' },
  footer: {
    textAlign: 'center',
    fontSize: typography.xs,
    color: colors.textHint,
    marginTop: spacing['2xl'],
    marginBottom: spacing.base,
  },
});
