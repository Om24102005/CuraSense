import { StyleSheet, Text, type TextProps, type TextStyle } from 'react-native';
import { useSettings } from '../settings/SettingsContext';
import { useTheme } from '../theme';

const variants = {
  title: { fontSize: 24, fontWeight: '700' },
  headline: { fontSize: 17, fontWeight: '600' },
  body: { fontSize: 17, lineHeight: 24 },
  callout: { fontSize: 15, lineHeight: 21 },
  caption: { fontSize: 13, lineHeight: 18 },
} as const;

type Tone = 'primary' | 'secondary' | 'muted' | 'error' | 'success' | 'accent';
interface Props extends TextProps {
  variant?: keyof typeof variants;
  tone?: Tone;
  /** Clinical text (AI answers, lab values): grows 20% when "Large clinical text" is on. */
  dense?: boolean;
}

/** Text that follows the phone's text-size setting (up to 200%, so layouts survive the largest sizes). */
export function AppText({ variant = 'body', tone = 'primary', dense, style, ...rest }: Props) {
  const t = useTheme();
  const { values } = useSettings();
  const color = { primary: t.text, secondary: t.textSecondary, muted: t.textMuted, error: t.error, success: t.success, accent: t.accent }[tone];
  const flat: TextStyle = (StyleSheet.flatten([variants[variant], { color }, style]) as TextStyle | undefined) ?? {};
  const grown = dense && values.largeText
    ? { ...flat, fontSize: (flat.fontSize ?? 17) * 1.2, ...(flat.lineHeight ? { lineHeight: flat.lineHeight * 1.2 } : {}) }
    : flat;
  return <Text maxFontSizeMultiplier={2} style={grown} {...rest} />;
}
