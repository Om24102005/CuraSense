import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

// What has to hold before anyone but the owner uses the server: no secret in the source, no reset code in a response,
// an admin that comes from the environment, one address that serves the site and the API, and rate limits that see the real client.
const root = path.resolve(import.meta.dirname, '..');
const SECRET = 'golive-test-jwt-secret-that-is-long-enough';
const SCRATCH_DB = 'mongodb://localhost:27017/curasense_unit_golive';

let server, base, webDir, mongoUp = false, User, ensureAdmin;

before(async () => {
  webDir = fs.mkdtempSync(path.join(os.tmpdir(), 'curasense-web-'));
  fs.mkdirSync(path.join(webDir, 'assets'));
  fs.writeFileSync(path.join(webDir, 'index.html'), '<!doctype html><title>the site</title>');
  fs.writeFileSync(path.join(webDir, 'assets', 'app-abc123.js'), 'console.log("hello");\n'.repeat(300));

  Object.assign(process.env, { NODE_ENV: 'production', JWT_SECRET: SECRET, STATIC_DIR: webDir, TRUST_PROXY: '1', PYTHON_AI_URL: 'http://127.0.0.1:9' });
  delete process.env.RESET_CODE_IN_RESPONSE;
  const { default: app } = await import('../app.js');
  server = app.listen(0);
  base = `http://localhost:${server.address().port}`;

  ({ User } = await import('../src/models/User.js'));
  ({ ensureAdmin } = await import('../src/config/db.js'));
  try {   // the admin tests need a database; without mongod they are skipped, not failed
    await mongoose.connect(SCRATCH_DB, { serverSelectionTimeoutMS: 1500 });
    await mongoose.connection.dropDatabase();
    mongoUp = true;
  } catch { /* skipped below */ }
});

after(async () => {
  server.close();
  fs.rmSync(webDir, { recursive: true, force: true });
  if (mongoUp) { await mongoose.connection.dropDatabase(); await mongoose.disconnect(); }
});

const loadEnvModule = (env) => spawnSync(process.execPath, ['--input-type=module', '-e', "await import('./src/config/env.js'); console.log('loaded')"], { cwd: root, env: { PATH: process.env.PATH, ...env }, encoding: 'utf8' });

test('production will not start without a JWT_SECRET of at least 32 characters; elsewhere a missing one only warns', () => {
  for (const bad of ['', 'short', 'x'.repeat(31)]) {
    const r = loadEnvModule({ NODE_ENV: 'production', JWT_SECRET: bad });
    assert.equal(r.status, 1, `"${bad.length} chars" should stop the server`);
    assert.match(r.stderr, /JWT_SECRET must be set/);
  }
  assert.equal(loadEnvModule({ NODE_ENV: 'production', JWT_SECRET: 'x'.repeat(32) }).status, 0);
  const dev = loadEnvModule({ NODE_ENV: 'development', JWT_SECRET: '' });
  assert.equal(dev.status, 0);
  assert.match(dev.stderr, /random secret/);
});

test('the password reset is off unless RESET_CODE_IN_RESPONSE=1, and says so without handing out a code', async () => {
  const { forgotPassword, verifyResetCode, resetPassword } = await import('../src/controllers/password.controller.js');
  for (const handler of [forgotPassword, verifyResetCode, resetPassword]) {
    const out = {};
    const res = { status(c) { out.status = c; return res; }, json(b) { out.body = b; return res; } };
    await handler({ body: { email: 'someone@example.test', code: '123456', password: 'a-new-password' } }, res);
    assert.equal(out.status, 503, handler.name);
    assert.match(out.body.error, /not set up/);
    assert.equal(out.body.code, undefined);
  }
});

test('the admin account comes from ADMIN_EMAIL and ADMIN_PASSWORD: created, kept, rotated, never a normal user promoted', async (t) => {
  if (!mongoUp) return t.skip('mongod is not running');
  const email = 'boss@example.test', pw1 = 'first-long-password', pw2 = 'second-long-password';
  assert.equal(await ensureAdmin({ email: undefined, password: undefined }), 'skipped');
  assert.equal(await ensureAdmin({ email, password: 'short' }), 'weak');
  assert.equal(await User.countDocuments(), 0, 'nothing is created without a usable password');

  assert.equal(await ensureAdmin({ email, password: pw1 }), 'created');
  const made = await User.findOne({ email });
  assert.equal(made.role, 'admin');
  assert.notEqual(made.password, pw1, 'only a hash is stored');
  assert.ok(await bcrypt.compare(pw1, made.password));

  assert.equal(await ensureAdmin({ email, password: pw1 }), 'ok');
  assert.equal(await ensureAdmin({ email, password: pw2 }), 'rotated');
  const rotated = await User.findOne({ email });
  assert.ok(await bcrypt.compare(pw2, rotated.password));
  assert.ok(!(await bcrypt.compare(pw1, rotated.password)), 'the old password stops working');

  await User.create({ name: 'Plain', email: 'plain@example.test', password: 'x', role: 'user' });
  assert.equal(await ensureAdmin({ email: 'plain@example.test', password: pw1 }), 'refused');
  assert.equal((await User.findOne({ email: 'plain@example.test' })).role, 'user');
});

const get = (p, headers = {}) => fetch(base + p, { headers });
const post = (p, headers = {}) => fetch(base + p, { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: '{}' });

test('with STATIC_DIR the same server serves the site: pages, cached assets, compression, and the API still wins', async () => {
  for (const page of ['/', '/platform', '/access']) {
    const r = await get(page, { Accept: 'text/html' });
    assert.equal(r.status, 200, page);
    assert.match(await r.text(), /the site/);
    assert.equal(r.headers.get('cache-control'), 'no-cache');
  }
  const asset = await get('/assets/app-abc123.js');
  assert.equal(asset.status, 200);
  assert.match(asset.headers.get('cache-control'), /immutable/);
  assert.match(asset.headers.get('content-encoding') ?? '', /gzip|br/);

  assert.equal((await get('/assets/missing.js')).status, 404, 'a missing file is not the site');
  assert.equal((await get('/nothing-here', { Accept: 'application/json' })).status, 404, 'a JSON client is not sent the site');
  assert.equal((await get('/health')).headers.get('content-type')?.includes('json'), true, 'API paths are not shadowed');
});

test('HSTS is sent in production over HTTPS only, and the rate limit counts the client behind the proxy', async () => {
  assert.match((await get('/health', { 'X-Forwarded-Proto': 'https' })).headers.get('strict-transport-security') ?? '', /max-age/);
  assert.equal((await get('/health')).headers.get('strict-transport-security'), null);

  const ip = (n) => ({ 'X-Forwarded-For': `203.0.113.${n}` });
  for (let i = 0; i < 15; i++) assert.notEqual((await post('/login-totp', ip(1))).status, 429);
  assert.equal((await post('/login-totp', ip(1))).status, 429, 'the first client is limited');
  assert.notEqual((await post('/login-totp', ip(2))).status, 429, 'a second client behind the same proxy is not');
});
