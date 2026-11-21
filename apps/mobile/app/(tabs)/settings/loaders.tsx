import { useEffect, useState, type ReactNode } from 'react';
import { View } from 'react-native';
import { TYPE_COLORS } from '@curasense/shared/history';
import {
  BatteryCharge, BouncingBall, BouncingDots, ChasingSquares, DotGridWave, EqualizerBars, FlippingSquare, GradientRing, IndeterminateBar, InfinityTrail, LOADERS, LiquidFill,
  Orbit, PercentBar, PulseRings, ReadingLens, ShimmerText, Skeleton, SkeletonGroup, SpinnerArc, SpokeSpinner, SquareMorph, SymptomChips, TypingDots, type LoaderId,
} from '../../../src/loaders';
import { useTheme } from '../../../src/theme';
import { AppText } from '../../../src/ui/AppText';
import { Card } from '../../../src/ui/Card';
import { Screen } from '../../../src/ui/Screen';

// A demonstration of each loader. Every one is silent for a screen reader here (label null); the row speaks its name and where it is used.
const demos = (c: string, pct: number): Record<LoaderId, ReactNode> => ({
  'spinner-arc': <SpinnerArc size={40} color={c} label={null} />,
  'bouncing-dots': <BouncingDots size={44} color={c} label={null} />,
  'pulse-rings': <PulseRings size={56} color={c} label={null} />,
  'indeterminate-bar': <View style={{ width: 84 }}><IndeterminateBar color={c} label={null} /></View>,
  'skeleton-shimmer': <SkeletonGroup><View style={{ width: 84, gap: 6 }}><Skeleton height={12} /><Skeleton height={12} width="70%" /></View></SkeletonGroup>,
  orbit: <Orbit size={56} color={c} label={null} />,
  'equalizer-bars': <EqualizerBars size={36} color={c} label={null} />,
  'square-morph': <SquareMorph size={48} color={c} label={null} />,
  'liquid-fill': <LiquidFill size={52} color={c} label={null} />,
  'dot-grid-wave': <DotGridWave size={48} color={c} label={null} />,
  'infinity-trail': <InfinityTrail size={64} color={c} label={null} />,
  'flipping-square': <FlippingSquare size={44} color={c} label={null} />,
  'gradient-ring': <GradientRing size={48} color={c} label={null} />,
  'typing-dots': <TypingDots size={44} color={c} label={null} />,
  'spoke-spinner': <SpokeSpinner size={40} color={c} label={null} />,
  'percent-bar': <View style={{ width: 84 }}><PercentBar value={pct} color={c} showValue label="Demonstration" /></View>,
  'chasing-squares': <ChasingSquares size={40} color={c} label={null} />,
  'text-shimmer': <ShimmerText text="Reading" tone="accent" />,
  'battery-charge': <BatteryCharge size={46} color={c} label={null} />,
  'bouncing-ball': <BouncingBall size={52} color={c} label={null} />,
});

export default function LoadingAnimations() {
  const t = useTheme();
  // The percent bar is only a demonstration here: in the app it shows real counts (files added, characters used).
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setPct((p) => (p >= 1 ? 0 : Math.min(1, p + 0.125))), 650);
    return () => clearInterval(id);
  }, []);
  const shown = demos(t.accent, pct);
  return (
    <Screen edges={[]}>
      <View style={{ gap: 4 }}>
        <AppText variant="title" accessibilityRole="header">Loading animations</AppText>
        <AppText variant="callout" tone="secondary">All twenty, and where the app uses each one.</AppText>
      </View>

      <Card testID="loader-reading-lens" style={{ gap: 12 }}>
        <ReadingLens color={TYPE_COLORS.image}><SymptomChips names={['Fever', 'Dry cough', 'Shortness of breath', 'Fatigue', 'Chest tightness']} /></ReadingLens>
        <View style={{ gap: 2 }}>
          <AppText variant="headline">Reading lens</AppText>
          <AppText variant="caption" tone="muted">The wait for a symptom check, a scan or a lab report: an orb travels a figure eight over your own input while a beam scans it. It is built from the pulse rings, infinity trail, typing dots and text shimmer below.</AppText>
        </View>
      </Card>

      {LOADERS.map((l, i) => (
        <Card key={l.id} testID={`loader-${l.id}`} accessible accessibilityLabel={`${l.name}. ${l.usedIn}`} style={{ flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 14 }}>
          <View style={{ width: 96, minHeight: 64, alignItems: 'center', justifyContent: 'center' }}>{shown[l.id]}</View>
          <View style={{ flex: 1, gap: 2 }}>
            <AppText variant="headline">{`${i + 1}. ${l.name}`}</AppText>
            <AppText variant="caption" tone="muted">{l.usedIn}</AppText>
          </View>
        </Card>
      ))}
    </Screen>
  );
}
