import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';

let server, base;
before(async () => {
  process.env.NODE_ENV = 'production';
  process.env.JWT_SECRET = 'test-jwt-secret-long-enough-for-production-use';   // production refuses anything under 32 characters
  process.env.CORS_ORIGINS = 'https://app.example.test';
  const { default: app } = await import('../app.js');
  server = app.listen(0);
  base = `http://localhost:${server.address().port}`;
});
after(() => server.close());

const allowOrigin = async (origin) => (await fetch(base + '/nothing-here', { headers: { Origin: origin } })).headers.get('access-control-allow-origin');

test('CORS in production: only the apps and CORS_ORIGINS are allowed, not localhost or the LAN', async () => {
  for (const ok of ['capacitor://localhost', 'https://localhost', 'https://app.example.test']) assert.equal(await allowOrigin(ok), ok, ok);
  for (const bad of ['http://localhost:5173', 'http://192.168.1.20:5173', 'http://macbook.local:5173', 'https://evil.example']) assert.equal(await allowOrigin(bad), null, bad);
});
