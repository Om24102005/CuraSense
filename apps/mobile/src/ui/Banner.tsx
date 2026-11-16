import { useEffect } from 'react';
import { AccessibilityInfo, View } from 'react-native';
import { Ionicons } from './Icon';
import { failure } from '../haptics';
import { useTheme } from '../theme';
import { AppText } from './AppText';
import { radius } from './tokens';

type Tone = 'error' | 'success' | 'info';

/** `quiet` is for a caller that announces the message itself. A plain information banner is part of the screen and is not announced. */
export function Banner({ tone, children, testID, quiet }: { tone: Tone; children: string; testID?: string; quiet?: boolean }) {
  const t = useTheme();
  useEffect(() => {
    if (quiet || tone === 'info') return;
    AccessibilityInfo.announceForAccessibility(children);
    if (tone === 'error') failure();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- once, when the banner appears
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
