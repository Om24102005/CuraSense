import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import speakeasy from 'speakeasy';

// What a public launch depends on: sessions that really end, the second factor, consent, account deletion, and reset by email.
// Needs a database; without mongod these tests are skipped, not failed.
const SECRET = 'launch-test-jwt-secret-long-enough';
const SCRATCH_DB = 'mongodb://localhost:27017/curasense_unit_launch';
const PASSWORD = 'launch-password-1';
let server, base, User, Prediction, tools, issueFullToken, mongoUp = false, n = 0;

before(async () => {
  Object.assign(process.env, { JWT_SECRET: SECRET, DATA_KEY: 'launch-test-data-key', PASSWORD_RESET_EMAIL: '1', SMTP_USER: 'nobody', SMTP_PASS: 'nothing', SMTP_HOST: '127.0.0.1', SMTP_PORT: '1', CONSENT_REQUIRED: '1' });
  delete process.env.RESET_CODE_IN_RESPONSE;
  const { default: app } = await import('../app.js');
  ({ User } = await import('../src/models/User.js'));
  ({ Prediction } = await import('../src/models/Prediction.js'));
  tools = await import('../src/services/accounts.js');
  ({ issueFullToken } = await import('../src/middleware/auth.js'));
  server = app.listen(0);
  base = `http://localhost:${server.address().port}`;
  try {
    await mongoose.connect(SCRATCH_DB, { serverSelectionTimeoutMS: 1500 });
    await mongoose.connection.dropDatabase();
    mongoUp = true;
  } catch { /* skipped below */ }
});
after(async () => {
  server.close();
  if (mongoUp) { await mongoose.connection.dropDatabase(); await mongoose.disconnect(); }
});

const send = (method, path, token, body) => fetch(base + path, {
  method,
  headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  body: body ? JSON.stringify(body) : undefined,
});
const makeUser = async (fields = {}) => {
  const user = await User.create({ name: `Person ${++n}`, email: `p${n}@example.test`, password: await bcrypt.hash(PASSWORD, 10), ...fields });
  return { user, token: issueFullToken(user) };
};

test('an authenticator secret is encrypted at rest, and one saved before encryption still reads', () => {
  const sealed = tools.sealSecret('JBSWY3DPEHPK3PXP');
  assert.ok(sealed.startsWith('enc1:'));
  assert.ok(!sealed.includes('JBSWY3DPEHPK3PXP'));
  assert.equal(tools.openSecret(sealed), 'JBSWY3DPEHPK3PXP');
  assert.equal(tools.openSecret('JBSWY3DPEHPK3PXP'), 'JBSWY3DPEHPK3PXP');
});

test('a query object in place of an email matches nobody', async (t) => {
  if (!mongoUp) return t.skip('mongod is not running');
  await makeUser();
  assert.equal(await tools.findAccount({ $ne: null }), null);
  assert.equal((await send('POST', '/login', null, { email: { $ne: null }, password: PASSWORD })).status, 400);
});

test('a password alone never opens an account without an authenticator: it opens the setup step', async (t) => {
  if (!mongoUp) return t.skip('mongod is not running');
  const { user } = await makeUser();
  const body = await (await send('POST', '/login', null, { email: user.email, password: PASSWORD })).json();
  assert.equal(body.token, undefined);
  assert.equal(body.requiresTotpSetup, true);
  assert.equal(jwt.verify(body.setupToken, SECRET).purpose, 'totp_setup');
  assert.equal((await send('GET', '/predictions', body.setupToken)).status, 403);
});

test('changing the password ends other sessions and keeps this one', async (t) => {
  if (!mongoUp) return t.skip('mongod is not running');
  const { token } = await makeUser();
  const out = await (await send('POST', '/api/user/password', token, { currentPassword: PASSWORD, newPassword: 'launch-password-2' })).json();
  assert.equal((await send('GET', '/predictions', token)).status, 401);
  assert.equal((await send('GET', '/predictions', out.token)).status, 200);
});

test('an analysis is refused until the person accepts, and accepting must be explicit', async (t) => {
  if (!mongoUp) return t.skip('mongod is not running');
  const { token } = await makeUser();
  const refused = await send('POST', '/analyze-symptoms', token, { symptoms: 'headache' });
  assert.equal(refused.status, 403);
  assert.equal((await refused.json()).consentRequired, true);
  assert.equal((await (await send('GET', '/api/user/consent', token)).json()).accepted, false);
  assert.equal((await send('POST', '/api/user/consent', token, { accepted: 'yes' })).status, 400);
  assert.equal((await send('POST', '/api/user/consent', token, { accepted: true })).status, 200);
  assert.equal((await (await send('GET', '/api/user/consent', token)).json()).accepted, true);
  assert.notEqual((await send('POST', '/analyze-symptoms', token, { symptoms: 'headache' })).status, 403);
});

test('deleting an account needs the password and the code, removes its analyses, and ends its session', async (t) => {
  if (!mongoUp) return t.skip('mongod is not running');
  const secret = speakeasy.generateSecret({ length: 20 }).base32;
  const { user, token } = await makeUser({ totpEnabled: true, totpSecret: tools.sealSecret(secret) });
  const other = await makeUser();
  const row = { type: 'symptom', diagnosis: 'x', confidence: 1, details: 'x', recommendations: [] };
  await Prediction.create([{ ...row, userId: user._id }, { ...row, userId: other.user._id }]);

  assert.equal((await send('POST', '/api/user/delete-account', token, { password: 'wrong-password', code: '000000' })).status, 400);
  assert.equal((await send('POST', '/api/user/delete-account', token, { password: PASSWORD, code: '000000' })).status, 400);
  assert.ok(await User.findById(user._id), 'nothing is deleted on a failed check');

  const code = speakeasy.totp({ secret, encoding: 'base32' });
  assert.equal((await send('POST', '/api/user/delete-account', token, { password: PASSWORD, code })).status, 200);
  assert.equal(await User.findById(user._id), null);
  assert.equal(await Prediction.countDocuments({ userId: user._id }), 0);
  assert.equal(await Prediction.countDocuments({ userId: other.user._id }), 1, 'nobody else\'s data is touched');
  assert.equal((await send('GET', '/predictions', token)).status, 401);
});

test('an admin account cannot be deleted through this route', async (t) => {
  if (!mongoUp) return t.skip('mongod is not running');
  const { user, token } = await makeUser({ role: 'admin' });
  assert.equal((await send('POST', '/api/user/delete-account', token, { password: PASSWORD })).status, 403);
  assert.ok(await User.findById(user._id));
});

test('reset by email: the same answer for any address, no code in it, stored hashed, ended by five wrong guesses', async (t) => {
  if (!mongoUp) return t.skip('mongod is not running');
  const { user, token } = await makeUser();
  const known = await (await send('POST', '/forgot-password', null, { email: user.email })).json();
  const unknown = await (await send('POST', '/forgot-password', null, { email: 'nobody-here@example.test' })).json();
  assert.equal(known.code, undefined);
  assert.equal(known.message, unknown.message);
  const stored = await User.findById(user._id);
  assert.match(stored.resetCode, /^[0-9a-f]{64}$/, 'only a hash is stored');

  // The test cannot read the email, so it plants a code it knows, hashed the way the server does.
  const plant = async (code) => User.updateOne({ _id: user._id }, { $set: { resetAttempts: 0, resetCodeExpiry: new Date(Date.now() + 60_000), resetCode: crypto.createHmac('sha256', SECRET).update(`${user._id}:${code}`).digest('hex') } });
  await plant('123456');
  for (let i = 0; i < 5; i++) assert.equal((await send('POST', '/verify-reset-code', null, { email: user.email, code: '000000' })).status, 400);
  assert.equal((await send('POST', '/verify-reset-code', null, { email: user.email, code: '123456' })).status, 400, 'the fifth wrong guess ended the code');

  await plant('654321');
  assert.equal((await send('POST', '/reset-password', null, { email: user.email, code: '654321', password: 'short' })).status, 400);
  assert.equal((await send('POST', '/reset-password', null, { email: user.email, code: '654321', password: 'launch-password-3' })).status, 200);
  assert.equal((await send('GET', '/predictions', token)).status, 401, 'a reset ends every session');
  assert.equal((await send('POST', '/reset-password', null, { email: user.email, code: '654321', password: 'launch-password-4' })).status, 400, 'a code works once');
});
