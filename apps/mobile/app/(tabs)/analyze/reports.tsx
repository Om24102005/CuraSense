import { useState } from 'react';
import { View } from 'react-native';
import { analyzeReportFile, analyzeReportText } from '@curasense/shared/api/predictions';
import { mapReport, toPrediction, type AnalysisResult, type Refusal } from '@curasense/shared/analysis';
import { reportFileProblem } from '@curasense/shared/files';
import { SAMPLE_REPORT } from '@curasense/shared/sampleReport';
import { usePredictions } from '../../../src/history/PredictionsContext';
import { AppText } from '../../../src/ui/AppText';
import { Banner } from '../../../src/ui/Banner';
import { Button } from '../../../src/ui/Button';
import { Screen } from '../../../src/ui/Screen';
import { Segmented } from '../../../src/ui/Segmented';
import { TextField } from '../../../src/ui/TextField';
import { AddFiles, FileRow } from '../../../src/analyze/FileParts';
import { Loading } from '../../../src/analyze/Loading';
import { pickFiles, pickPhotos, takePhoto, uploadable, type PickedFile } from '../../../src/analyze/pick';
import { ResultView } from '../../../src/analyze/ResultView';
import { WrongPageNotice } from '../../../src/analyze/WrongPageNotice';

const MAX_TEXT = 60000;

export default function Reports() {
  const { add } = usePredictions();
  const [mode, setMode] = useState<'paste' | 'upload'>('paste');
  const [text, setText] = useState('');
  const [file, setFile] = useState<PickedFile | null>(null);
  const [context, setContext] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [outcome, setOutcome] = useState<{ result?: AnalysisResult; refusal?: Refusal } | null>(null);

  const ready = mode === 'paste' ? text.trim().length > 0 : !!file;

  const choose = async (pick: () => Promise<PickedFile[]>) => {
    setError('');
    let picked: PickedFile[];
    try { picked = await pick(); } catch (e) { return setError(e instanceof Error ? e.message : 'Could not open the picker.'); }
    const f = picked[0];
    if (!f) return;
    const problem = reportFileProblem(f);
    if (problem) { setFile(null); return setOutcome({ refusal: problem }); }
    setFile(f);
  };

  const analyze = async () => {
    if (!ready || busy) return;
    setBusy(true);
    setError('');
    const ctx = context.trim();
    const res = mode === 'upload' && file ? await analyzeReportFile(await uploadable(file), ctx) : await analyzeReportText(text, ctx);
    setBusy(false);
    if (res.error || !res.data) return setError(res.error || 'Could not reach the CuraSense server. Try again.');
    const mapped = mapReport(res.data);
    if ('refusal' in mapped) return setOutcome({ refusal: mapped.refusal });
    setOutcome({ result: mapped.result });
    if (mapped.save) void add(toPrediction('report', mapped.result));
  };

  if (busy) return <Screen edges={[]}><Loading title="Reading your report" detail={mode === 'upload' ? file?.name : `${text.length.toLocaleString()} characters`} /></Screen>;
  if (outcome?.refusal) {
    return (
      <Screen edges={[]}>
        <WrongPageNotice refusal={outcome.refusal} />
        <Button title="Back to the report" variant="secondary" onPress={() => setOutcome(null)} />
      </Screen>
    );
  }
  if (outcome?.result) return <Screen edges={[]}><ResultView result={outcome.result} onReset={() => { setOutcome(null); setText(''); setFile(null); }} /></Screen>;

  return (
    <Screen edges={[]}>
      <View style={{ gap: 6 }}>
        <AppText variant="callout" tone="secondary">Blood, lab and biomarker reports only: CBC, lipid panel, HbA1c and so on.</AppText>
        <AppText variant="caption" tone="muted">Radiology scans (X-ray, CT, MRI, ultrasound, DICOM) belong on the Scans screen.</AppText>
      </View>

      <Segmented value={mode} onChange={setMode} options={[{ value: 'paste', label: 'Paste text' }, { value: 'upload', label: 'Upload file' }]} />

      {mode === 'paste' ? (
        <View style={{ gap: 8 }}>
          <TextField
            label="Report text"
            testID="report-text"
            value={text}
            onChangeText={setText}
            multiline
            maxLength={MAX_TEXT}
            autoCorrect={false}
            placeholder="Paste your lab report here... Include parameter names and values."
            style={{ minHeight: 200, textAlignVertical: 'top' }}
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <AppText variant="caption" tone="muted">{text.length.toLocaleString()} / {MAX_TEXT.toLocaleString()} characters</AppText>
            <Button title="Load sample report" variant="link" testID="load-sample" onPress={() => setText(SAMPLE_REPORT)} />
          </View>
        </View>
      ) : (
        <View style={{ gap: 10 }}>
          <AppText variant="callout" tone="secondary">A PDF, a photo of the report, a Word or Excel file, text or a ZIP of pages. Up to 25 MB (40 MB for Word, Excel and ZIP).</AppText>
          {file ? <FileRow file={file} onRemove={() => setFile(null)} /> : null}
          <AddFiles onPhotos={() => choose(() => pickPhotos(1))} onCamera={() => choose(takePhoto)} onFiles={() => choose(() => pickFiles(false))} />
        </View>
      )}

      <TextField label="Additional context (optional)" testID="context-input" value={context} onChangeText={setContext} multiline placeholder={"e.g. 'Patient is diabetic, 52 years old. Please focus on kidney function and flag any early CKD markers.'"} style={{ minHeight: 84, textAlignVertical: 'top' }} />

      {error ? <Banner tone="error" testID="error">{error}</Banner> : null}
      <Button title="Analyze report" testID="analyze-button" disabled={!ready} onPress={analyze} />
    </Screen>
  );
}
