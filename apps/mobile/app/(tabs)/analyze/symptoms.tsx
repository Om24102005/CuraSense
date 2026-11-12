import { useMemo, useState } from 'react';
import { Pressable, SectionList, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { analyzeSymptoms, savePrediction } from '@curasense/shared/api/predictions';
import { mapSymptoms, toPrediction, type AnalysisResult, type Refusal } from '@curasense/shared/analysis';
import { SYMPTOMS, type Symptom } from '@curasense/shared/symptoms';
import { useTheme } from '../../../src/theme';
import { AppText } from '../../../src/ui/AppText';
import { Banner } from '../../../src/ui/Banner';
import { Button } from '../../../src/ui/Button';
import { Screen } from '../../../src/ui/Screen';
import { TextField } from '../../../src/ui/TextField';
import { radius } from '../../../src/ui/tokens';
import { Loading } from '../../../src/analyze/Loading';
import { ResultView } from '../../../src/analyze/ResultView';
import { WrongPageNotice } from '../../../src/analyze/WrongPageNotice';

const nameOf = (id: string) => SYMPTOMS.find((s) => s.id === id)?.name ?? '';

function SymptomRow({ item, checked, onToggle }: { item: Symptom; checked: boolean; onToggle: () => void }) {
  const t = useTheme();
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={item.name}
      testID={`symptom-${item.id}`}
      onPress={onToggle}
      style={({ pressed }) => ({
        flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 48, paddingHorizontal: 12, borderRadius: radius.md, borderWidth: 1,
        borderColor: checked ? t.accent : 'transparent', backgroundColor: checked ? `${t.primary}2e` : pressed ? t.card : 'transparent',
      })}
    >
      <Ionicons name={checked ? 'checkbox' : 'square-outline'} size={22} color={checked ? t.accent : t.textMuted} />
      <AppText style={{ flex: 1 }}>{item.name}</AppText>
    </Pressable>
  );
}

function Chip({ label, onRemove, custom }: { label: string; onRemove: () => void; custom?: boolean }) {
  const t = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Remove ${label}`}
      onPress={onRemove}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 999, borderWidth: 1, borderColor: custom ? t.success : t.accent, backgroundColor: custom ? t.successBg : `${t.primary}26` }}
    >
      <AppText variant="caption" style={{ fontWeight: '700' }}>{custom ? `✦ ${label}` : label}</AppText>
      <Ionicons name="close" size={14} color={t.textSecondary} />
    </Pressable>
  );
}

export default function Symptoms() {
  const t = useTheme();
  const [selected, setSelected] = useState<string[]>([]);
  const [custom, setCustom] = useState<string[]>([]);
  const [customInput, setCustomInput] = useState('');
  const [query, setQuery] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [outcome, setOutcome] = useState<{ result?: AnalysisResult; refusal?: Refusal } | null>(null);

  const count = selected.length + custom.length;
  const names = [...selected.map(nameOf), ...custom];

  const sections = useMemo(() => {
    const q = query.trim().toLowerCase();
    const byCategory = new Map<string, Symptom[]>();
    for (const s of SYMPTOMS) {
      if (q && !s.name.toLowerCase().includes(q) && !s.category.toLowerCase().includes(q)) continue;
      byCategory.set(s.category, [...(byCategory.get(s.category) ?? []), s]);
    }
    return [...byCategory].map(([title, data]) => ({ title, data }));
  }, [query]);

  const toggle = (id: string) => setSelected((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const addCustom = () => {
    const text = customInput.trim();
    if (text && !custom.includes(text)) setCustom((p) => [...p, text]);
    setCustomInput('');
  };

  const analyze = async () => {
    if (!count || busy) return;
    setBusy(true);
    setError('');
    const res = await analyzeSymptoms(names.join(', '));
    setBusy(false);
    if (res.error || !res.data) return setError(res.error || 'Could not reach the CuraSense server. Try again.');
    const mapped = mapSymptoms(res.data);
    if ('refusal' in mapped) return setOutcome({ refusal: mapped.refusal });
    setOutcome({ result: mapped.result });
    if (mapped.save) void savePrediction(toPrediction('symptom', mapped.result));
  };

  if (busy) {
    return <Screen edges={[]}><Loading title="Analysing your symptoms" detail={names.slice(0, 4).join(', ') + (names.length > 4 ? ` and ${names.length - 4} more` : '')} /></Screen>;
  }
  if (outcome?.refusal) {
    return (
      <Screen edges={[]}>
        <WrongPageNotice refusal={outcome.refusal} />
        <Button title="Back to symptoms" variant="secondary" onPress={() => setOutcome(null)} />
      </Screen>
    );
  }
  if (outcome?.result) {
    return <Screen edges={[]}><ResultView result={outcome.result} onReset={() => { setOutcome(null); setSelected([]); setCustom([]); }} /></Screen>;
  }

  const header = (
    <View style={{ gap: 12, paddingBottom: 8 }}>
      <AppText variant="callout" tone="secondary">Choose all symptoms you are currently experiencing.</AppText>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 48, paddingHorizontal: 12, borderRadius: radius.md, borderWidth: 1.5, borderColor: t.border, backgroundColor: t.surface }}>
        <Ionicons name="search" size={18} color={t.textMuted} />
        <TextInput
          testID="symptom-search"
          accessibilityLabel="Search symptoms"
          placeholder="Search symptoms..."
          placeholderTextColor={t.textMuted}
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode="while-editing"
          returnKeyType="search"
          style={{ flex: 1, color: t.text, fontSize: 17, paddingVertical: 10 }}
        />
      </View>
      {count > 0 ? (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {selected.map((id) => <Chip key={id} label={nameOf(id)} onRemove={() => toggle(id)} />)}
          {custom.map((c, i) => <Chip key={`c-${i}`} label={c} custom onRemove={() => setCustom((p) => p.filter((_, j) => j !== i))} />)}
          <Pressable accessibilityRole="button" onPress={() => { setSelected([]); setCustom([]); }} style={{ paddingVertical: 6, paddingHorizontal: 12 }}>
            <AppText variant="caption" tone="muted" style={{ fontWeight: '700' }}>Clear all</AppText>
          </Pressable>
        </View>
      ) : null}
      <TextField
        label="Can't find yours? Describe it"
        testID="custom-input"
        value={customInput}
        onChangeText={setCustomInput}
        placeholder={'e.g. "burning sensation in palms"'}
        returnKeyType="done"
        submitBehavior="submit"
        onSubmitEditing={addCustom}
      />
      <Button title="Add symptom" variant="secondary" testID="add-custom" disabled={!customInput.trim()} onPress={addCustom} />
      <AppText variant="caption" tone="muted" testID="selected-count">{count} symptom(s) selected</AppText>
    </View>
  );

  return (
    <SafeAreaView edges={[]} style={{ flex: 1, backgroundColor: t.bg }}>
      <SectionList
        sections={sections}
        keyExtractor={(s) => s.id}
        stickySectionHeadersEnabled
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={{ padding: 20, paddingBottom: 24 }}
        ListHeaderComponent={header}
        ListEmptyComponent={<AppText tone="secondary">No symptom matches your search. Add it above in your own words.</AppText>}
        renderSectionHeader={({ section }) => (
          <View style={{ backgroundColor: t.bg, paddingVertical: 8 }}>
            <AppText variant="caption" tone="muted" accessibilityRole="header" style={{ letterSpacing: 1.5, fontWeight: '800', textTransform: 'uppercase' }}>{section.title}</AppText>
          </View>
        )}
        renderItem={({ item }) => <SymptomRow item={item} checked={selected.includes(item.id)} onToggle={() => toggle(item.id)} />}
      />
      <View style={{ padding: 16, gap: 10, borderTopWidth: 1, borderTopColor: t.border, backgroundColor: t.bg }}>
        {error ? <Banner tone="error" testID="error">{error}</Banner> : null}
        <Button title={count ? `Analyze ${count} symptom${count > 1 ? 's' : ''}` : 'Select symptoms to analyze'} testID="analyze-button" disabled={!count} onPress={analyze} />
      </View>
    </SafeAreaView>
  );
}
