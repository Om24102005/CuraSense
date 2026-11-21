import { useEffect, useRef, useState, memo } from 'react';
import { Animated, Easing, View } from 'react-native';
import { useTheme } from '../theme';
import { AppText } from '../ui/AppText';
import { Frame, type LoaderProps } from './frame';
import { EASE, NATIVE, curve, keyed, useLoop, withAlpha } from './motion';

/** 4. A bar of unknown length: two bright stretches slide across a faint track, one after the other. */
function IndeterminateBarBase({ color, height = 4, label, style }: Omit<LoaderProps, 'size'> & { height?: number }) {
  const t = useTheme();
  const c = color ?? t.accent;
  const v = useLoop(1500, EASE.inOut);
  const [w, setW] = useState(0);
  return (
    <View
      accessible={label !== null}
      accessibilityRole={label === null ? undefined : 'progressbar'}
      accessibilityLabel={label === null ? undefined : label ?? 'Loading'}
      accessibilityState={{ busy: true }}
      onLayout={(e) => setW(e.nativeEvent.layout.width)}
      style={[{ alignSelf: 'stretch', height, borderRadius: height / 2, overflow: 'hidden', backgroundColor: withAlpha(c, 0.15) }, style]}
    >
      {/* The first stretch crosses in the first 55% of the loop, the second in the last 55%; each waits out of sight the rest of the time. */}
      {w > 0 ? (
        <>
          <Animated.View style={{ position: 'absolute', top: 0, bottom: 0, width: w * 0.4, borderRadius: height / 2, backgroundColor: c, transform: [{ translateX: keyed(v, [-w * 0.4, w, w], [0, 0.55, 1]) }] }} />
          <Animated.View style={{ position: 'absolute', top: 0, bottom: 0, width: w * 0.4, borderRadius: height / 2, backgroundColor: c, transform: [{ translateX: keyed(v, [-w * 0.4, -w * 0.4, w], [0, 0.45, 1]) }] }} />
        </>
      ) : null}
    </View>
  );
}

/** 16. Real progress, 0 to 1: it only shows what was measured, never a made-up percentage. */
export function PercentBar({ value, color, height = 8, showValue, label, style }: Omit<LoaderProps, 'size'> & { value: number; height?: number; showValue?: boolean }) {
  const t = useTheme();
  const c = color ?? t.accent;
  const now = Math.min(1, Math.max(0, value));
  const p = useRef(new Animated.Value(now)).current;
  useEffect(() => {
    Animated.timing(p, { toValue: now, duration: 320, easing: Easing.out(Easing.cubic), useNativeDriver: NATIVE }).start();
  }, [now, p]);
  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={label ?? 'Progress'}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(now * 100) }}
      style={[{ alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center', gap: 10 }, style]}
    >
      <View style={{ flex: 1, height, borderRadius: height / 2, overflow: 'hidden', backgroundColor: withAlpha(c, 0.15) }}>
        <Animated.View style={{ height, borderRadius: height / 2, backgroundColor: c, transformOrigin: '0% 50%', transform: [{ scaleX: p }] }} />
      </View>
      {showValue ? <AppText variant="caption" tone="muted" style={{ minWidth: 34, textAlign: 'right' }} importantForAccessibility="no" accessibilityElementsHidden>{Math.round(now * 100)}%</AppText> : null}
    </View>
  );
}

/** 7. Bars that rise and fall out of step, like a level meter. */
function EqualizerBarsBase({ size = 32, color, label, style }: LoaderProps) {
  const t = useTheme();
  const c = color ?? t.accent;
  const v = useLoop(1100);
  const n = 5;
  const w = size / (n * 1.6);
  return (
    <Frame width={size} label={label} style={style}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: w * 0.6, height: size }}>
        {Array.from({ length: n }, (_, i) => (
          <Animated.View
            key={i}
            style={{ width: w, height: size, borderRadius: w / 2, backgroundColor: c, transformOrigin: '50% 100%', transform: [{ scaleY: curve(v, (u) => 0.22 + 0.78 * Math.abs(Math.sin(Math.PI * (2 * u + i * 0.37))), 24, i * 0.17) }] }}
          />
        ))}
      </View>
    </Frame>
  );
}

/** 19. A battery that fills. Give it `level` (0 to 1) for something measured; without it, it charges in a loop. */
function BatteryChargeBase({ size = 46, color, level, label, style }: LoaderProps & { level?: number }) {
  const t = useTheme();
  const c = color ?? t.accent;
  const v = useLoop(2200);
  const lv = useRef(new Animated.Value(level ?? 0)).current;
  useEffect(() => {
    if (level === undefined) return;
    Animated.timing(lv, { toValue: Math.min(1, Math.max(0, level)), duration: 400, easing: Easing.out(Easing.cubic), useNativeDriver: NATIVE }).start();
  }, [level, lv]);
  const h = size * 0.52;
  const cap = Math.max(3, size * 0.07);
  const pad = Math.max(2, size * 0.06);
  const fill = level === undefined ? curve(v, (u) => Math.min(1, u / 0.85)) : lv;
  return (
    <Frame width={size + cap + 1} height={h} label={label} style={style}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ width: size, height: h, borderRadius: h * 0.28, borderWidth: 2, borderColor: c, padding: pad }}>
          <Animated.View style={{ flex: 1, borderRadius: h * 0.12, backgroundColor: c, transformOrigin: '0% 50%', transform: [{ scaleX: fill }] }} />
        </View>
        <View style={{ width: cap, height: h * 0.4, marginLeft: 1, borderTopRightRadius: 2, borderBottomRightRadius: 2, backgroundColor: c }} />
      </View>
    </Frame>
  );
}

export const IndeterminateBar = memo(IndeterminateBarBase);
export const EqualizerBars = memo(EqualizerBarsBase);
export const BatteryCharge = memo(BatteryChargeBase);
