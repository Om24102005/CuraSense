import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme';
import { AppText } from './AppText';
import { Card } from './Card';

/** Stand-in for a screen that a later stage builds. */
export function ComingSoon({ icon, title, body }: { icon: keyof typeof Ionicons.glyphMap; title: string; body: string }) {
  const t = useTheme();
  return (
    <Card style={{ alignItems: 'center', gap: 12, padding: 28 }}>
      <Ionicons name={icon} size={36} color={t.accent} />
      <AppText variant="headline" style={{ textAlign: 'center' }}>{title}</AppText>
      <AppText variant="callout" tone="secondary" style={{ textAlign: 'center' }}>{body}</AppText>
    </Card>
  );
}
