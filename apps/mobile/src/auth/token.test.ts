import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isTokenExpired } from './token.ts';

const jwt = (claims: object) => `h.${Buffer.from(JSON.stringify(claims)).toString('base64url')}.s`;

test('a token past its exp is expired and a future one is not', () => {
  const now = Date.UTC(2026, 10, 12);
  assert.equal(isTokenExpired(jwt({ exp: now / 1000 - 1 }), now), true);
  assert.equal(isTokenExpired(jwt({ exp: now / 1000 + 60 }), now), false);
});

test('a token without exp, or one that cannot be read, is left to the server', () => {
  assert.equal(isTokenExpired(jwt({ sub: 'x' })), false);
  assert.equal(isTokenExpired('not-a-token'), false);
  assert.equal(isTokenExpired(''), false);
});
