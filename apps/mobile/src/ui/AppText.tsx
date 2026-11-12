import { Text, type TextProps } from 'react-native';
import { useTheme } from '../theme';

const variants = {
  title: { fontSize: 24, fontWeight: '700' },
  headline: { fontSize: 17, fontWeight: '600' },
  body: { fontSize: 17, lineHeight: 24 },
  callout: { fontSize: 15, lineHeight: 21 },
  caption: { fontSize: 13, lineHeight: 18 },
} as const;

type Tone = 'primary' | 'secondary' | 'muted' | 'error' | 'success' | 'accent';
interface Props extends TextProps { variant?: keyof typeof variants; tone?: Tone }

/** Text that follows the phone's text-size setting (capped so layouts survive the largest sizes). */
export function AppText({ variant = 'body', tone = 'primary', style, ...rest }: Props) {
  const t = useTheme();
  const color = { primary: t.text, secondary: t.textSecondary, muted: t.textMuted, error: t.error, success: t.success, accent: t.accent }[tone];
  return <Text maxFontSizeMultiplier={1.5} style={[variants[variant], { color }, style]} {...rest} />;
}
