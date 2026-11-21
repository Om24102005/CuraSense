import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, Platform } from 'react-native';

// Every loader runs on ONE looping clock (a value that goes 0 to 1 and starts again). All of its moving parts are interpolations of
// that clock, so a loader is a single animation on the native driver: nothing runs on the JavaScript thread while the AI is busy.

/** Anything that can be interpolated: the clock itself, or the clock shifted by a phase. */
export type Clock = Pick<Animated.Value, 'interpolate'>;

/** The native driver runs the loop on the phone's UI thread. The browser build has none, and a looping native-driver animation plays only once there. */
export const NATIVE = Platform.OS !== 'web';

/** Easings are module constants: a new function on each render would restart the loop. */
export const EASE = { linear: Easing.linear, inOut: Easing.inOut(Easing.quad) } as const;

/** True when the phone's Reduce Motion setting is on. Loaders then hold one still frame instead of moving. */
export function useReduceMotion(): boolean {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    let live = true;
    AccessibilityInfo.isReduceMotionEnabled().then((r) => { if (live) setReduce(r); }).catch(() => {});
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduce);
    return () => { live = false; sub.remove(); };
  }, []);
  return reduce;
}

/** The frame a loader shows when Reduce Motion is on: far enough into the loop that its shape is clear. */
const STILL = 0.3;

export function useLoop(duration: number, easing: (t: number) => number = EASE.linear): Animated.Value {
  const reduce = useReduceMotion();
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (reduce) { v.setValue(STILL); return; }
    v.setValue(0);
    const loop = Animated.loop(Animated.timing(v, { toValue: 1, duration, easing, useNativeDriver: NATIVE, isInteraction: false }));
    loop.start();
    return () => loop.stop();
  }, [reduce, duration, easing, v]);
  return v;
}

/** Maps the clock onto the listed values, evenly spaced (or at the given points) over one loop. */
export function keyed(x: Clock, out: number[], at?: number[]): Animated.AnimatedInterpolation<number> {
  const last = out.length - 1;
  return x.interpolate<number>({ inputRange: at ?? out.map((_, i) => i / last), outputRange: out });
}

/**
 * Maps the clock onto a function of the position in the loop (0 to 1), sampled n times. `phase` starts it that fraction of a loop later, which is how a
 * row of dots or bars gets its stagger: it is baked into the samples, so no extra animated node is needed. Make fn(0) equal fn(1) for a seamless loop.
 */
export function curve(x: Clock, fn: (t: number) => number, n = 24, phase = 0): Animated.AnimatedInterpolation<number> {
  return keyed(x, Array.from({ length: n + 1 }, (_, i) => fn(phase === 0 ? i / n : (i / n + phase) % 1)));
}

/** A function of the loop position that follows the listed values at the listed points (evenly spaced when no points are given). */
export function along(out: number[], at?: number[]): (t: number) => number {
  const xs = at ?? out.map((_, i) => i / (out.length - 1));
  return (t) => {
    let i = 1;
    while (i < xs.length - 1 && t > xs[i]) i++;
    const k = (t - xs[i - 1]) / (xs[i] - xs[i - 1] || 1);
    return out[i - 1] + (out[i] - out[i - 1]) * Math.min(1, Math.max(0, k));
  };
}

export function deg(x: Clock, from: number, to: number): Animated.AnimatedInterpolation<string> {
  return x.interpolate<string>({ inputRange: [0, 1], outputRange: [`${from}deg`, `${to}deg`] });
}

export { eight, withAlpha } from './pure.ts';
