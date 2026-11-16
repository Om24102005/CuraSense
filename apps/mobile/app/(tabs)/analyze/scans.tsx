import { useMemo, useState } from 'react';
import { Modal, Pressable, SectionList, TextInput, View } from 'react-native';
import { Ionicons } from '../../../src/ui/Icon';
import { SafeAreaView } from 'react-native-safe-area-context';
import { analyzeImage } from '@curasense/shared/api/predictions';
import { mapScans, toPrediction, type AnalysisResult } from '@curasense/shared/analysis';
import { scanFileProblem } from '@curasense/shared/files';
import { MAX_FILES, SCAN_GROUPS, SCAN_TYPES, modalityOf, regionsOf, studyLabel } from '@curasense/shared/scans';
import { usePredictions } from '../../../src/history/PredictionsContext';
import { useTheme } from '../../../src/theme';
import { AppText } from '../../../src/ui/AppText';
import { Banner } from '../../../src/ui/Banner';
import { Button } from '../../../src/ui/Button';
import { Screen } from '../../../src/ui/Screen';
import { TextField } from '../../../src/ui/TextField';
import { radius } from '../../../src/ui/tokens';
import { AddFiles, FileRow } from '../../../src/analyze/FileParts';
import { Loading } from '../../../src/analyze/Loading';
import { pickFiles, pickPhotos, takePhoto, uploadable, type PickedFile } from '../../../src/analyze/pick';
import { ResultView } from '../../../src/analyze/ResultView';

/** A sheet to choose the kind of study: the AI service refuses a file that does not fit it. */
function StudyPicker({ visible, value, onSelect, onClose }: { visible: boolean; value: string; onSelect: (id: string) => void; onClose: () => void }) {
  const t = useTheme();
  const [query, setQuery] = useState('');
  const sections = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SCAN_GROUPS
      .map((g) => ({ title: g.label, data: SCAN_TYPES.filter(g.filter).filter((s) => !q || `${s.name} ${s.description} ${g.label}`.toLowerCase().includes(q)) }))
      .filter((s) => s.data.length);
  }, [query]);
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: t.bg }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 }}>
          <AppText variant="title" accessibilityRole="header">Scan type</AppText>
          <Button title="Done" variant="link" testID="study-done" onPress={onClose} />
        </View>
        <View style={{ marginHorizontal: 16, marginBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 48, paddingHorizontal: 12, borderRadius: radius.md, borderWidth: 1.5, borderColor: t.border, backgroundColor: t.surface }}>
          <Ionicons name="search" size={18} color={t.textMuted} />
          <TextInput testID="study-search" accessibilityLabel="Search scan types" placeholder="Search scan types..." placeholderTextColor={t.textMuted} value={query} onChangeText={setQuery} autoCorrect={false} autoCapitalize="none" clearButtonMode="while-editing" style={{ flex: 1, minHeight: 44, color: t.text, fontSize: 17, paddingVertical: 10 }} />
        </View>
        <SectionList
          sections={sections}
          keyExtractor={(s) => s.id}
          stickySectionHeadersEnabled
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          renderSectionHeader={({ section }) => (
            <View style={{ backgroundColor: t.bg, paddingVertical: 8 }}>
              <AppText variant="caption" tone="muted" accessibilityRole="header" style={{ letterSpacing: 1.5, fontWeight: '800', textTransform: 'uppercase' }}>{section.title}</AppText>
            </View>
          )}
          renderItem={({ item }) => {
            const selected = item.id === value;
            return (
              <Pressable
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                accessibilityLabel={`${item.name}. ${item.description}`}
                testID={`study-${item.id}`}
                onPress={() => { onSelect(item.id); onClose(); }}
                style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 56, paddingVertical: 8, paddingHorizontal: 12, borderRadius: radius.md, backgroundColor: selected ? `${t.primary}2e` : pressed ? t.card : 'transparent' })}
              >
                <View style={{ flex: 1 }}>
                  <AppText variant="headline">{item.name}</AppText>
                  <AppText variant="caption" tone="muted">{item.description}</AppText>
                </View>
                {selected ? <Ionicons name="checkmark" size={20} color={t.accent} /> : null}
              </Pressable>
            );
          }}
        />
      </SafeAreaView>
    </Modal>
  );
}

export default function Scans() {
  const t = useTheme();
  const { add: saveResult } = usePredictions();
  const [study, setStudy] = useState('xray-chest');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [files, setFiles] = useState<PickedFile[]>([]);
  const [context, setContext] = useState('');
  const [warnings, setWarnings] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const selected = SCAN_TYPES.find((s) => s.id === study);

  const add = async (pick: () => Promise<PickedFile[]>) => {
    setError('');
    let picked: PickedFile[];
    try { picked = await pick(); } catch (e) { return setError(e instanceof Error ? e.message : 'Could not open the picker.'); }
    if (!picked.length) return;
    const slots = MAX_FILES - files.length;
    if (slots <= 0) return setWarnings([`Maximum ${MAX_FILES} files allowed.`]);
    const warn: string[] = [];
    const ok: PickedFile[] = [];
    for (const f of picked.slice(0, slots)) {
      const problem = scanFileProblem(f);
      if (problem) warn.push(`${f.name}: ${problem}`); else ok.push(f);
    }
    if (picked.length > slots) warn.push(`Only ${slots} of ${picked.length} files added: the limit is ${MAX_FILES}.`);
    setWarnings(warn);
    setFiles((p) => [...p, ...ok]);
  };

  const analyze = async () => {
    if (!files.length || busy) return;
    setBusy(true);
    setError('');
    const settled = await Promise.allSettled(files.map(async (f) => {
      const res = await analyzeImage(await uploadable(f), modalityOf(study), studyLabel(study), context.trim(), regionsOf(study));
      if (res.error || !res.data) throw new Error(res.error || `Server error on ${f.name}`);
      return { name: f.name, data: res.data };
    }));
    setBusy(false);
    const done = settled.flatMap((s) => (s.status === 'fulfilled' ? [s.value] : []));
    if (!done.length) {
      const first = settled.find((s): s is PromiseRejectedResult => s.status === 'rejected');
      return setError(first?.reason instanceof Error ? first.reason.message : 'All scans failed to analyze.');
    }
    const mapped = mapScans(done, files.length);
    setResult(mapped.result);
    if (mapped.save) void saveResult(toPrediction('image', mapped.result));
  };

  if (busy) return <Screen edges={[]}><Loading title="Reading your scan" detail={files.length > 1 ? `${files.length} files` : files[0]?.name} /></Screen>;
  if (result) return <Screen edges={[]}><ResultView type="image" result={result} onReset={() => { setResult(null); setFiles([]); setWarnings([]); }} /></Screen>;

  return (
    <Screen edges={[]}>
      <AppText variant="callout" tone="secondary">Upload X-rays, CT scans, MRIs or other medical images: JPG, PNG, DICOM, ZIP (a whole study) or PDF.</AppText>

      <View style={{ gap: 6 }}>
        <AppText variant="callout" tone="secondary">Scan type</AppText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Scan type: ${selected?.name}. Change`}
          testID="study-trigger"
          onPress={() => setPickerOpen(true)}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 56, paddingHorizontal: 14, borderRadius: radius.md, borderWidth: 1.5, borderColor: t.border, backgroundColor: t.surface }}
        >
          <View style={{ flex: 1 }}>
            <AppText variant="headline" numberOfLines={1}>{selected?.name ?? 'Select scan type'}</AppText>
            <AppText variant="caption" tone="muted" numberOfLines={1}>{selected?.description}</AppText>
          </View>
          <Ionicons name="chevron-down" size={18} color={t.textMuted} />
        </Pressable>
      </View>
      <StudyPicker visible={pickerOpen} value={study} onSelect={setStudy} onClose={() => setPickerOpen(false)} />

      <View style={{ gap: 10 }}>
        <AppText variant="callout" tone="secondary" testID="files-count">Scan files · {files.length}/{MAX_FILES}</AppText>
        {files.map((f, i) => <FileRow key={`${f.uri}-${i}`} file={f} onRemove={() => setFiles((p) => p.filter((_, j) => j !== i))} />)}
        <AddFiles disabled={files.length >= MAX_FILES} onPhotos={() => add(() => pickPhotos(MAX_FILES - files.length))} onCamera={() => add(takePhoto)} onFiles={() => add(() => pickFiles(true))} />
      </View>

      {warnings.map((w, i) => <Banner key={i} tone="error" testID="warning">{w}</Banner>)}

      <TextField label="Additional clinical context (optional)" testID="context-input" value={context} onChangeText={setContext} multiline placeholder={"e.g. 'Patient has 3-week history of productive cough. Looking for infiltrates or consolidation in lower lobes.'"} style={{ minHeight: 84, textAlignVertical: 'top' }} />

      {error ? <Banner tone="error" testID="error">{error}</Banner> : null}
      <Button title={files.length > 1 ? `Analyze ${files.length} files` : 'Analyze with AI'} testID="analyze-button" disabled={!files.length} onPress={analyze} />
    </Screen>
  );
}
