import { useState } from 'react';
import { FlatList, Pressable, RefreshControl, View, useWindowDimensions } from 'react-native';
import { Ionicons } from '../../../src/ui/Icon';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TYPE_LABELS, summarize } from '@curasense/shared/history';
import { usePredictions } from '../../../src/history/PredictionsContext';
import { LoadStatus, RowsLoading } from '../../../src/loaders';
import { PredictionRow } from '../../../src/history/parts';
import { useTheme } from '../../../src/theme';
import { AppText } from '../../../src/ui/AppText';
import { Banner } from '../../../src/ui/Banner';
import { Button } from '../../../src/ui/Button';
import { radius } from '../../../src/ui/tokens';

function MiniStat({ label, value, color, testID, wide }: { label: string; value: string; color: string; testID: string; wide?: boolean }) {
  return (
    <View style={{ flex: wide ? undefined : 1, gap: 2, padding: 12, borderRadius: radius.md, borderWidth: 1, borderColor: `${color}40`, backgroundColor: `${color}14` }}>
      <AppText testID={testID} variant="title" numberOfLines={1} adjustsFontSizeToFit style={{ fontWeight: '800' }}>{value}</AppText>
      <AppText variant="caption" tone="muted" numberOfLines={2}>{label}</AppText>
    </View>
  );
}

export default function HistoryList() {
  const t = useTheme();
  const router = useRouter();
  const { items, loading, error, refresh } = usePredictions();
  const [onlyLiked, setOnlyLiked] = useState(false);
  const [pulling, setPulling] = useState(false);
  const s = summarize(items);
  const wide = useWindowDimensions().fontScale > 1.3; // three tiles side by side stop fitting when the text is large
  const likedCount = items.filter((p) => p.liked).length;
  const shown = onlyLiked && likedCount ? items.filter((p) => p.liked) : items;

  const header = (
    <View style={{ gap: 14, paddingBottom: 14 }}>
      <LoadStatus loading={loading} pulling={pulling} />
      <View style={{ gap: 2 }}>
        <AppText variant="title" accessibilityRole="header">Analysis History</AppText>
        <AppText variant="callout" tone="secondary">View all your previous AI-powered medical analyses.</AppText>
      </View>
      {error ? <Banner tone="error" testID="error">{error}</Banner> : null}
      {items.length > 0 ? (
        <View style={{ flexDirection: wide ? 'column' : 'row', gap: 10 }}>
          <MiniStat wide={wide} testID="hist-total" label="Total" value={String(s.total)} color="#0ea5e9" />
          <MiniStat wide={wide} testID="hist-confidence" label="Avg confidence" value={`${s.avgConfidence}%`} color="#8b5cf6" />
          <MiniStat wide={wide} testID="hist-most" label="Most used" value={s.mostUsed ? TYPE_LABELS[s.mostUsed].replace(' Analysis', '') : 'N/A'} color="#10b981" />
        </View>
      ) : null}
      {likedCount > 0 ? (
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: onlyLiked }}
          testID="filter-liked"
          onPress={() => setOnlyLiked((v) => !v)}
          style={{ alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 40, paddingHorizontal: 14, borderRadius: radius.md, borderWidth: 1, borderColor: onlyLiked ? '#ec4899' : t.border, backgroundColor: onlyLiked ? '#ec489926' : t.card }}
        >
          <Ionicons name={onlyLiked ? 'heart' : 'heart-outline'} size={16} color="#ec4899" />
          <AppText variant="callout" style={{ fontWeight: '700' }}>{onlyLiked ? `Liked (${likedCount})` : `Show liked (${likedCount})`}</AppText>
        </Pressable>
      ) : null}
    </View>
  );

  return (
    <SafeAreaView edges={[]} style={{ flex: 1, backgroundColor: t.bg }}>
      <FlatList
        data={shown}
        keyExtractor={(p) => p.id}
        ListHeaderComponent={header}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        contentContainerStyle={{ padding: 20, paddingBottom: 32 }}
        refreshControl={<RefreshControl refreshing={pulling} tintColor={t.accent} onRefresh={async () => { setPulling(true); await refresh(); setPulling(false); }} />}
        ListEmptyComponent={
          loading ? <RowsLoading testID="no-history" /> : (
          <View style={{ alignItems: 'center', gap: 10, paddingVertical: 40 }}>
            <Ionicons name="time-outline" size={44} color={t.textMuted} />
            <AppText tone="muted" testID="no-history">{onlyLiked ? 'No liked analyses yet' : 'No analysis history yet'}</AppText>
            {!items.length ? <Button title="Run your first analysis" variant="secondary" onPress={() => router.push('/analyze')} /> : null}
          </View>
          )
        }
        renderItem={({ item }) => <PredictionRow p={item} onPress={() => router.push(`/history/${item.id}`)} />}
      />
    </SafeAreaView>
  );
}
