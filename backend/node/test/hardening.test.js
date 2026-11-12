import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';

let server, base;
before(async () => {
  process.env.JWT_SECRET = 'test-jwt-secret';
  process.env.CORS_ORIGINS = 'https://app.example.test';
  const { default: app } = await import('../app.js');
  server = app.listen(0);
  base = `http://localhost:${server.address().port}`;
});
after(() => server.close());

const post = (path, body = '{}') => fetch(base + path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
const allowOrigin = async (origin) => (await fetch(base + '/nothing-here', { headers: { Origin: origin } })).headers.get('access-control-allow-origin');

test('CORS outside production: the apps, local dev, the LAN and listed sites are allowed; other sites are not', async () => {
  for (const ok of ['capacitor://localhost', 'https://localhost', 'http://localhost:5173', 'http://192.168.1.20:5173', 'http://macbook.local:5173', 'https://app.example.test'])
    assert.equal(await allowOrigin(ok), ok, ok);
  for (const bad of ['https://evil.example', 'http://localhost.evil.example', 'http://192.168.1.20.evil.example'])
    assert.equal(await allowOrigin(bad), null, bad);
});

test('responses carry the basic security headers and no X-Powered-By', async () => {
  const r = await fetch(base + '/nothing-here');
  assert.equal(r.headers.get('x-content-type-options'), 'nosniff');
  assert.equal(r.headers.get('x-frame-options'), 'DENY');
  assert.equal(r.headers.get('referrer-policy'), 'no-referrer');
  assert.equal(r.headers.get('x-powered-by'), null);
});

test('JSON bodies over 2 MB are refused; a 60,000-character report still reaches the auth check', async () => {
  const analyze = (text) => post('/analyze-report', JSON.stringify({ text }));
  assert.equal((await analyze('a'.repeat(2.5 * 1024 * 1024))).status, 413);
  assert.equal((await analyze('a'.repeat(60_000))).status, 401);
});

test('sign-in, 2FA-code and reset routes are rate limited per IP, each family with its own bucket', async () => {
  // No database here: requireMongo answers 503 after the limiter, which is all these routes need to show.
  for (const [paths, max] of [[['/login'], 30], [['/login-totp'], 15], [['/forgot-password', '/verify-reset-code', '/reset-password'], 15]]) {
    for (let i = 0; i < max; i++) assert.notEqual((await post(paths[i % paths.length])).status, 429, `${paths[0]} call ${i + 1}`);
    const blocked = await post(paths[0]);
    assert.equal(blocked.status, 429, paths[0]);
    assert.ok(Number(blocked.headers.get('retry-after')) > 0, 'Retry-After is set');
  }
  assert.notEqual((await post('/register')).status, 429, 'sign-up is not limited');
});
