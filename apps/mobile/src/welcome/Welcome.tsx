import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, Image, Platform, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { type Arrival, useAuth } from '../auth/AuthContext';
import { success } from '../haptics';
import { usePredictions } from '../history/PredictionsContext';
import { BatteryCharge, BouncingDots, EqualizerBars, SquareMorph } from '../loaders';
import { useSettings } from '../settings/SettingsContext';
import { Ionicons } from '../ui/Icon';
import { ECG_X, ECG_Y, ecgSegments } from './ecg';
import { MAX_MS, type Real, isFinished, rowTiming, shown } from './timeline';

// The welcome is always dark, like the splash screen it follows, whatever the phone's appearance.
const C = { bg: '#05070f', text: '#dceaf4', soft: 'rgba(220,234,244,0.74)', accent: '#87bfff', ok: '#34d399', warn: '#fbbf24' };
const NATIVE = Platform.OS !== 'web';

function useReduceMotion(): boolean | null {
  const [reduce, setReduce] = useState<boolean | null>(null);
  useEffect(() => {
    let live = true;
    AccessibilityInfo.isReduceMotionEnabled().then((r) => { if (live) setReduce(r); }).catch(() => { if (live) setReduce(false); });
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduce);
    return () => { live = false; sub.remove(); };
  }, []);
  return reduce;
}

/** The brand mark beating about once a second, pulse rings leaving it, and an ECG line drawn under it. Still under Reduce Motion. */
function Heartbeat({ reduce }: { reduce: boolean }) {
  const { width: screen } = useWindowDimensions();
  const W = Math.min(screen - 48, 420), H = 64, MARK = 100;
  const intro = useRef(new Animated.Value(reduce ? 1 : 0)).current;
  const beat = useRef(new Animated.Value(0)).current;
  const ring1 = useRef(new Animated.Value(0)).current;
  const ring2 = useRef(new Animated.Value(0)).current;
  const draw = useRef(new Animated.Value(reduce ? 1 : 0)).current;
  const segs = useMemo(() => ecgSegments(W, H), [W]);

  useEffect(() => {
    if (reduce) return;
    const pulse = (v: Animated.Value, delay: number) => Animated.loop(Animated.sequence([Animated.delay(delay), Animated.timing(v, { toValue: 1, duration: 1100, easing: Easing.out(Easing.quad), useNativeDriver: NATIVE }), Animated.timing(v, { toValue: 0, duration: 0, useNativeDriver: NATIVE })]));
    const run = Animated.parallel([
      Animated.timing(intro, { toValue: 1, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: NATIVE }),
      Animated.timing(draw, { toValue: 1, duration: 1400, delay: 250, easing: Easing.inOut(Easing.quad), useNativeDriver: NATIVE }),
      Animated.loop(Animated.sequence([Animated.timing(beat, { toValue: 1, duration: 1100, easing: Easing.linear, useNativeDriver: NATIVE }), Animated.timing(beat, { toValue: 0, duration: 0, useNativeDriver: NATIVE })])),
      pulse(ring1, 0), pulse(ring2, 550),
    ]);
    run.start();
    return () => run.stop();
  }, [reduce, intro, draw, beat, ring1, ring2]);

  const ring = (v: Animated.Value) => ({ opacity: v.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0] }), transform: [{ scale: v.interpolate({ inputRange: [0, 1], outputRange: [1, 2.3] }) }] });
  const markScale = Animated.multiply(intro.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }), beat.interpolate({ inputRange: [0, 0.12, 0.24, 1], outputRange: [1, 1.07, 1, 1] }));
  return (
    <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ alignItems: 'center', gap: 22 }}>
      <View style={{ width: MARK, height: MARK, alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
        {reduce ? null : [ring1, ring2].map((v, i) => <Animated.View key={i} style={[{ position: 'absolute', width: MARK + 20, height: MARK + 20, borderRadius: (MARK + 20) / 2, borderWidth: 2, borderColor: C.accent }, ring(v)]} />)}
        <Animated.View style={{ borderRadius: 24, opacity: intro, transform: [{ scale: markScale }], shadowColor: C.accent, shadowOpacity: 0.55, shadowRadius: 24, shadowOffset: { width: 0, height: 0 } }}>
          <Image source={require('../../assets/icon.png')} style={{ width: MARK, height: MARK, borderRadius: 24 }} accessibilityIgnoresInvertColors />
        </Animated.View>
      </View>
      <View testID="welcome-ecg" style={{ width: W, height: H, overflow: 'hidden', zIndex: 1 }}>
        {segs.map((s, i) => <View key={i} style={{ position: 'absolute', left: s.cx - s.length / 2, top: s.cy - 1.25, width: s.length, height: 2.5, borderRadius: 2, backgroundColor: C.accent, opacity: 0.85, transform: [{ rotate: `${s.angle}rad` }] }} />)}
        {reduce ? null : (
          <>
            <Animated.View style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, backgroundColor: C.bg, transform: [{ translateX: draw.interpolate({ inputRange: [0, 1], outputRange: [0, W] }) }] }} />
            <Animated.View style={{ position: 'absolute', left: -5, top: -5, width: 10, height: 10, borderRadius: 5, backgroundColor: '#fff', opacity: draw.interpolate({ inputRange: [0, 0.02, 0.98, 1], outputRange: [0, 1, 1, 0] }), shadowColor: C.accent, shadowOpacity: 1, shadowRadius: 8, shadowOffset: { width: 0, height: 0 },
              transform: [{ translateX: draw.interpolate({ inputRange: [0, 1], outputRange: [0, W] }) }, { translateY: draw.interpolate({ inputRange: ECG_X, outputRange: ECG_Y.map((y) => y * H) }) }] }} />
          </>
        )}
      </View>
    </View>
  );
}

function FadeIn({ delay, reduce, children }: { delay: number; reduce: boolean; children: React.ReactNode }) {
  const v = useRef(new Animated.Value(reduce ? 1 : 0)).current;
  useEffect(() => {
    if (reduce) return;
    const a = Animated.timing(v, { toValue: 1, duration: 450, delay, easing: Easing.out(Easing.cubic), useNativeDriver: NATIVE });
    a.start();
    return () => a.stop();
  }, [reduce, delay, v]);
  return <Animated.View style={{ opacity: v, transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }] }}>{children}</Animated.View>;
}

/** The small loader of a pending row: equalizer bars for syncing, hopping dots for loading, a morphing shape for preparing. */
function RowLoader({ id }: { id: string }) {
  const Mini = id === 'settings' ? EqualizerBars : id === 'history' ? BouncingDots : SquareMorph;
  return <Mini size={22} color={C.accent} label={null} />;
}

function Row({ id, status, pending, ok, failed, delay, reduce }: { id: string; status: Real; pending: string; ok: string; failed: string; delay: number; reduce: boolean }) {
  const label = status === 'pending' ? pending : status === 'ok' ? ok : failed;
  return (
    <FadeIn delay={delay} reduce={reduce}>
      <View testID={`welcome-row-${id}`} accessible accessibilityLabel={label} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 32 }}>
        <View style={{ width: 22, alignItems: 'center' }}>
          {status === 'pending' ? <RowLoader id={id} /> : <Ionicons name={status === 'ok' ? 'checkmark-circle' : 'alert-circle'} size={22} color={status === 'ok' ? C.ok : C.warn} />}
        </View>
        <Text maxFontSizeMultiplier={1.6} style={{ color: status === 'pending' ? C.soft : C.text, fontSize: 16 }}>{label}</Text>
      </View>
    </FadeIn>
  );
}

function Sequence({ arrival, onDone }: { arrival: NonNullable<Arrival>; onDone: () => void }) {
  const known = useReduceMotion();
  const reduce = known === true;
  const { sync } = useSettings();
  const { loading, error } = usePredictions();
  const [t, setT] = useState(0);
  const fade = useRef(new Animated.Value(1)).current;
  const leaving = useRef(false);
  const full = arrival.kind !== 'resume';

  // The time since the welcome began, from the monotonic clock: a changed or frozen phone clock must not stretch or cut it short.
  useEffect(() => {
    const start = performance.now();
    const id = setInterval(() => setT(performance.now() - start), 100);
    return () => clearInterval(id);
  }, []);

  const timing = rowTiming(reduce);
  const settings = shown(sync === 'pending' ? 'pending' : sync === 'ok' ? 'ok' : 'failed', t, timing.appear[0], timing.minShow);
  const history = shown(loading ? 'pending' : error ? 'failed' : 'ok', t, timing.appear[1], timing.minShow);
  const dashboard = shown(settings !== 'pending' && history !== 'pending' ? 'ok' : 'pending', t, timing.appear[2], timing.minShow);
  const finished = known !== null && isFinished(arrival.kind, full ? [settings, history, dashboard] : [], t, reduce);

  const leave = useCallback(() => {
    if (leaving.current) return;
    leaving.current = true;
    if (full) success();
    // The fade ends it, but a timer ends it too: nothing about an animation may keep the person on this screen.
    const ms = reduce ? 150 : 450;
    let ended = false;
    const end = () => { if (!ended) { ended = true; onDone(); } };
    Animated.timing(fade, { toValue: 0, duration: ms, easing: Easing.in(Easing.quad), useNativeDriver: NATIVE }).start(end);
    setTimeout(end, ms + 200);
  }, [full, reduce, fade, onDone]);
  useEffect(() => { if (finished) leave(); }, [finished, leave]);
  // The limit does not depend on the timeline above: whatever else goes wrong, the welcome ends.
  useEffect(() => { const id = setTimeout(leave, MAX_MS); return () => clearTimeout(id); }, [leave]);

  const title = arrival.kind === 'signup' ? 'Welcome to CuraSense' : arrival.name ? `Welcome back, ${arrival.name}` : 'Welcome back';
  useEffect(() => { AccessibilityInfo.announceForAccessibility(title); }, [title]);

  return (
    <Animated.View testID="welcome" accessibilityViewIsModal style={[StyleSheet.absoluteFill, { backgroundColor: C.bg, opacity: fade, zIndex: 100 }]}>
      <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1 }}>
        <ScrollView bounces={false} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}>
          {known === null ? null : (
            <View style={{ width: '100%', maxWidth: 420, alignSelf: 'center', alignItems: 'center', gap: 20 }}>
              <Heartbeat reduce={reduce} />
              <FadeIn delay={700} reduce={reduce}>
                <View style={{ alignItems: 'center', gap: 6 }}>
                  {full ? <Text testID="welcome-overline" maxFontSizeMultiplier={1.6} style={{ color: C.accent, fontSize: 12, fontWeight: '800', letterSpacing: 2 }}>{arrival.kind === 'signup' ? 'ACCOUNT CREATED' : 'IDENTITY VERIFIED'}</Text> : null}
                  <Text testID="welcome-title" accessibilityRole="header" maxFontSizeMultiplier={1.6} style={{ color: C.text, fontSize: 28, fontWeight: '700', textAlign: 'center' }}>{title}</Text>
                </View>
              </FadeIn>
              {full ? (
                <View style={{ alignSelf: 'stretch', gap: 6, paddingTop: 8 }}>
                  <View testID="welcome-ready" accessible accessibilityLabel={`${[settings, history, dashboard].filter((x) => x !== 'pending').length} of 3 steps done`} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 6 }}>
                    <Text maxFontSizeMultiplier={1.6} style={{ color: C.soft, fontSize: 12, fontWeight: '800', letterSpacing: 2 }}>GETTING READY</Text>
                    <BatteryCharge size={38} color={C.accent} level={[settings, history, dashboard].filter((x) => x !== 'pending').length / 3} label={null} />
                  </View>
                  <Row id="settings" status={settings} pending="Syncing your settings" ok="Settings ready" failed="Using the settings saved on this phone" delay={timing.appear[0]} reduce={reduce} />
                  <Row id="history" status={history} pending="Loading your history" ok="History ready" failed="Could not load your history" delay={timing.appear[1]} reduce={reduce} />
                  <Row id="dashboard" status={dashboard} pending="Preparing your dashboard" ok="Dashboard ready" failed="Dashboard ready" delay={timing.appear[2]} reduce={reduce} />
                </View>
              ) : null}
            </View>
          )}
        </ScrollView>
        {full && t > 1000 ? (
          <Pressable accessibilityRole="button" accessibilityLabel="Skip the welcome" testID="welcome-skip" onPress={leave} style={{ alignSelf: 'center', minHeight: 44, paddingHorizontal: 24, justifyContent: 'center', marginBottom: 8 }}>
            <Text maxFontSizeMultiplier={1.6} style={{ color: C.soft, fontSize: 15 }}>Skip</Text>
          </Pressable>
        ) : null}
      </SafeAreaView>
    </Animated.View>
  );
}

/** Covers the screen as soon as the person is signed in, until the settings and history have loaded (the short version when a saved session resumes). */
export function Welcome() {
  const { arrival, endArrival } = useAuth();
  return arrival ? <Sequence arrival={arrival} onDone={endArrival} /> : null;
}
