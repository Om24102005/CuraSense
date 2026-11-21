import { useRouter } from 'expo-router';
import { Ionicons } from '../ui/Icon';
import { View } from 'react-native';
import type { Refusal } from '@curasense/shared/analysis';
import { useTheme } from '../theme';
import { AppText } from '../ui/AppText';
import { Button } from '../ui/Button';
import { radius } from '../ui/tokens';
import { MedicalText } from './MedicalText';

const PAGES = { symptoms: 'Symptoms', scans: 'Scans', reports: 'Reports' } as const;

/** Shown when the AI service refuses a text or file because it belongs on another analysis page. */
export function WrongPageNotice({ refusal }: { refusal: Refusal }) {
  const router = useRouter();
  const t = useTheme();
  const page = refusal.redirect?.page ?? null;
  return (
    <View
      accessibilityRole="alert"
      testID="wrong-page"
      style={{ gap: 12, padding: 16, borderRadius: radius.lg, borderWidth: 1, borderColor: '#f59e0b55', backgroundColor: '#f59e0b1f' }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Ionicons name="warning" size={18} color="#f59e0b" />
        <AppText variant="headline">Not analysed</AppText>
      </View>
      <MedicalText text={refusal.message} />
      {page ? <Button title={`Open the ${PAGES[page]} page`} variant="secondary" onPress={() => router.replace(`/analyze/${page}`)} /> : null}
      <AppText variant="caption" tone="muted" style={{ color: t.textMuted }}>Nothing was saved.</AppText>
    </View>
  );
}
