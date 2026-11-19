import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

// Changing your own name and password. Needs a database; without mongod these tests are skipped, not failed.
const SECRET = 'profile-test-jwt-secret-long-enough';
const SCRATCH_DB = 'mongodb://localhost:27017/curasense_unit_profile';
let server, base, User, mongoUp = false;

before(async () => {
  process.env.JWT_SECRET = SECRET;
  const { default: app } = await import('../app.js');
  ({ User } = await import('../src/models/User.js'));
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

const makeUser = async (tag, password = 'old-password-1') => {
  const user = await User.create({ name: `Person ${tag}`, email: `${tag}@example.test`, password: await bcrypt.hash(password, 4), role: 'user' });
  return { user, token: jwt.sign({ _id: user._id, role: 'user' }, SECRET), password };
};
const send = (method, path, token, body) => fetch(base + path, { method, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify(body ?? {}) });

test('the name can be changed, within limits, and only by the signed-in user', async (t) => {
  if (!mongoUp) return t.skip('mongod is not running');
  const a = await makeUser('rename-a'), b = await makeUser('rename-b');

  const ok = await send('PATCH', '/api/user/profile', a.token, { name: '  Asha Rao  ' });
  assert.equal(ok.status, 200);
  assert.equal((await ok.json()).user.name, 'Asha Rao');
  assert.equal((await User.findById(a.user._id)).name, 'Asha Rao');
  assert.equal((await User.findById(b.user._id)).name, 'Person rename-b', 'another account is untouched');

  for (const bad of ['', '   ', 'x'.repeat(81), 'someone@example.test', 42, null])
    assert.equal((await send('PATCH', '/api/user/profile', a.token, { name: bad })).status, 400, JSON.stringify(bad));
  assert.equal((await send('PATCH', '/api/user/profile', null, { name: 'Anon' })).status, 401);
  const setupToken = jwt.sign({ _id: a.user._id, purpose: 'totp_setup' }, SECRET);
  assert.equal((await send('PATCH', '/api/user/profile', setupToken, { name: 'Sneaky' })).status, 403, 'a half-finished sign-up cannot use it');
  assert.equal((await User.findById(a.user._id)).name, 'Asha Rao');
});

test('the password changes only with the right current password, and the new one then signs in', async (t) => {
  if (!mongoUp) return t.skip('mongod is not running');
  const { user, token, password } = await makeUser('pw');
  const change = (body, tk = token) => send('POST', '/api/user/password', tk, body);

  assert.equal((await change({ currentPassword: 'not-it-at-all', newPassword: 'brand-new-pass' })).status, 400);
  assert.equal((await change({ currentPassword: password, newPassword: 'short' })).status, 400);
  assert.equal((await change({ currentPassword: password, newPassword: password })).status, 400);
  assert.equal((await change({ currentPassword: password })).status, 400);
  assert.equal((await change({ currentPassword: password, newPassword: 'brand-new-pass' }, null)).status, 401);
  assert.ok(await bcrypt.compare(password, (await User.findById(user._id)).password), 'nothing changed so far');

  const done = await change({ currentPassword: password, newPassword: 'brand-new-pass' });
  assert.equal(done.status, 200);
  const stored = (await User.findById(user._id)).password;
  assert.ok(await bcrypt.compare('brand-new-pass', stored));
  assert.notEqual(stored, 'brand-new-pass', 'only a hash is stored');

  assert.equal((await send('POST', '/login', null, { email: 'pw@example.test', password })).status, 400, 'the old password no longer signs in');
  const login = await send('POST', '/login', null, { email: 'pw@example.test', password: 'brand-new-pass' });
  assert.equal(login.status, 200);
  assert.ok((await login.json()).token);
});

test('guessing the current password through the change route is limited per user', async (t) => {
  if (!mongoUp) return t.skip('mongod is not running');
  const { token } = await makeUser('limit');
  for (let i = 0; i < 10; i++) assert.equal((await send('POST', '/api/user/password', token, { currentPassword: `guess-${i}-xx`, newPassword: 'brand-new-pass' })).status, 400);
  const blocked = await send('POST', '/api/user/password', token, { currentPassword: 'guess-11-xx', newPassword: 'brand-new-pass' });
  assert.equal(blocked.status, 429);
  assert.ok(Number(blocked.headers.get('retry-after')) > 0);
});
