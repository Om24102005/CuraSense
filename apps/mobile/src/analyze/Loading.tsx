import { useEffect, useState, type ReactNode } from 'react';
import { View } from 'react-native';
import { TYPE_COLORS } from '@curasense/shared/history';
import { DotGridWave, GradientRing, LiquidFill, Orbit, ReadingLens, ShimmerText, TypingDots } from '../loaders';
import { useTheme } from '../theme';
import { AppText } from '../ui/AppText';
import { Card } from '../ui/Card';

type Kind = 'symptoms' | 'scan' | 'report';
const COLORS: Record<Kind, string> = { symptoms: TYPE_COLORS.symptom, scan: TYPE_COLORS.image, report: TYPE_COLORS.report };

/** Whole seconds since it appeared, from the monotonic clock. */
function useSeconds() {
  const [s, setS] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const id = setInterval(() => setS(Math.floor((performance.now() - start) / 1000)), 1000);
    return () => clearInterval(id);
  }, []);
  return s;
}

function Status({ kind, color }: { kind: Kind; color: string }) {
  const s = useSeconds();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
      <TypingDots color={color} label={null} />
      {/* The timer changes every second, so a screen reader must not announce it. */}
      <AppText variant="caption" tone="muted" accessibilityElementsHidden importantForAccessibility="no">{`${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')} · usually under a minute`}</AppText>
      {kind === 'symptoms' ? <Orbit size={34} color={color} label={null} /> : kind === 'scan' ? <DotGridWave size={30} color={color} label={null} /> : <LiquidFill size={32} color={color} label={null} />}
    </View>
  );
}

/**
 * Shown while the AI reads the input. A request can take a while, so it says what is happening: for a symptom check, a scan or a report
 * it is the reading lens over the person's own input (`preview`), in the colour of that tool. Without a kind it is a plain ring.
 */
export function Loading({ title, detail, kind, preview }: { title: string; detail?: string; kind?: Kind; preview?: ReactNode }) {
  const t = useTheme();
  const color = kind ? COLORS[kind] : t.accent;
  return (
    <Card testID="loading" accessibilityLiveRegion="polite" style={{ gap: 16, paddingVertical: 20 }}>
      {kind ? <ReadingLens color={color}>{preview}</ReadingLens> : <View style={{ alignItems: 'center', paddingVertical: 14 }}><GradientRing size={56} color={color} /></View>}
      <View style={{ alignItems: 'center', gap: 6 }}>
        <ShimmerText text={title} />
        {detail ? <AppText variant="callout" tone="secondary" style={{ textAlign: 'center' }} numberOfLines={2}>{detail}</AppText> : null}
      </View>
      {kind ? <Status kind={kind} color={color} /> : null}
    </Card>
  );
}
