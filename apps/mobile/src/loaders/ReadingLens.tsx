import { memo, useState, type ReactNode } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme';
import { radius } from '../ui/tokens';
import { EASE, curve, eight, keyed, useLoop, withAlpha } from './motion';
import { PulseRings } from './spinners';

const R = 24; // the orb's radius
const GHOSTS = 8;
const BEAM = 64;

/** The moving part: the orb, its trail and the beam. It is memoised, so re-rendering the input behind it never rebuilds its animation. */
const LensMotion = memo(function LensMotion({ color, w, height }: { color: string; w: number; height: number }) {
  const path = useLoop(7200);
  const scan = useLoop(2600, EASE.inOut);
  const ax = Math.max(0, w / 2 - R - 16);
  const ay = Math.max(0, height / 2 - R - 12);
  const place = (size: number) => ({ position: 'absolute', left: w / 2 - size / 2, top: height / 2 - size / 2, width: size, height: size } as const);
  const glide = (lag: number) => [
    { translateX: curve(path, (u) => eight(u)[0] * ax, 64, 1 - lag) },
    { translateY: curve(path, (u) => eight(u)[1] * ay, 64, 1 - lag) },
  ];
  return (
    <>
      <Animated.View style={{ position: 'absolute', left: 0, right: 0, top: 0, height: BEAM, transform: [{ translateY: keyed(scan, [-BEAM, height]) }] }}>
        <LinearGradient colors={[withAlpha(color, 0), withAlpha(color, 0.3)]} style={{ flex: 1 }} />
        <View style={{ height: 2, backgroundColor: color, opacity: 0.85 }} />
      </Animated.View>
      {Array.from({ length: GHOSTS }, (_, i) => {
        const k = GHOSTS - i; // faintest first, so the nearest ones paint over it
        const size = 2 * R * (1 - k * 0.07);
        return <Animated.View key={k} style={[place(size), { borderRadius: size / 2, backgroundColor: color, opacity: 0.5 * (1 - k / (GHOSTS + 1)), transform: glide(k * 0.013) }]} />;
      })}
      <Animated.View style={[place(2 * R), { transform: glide(0) }]}>
        <View style={{ position: 'absolute', left: R - R * 2.5, top: R - R * 2.5 }}>
          <PulseRings size={R * 5} color={color} label={null} />
        </View>
        <View style={{ width: 2 * R, height: 2 * R, borderRadius: R, backgroundColor: color, shadowColor: color, shadowOpacity: 0.95, shadowRadius: 16, shadowOffset: { width: 0, height: 0 } }}>
          <View style={{ position: 'absolute', left: R * 0.35, top: R * 0.3, width: R * 0.6, height: R * 0.6, borderRadius: R * 0.3, backgroundColor: 'rgba(255,255,255,0.4)' }} />
        </View>
      </Animated.View>
    </>
  );
});

/**
 * The wait for an AI analysis. An orb glides along a figure eight over the person's own input (what `children` draws, dimmed) while a
 * beam scans down it, so the wait shows that the person's own symptoms, scan or report are being read. Several of the loaders make it:
 * pulse rings round the orb, the infinity trail for its path, and a scan beam. It uses one accent colour and runs on the native driver.
 */
export function ReadingLens({ color, height = 200, children }: { color: string; height?: number; children?: ReactNode }) {
  const t = useTheme();
  const [box, setBox] = useState({ w: 0, h: 0 });
  // At least `height` tall, and taller when the input behind it needs the room (large text), so nothing is cut off.
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      onLayout={(e) => {
        const { width, height: h } = e.nativeEvent.layout;
        setBox((b) => (Math.round(b.w) === Math.round(width) && Math.round(b.h) === Math.round(h) ? b : { w: Math.round(width), h: Math.round(h) }));
      }}
      style={{ alignSelf: 'stretch', minHeight: height, borderRadius: radius.lg, overflow: 'hidden', borderWidth: 1, borderColor: t.border, backgroundColor: t.surface }}
    >
      <View style={{ minHeight: height, opacity: 0.55, justifyContent: 'center' }}>{children}</View>
      {/* Its own clipped layer: the beam rests below the lens at the end of each sweep, and that must not count as overflow of the lens. */}
      {box.w > 0 ? <View style={[StyleSheet.absoluteFill, { overflow: 'hidden', pointerEvents: 'none' }]}><LensMotion color={color} w={box.w} height={box.h} /></View> : null}
    </View>
  );
}
