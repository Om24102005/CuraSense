import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme';
import { AppText } from './AppText';
import { radius } from './tokens';

type Tone = 'error' | 'success' | 'info';

export function Banner({ tone, children, testID }: { tone: Tone; children: string; testID?: string }) {
  const t = useTheme();
  const color = { error: t.error, success: t.success, info: t.accent }[tone];
  const bg = { error: t.errorBg, success: t.successBg, info: t.card }[tone];
  const icon = { error: 'alert-circle', success: 'checkmark-circle', info: 'information-circle' }[tone] as 'alert-circle';
  return (
    <View
      testID={testID}
      accessibilityRole={tone === 'error' ? 'alert' : undefined}
      accessibilityLiveRegion="polite"
      style={{ flexDirection: 'row', gap: 10, padding: 12, borderRadius: radius.md, backgroundColor: bg, borderWidth: 1, borderColor: color }}
    >
      <Ionicons name={icon} size={20} color={color} />
      <AppText variant="callout" style={{ flex: 1 }}>{children}</AppText>
    </View>
  );
}
