import { Pressable, View } from 'react-native';
import { Ionicons } from '../../../src/ui/Icon';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { URGENCY_LEVELS } from '@curasense/shared/analysis';
import { TYPE_COLORS, formatAbsolute } from '@curasense/shared/history';
import { BiomarkerCard, ConditionRow, DISCLAIMER, UrgencyBanner } from '../../../src/analyze/ResultView';
import { Loading } from '../../../src/analyze/Loading';
import { MedicalText } from '../../../src/analyze/MedicalText';
import { usePredictions } from '../../../src/history/PredictionsContext';
import { ConfidenceChip, DetailSection, TypeBadge } from '../../../src/history/parts';
import { useTheme } from '../../../src/theme';
import { ShareButton } from '../../../src/ui/ShareButton';
import { AppText } from '../../../src/ui/AppText';
import { Button } from '../../../src/ui/Button';
import { Screen } from '../../../src/ui/Screen';

export default function HistoryDetail() {
  const t = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { items, loading, toggleLike } = usePredictions();
  const p = items.find((x) => x.id === id);

  if (!p) {
    return (
      <Screen edges={[]}>
        {loading ? <Loading title="Loading your analysis" /> : (
          <View style={{ gap: 14, alignItems: 'center', paddingVertical: 40 }}>
            <AppText tone="muted" testID="not-found">This analysis could not be found.</AppText>
            <Button title="Back to history" variant="secondary" onPress={() => router.replace('/history')} />
          </View>
        )}
      </Screen>
    );
  }

  const color = TYPE_COLORS[p.type];
  const urgency = p.urgency ? URGENCY_LEVELS[p.urgency] : null;
  const conditions = p.conditions ?? [];
  const biomarkers = p.biomarkers ?? [];
  const sections = (p.scanSections ?? []).filter((s) => s.title || s.findings?.length);

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable accessibilityRole="button" accessibilityLabel={p.liked ? 'Remove from liked' : 'Add to liked'} testID="like-button" hitSlop={12} onPress={() => toggleLike(p.id)}>
              <Ionicons name={p.liked ? 'heart' : 'heart-outline'} size={24} color="#ec4899" />
            </Pressable>
          ),
        }}
      />
      <Screen edges={[]}>
        <View testID="detail" style={{ gap: 16 }}>
          <View style={{ gap: 8 }}>
            <TypeBadge type={p.type} suffix="Full report" />
            <AppText variant="title" accessibilityRole="header">{p.diagnosis}</AppText>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <Ionicons name="time-outline" size={13} color={t.textMuted} />
              <AppText variant="caption" tone="muted">{formatAbsolute(p.timestamp)}</AppText>
            </View>
          </View>

          <View style={{ gap: 6 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <AppText variant="caption" tone="muted" style={{ letterSpacing: 1.2, fontWeight: '700' }}>OVERALL CONFIDENCE</AppText>
              <ConfidenceChip value={p.confidence} />
            </View>
            <View style={{ height: 9, borderRadius: 5, backgroundColor: t.border }}>
              <View style={{ width: `${Math.max(0, Math.min(100, p.confidence))}%`, height: 9, borderRadius: 5, backgroundColor: color }} />
            </View>
          </View>

          <DetailSection icon="shield-checkmark" title="Urgency assessment" color={urgency?.color ?? color}>
            {p.urgency ? <UrgencyBanner urgency={p.urgency} /> : (
              <AppText variant="callout" tone="muted" style={{ textAlign: 'center' }}>Urgency data is not available for this record. Run a new analysis to capture full triage information.</AppText>
            )}
          </DetailSection>

          {p.details ? <DetailSection icon="medkit" title="Clinical assessment" color={color}><MedicalText text={p.details} /></DetailSection> : null}

          {conditions.length || p.type === 'symptom' ? (
            <DetailSection icon="search" title="Potential conditions" color={color}>
              {conditions.length
                ? conditions.map((c, i) => <ConditionRow key={i} c={c} top={i === 0} />)
                : <AppText variant="callout" tone="muted" style={{ textAlign: 'center' }}>Condition probabilities are not available for this record. Run a new analysis for a full differential diagnosis.</AppText>}
            </DetailSection>
          ) : null}

          {biomarkers.length ? (
            <DetailSection icon="flask" title="Blood biomarker panel" color={color}>
              {biomarkers.map((b, i) => <BiomarkerCard key={i} b={b} />)}
            </DetailSection>
          ) : null}

          {sections.length ? (
            <DetailSection icon="scan" title="Scan findings" color={color}>
              {sections.map((s, i) => (
                <View key={i} style={{ gap: 6 }}>
                  {s.title ? <AppText variant="caption" style={{ color, fontWeight: '800', letterSpacing: 1.2, textTransform: 'uppercase' }}>{s.title}</AppText> : null}
                  {(s.findings ?? []).map((f, j) => (
                    <View key={j} style={{ flexDirection: 'row', gap: 8 }}>
                      <View style={{ width: 6, height: 6, borderRadius: 3, marginTop: 8, backgroundColor: color }} />
                      <AppText variant="callout" style={{ flex: 1, lineHeight: 22 }}>{f}</AppText>
                    </View>
                  ))}
                </View>
              ))}
            </DetailSection>
          ) : null}

          {p.recommendations.length ? (
            <DetailSection icon="checkmark-circle" title="Recommendations and treatment plan" color={color}>
              {p.recommendations.map((r, i) => (
                <View key={i} style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
                  <View style={{ minWidth: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: t.primary }}>
                    <AppText variant="caption" style={{ color: '#fff', fontWeight: '800' }}>{i + 1}</AppText>
                  </View>
                  <AppText variant="callout" style={{ flex: 1, lineHeight: 22 }}>{r}</AppText>
                </View>
              ))}
            </DetailSection>
          ) : null}

          <AppText variant="caption" tone="muted">{DISCLAIMER}</AppText>
          <ShareButton result={p} />
        </View>
      </Screen>
    </>
  );
}
