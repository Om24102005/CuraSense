import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { URGENCY_LEVELS } from '@curasense/shared/analysis';
import { TYPE_COLORS, TYPE_LABELS, formatRelative, type Prediction, type PredictionType } from '@curasense/shared/history';
import { useTheme } from '../theme';
import { AppText } from '../ui/AppText';
import { radius } from '../ui/tokens';
import { Chip } from '../analyze/ResultView';

type Icon = keyof typeof Ionicons.glyphMap;
const TYPE_ICONS: Record<PredictionType, Icon> = { symptom: 'medkit', image: 'scan', report: 'flask' };

export function TypeIcon({ type, size = 40 }: { type: PredictionType; size?: number }) {
  const color = TYPE_COLORS[type];
  return (
    <View style={{ width: size, height: size, borderRadius: size / 3.4, alignItems: 'center', justifyContent: 'center', backgroundColor: `${color}26` }}>
      <Ionicons name={TYPE_ICONS[type]} size={size * 0.5} color={color} />
    </View>
  );
}

export function TypeBadge({ type, suffix }: { type: PredictionType; suffix?: string }) {
  const color = TYPE_COLORS[type];
  return (
    <View style={{ alignSelf: 'flex-start', paddingVertical: 2, paddingHorizontal: 9, borderRadius: 999, backgroundColor: `${color}1f`, borderWidth: 1, borderColor: `${color}4d` }}>
      <AppText variant="caption" style={{ color, fontWeight: '800', letterSpacing: 0.8, textTransform: 'uppercase', fontSize: 10 }}>{TYPE_LABELS[type]}{suffix ? ` · ${suffix}` : ''}</AppText>
    </View>
  );
}

export function ConfidenceChip({ value }: { value: number }) {
  return <Chip text={`${value}%`} color={value >= 80 ? '#10b981' : '#f59e0b'} />;
}

export function UrgencyChip({ urgency }: { urgency: NonNullable<Prediction['urgency']> }) {
  const u = URGENCY_LEVELS[urgency];
  return <Chip text={u.label} color={u.color} />;
}

/** One analysis in a list: what it was, how urgent, how sure, and when. */
export function PredictionRow({ p, onPress }: { p: Prediction; onPress: () => void }) {
  const t = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${TYPE_LABELS[p.type]}: ${p.diagnosis}, ${formatRelative(p.timestamp)}`}
      testID={`prediction-${p.id}`}
      onPress={onPress}
      style={({ pressed }) => ({ gap: 10, padding: 14, borderRadius: radius.lg, borderWidth: 1, borderColor: t.border, backgroundColor: pressed ? t.surface : t.card })}
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
        <TypeIcon type={p.type} />
        <View style={{ flex: 1, gap: 4 }}>
          <TypeBadge type={p.type} />
          <AppText variant="headline" numberOfLines={2}>{p.diagnosis}</AppText>
        </View>
        {p.liked ? <Ionicons name="heart" size={18} color="#ec4899" /> : null}
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 6 }}>
        {p.urgency ? <UrgencyChip urgency={p.urgency} /> : null}
        <ConfidenceChip value={p.confidence} />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, borderTopWidth: 1, borderTopColor: t.border }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <Ionicons name="time-outline" size={13} color={t.textMuted} />
          <AppText variant="caption" tone="muted">{formatRelative(p.timestamp)}</AppText>
        </View>
        <Ionicons name="chevron-forward" size={16} color={t.textMuted} />
      </View>
    </Pressable>
  );
}

/** A titled block of a full report. */
export function DetailSection({ icon, title, color, children }: { icon: Icon; title: string; color: string; children: ReactNode }) {
  const t = useTheme();
  return (
    <View style={{ gap: 12, padding: 16, borderRadius: radius.lg, borderWidth: 1, borderColor: t.border, backgroundColor: t.card }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: t.border }}>
        <Ionicons name={icon} size={16} color={color} />
        <AppText variant="caption" accessibilityRole="header" style={{ color: t.textMuted, fontWeight: '800', letterSpacing: 1.4, textTransform: 'uppercase', flex: 1 }}>{title}</AppText>
      </View>
      {children}
    </View>
  );
}
