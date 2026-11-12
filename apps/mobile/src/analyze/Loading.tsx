import { ActivityIndicator } from 'react-native';
import { useTheme } from '../theme';
import { AppText } from '../ui/AppText';
import { Card } from '../ui/Card';

/** Shown while the AI reads the input. A request can take a while, so it says what is happening. */
export function Loading({ title, detail }: { title: string; detail?: string }) {
  const t = useTheme();
  return (
    <Card testID="loading" accessibilityLiveRegion="polite" style={{ alignItems: 'center', gap: 14, paddingVertical: 44 }}>
      <ActivityIndicator size="large" color={t.accent} />
      <AppText variant="headline" style={{ textAlign: 'center' }}>{title}</AppText>
      {detail ? <AppText variant="callout" tone="secondary" style={{ textAlign: 'center' }}>{detail}</AppText> : null}
    </Card>
  );
}
