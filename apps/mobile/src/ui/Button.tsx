import { ActivityIndicator, Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';
import { AppText } from './AppText';
import { MIN_TOUCH, radius } from './tokens';

type Variant = 'primary' | 'secondary' | 'danger' | 'emergency' | 'link';
interface Props extends Omit<PressableProps, 'children' | 'style'> {
  title: string;
  variant?: Variant;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Button({ title, variant = 'primary', loading = false, disabled, style, ...rest }: Props) {
  const t = useTheme();
  const off = !!disabled || loading;
  const solid = variant !== 'link';
  const bg = { primary: t.primary, secondary: t.card, danger: t.errorBg, emergency: '#dc2626', link: 'transparent' }[variant];
  const fg = { primary: t.onPrimary, secondary: t.text, danger: t.error, emergency: '#ffffff', link: t.accent }[variant];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: off, busy: loading }}
      disabled={off}
      style={({ pressed }) => [
        {
          minHeight: solid ? 52 : MIN_TOUCH, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20, paddingVertical: 10,
          backgroundColor: bg, borderWidth: variant === 'secondary' ? 1 : 0, borderColor: t.border,
          opacity: off ? 0.55 : pressed ? 0.82 : 1, transform: [{ scale: pressed && solid ? 0.985 : 1 }],
        },
        style,
      ]}
      {...rest}
    >
      {loading ? <ActivityIndicator color={fg} /> : <AppText variant="headline" style={{ color: fg }}>{title}</AppText>}
    </Pressable>
  );
}
