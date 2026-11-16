import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isEmergency } from '../src/emergency.ts';
import { DEFAULT_SETTINGS, EMERGENCY_NOTE, emergencyNumberProblem, smsUrl, telUrl, toServerPayload } from '../src/settings.ts';

const sec = (content: string, refusal?: object) => ({ num: 1, filename: 'a.png', content, ...(refusal ? { refusal: refusal as any } : {}) });

test('only the top urgency counts: symptoms and reports by the AI level, scans by Critical or Emergency pages', () => {
  assert.equal(isEmergency({ urgency: 'emergency' }), true);
  for (const urgency of ['low', 'medium', 'high', undefined] as const) assert.equal(isEmergency({ urgency }), false, String(urgency));
  assert.equal(isEmergency({ scanSections: [sec('Findings.\n**Urgency Level:** Critical')] }), true);
  assert.equal(isEmergency({ scanSections: [sec('Urgency Level: Emergency')] }), true);
  assert.equal(isEmergency({ scanSections: [sec('Urgency Level: High'), sec('Urgency Level: Monitor')] }), false);
  assert.equal(isEmergency({ scanSections: [sec('Urgency Level: Low'), sec('Urgency Level: Critical')] }), true, 'the worst page decides');
  assert.equal(isEmergency({ scanSections: [sec('Urgency Level: Emergency', { message: 'wrong page' })] }), false, 'a refused page says nothing about the patient');
  assert.equal(isEmergency({ scanSections: [] }), false);
  assert.equal(isEmergency({}), false);
});

test('the emergency number is digits only, and the dial and message links drop punctuation', () => {
  for (const n of ['112', '911', ' 999 ', '108', '1122']) assert.equal(emergencyNumberProblem(n), '', n);
  for (const n of ['', '1', 'abc', '11 2', '+112', '1234567']) assert.notEqual(emergencyNumberProblem(n), '', n);
  assert.equal(telUrl('112'), 'tel:112');
  assert.equal(smsUrl('+91 98765-43210', EMERGENCY_NOTE), 'sms:+919876543210&body=I%20need%20help.%20Please%20call%20me%20as%20soon%20as%20you%20can.');
  assert.equal(smsUrl('(020) 7946 0958', 'Hi', 'android'), 'sms:02079460958?body=Hi');
  assert.doesNotMatch(EMERGENCY_NOTE, /health|CuraSense|result|diagnos/i);
});

test('the emergency number stays on the phone: it defaults to 112 and is never sent to the server', () => {
  assert.equal(DEFAULT_SETTINGS.emergencyNumber, '112');
  assert.deepEqual(toServerPayload({ ...DEFAULT_SETTINGS, emergencyNumber: '911' }, ['emergencyNumber']), {});
  assert.deepEqual(toServerPayload({ ...DEFAULT_SETTINGS, autoAlertsEnabled: true }, ['autoAlertsEnabled']), { emergencyProtocols: { autoAlertsEnabled: true } });
});
