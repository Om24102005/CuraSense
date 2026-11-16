import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DISCLAIMER, plainText, resultToText } from '../src/share.ts';

test('the AI markdown becomes plain text', () => {
  const md = '## Assessment\nLikely a **mild** viral illness.\n\n---\n\n* First point\n• Second point\n**Key**: value\n\n\n\n### Next steps\n1. Rest';
  assert.equal(plainText(md), 'ASSESSMENT\nLikely a mild viral illness.\n\n- First point\n- Second point\nKey: value\n\nNEXT STEPS\n1. Rest');
  assert.equal(plainText('   '), '');
});

test('a symptom result is shared with everything the person saw, and the disclaimer last', () => {
  const text = resultToText({
    type: 'symptom', diagnosis: 'Common cold', confidence: 82, urgency: 'high', details: '## Assessment\nLikely a **mild** viral illness.',
    conditions: [{ name: 'Common cold', probability: 70 }, { name: 'Influenza', probability: 20 }], recommendations: ['Rest and hydrate', 'See a clinician if it worsens'],
  });
  const lines = text.split('\n');
  assert.deepEqual(lines.slice(0, 5), ['CuraSense analysis: Symptom Analysis', 'Common cold', 'Urgency: CONCERNING. Consult a physician today.', 'Confidence: 82%', '']);
  for (const want of ['ASSESSMENT', 'Likely a mild viral illness.', 'Possible conditions:', '- Common cold: 70%', '- Influenza: 20%', 'Recommendations:', '- Rest and hydrate']) assert.ok(lines.includes(want), want);
  assert.equal(lines.at(-1), DISCLAIMER);
  assert.doesNotMatch(text, /\*\*|##/);
});

test('lab values are listed with their unit and status, and empty sections are left out', () => {
  const text = resultToText({ type: 'report', diagnosis: 'Lab analysis', confidence: 0, biomarkers: [{ name: 'Hemoglobin', value: 13.2, unit: 'g/dL', status: 'normal' }, { name: 'Note', value: 'see text' }], conditions: [], recommendations: [], details: '' });
  assert.match(text, /Lab values:\n- Hemoglobin: 13\.2 g\/dL \(normal\)\n- Note: see text/);
  for (const absent of ['Confidence', 'Urgency', 'Possible conditions', 'Recommendations']) assert.doesNotMatch(text, new RegExp(absent), absent);
  assert.equal(text.split('\n\n').length, 3, 'header, lab values, disclaimer');
});

test('a saved record shows its date, and a bad date is skipped', () => {
  assert.match(resultToText({ type: 'image', diagnosis: 'Scan', timestamp: new Date(2026, 10, 16, 12) }), /November 16, 2026/);
  assert.doesNotMatch(resultToText({ diagnosis: 'Scan', timestamp: new Date('nope') }), /Invalid/);
});
