import { memo } from 'react';
import { Animated, View } from 'react-native';
import { useTheme } from '../theme';
import { Frame, type LoaderProps } from './frame';
import { curve, useLoop } from './motion';

/** 2. Three dots that hop in turn. */
function BouncingDotsBase({ size = 32, color, label, style }: LoaderProps) {
  const t = useTheme();
  const c = color ?? t.accent;
  const v = useLoop(1000);
  const d = size / 5;
  const hop = size * 0.28;
  return (
    <Frame width={size} height={size * 0.6} label={label} style={style}>
      <View style={{ flexDirection: 'row', gap: d * 0.8, alignItems: 'flex-end', height: d + hop }}>
        {[0, 1, 2].map((i) => (
          <Animated.View
            key={i}
            style={{ width: d, height: d, borderRadius: d / 2, backgroundColor: c, transform: [{ translateY: curve(v, (x) => -hop * Math.sin(Math.PI * Math.min(1, x * 2)), 24, i * 0.12) }] }}
          />
        ))}
      </View>
    </Frame>
  );
}

/** 14. Three dots that swell and fade in turn, as in a chat when someone is writing. */
function TypingDotsBase({ size = 32, color, label, style }: LoaderProps) {
  const t = useTheme();
  const c = color ?? t.accent;
  const v = useLoop(1300);
  const d = size / 4.5;
  return (
    <Frame width={size} height={size * 0.5} label={label} style={style}>
      <View style={{ flexDirection: 'row', gap: d * 0.7, alignItems: 'center' }}>
        {[0, 1, 2].map((i) => {
          const pulse = (a: number, b: number) => curve(v, (u) => a + b * Math.pow(Math.sin(Math.PI * u), 2), 16, i * 0.17);
          return <Animated.View key={i} style={{ width: d, height: d, borderRadius: d / 2, backgroundColor: c, opacity: pulse(0.25, 0.75), transform: [{ scale: pulse(0.7, 0.3) }] }} />;
        })}
      </View>
    </Frame>
  );
}

/** 10. A grid of dots; a wave of size and light crosses it corner to corner, like pixels being read. */
function DotGridWaveBase({ size = 48, color, label, style }: LoaderProps) {
  const t = useTheme();
  const c = color ?? t.accent;
  const v = useLoop(1500);
  const n = 4;
  const cell = size / n;
  const d = cell * 0.52;
  return (
    <Frame width={size} label={label} style={style}>
      {Array.from({ length: n * n }, (_, k) => {
        const r = Math.floor(k / n);
        const col = k % n;
        const wave = (a: number, b: number) => curve(v, (u) => a + b * (0.5 - 0.5 * Math.cos(2 * Math.PI * u)), 16, (r + col) / (2 * n));
        return (
          <Animated.View
            key={k}
            style={{ position: 'absolute', left: col * cell + (cell - d) / 2, top: r * cell + (cell - d) / 2, width: d, height: d, borderRadius: d / 2, backgroundColor: c, opacity: wave(0.2, 0.8), transform: [{ scale: wave(0.55, 0.45) }] }}
          />
        );
      })}
    </Frame>
  );
}

/** 17. Two squares chase each other round the corners of a box. */
function ChasingSquaresBase({ size = 32, color, label, style }: LoaderProps) {
  const t = useTheme();
  const c = color ?? t.accent;
  const v = useLoop(1700);
  const sq = size * 0.34;
  const run = size - sq;
  const corners = [[0, 0], [1, 0], [1, 1], [0, 1]];
  const at = (u: number, axis: 0 | 1) => {
    const s = (u * 4) % 4;
    const i = Math.floor(s);
    const f = s - i;
    const e = f * f * (3 - 2 * f);
    const a = corners[i % 4][axis];
    const b = corners[(i + 1) % 4][axis];
    return (a + (b - a) * e) * run;
  };
  return (
    <Frame width={size} label={label} style={style}>
      {[0, 0.5].map((p) => (
        <Animated.View
          key={p}
          style={{ position: 'absolute', left: 0, top: 0, width: sq, height: sq, borderRadius: sq * 0.2, backgroundColor: c, transform: [{ translateX: curve(v, (u) => at(u, 0), 48, p) }, { translateY: curve(v, (u) => at(u, 1), 48, p) }, { scale: curve(v, (u) => 1 - 0.3 * Math.sin(Math.PI * ((u * 4) % 1)), 48, p) }] }}
        />
      ))}
    </Frame>
  );
}

/** 20. A ball that falls, squashes on the floor and rises again, with its shadow. */
function BouncingBallBase({ size = 40, color, label, style }: LoaderProps) {
  const t = useTheme();
  const c = color ?? t.accent;
  const v = useLoop(900);
  const d = size * 0.34;
  const rise = size * 0.5;
  const squash = (u: number) => { const near = Math.min(u, 1 - u); return near < 0.07 ? 0.72 + (near / 0.07) * 0.28 : 1; };
  return (
    <Frame width={size} label={label} style={style}>
      <Animated.View style={{ position: 'absolute', bottom: size * 0.08, width: d * 1.1, height: d * 0.28, borderRadius: d, backgroundColor: c, opacity: curve(v, (u) => 0.3 - 0.2 * 4 * u * (1 - u)), transform: [{ scaleX: curve(v, (u) => 1 - 0.5 * 4 * u * (1 - u)) }] }} />
      <Animated.View
        style={{ position: 'absolute', bottom: size * 0.08 + d * 0.14, width: d, height: d, borderRadius: d / 2, backgroundColor: c, transformOrigin: '50% 100%', transform: [{ translateY: curve(v, (u) => -rise * 4 * u * (1 - u)) }, { scaleY: curve(v, squash) }, { scaleX: curve(v, (u) => 2 - squash(u)) }] }}
      />
    </Frame>
  );
}

export const BouncingDots = memo(BouncingDotsBase);
export const TypingDots = memo(TypingDotsBase);
export const DotGridWave = memo(DotGridWaveBase);
export const ChasingSquares = memo(ChasingSquaresBase);
export const BouncingBall = memo(BouncingBallBase);
