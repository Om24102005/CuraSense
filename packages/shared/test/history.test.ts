import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizePrediction, summarize, formatRelative, formatAbsolute } from '../src/history.ts';

const rec = (over: object = {}) => normalizePrediction({ _id: 'a1', type: 'symptom', timestamp: '2026-11-12T10:00:00.000Z', diagnosis: 'X', confidence: 80, ...over });

test('a stored record is normalized: _id becomes id, the date becomes a Date, missing lists become empty', () => {
  const p = rec({ urgency: 'high' });
  assert.equal(p.id, 'a1');
  assert.ok(p.timestamp instanceof Date && !isNaN(p.timestamp.getTime()));
  assert.equal(p.urgency, 'high');
  assert.deepEqual([p.recommendations, p.conditions, p.biomarkers, p.scanSections], [[], [], [], []]);
  assert.equal(p.details, '');
});

test('an unknown urgency is dropped and an unknown type falls back to symptom', () => {
  const p = rec({ urgency: 'critical', type: 'mystery', confidence: 'n/a' });
  assert.equal(p.urgency, undefined);
  assert.equal(p.type, 'symptom');
  assert.equal(p.confidence, 0);
});

test('the summary counts today by the local day, averages confidence and ranks the types', () => {
  const now = new Date(2026, 10, 12, 18, 0, 0);
  const items = [
    rec({ _id: '1', type: 'report', confidence: 90, timestamp: new Date(2026, 10, 12, 9, 0).toISOString() }),
    rec({ _id: '2', type: 'report', confidence: 71, timestamp: new Date(2026, 10, 11, 9, 0).toISOString() }),
    rec({ _id: '3', type: 'image', confidence: 50, timestamp: new Date(2026, 10, 12, 17, 0).toISOString() }),
  ];
  const s = summarize(items, now);
  assert.deepEqual([s.total, s.today, s.avgConfidence, s.mostUsed], [3, 2, 70, 'report']);
  assert.deepEqual(s.byType, { report: 2, image: 1 });
  assert.equal(s.latest?.getTime(), new Date(2026, 10, 12, 17, 0).getTime());
  assert.deepEqual(summarize([], now), { total: 0, today: 0, avgConfidence: 0, byType: {}, mostUsed: null, latest: null });
});

test('relative dates step from just now to minutes, hours, days and then a calendar date', () => {
  const now = new Date(2026, 10, 12, 12, 0, 0);
  const ago = (ms: number) => new Date(now.getTime() - ms);
  assert.equal(formatRelative(ago(20_000), now), 'Just now');
  assert.equal(formatRelative(ago(5 * 60_000), now), '5m ago');
  assert.equal(formatRelative(ago(3 * 3_600_000), now), '3h ago');
  assert.equal(formatRelative(ago(2 * 86_400_000), now), '2d ago');
  assert.equal(formatRelative(ago(10 * 86_400_000), now), 'Nov 2, 2026');
  assert.equal(formatRelative('not a date', now), '—');
  assert.equal(formatAbsolute(null), '—');
});
