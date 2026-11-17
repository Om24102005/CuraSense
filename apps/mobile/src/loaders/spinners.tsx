import { memo } from 'react';
import { Animated, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme';
import { Frame, type LoaderProps } from './frame';
import { along, curve, deg, useLoop, withAlpha } from './motion';

/** 1. A ring with a bright arc that turns. */
function SpinnerArcBase({ size = 40, color, label, style }: LoaderProps) {
  const t = useTheme();
  const c = color ?? t.accent;
  const v = useLoop(850);
  const w = Math.max(2, Math.round(size / 9));
  const ring = { position: 'absolute', width: size, height: size, borderRadius: size / 2, borderWidth: w } as const;
  return (
    <Frame width={size} label={label} style={style}>
      <View style={[ring, { borderColor: withAlpha(c, 0.18) }]} />
      <Animated.View style={[ring, { borderColor: 'transparent', borderTopColor: c, borderRightColor: withAlpha(c, 0.45), transform: [{ rotate: deg(v, 0, 360) }] }]} />
    </Frame>
  );
}

/** 15. Twelve spokes; a bright one moves round and leaves a fading tail, like the iOS spinner. */
function SpokeSpinnerBase({ size = 40, color, label, style }: LoaderProps) {
  const t = useTheme();
  const c = color ?? t.accent;
  const v = useLoop(1000);
  const w = Math.max(2, size / 12);
  return (
    <Frame width={size} label={label} style={style}>
      {Array.from({ length: 12 }, (_, i) => (
        <View key={i} style={{ position: 'absolute', width: size, height: size, alignItems: 'center', transform: [{ rotate: `${i * 30}deg` }] }}>
          <Animated.View style={{ width: w, height: size * 0.27, borderRadius: w / 2, backgroundColor: c, opacity: curve(v, along([1, 0.15, 0.15], [0, 0.75, 1]), 48, 1 - i / 12) }} />
        </View>
      ))}
    </Frame>
  );
}

/** 13. A ring that fades from nothing to full colour as it turns. The hole is painted in the colour behind it (the card by default). */
function GradientRingBase({ size = 48, color, holeColor, label, style }: LoaderProps & { holeColor?: string }) {
  const t = useTheme();
  const c = color ?? t.accent;
  const v = useLoop(1100);
  const w = Math.max(3, Math.round(size / 8));
  const hole = size - 2 * w;
  return (
    <Frame width={size} label={label} style={style}>
      <View style={{ width: size, height: size, borderRadius: size / 2, overflow: 'hidden', backgroundColor: withAlpha(c, 0.12) }}>
        <Animated.View style={{ width: size, height: size, transform: [{ rotate: deg(v, 0, 360) }] }}>
          <LinearGradient colors={[withAlpha(c, 0), c]} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={{ flex: 1 }} />
        </Animated.View>
        <View style={{ position: 'absolute', left: w, top: w, width: hole, height: hole, borderRadius: hole / 2, backgroundColor: holeColor ?? t.card }} />
      </View>
    </Frame>
  );
}

/** 6. Three satellites on three orbits, turning at one, two and three whole turns per loop (so it repeats without a jump). */
function OrbitBase({ size = 56, color, label, style }: LoaderProps) {
  const t = useTheme();
  const c = color ?? t.accent;
  const v = useLoop(2600);
  const rings = [{ k: 1, turns: 1, dot: 0.13 }, { k: 0.68, turns: -2, dot: 0.1 }, { k: 0.38, turns: 3, dot: 0.08 }];
  return (
    <Frame width={size} label={label} style={style}>
      <View style={{ position: 'absolute', width: size * 0.16, height: size * 0.16, borderRadius: size, backgroundColor: c }} />
      {rings.map(({ k, turns, dot }) => {
        const d = size * k;
        const r = size * dot;
        return (
          <Animated.View key={k} style={{ position: 'absolute', width: d, height: d, borderRadius: d / 2, borderWidth: 1, borderColor: withAlpha(c, 0.2), transform: [{ rotate: deg(v, 0, 360 * turns) }] }}>
            <View style={{ position: 'absolute', top: -r / 2 - 0.5, left: d / 2 - r / 2 - 0.5, width: r, height: r, borderRadius: r / 2, backgroundColor: c }} />
          </Animated.View>
        );
      })}
    </Frame>
  );
}

/** 3. Rings that spread from a point and fade, one after another, like a sonar. */
function PulseRingsBase({ size = 64, color, label, style }: LoaderProps) {
  const t = useTheme();
  const c = color ?? t.accent;
  const v = useLoop(2100);
  return (
    <Frame width={size} label={label} style={style}>
      {[0, 1 / 3, 2 / 3].map((p) => (
        <Animated.View
          key={p}
          style={{ position: 'absolute', width: size, height: size, borderRadius: size / 2, borderWidth: 2, borderColor: c, opacity: curve(v, along([0, 0.7, 0], [0, 0.12, 1]), 48, p), transform: [{ scale: curve(v, along([0.2, 1]), 48, p) }] }}
        />
      ))}
      <View style={{ width: size * 0.16, height: size * 0.16, borderRadius: size, backgroundColor: c }} />
    </Frame>
  );
}

export const SpinnerArc = memo(SpinnerArcBase);
export const SpokeSpinner = memo(SpokeSpinnerBase);
export const GradientRing = memo(GradientRingBase);
export const Orbit = memo(OrbitBase);
export const PulseRings = memo(PulseRingsBase);
