import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mapSymptoms, mapReport, mapScans, toPrediction } from '../src/analysis.ts';
import { parseSections } from '../src/medicalText.ts';

test('symptoms: a structured answer is mapped and saved; urgency outside the four levels becomes medium', () => {
  const m = mapSymptoms({ analysis: { assessment: 'Likely a cold.', urgency: 'High', confidence: 91, conditions: [{ name: 'Cold', probability: 70 }], recommendations: ['Rest'] } });
  assert.ok('result' in m && m.save);
  assert.equal(m.result.urgency, 'high');
  assert.equal(m.result.confidence, 91);
  assert.deepEqual(m.result.recommendations, ['Rest']);
  assert.equal((mapSymptoms({ analysis: { assessment: 'x', urgency: 'critical' } }) as any).result.urgency, 'medium');
});

test('symptoms: a JSON string in data.result is used, and a double-encoded assessment is unwrapped', () => {
  const fromResult = mapSymptoms({ result: JSON.stringify({ assessment: 'From the legacy field', urgency: 'low' }) }) as any;
  assert.equal(fromResult.result.details, 'From the legacy field');
  const wrapped = mapSymptoms({ analysis: { assessment: JSON.stringify({ text: 'Inner text' }) } }) as any;
  assert.equal(wrapped.result.details, 'Inner text');
  const bare = mapSymptoms({ analysis: {} }) as any;
  assert.match(bare.result.details, /Analysis complete/);
  assert.equal(bare.result.recommendations.length, 3);
});

test('a refusal carries the message and the page to use instead, and is never saved', () => {
  const m = mapSymptoms({ analysis: { error: 'This is a scan.', redirect: { page: 'scans' } } });
  assert.deepEqual(m, { refusal: { message: 'This is a scan.', redirect: { page: 'scans' } } });
  assert.ok('refusal' in mapReport({ analysis: { error: 'x', redirect: { page: 'symptoms' } } }));
});

test('report: a busy service is not blamed on the file, and nothing is saved on an error', () => {
  const busy = mapReport({ analysis: { error: 'The AI service did not respond. Try again in a minute.' } }) as any;
  assert.equal(busy.result.diagnosis, 'AI Service Busy');
  assert.equal(busy.save, false);
  const unreadable = mapReport({ analysis: { error: 'No text found' } }) as any;
  assert.equal(unreadable.result.diagnosis, 'Could Not Read Report');
  const ok = mapReport({ analysis: { assessment: 'All fine', biomarkers: [{ name: 'HbA1c', value: 5.4, unit: '%', status: 'normal', normal_min: 4, normal_max: 5.6 }] } }) as any;
  assert.equal(ok.save, true);
  assert.equal(ok.result.biomarkers.length, 1);
});

test('scans: one refused file among several; confidence is the mean of the analysed ones; a failed upload is noted', () => {
  const m = mapScans([
    { name: 'a.png', data: { vision_analysis: { analysis: 'Finding A', detected_kind: 'xray', detected_confidence: 90 } } },
    { name: 'b.png', data: { vision_analysis: { analysis: 'Finding B', detected_confidence: 80 } } },
    { name: 'c.png', data: { vision_analysis: { error: 'Not an X-ray', redirect: { page: 'reports' } } } },
  ], 4);
  assert.equal(m.save, true);
  assert.equal(m.result.confidence, 85);
  assert.equal(m.result.diagnosis, 'Multi-Scan Radiology Assessment (2/4)');
  assert.equal(m.result.scanSections?.[2].refusal?.message, 'Not an X-ray');
  assert.match(m.result.details, /1 file failed to analyze/);
  const none = mapScans([{ name: 'c.png', data: { vision_analysis: { error: 'No' } } }], 1);
  assert.equal(none.save, false);
  assert.equal(none.result.diagnosis, 'Not Analysed');
  assert.equal(none.result.confidence, null);
});

test('the saved history record has a numeric confidence and the type', () => {
  const rec = toPrediction('image', { diagnosis: 'x', confidence: null, details: '', recommendations: [] });
  assert.equal(rec.type, 'image');
  assert.equal(rec.confidence, 0);
});

test('result text is split into titled sections', () => {
  const s = parseSections('Intro line\n## Findings\n- one\n- two\n**Risks**\nSome risk');
  assert.deepEqual(s.map((x) => x.title), ['', 'Findings', 'Risks']);
  assert.equal(s[1].lines.filter((l) => l.trim()).length, 2);
  assert.equal(parseSections('just text').length, 1);
});
