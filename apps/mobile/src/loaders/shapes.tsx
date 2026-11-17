import { memo } from 'react';
import { Animated, View } from 'react-native';
import { useTheme } from '../theme';
import { Frame, type LoaderProps } from './frame';
import { curve, deg, eight, useLoop, withAlpha } from './motion';

/** 8. A rounded square that turns into a circle and back while it turns. */
function SquareMorphBase({ size = 40, color, label, style }: LoaderProps) {
  const t = useTheme();
  const c = color ?? t.accent;
  const v = useLoop(2200);
  const s = size * 0.62;
  const base = { position: 'absolute', width: s, height: s, backgroundColor: c } as const;
  const turn = { rotate: deg(v, 0, 180) };
  const grow = { scale: curve(v, (u) => 0.8 + 0.2 * Math.cos(2 * Math.PI * u)) };
  return (
    <Frame width={size} label={label} style={style}>
      <Animated.View style={[base, { borderRadius: s * 0.14, opacity: curve(v, (u) => 0.5 + 0.5 * Math.cos(2 * Math.PI * u)), transform: [turn, grow] }]} />
      <Animated.View style={[base, { borderRadius: s / 2, opacity: curve(v, (u) => 0.5 - 0.5 * Math.cos(2 * Math.PI * u)), transform: [turn, grow] }]} />
    </Frame>
  );
}

/** 12. A square that flips over one axis, then the other. */
function FlippingSquareBase({ size = 36, color, label, style }: LoaderProps) {
  const t = useTheme();
  const c = color ?? t.accent;
  const v = useLoop(1500);
  const s = size * 0.6;
  return (
    <Frame width={size} label={label} style={style}>
      <Animated.View
        style={{ width: s, height: s, borderRadius: s * 0.14, backgroundColor: c, transform: [{ perspective: 180 }, { rotateX: v.interpolate({ inputRange: [0, 0.5, 1], outputRange: ['0deg', '-180deg', '-180deg'] }) }, { rotateY: v.interpolate({ inputRange: [0, 0.5, 1], outputRange: ['0deg', '0deg', '-180deg'] }) }] }}
      />
    </Frame>
  );
}

/** 11. A dot runs along a figure eight and leaves a fading trail. */
function InfinityTrailBase({ size = 64, color, label, style }: LoaderProps) {
  const t = useTheme();
  const c = color ?? t.accent;
  const v = useLoop(2400);
  const dot = size * 0.13;
  const ax = size / 2 - dot / 2;
  const ay = (size * 0.6) / 2 - dot / 2;
  const trail = 10;
  return (
    <Frame width={size} height={size * 0.6} label={label} style={style}>
      {Array.from({ length: trail }, (_, i) => (
        <Animated.View
          key={i}
          style={{ position: 'absolute', width: dot, height: dot, borderRadius: dot / 2, backgroundColor: c, opacity: 1 - i / (trail + 1), transform: [{ translateX: curve(v, (u) => eight(u)[0] * ax, 48, 1 - i * 0.02) }, { translateY: curve(v, (u) => eight(u)[1] * ay, 48, 1 - i * 0.02) }, { scale: 1 - i * 0.06 }] }}
        />
      ))}
    </Frame>
  );
}

/** 9. A circle that fills with liquid and drains again; the surface sloshes. */
function LiquidFillBase({ size = 64, color, label, style }: LoaderProps) {
  const t = useTheme();
  const c = color ?? t.accent;
  const v = useLoop(4200);
  const wave = (alpha: number, turns: number, lag: number) => (
    <Animated.View
      style={{
        position: 'absolute', left: -size * 0.5, top: 0, width: size * 2, height: size * 2, borderRadius: size * 0.8, backgroundColor: c, opacity: alpha,
        transform: [{ translateY: curve(v, (u) => size * (0.92 - 0.72 * (0.5 - 0.5 * Math.cos(2 * Math.PI * u))), 24, lag) }, { rotate: deg(v, 0, 360 * turns) }],
      }}
    />
  );
  return (
    <Frame width={size} label={label} style={style}>
      <View style={{ width: size, height: size, borderRadius: size / 2, overflow: 'hidden', borderWidth: 2, borderColor: c, backgroundColor: withAlpha(c, 0.08) }}>
        {wave(0.35, -1, 0.06)}
        {wave(0.65, 1, 0)}
      </View>
    </Frame>
  );
}

export const SquareMorph = memo(SquareMorphBase);
export const FlippingSquare = memo(FlippingSquareBase);
export const InfinityTrail = memo(InfinityTrailBase);
export const LiquidFill = memo(LiquidFillBase);
