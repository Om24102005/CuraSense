import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

export type LoaderProps = {
  size?: number;
  /** Defaults to the theme's accent colour. */
  color?: string;
  /** What a screen reader says. Pass null when the loader only decorates words that already say it. */
  label?: string | null;
  style?: StyleProp<ViewStyle>;
};

/** The box every loader draws in. It is one progress indicator for a screen reader, or hidden from it when it is decoration. */
export function Frame({ width, height = width, label = 'Loading', style, children }: { width: number; height?: number; label?: string | null; style?: StyleProp<ViewStyle>; children: ReactNode }) {
  const speak = label !== null;
  return (
    <View
      accessible={speak}
      accessibilityRole={speak ? 'progressbar' : undefined}
      accessibilityLabel={speak ? label : undefined}
      accessibilityState={speak ? { busy: true } : undefined}
      accessibilityElementsHidden={!speak}
      importantForAccessibility={speak ? 'yes' : 'no-hide-descendants'}
      style={[{ width, height, alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }, style]}
    >
      {children}
    </View>
  );
}
