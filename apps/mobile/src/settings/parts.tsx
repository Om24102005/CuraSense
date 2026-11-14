import type { ReactNode } from 'react';
import { Pressable, Switch, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme';
import { AppText } from '../ui/AppText';
import { Banner } from '../ui/Banner';
import { Card } from '../ui/Card';
import { Segmented } from '../ui/Segmented';
import { MIN_TOUCH, radius } from '../ui/tokens';
import { useSettings } from './SettingsContext';

/** Said under every control that is saved to the account but that nothing on the server reads yet. */
export const NOT_USED = 'Saved to your account. The AI service does not use this yet, so your answers will not change.';

export function Group({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <View style={{ gap: 8 }}>
      <AppText variant="caption" tone="muted" accessibilityRole="header" style={{ letterSpacing: 1.5, fontWeight: '800', textTransform: 'uppercase' }}>{title}</AppText>
      <Card style={{ gap: 16 }}>{children}</Card>
      {note ? <AppText variant="caption" tone="muted">{note}</AppText> : null}
    </View>
  );
}

export function Choice<T extends string>({ label, hint, options, value, onChange }: { label: string; hint?: string; options: { value: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <View style={{ gap: 8 }}>
      <AppText variant="headline">{label}</AppText>
      <Segmented options={options} value={value} onChange={onChange} />
      {hint ? <AppText variant="caption" tone="muted">{hint}</AppText> : null}
    </View>
  );
}

export function SwitchRow({ label, hint, value, onChange, testID }: { label: string; hint: string; value: boolean; onChange: (v: boolean) => void; testID: string }) {
  const t = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <View style={{ flex: 1, gap: 2 }}>
        <AppText variant="headline">{label}</AppText>
        <AppText variant="caption" tone="muted">{hint}</AppText>
      </View>
      <Switch testID={testID} accessibilityLabel={label} value={value} onValueChange={onChange} trackColor={{ true: t.primary, false: t.border }} thumbColor="#ffffff" ios_backgroundColor={t.border} />
    </View>
  );
}

export function NavRow({ label, value, onPress, testID }: { label: string; value: string; onPress: () => void; testID: string }) {
  const t = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label}, ${value}`}
      testID={testID}
      onPress={onPress}
      style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: MIN_TOUCH, opacity: pressed ? 0.7 : 1 })}
    >
      <AppText variant="headline" style={{ flex: 1 }}>{label}</AppText>
      <AppText tone="secondary" numberOfLines={1} style={{ flexShrink: 1 }}>{value}</AppText>
      <Ionicons name="chevron-forward" size={18} color={t.textMuted} />
    </Pressable>
  );
}

/** The result of the last save, floating above the tab bar so it is seen wherever on the screen the control was. */
export function SaveToast() {
  const t = useTheme();
  const { notice } = useSettings();
  if (!notice) return null;
  return (
    <View style={{ position: 'absolute', left: 16, right: 16, bottom: 12, pointerEvents: 'none' }}>
      <View style={{ borderRadius: radius.md, backgroundColor: t.bg }}>
        <Banner tone={notice.kind} testID="save-notice">{notice.message}</Banner>
      </View>
    </View>
  );
}
