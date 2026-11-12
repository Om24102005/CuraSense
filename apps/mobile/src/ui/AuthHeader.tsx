import { Image, View } from 'react-native';
import { AppText } from './AppText';

export function AuthHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={{ alignItems: 'center', gap: 12, paddingTop: 16, paddingBottom: 4 }}>
      <Image source={require('../../assets/icon.png')} style={{ width: 72, height: 72, borderRadius: 18 }} accessibilityIgnoresInvertColors />
      <AppText variant="title" accessibilityRole="header" style={{ textAlign: 'center' }}>{title}</AppText>
      {subtitle ? <AppText variant="callout" tone="secondary" style={{ textAlign: 'center' }}>{subtitle}</AppText> : null}
    </View>
  );
}
