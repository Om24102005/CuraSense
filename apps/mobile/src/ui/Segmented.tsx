import { Pressable, View } from 'react-native';
import { useTheme } from '../theme';
import { AppText } from './AppText';
import { MIN_TOUCH, radius } from './tokens';

/** Two or three choices side by side, one selected (iOS-style segmented control). */
export function Segmented<T extends string>({ options, value, onChange }: { options: { value: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  const t = useTheme();
  return (
    <View accessibilityRole="tablist" style={{ flexDirection: 'row', padding: 3, borderRadius: radius.md, backgroundColor: t.surface, borderWidth: 1, borderColor: t.border }}>
      {options.map((o) => {
        const selected = o.value === value;
        return (
          <Pressable
            key={o.value}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            testID={`segment-${o.value}`}
            onPress={() => onChange(o.value)}
            style={{ flex: 1, minHeight: MIN_TOUCH - 6, alignItems: 'center', justifyContent: 'center', borderRadius: radius.md - 3, backgroundColor: selected ? t.primary : 'transparent' }}
          >
            <AppText variant="callout" style={{ fontWeight: '700', color: selected ? t.onPrimary : t.textSecondary }}>{o.label}</AppText>
          </Pressable>
        );
      })}
    </View>
  );
}
