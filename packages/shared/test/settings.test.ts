import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseServerSettings, newId, DEFAULT_SETTINGS, LANGUAGES } from '../src/settings.ts';

test('a stored settings object maps to the values it holds', () => {
  const v = parseServerSettings({
    localization: { language: 'ja', measurementStandard: 'imperial', highContrast: true, largeText: false },
    aiPreferences: { explainLevel: 'simple', outputDepth: 'comprehensive' },
    dependents: [{ id: 'd1', name: 'Kid', dob: '2015-01-01', sex: 'other', allergies: '' }],
    emergencyProtocols: { contacts: [{ id: 'c1', name: 'Mum', relation: 'Mother', phone: '+91 98' }], autoAlertsEnabled: true },
  });
  assert.deepEqual([v.language, v.measurement, v.highContrast, v.largeText, v.explainLevel, v.outputDepth, v.autoAlertsEnabled], ['ja', 'imperial', true, false, 'simple', 'comprehensive', true]);
  assert.equal(v.dependents?.length, 1);
  assert.equal(v.emergencyContacts?.[0].phone, '+91 98');
});

test('anything missing or of the wrong kind is left out, so the caller keeps what it has', () => {
  assert.deepEqual(parseServerSettings(null), {});
  assert.deepEqual(parseServerSettings({ localization: { language: 'xx', highContrast: 'yes' }, aiPreferences: { explainLevel: 'expert' }, dependents: 'none' }), {});
  assert.equal(parseServerSettings({ localization: { language: 'ar' } }).language, 'ar');
});

test('defaults match the website, every language has a label, and ids do not repeat', () => {
  assert.deepEqual([DEFAULT_SETTINGS.language, DEFAULT_SETTINGS.explainLevel, DEFAULT_SETTINGS.outputDepth, DEFAULT_SETTINGS.measurement], ['en', 'clinical', 'concise', 'metric']);
  assert.equal(LANGUAGES.length, 10);
  assert.equal(new Set(Array.from({ length: 200 }, newId)).size, 200);
});

import { toServerPayload, dependentProblem, contactProblem, telUrl } from '../src/settings.ts';

test('only the fields that changed are sent, in the shape the server stores them', () => {
  const v = { ...DEFAULT_SETTINGS, measurement: 'imperial' as const, language: 'fr' as const, explainLevel: 'simple' as const, autoAlertsEnabled: true, emergencyContacts: [{ id: 'c', name: 'A', relation: '', phone: '123456' }] };
  assert.deepEqual(toServerPayload(v, ['measurement']), { localization: { measurementStandard: 'imperial' } });
  assert.deepEqual(toServerPayload(v, ['language', 'highContrast']), { localization: { language: 'fr', highContrast: false } });
  assert.deepEqual(toServerPayload(v, ['explainLevel']), { aiPreferences: { explainLevel: 'simple' } });
  assert.deepEqual(toServerPayload(v, ['emergencyContacts']), { emergencyProtocols: { contacts: v.emergencyContacts } });
  assert.deepEqual(toServerPayload(v, ['dependents']), { dependents: [] });
  assert.deepEqual(toServerPayload(v, []), {});
});

test('a dependent needs a name, and a date of birth that is real and not in the future', () => {
  const now = new Date('2026-11-14T10:00:00Z');
  assert.equal(dependentProblem({ name: 'Asha', dob: '' }, now), '');
  assert.equal(dependentProblem({ name: 'Asha', dob: '2014-03-27' }, now), '');
  assert.match(dependentProblem({ name: '  ', dob: '' }, now), /name/);
  for (const dob of ['27/03/2014', '2014-3-27', '2014-02-30', '2031-01-01', '1850-01-01']) assert.notEqual(dependentProblem({ name: 'A', dob }, now), '', dob);
});

test('a contact needs a name and a plausible phone number; the dial link drops punctuation', () => {
  assert.equal(contactProblem({ name: 'Mum', phone: '+91 98765-43210' }), '');
  assert.equal(contactProblem({ name: 'Mum', phone: '(020) 7946 0958' }), '');
  for (const phone of ['', '12', 'call me', '1234567890123456']) assert.notEqual(contactProblem({ name: 'Mum', phone }), '', phone);
  assert.notEqual(contactProblem({ name: '', phone: '+91 98765 43210' }), '');
  assert.equal(telUrl('+91 98765-43210'), 'tel:+919876543210');
  assert.equal(telUrl('(020) 7946 0958'), 'tel:02079460958');
});
