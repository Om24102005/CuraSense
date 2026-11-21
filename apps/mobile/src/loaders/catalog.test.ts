import assert from 'node:assert/strict';
import { test } from 'node:test';
import { LOADERS } from './catalog.ts';
import { eight, withAlpha } from './pure.ts';

test('the catalogue is the twenty loaders the owner listed, in that order', () => {
  assert.deepEqual(LOADERS.map((l) => l.name), [
    'Spinner Arc', 'Bouncing Dots', 'Pulse Rings', 'Indeterminate Bar', 'Skeleton Shimmer', 'Orbit', 'Equalizer Bars', 'Square Morph', 'Liquid Fill', 'Dot Grid Wave',
    'Infinity Trail', 'Flipping Square', 'Gradient Ring', 'Typing Dots', 'Spoke Spinner', 'Percent Bar', 'Chasing Squares', 'Text Shimmer', 'Battery Charge', 'Bouncing Ball',
  ]);
});

test('every loader has a unique id and says where it is used', () => {
  assert.equal(new Set(LOADERS.map((l) => l.id)).size, LOADERS.length);
  for (const l of LOADERS) assert.match(l.id, /^[a-z]+(-[a-z]+)*$/), assert.ok(l.usedIn.length > 8, l.id);
});

test('the figure eight closes on itself and stays inside its box', () => {
  const [x0, y0] = eight(0);
  const [x1, y1] = eight(1);
  assert.ok(Math.abs(x0 - x1) < 1e-9 && Math.abs(y0 - y1) < 1e-9, 'start and end are the same point');
  for (let i = 0; i <= 200; i++) {
    const [x, y] = eight(i / 200);
    assert.ok(Math.abs(x) <= 1 + 1e-9 && Math.abs(y) <= 1.01, `inside the box at ${i}`);
  }
  assert.ok(Math.abs(eight(0.25)[0]) < 1e-9, 'it crosses the middle at a quarter turn');
});

test('withAlpha keeps the colour and changes only the opacity', () => {
  assert.equal(withAlpha('#2667ff', 0.5), 'rgba(38, 103, 255, 0.5)');
  assert.equal(withAlpha('#fff', 0.2), 'rgba(255, 255, 255, 0.2)');
  assert.equal(withAlpha('rgb(1, 2, 3)', 0.25), 'rgba(1, 2, 3, 0.25)');
  assert.equal(withAlpha('transparent', 0.5), 'transparent');
});
