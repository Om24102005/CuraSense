import { Fragment, type ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '../ui/Icon';
import { LinearGradient } from 'expo-linear-gradient';
import { URGENCY_LEVELS } from '@curasense/shared/analysis';
import type { ConsultMode } from '@curasense/shared/booking';
import type { Prediction } from '@curasense/shared/history';
import { STEP_LABELS } from '@curasense/shared/booking';
import { Chip, ConditionRow, UrgencyBanner } from '../analyze/ResultView';
import { tick } from '../haptics';
import { MedicalText } from '../analyze/MedicalText';
import { useTheme } from '../theme';
import { AppText } from '../ui/AppText';
import { Banner } from '../ui/Banner';
import { Card } from '../ui/Card';
import { radius } from '../ui/tokens';

type Icon = keyof typeof Ionicons.glyphMap;

/** Said on every booking screen: the flow is a demonstration, and the screens must not suggest otherwise. */
export const DEMO_NOTICE = 'Demonstration only. The doctors are samples, nothing is sent to any doctor or hospital, and bookings stay on this phone.';
export const DemoNotice = () => <Banner tone="info" testID="demo-notice">{DEMO_NOTICE}</Banner>;

/** Bright blue and violet on dark, deeper shades on light, so the text of a chip is readable on both. */
export function useModeColor(mode: ConsultMode) {
  const dark = useTheme().name === 'dark';
  return mode === 'online' ? (dark ? '#22d3ee' : '#0e7490') : (dark ? '#a78bfa' : '#6d28d9');
}

export function ModeChip({ mode }: { mode: ConsultMode }) {
  return <Chip text={mode === 'online' ? 'ONLINE' : 'IN-CLINIC'} color={useModeColor(mode)} />;
}

export function DoctorAvatar({ initials, color, size = 46 }: { initials: string; color: string; size?: number }) {
  return (
    <LinearGradient colors={[color, `${color}88`]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ width: size, height: size, borderRadius: size * 0.28, alignItems: 'center', justifyContent: 'center' }}>
      <Text allowFontScaling={false} style={{ color: '#fff', fontWeight: '800', fontSize: size * 0.34 }}>{initials}</Text>
    </LinearGradient>
  );
}

export function Stars({ rating }: { rating: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 1 }} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {Array.from({ length: 5 }, (_, i) => <Ionicons key={i} name={i < Math.round(rating) ? 'star' : 'star-outline'} size={13} color="#f59e0b" />)}
    </View>
  );
}

/** The five steps as numbered circles: done in green, the current one in the accent colour. Fixed-width columns with the lines between them filling the rest. */
export function StepProgress({ step }: { step: number }) {
  const t = useTheme();
  return (
    <View testID="step-progress" accessible accessibilityLabel={`Step ${step} of ${STEP_LABELS.length}: ${STEP_LABELS[step - 1]}`} style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
      {STEP_LABELS.map((label, i) => {
        const n = i + 1;
        const done = step > n, active = step === n;
        const c = active ? t.accent : done ? t.success : t.textMuted;
        return (
          <Fragment key={label}>
            <View style={{ width: 62, alignItems: 'center', gap: 4 }}>
              <View style={{ width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: c, backgroundColor: done ? t.success : active ? `${t.primary}29` : t.surface }}>
                {done ? <Ionicons name="checkmark" size={16} color="#fff" /> : <AppText variant="caption" style={{ color: c, fontWeight: '800' }}>{n}</AppText>}
              </View>
              <AppText variant="caption" maxFontSizeMultiplier={1.15} style={{ color: c, fontSize: 11, lineHeight: 14, fontWeight: active ? '800' : '600' }} numberOfLines={1}>{label}</AppText>
            </View>
            {i < STEP_LABELS.length - 1 ? <View style={{ flex: 1, height: 2, marginTop: 14, marginHorizontal: -8, backgroundColor: done ? t.success : t.border }} /> : null}
          </Fragment>
        );
      })}
    </View>
  );
}

/** One choice in a list, with a ring when it is the chosen one. */
export function Choice({ selected, disabled, color, onPress, label, testID, children }: { selected: boolean; disabled?: boolean; color?: string; onPress: () => void; label: string; testID: string; children: ReactNode }) {
  const t = useTheme();
  const c = color ?? t.accent;
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={label}
      accessibilityState={{ selected, disabled: !!disabled }}
      testID={testID}
      disabled={disabled}
      onPress={() => { tick(); onPress(); }}
      style={({ pressed }) => ({ padding: 14, borderRadius: radius.lg, borderWidth: selected ? 2 : 1, borderColor: selected ? c : t.border, backgroundColor: selected ? `${c}1f` : pressed ? t.surface : t.card, opacity: disabled ? 0.5 : 1 })}
    >
      {children}
    </Pressable>
  );
}

export function Fact({ icon, label, children }: { icon: Icon; label: string; children: ReactNode }) {
  const t = useTheme();
  return (
    <View style={{ gap: 3 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Ionicons name={icon} size={13} color={t.textMuted} />
        <AppText variant="caption" tone="muted" style={{ letterSpacing: 1, fontWeight: '700', textTransform: 'uppercase' }}>{label}</AppText>
      </View>
      {children}
    </View>
  );
}

/** What the AI found, for the doctor to see: urgency, the written analysis, the three likeliest conditions and the confidence. */
export function DiagnosisSummary({ p }: { p: Prediction }) {
  const t = useTheme();
  const conditions = (p.conditions ?? []).slice(0, 3);
  const color = p.urgency ? URGENCY_LEVELS[p.urgency].color : t.accent;
  return (
    <View testID="diagnosis-summary" style={{ gap: 12, marginTop: 12 }}>
      {p.urgency ? <UrgencyBanner urgency={p.urgency} /> : null}
      {p.details ? (
        <Card style={{ gap: 8 }}>
          <AppText variant="caption" tone="muted" style={{ letterSpacing: 1.2, fontWeight: '800', textTransform: 'uppercase' }}>AI analysis</AppText>
          <MedicalText text={p.details} />
        </Card>
      ) : null}
      {conditions.length ? (
        <Card style={{ gap: 2 }}>
          <AppText variant="caption" tone="muted" style={{ letterSpacing: 1.2, fontWeight: '800', textTransform: 'uppercase' }}>Potential conditions</AppText>
          {conditions.map((c, i) => <ConditionRow key={i} c={c} top={i === 0} />)}
        </Card>
      ) : null}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <AppText variant="caption" tone="muted" style={{ fontWeight: '700' }}>Overall confidence</AppText>
        <View style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: t.border }}>
          <View style={{ width: `${Math.max(0, Math.min(100, p.confidence))}%`, height: 6, borderRadius: 3, backgroundColor: color }} />
        </View>
        <AppText variant="caption" style={{ fontWeight: '800' }}>{p.confidence}%</AppText>
      </View>
    </View>
  );
}
