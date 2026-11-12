import { View, type ViewProps } from 'react-native';
import { useTheme } from '../theme';
import { radius } from './tokens';

export function Card({ style, ...rest }: ViewProps) {
  const t = useTheme();
  return <View style={[{ gap: 6, padding: 16, borderRadius: radius.lg, borderWidth: 1, borderColor: t.border, backgroundColor: t.card }, style]} {...rest} />;
}
