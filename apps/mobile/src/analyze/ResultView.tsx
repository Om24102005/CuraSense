import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { URGENCY_LEVELS, type AnalysisResult, type ScanSection } from '@curasense/shared/analysis';
import { extractUrgency } from '@curasense/shared/scans';
import { useTheme } from '../theme';
import { AppText } from '../ui/AppText';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { radius } from '../ui/tokens';
import { MedicalText } from './MedicalText';
import { WrongPageNotice } from './WrongPageNotice';

const BIOMARKER_STATUS = {
  normal: { color: '#10b981', label: 'NORMAL' },
  low: { color: '#f59e0b', label: 'LOW' },
  high: { color: '#f59e0b', label: 'HIGH' },
  critical: { color: '#ef4444', label: 'CRITICAL' },
} as const;

export function Chip({ text, color }: { text: string; color: string }) {
  return (
    <View style={{ alignSelf: 'flex-start', paddingVertical: 3, paddingHorizontal: 9, borderRadius: 999, backgroundColor: `${color}22`, borderWidth: 1, borderColor: `${color}66` }}>
      <AppText variant="caption" style={{ color, fontWeight: '800' }}>{text}</AppText>
    </View>
  );
}

export function UrgencyBanner({ urgency }: { urgency: keyof typeof URGENCY_LEVELS }) {
  const u = URGENCY_LEVELS[urgency];
  return (
    <View
      testID="urgency"
      accessibilityLabel={`Urgency: ${u.label}. ${u.sub}`}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: radius.lg, backgroundColor: `${u.color}1f`, borderWidth: 1, borderColor: `${u.color}66` }}
    >
      <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: u.color }} />
      <View style={{ flex: 1 }}>
        <AppText variant="headline" style={{ color: u.color }}>{u.label}</AppText>
        <AppText variant="callout" tone="secondary">{u.sub}</AppText>
      </View>
    </View>
  );
}

/** A possible condition with its probability. `top` marks the best match. */
export function ConditionRow({ c, top }: { c: { name: string; probability: number; description?: string }; top?: boolean }) {
  const t = useTheme();
  const pct = Math.max(0, Math.min(100, Number(c.probability) || 0));
  return (
    <View style={{ gap: 6, paddingVertical: 8 }}>
      {top ? <Chip text="TOP MATCH" color={t.accent} /> : null}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
        <AppText variant="headline" style={{ flex: 1 }}>{c.name}</AppText>
        <AppText variant="headline" tone="accent">{pct}%</AppText>
      </View>
      <View style={{ height: 6, borderRadius: 3, backgroundColor: t.border }}>
        <View style={{ width: `${pct}%`, height: 6, borderRadius: 3, backgroundColor: t.primary }} />
      </View>
      {c.description ? <AppText variant="callout" tone="secondary">{c.description}</AppText> : null}
    </View>
  );
}

export interface BiomarkerData { name: string; value: number | string; unit?: string; status?: string; normal_min?: number; normal_max?: number }

/** One lab value: the number, a status chip and, when the range is known, a bar with the normal zone and where the value falls. */
export function BiomarkerCard({ b }: { b: BiomarkerData }) {
  const t = useTheme();
  const status = String(b.status || 'normal').toLowerCase();
  const s = BIOMARKER_STATUS[status as keyof typeof BIOMARKER_STATUS] ?? BIOMARKER_STATUS.normal;
  const value = Number(b.value), min = Number(b.normal_min), max = Number(b.normal_max);
  const hasRange = [value, min, max].every(Number.isFinite) && max > min;
  // The bar runs from one normal-range width below the normal range to one above it, so the normal zone sits in the middle.
  const span = Math.max(1, max - min), lo = min - span, hi = max + span;
  const pct = (n: number) => Math.max(0, Math.min(100, ((n - lo) / (hi - lo)) * 100));
  const note = status === 'normal' ? 'Within range'
    : status === 'critical' ? `Dangerously ${value > max ? 'elevated' : 'low'}`
    : value > max ? `${(value - max).toFixed(1)} above the maximum` : `${(min - value).toFixed(1)} below the minimum`;
  return (
    <View style={{ gap: 8, padding: 14, borderRadius: radius.md, borderWidth: 1, borderColor: `${s.color}44`, backgroundColor: t.surface }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
        <AppText variant="headline" style={{ flex: 1 }}>{b.name}</AppText>
        <Chip text={s.label} color={s.color} />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
        <AppText variant="title" style={{ color: s.color }}>{Number.isFinite(value) ? (Number.isInteger(value) ? String(value) : value.toFixed(1)) : String(b.value)}</AppText>
        {b.unit ? <AppText variant="callout" tone="muted">{b.unit}</AppText> : null}
      </View>
      {hasRange ? (
        <View style={{ height: 8, borderRadius: 4, backgroundColor: t.border }}>
          <View style={{ position: 'absolute', top: 0, bottom: 0, left: `${pct(min)}%`, width: `${pct(max) - pct(min)}%`, borderRadius: 4, backgroundColor: '#10b98180' }} />
          <View style={{ position: 'absolute', top: -3, left: `${pct(value)}%`, width: 14, height: 14, marginLeft: -7, borderRadius: 7, backgroundColor: s.color, borderWidth: 2, borderColor: t.bg }} />
        </View>
      ) : null}
      {hasRange ? (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
          <AppText variant="caption" tone="muted">Normal {min} to {max} {b.unit}</AppText>
          <AppText variant="caption" style={{ color: status === 'normal' ? t.success : s.color, fontWeight: '700' }}>{note}</AppText>
        </View>
      ) : null}
    </View>
  );
}

export function Recommendations({ items }: { items: string[] }) {
  const t = useTheme();
  if (!items.length) return null;
  return (
    <Card>
      <AppText variant="headline">Recommendations</AppText>
      {items.map((r, i) => (
        <View key={i} style={{ flexDirection: 'row', gap: 10, paddingVertical: 3 }}>
          <Ionicons name="checkmark-circle" size={18} color={t.success} style={{ marginTop: 2 }} />
          <AppText variant="callout" style={{ flex: 1, lineHeight: 22 }}>{r}</AppText>
        </View>
      ))}
    </Card>
  );
}

export const DISCLAIMER = 'AI-assisted information, not a medical diagnosis. Talk to a clinician about your results.';

function ScanSectionCard({ s }: { s: ScanSection }) {
  const urgency = s.refusal ? null : extractUrgency(s.content);
  return (
    <Card style={{ gap: 10 }}>
      <AppText variant="headline">{s.num}. {s.filename}</AppText>
      {(s.detectedKind || urgency) && !s.refusal ? (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
          {s.detectedKind ? <Chip text={`${s.detectedKind}${s.detectedConfidence ? ` ${s.detectedConfidence}%` : ''}`.toUpperCase()} color="#60a5fa" /> : null}
          {urgency ? <Chip text={urgency.label.toUpperCase()} color={urgency.color} /> : null}
        </View>
      ) : null}
      {s.refusal ? <WrongPageNotice refusal={s.refusal} /> : <MedicalText text={s.content} />}
    </Card>
  );
}

/** A finished analysis: urgency, the written answer, conditions, lab values, scan sections and next steps. */
export function ResultView({ result, onReset }: { result: AnalysisResult; onReset: () => void }) {
  const hasSections = !!result.scanSections?.length;
  return (
    <View testID="result" style={{ gap: 16 }}>
      <View style={{ gap: 6 }}>
        <AppText variant="title" accessibilityRole="header">{result.diagnosis}</AppText>
        {typeof result.confidence === 'number' && result.confidence > 0 ? <AppText variant="callout" tone="secondary">Confidence {result.confidence}%</AppText> : null}
      </View>

      {result.urgency ? <UrgencyBanner urgency={result.urgency} /> : null}

      {hasSections ? result.scanSections!.map((s) => <ScanSectionCard key={s.num} s={s} />) : <MedicalText text={result.details} />}

      {result.conditions?.length ? (
        <Card>
          <AppText variant="headline">Possible conditions</AppText>
          {result.conditions.map((c, i) => <ConditionRow key={i} c={c} />)}
        </Card>
      ) : null}

      {result.biomarkers?.length ? (
        <View style={{ gap: 10 }}>
          <AppText variant="headline">Lab values</AppText>
          {result.biomarkers.map((b, i) => <BiomarkerCard key={i} b={b} />)}
        </View>
      ) : null}

      <Recommendations items={result.recommendations} />

      <AppText variant="caption" tone="muted">{DISCLAIMER}</AppText>
      <Button title="New analysis" variant="secondary" testID="new-analysis" onPress={onReset} />
    </View>
  );
}
