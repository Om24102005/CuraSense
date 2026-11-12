import { test } from 'node:test';
import assert from 'node:assert/strict';
import { modalityOf, regionsOf, studyLabel, extractUrgency, SCAN_TYPES, SCAN_GROUPS } from '../src/scans.ts';

test('the kind of image follows from the study id', () => {
  assert.equal(modalityOf('xray-chest'), 'xray');
  assert.equal(modalityOf('ct-head'), 'ct');
  assert.equal(modalityOf('mri-knee'), 'mri');
  assert.equal(modalityOf('us-thyroid'), 'ultrasound');
  assert.equal(modalityOf('echo'), 'ultrasound');
  assert.equal(modalityOf('mammo-3d'), 'mammogram');
  assert.equal(modalityOf('onco-psma-pet'), 'nuclear');
  assert.equal(modalityOf('onco-ldct'), 'ct');
  assert.equal(modalityOf('skin'), 'skin_lesion');
  assert.equal(modalityOf('ekg'), 'ecg');
  assert.equal(modalityOf('something-new'), 'scan');
});

test('a study maps to the body regions it covers; an unlisted study takes any region', () => {
  assert.equal(regionsOf('ct-head'), 'head');
  assert.deepEqual(regionsOf('fluoroscopy').split(','), ['neck', 'chest', 'abdomen', 'pelvis']);
  assert.equal(regionsOf('skin'), '');
});

test('every study is in exactly one group, and has a label', () => {
  for (const t of SCAN_TYPES) {
    assert.equal(SCAN_GROUPS.filter((g) => g.filter(t)).length, 1, t.id);
    assert.ok(studyLabel(t.id).includes(t.name), t.id);
  }
});

test('the worst urgency line of a multi-page answer wins', () => {
  const text = 'Page 1\n**Urgency level**: Normal\nPage 2\nUrgency: **Urgent**\nPage 3\nUrgency level: low';
  assert.equal(extractUrgency(text)?.label, 'Urgent');
  assert.equal(extractUrgency('no urgency stated'), null);
});
