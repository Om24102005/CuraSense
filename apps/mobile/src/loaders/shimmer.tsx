import { createContext, useContext, useState, type ReactNode, memo } from 'react';
import { Animated, View, type DimensionValue, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme';
import { AppText } from '../ui/AppText';
import { EASE, curve, keyed, useLoop, withAlpha } from './motion';

const Shared = createContext<Animated.Value | null>(null);

/** Skeleton blocks inside one group shimmer in step, on one clock. */
export function SkeletonGroup({ children }: { children: ReactNode }) {
  const v = useLoop(1500, EASE.inOut);
  return <Shared.Provider value={v}>{children}</Shared.Provider>;
}

function SweepBase({ w, clock, glow }: { w: number; clock: Animated.Value; glow: string }) {
  return (
    <Animated.View style={{ position: 'absolute', top: 0, bottom: 0, width: w * 0.6, transform: [{ translateX: keyed(clock, [-w * 0.6, w]) }] }}>
      <LinearGradient colors={[withAlpha(glow, 0), glow, withAlpha(glow, 0)]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flex: 1 }} />
    </Animated.View>
  );
}

const Sweep = memo(SweepBase);

function OwnSweep({ w, glow }: { w: number; glow: string }) {
  return <Sweep w={w} glow={glow} clock={useLoop(1500, EASE.inOut)} />;
}

/** 5. A grey block with a band of light sliding across it, standing in for content that has not arrived. */
export function Skeleton({ width = '100%', height = 14, radius = 8, onColor, style }: { width?: DimensionValue; height?: number; radius?: number; /** On a coloured background (a tile), so the block is white-ish. */ onColor?: boolean; style?: StyleProp<ViewStyle> }) {
  const t = useTheme();
  const shared = useContext(Shared);
  const [w, setW] = useState(0);
  const dark = t.name === 'dark';
  const base = onColor ? 'rgba(255,255,255,0.28)' : dark ? 'rgba(255,255,255,0.07)' : 'rgba(10,18,48,0.07)';
  const glow = onColor ? 'rgba(255,255,255,0.55)' : dark ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.85)';
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      onLayout={(e) => setW(e.nativeEvent.layout.width)}
      style={[{ width, height, borderRadius: radius, overflow: 'hidden', backgroundColor: base }, style]}
    >
      {w > 0 ? (shared ? <Sweep w={w} clock={shared} glow={glow} /> : <OwnSweep w={w} glow={glow} />) : null}
    </View>
  );
}

/** 18. Text whose letters brighten one after another, so a band of light seems to cross it. Say what is happening in it. */
function ShimmerTextBase({ text, variant = 'headline', tone = 'primary' }: { text: string; variant?: 'title' | 'headline' | 'body' | 'callout'; tone?: 'primary' | 'secondary' | 'accent' }) {
  const v = useLoop(2000);
  const total = Math.max(1, text.length);
  let index = 0;
  return (
    <View accessible accessibilityRole="header" accessibilityLabel={text} style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', columnGap: 5 }}>
      {text.split(' ').map((word, wi) => (
        <View key={wi} style={{ flexDirection: 'row' }}>
          {word.split('').map((ch, ci) => {
            const i = index++;
            const sheen = curve(v, (u) => { const d = Math.min(u, 1 - u); return 0.38 + 0.62 * Math.exp(-(d * d) / 0.012); }, 20, 1 - (i / total) * 0.6);
            return (
              <Animated.View key={ci} style={{ opacity: sheen }}>
                <AppText variant={variant} tone={tone}>{ch}</AppText>
              </Animated.View>
            );
          })}
        </View>
      ))}
    </View>
  );
}

export const ShimmerText = memo(ShimmerTextBase);
