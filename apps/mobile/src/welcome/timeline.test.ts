import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MAX_MS, isFinished, minDuration, rowTiming, shown } from './timeline.ts';
import { ECG_X, ECG_Y, ecgSegments } from './ecg.ts';

test('a row shows its real result only after it has been on screen long enough, and never early', () => {
  const { appear, minShow } = rowTiming(false);
  assert.equal(shown('ok', appear[0] + minShow - 1, appear[0], minShow), 'pending');
  assert.equal(shown('ok', appear[0] + minShow, appear[0], minShow), 'ok');
  assert.equal(shown('failed', 99999, appear[0], minShow), 'failed');
  assert.equal(shown('pending', 99999, appear[0], minShow), 'pending', 'a task that has not finished never shows a result');
});

test('the full welcome waits for its minimum time and for every row; the short one only for its time', () => {
  const done = ['ok', 'failed', 'ok'] as const;
  assert.equal(isFinished('signin', [...done], 2999, false), false);
  assert.equal(isFinished('signin', [...done], 3000, false), true);
  assert.equal(isFinished('signup', ['ok', 'pending', 'pending'], 8000, false), false, 'a slow request keeps it waiting');
  assert.equal(isFinished('signin', ['pending', 'pending', 'pending'], MAX_MS, false), true, 'but not for ever');
  assert.equal(isFinished('resume', ['pending', 'pending', 'pending'], 1200, false), true);
  assert.equal(isFinished('resume', [], 1199, false), false);
});

test('Reduce Motion shortens every version', () => {
  for (const kind of ['signin', 'signup', 'resume'] as const) assert.ok(minDuration(kind, true) < minDuration(kind, false), kind);
  const t = rowTiming(true);
  assert.ok(Math.max(...t.appear) + t.minShow < minDuration('signin', true) + 1);
  assert.ok(rowTiming(false).appear.every((a, i, all) => i === 0 || a > all[i - 1]), 'rows appear one after another');
});

test('the ECG line is one connected polyline from the left edge to the right edge', () => {
  assert.equal(ECG_X.length, ECG_Y.length);
  assert.ok(ECG_X.every((x, i) => i === 0 || x > ECG_X[i - 1]), 'x increases');
  assert.ok(ECG_Y.every((y) => y >= 0 && y <= 1));
  const segs = ecgSegments(320, 64);
  assert.equal(segs.length, ECG_X.length - 1);
  assert.ok(segs.every((s) => s.length > 0));
  const spike = Math.max(...segs.map((s) => s.length)); assert.ok(spike > 60, 'the R spike is tall');
  // every segment starts where the last one ended
  let x = 0, y = ECG_Y[0] * 64;
  for (const s of segs) { const x0 = s.cx - Math.cos(s.angle) * s.length / 2, y0 = s.cy - Math.sin(s.angle) * s.length / 2; assert.ok(Math.abs(x0 - x) < 1e-6 && Math.abs(y0 - y) < 1e-6); x = s.cx + Math.cos(s.angle) * s.length / 2; y = s.cy + Math.sin(s.angle) * s.length / 2; }
  assert.ok(Math.abs(x - 320) < 1e-6);
});
