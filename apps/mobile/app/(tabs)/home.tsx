import { useState } from 'react';
import { Pressable, RefreshControl, View } from 'react-native';
import { Ionicons } from '../../src/ui/Icon';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { TYPE_COLORS, TYPE_LABELS, formatRelative, summarize, type PredictionType } from '@curasense/shared/history';
import { useAuth } from '../../src/auth/AuthContext';
import { usePredictions } from '../../src/history/PredictionsContext';
import { TypeIcon } from '../../src/history/parts';
import { useTheme } from '../../src/theme';
import { AppText } from '../../src/ui/AppText';
import { Banner } from '../../src/ui/Banner';
import { Button } from '../../src/ui/Button';
import { Card } from '../../src/ui/Card';
import { Screen } from '../../src/ui/Screen';
import { radius } from '../../src/ui/tokens';

type Icon = keyof typeof Ionicons.glyphMap;

function StatTile({ label, badge, value, icon, from, to, testID }: { label: string; badge: string; value: string; icon: Icon; from: string; to: string; testID: string }) {
  return (
    <LinearGradient colors={[from, to]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1, minHeight: 112, padding: 14, borderRadius: radius.lg, justifyContent: 'space-between' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ padding: 7, borderRadius: 9, backgroundColor: 'rgba(255,255,255,0.22)' }}><Ionicons name={icon} size={16} color="#fff" /></View>
        <View style={{ paddingVertical: 2, paddingHorizontal: 8, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.25)' }}>
          <AppText variant="caption" style={{ color: '#fff', fontSize: 10, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase' }}>{badge}</AppText>
        </View>
      </View>
      <View>
        <AppText testID={testID} style={{ color: '#fff', fontSize: 26, fontWeight: '900' }}>{value}</AppText>
        <AppText variant="caption" style={{ color: 'rgba(255,255,255,0.85)' }}>{label}</AppText>
      </View>
    </LinearGradient>
  );
}

const ACTIONS: { href: '/analyze/symptoms' | '/analyze/scans' | '/analyze/reports'; icon: Icon; label: string; desc: string; from: string; to: string }[] = [
  { href: '/analyze/symptoms', icon: 'medkit', label: 'Symptom Check', desc: 'Analyze your symptoms', from: '#0ea5e9', to: '#6366f1' },
  { href: '/analyze/scans', icon: 'scan', label: 'Upload Scan', desc: 'Analyze medical images', from: '#8b5cf6', to: '#6d28d9' },
  { href: '/analyze/reports', icon: 'flask', label: 'Lab Report', desc: 'Analyze test results', from: '#ec4899', to: '#be185d' },
];

export default function Home() {
  const t = useTheme();
  const router = useRouter();
  const { user } = useAuth();
  const { items, loading, error, refresh } = usePredictions();
  const [pulling, setPulling] = useState(false);
  const s = summarize(items);
  const first = user?.name?.split(' ')[0];
  const recent = items.slice(0, 3);

  return (
    <Screen
      edges={[]}
      refreshControl={<RefreshControl refreshing={pulling} tintColor={t.accent} onRefresh={async () => { setPulling(true); await refresh(); setPulling(false); }} />}
    >
      <View style={{ gap: 4 }}>
        <AppText variant="title" testID="greeting">{first ? `Welcome back, ${first}` : 'Welcome back'}</AppText>
        <AppText variant="callout" tone="secondary">Here is your health analysis overview.</AppText>
      </View>

      {error && !items.length ? <Banner tone="error" testID="error">{error}</Banner> : null}

      <View style={{ gap: 12 }}>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <StatTile testID="stat-total" label="Total Analyses" badge="All time" value={String(s.total)} icon="locate-outline" from="#0ea5e9" to="#6366f1" />
          <StatTile testID="stat-today" label="Today's Analyses" badge="Today" value={String(s.today)} icon="calendar-outline" from="#10b981" to="#059669" />
        </View>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <StatTile testID="stat-confidence" label="Avg Confidence" badge="Avg" value={`${s.avgConfidence}%`} icon="trending-up-outline" from="#8b5cf6" to="#6d28d9" />
          <StatTile testID="stat-latest" label="Latest analysis" badge="Latest" value={s.latest ? formatRelative(s.latest) : 'None yet'} icon="time-outline" from="#f59e0b" to="#d97706" />
        </View>
      </View>

      <Card style={{ gap: 12 }}>
        <View>
          <AppText variant="headline">Quick Actions</AppText>
          <AppText variant="caption" tone="muted">Start a new analysis</AppText>
        </View>
        {ACTIONS.map((a) => (
          <Pressable
            key={a.href}
            accessibilityRole="button"
            accessibilityLabel={`${a.label}. ${a.desc}`}
            testID={`action-${a.href.split('/').pop()}`}
            onPress={() => router.push(a.href)}
            style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, minHeight: 64, borderRadius: radius.md, borderWidth: 1, borderColor: t.border, backgroundColor: pressed ? t.surface : 'transparent' })}
          >
            <LinearGradient colors={[a.from, a.to]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name={a.icon} size={20} color="#fff" />
            </LinearGradient>
            <View style={{ flex: 1 }}>
              <AppText variant="headline">{a.label}</AppText>
              <AppText variant="caption" tone="muted">{a.desc}</AppText>
            </View>
            <Ionicons name="chevron-forward" size={18} color={t.textMuted} />
          </Pressable>
        ))}
      </Card>

      <Card style={{ gap: 14 }}>
        <View>
          <AppText variant="headline">Analysis Types</AppText>
          <AppText variant="caption" tone="muted">Breakdown by category</AppText>
        </View>
        {s.total === 0 ? (
          <View style={{ alignItems: 'center', gap: 8, paddingVertical: 18 }}>
            <Ionicons name="alert-circle-outline" size={36} color={t.textMuted} />
            <AppText variant="callout" tone="muted" testID="no-analyses">{loading ? 'Loading your analyses…' : 'No analyses yet'}</AppText>
          </View>
        ) : (
          <View style={{ gap: 14 }}>
            {(Object.keys(s.byType) as PredictionType[]).map((type) => (
              <View key={type} style={{ gap: 6 }} testID={`type-${type}`}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <AppText variant="callout" tone="secondary">{TYPE_LABELS[type]}</AppText>
                  <AppText variant="callout" style={{ fontWeight: '800' }}>{s.byType[type]}</AppText>
                </View>
                <View style={{ height: 6, borderRadius: 3, backgroundColor: t.border }}>
                  <View style={{ width: `${((s.byType[type] ?? 0) / s.total) * 100}%`, height: 6, borderRadius: 3, backgroundColor: TYPE_COLORS[type] }} />
                </View>
              </View>
            ))}
            <Button title="View full history" variant="secondary" onPress={() => router.push('/history')} />
          </View>
        )}
      </Card>

      <Card style={{ gap: 12 }}>
        <View>
          <AppText variant="headline">Recent Analyses</AppText>
          <AppText variant="caption" tone="muted">Your latest predictions</AppText>
        </View>
        {recent.length === 0 ? (
          <AppText variant="callout" tone="muted" style={{ textAlign: 'center', paddingVertical: 14 }}>No analyses yet</AppText>
        ) : recent.map((p) => (
          <Pressable
            key={p.id}
            accessibilityRole="button"
            accessibilityLabel={`${p.diagnosis}, ${formatRelative(p.timestamp)}`}
            testID={`recent-${p.id}`}
            onPress={() => router.push(`/history/${p.id}`)}
            style={({ pressed }) => ({ flexDirection: 'row', gap: 12, padding: 12, borderRadius: radius.md, borderWidth: 1, borderColor: t.border, backgroundColor: pressed ? t.surface : 'transparent' })}
          >
            <TypeIcon type={p.type} size={36} />
            <View style={{ flex: 1, gap: 2 }}>
              <AppText variant="headline" numberOfLines={1}>{p.diagnosis}</AppText>
              <AppText variant="caption" tone="muted">{formatRelative(p.timestamp)}</AppText>
              {p.details ? <AppText variant="caption" tone="secondary" numberOfLines={2}>{p.details.replace(/[#*>_`-]/g, '').trim()}</AppText> : null}
            </View>
          </Pressable>
        ))}
      </Card>
    </Screen>
  );
}
