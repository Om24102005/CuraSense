import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import jwt from 'jsonwebtoken';

// Fake Python gateway: records what it receives and answers with the real response shape.
const seen = [];
const fakePython = http.createServer((req, res) => {
  const chunks = [];
  req.on('data', (c) => chunks.push(c));
  req.on('end', () => {
    seen.push({ url: req.url, auth: req.headers.authorization, body: Buffer.concat(chunks).toString('latin1') });
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(req.url === '/health' ? { status: 'ok' } : { status: 'success', analysis: { ok: true } }));
  });
});

let server, base, pyPort;
const SECRET = 'test-gateway-secret-xyz';
const token = () => jwt.sign({ _id: '64b000000000000000000001', role: 'user' }, process.env.JWT_SECRET);
const png = Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), Buffer.alloc(64)]);

const upload = (path, bytes, name, extra = {}) => {
  const fd = new FormData();
  for (const [k, v] of Object.entries(extra)) fd.append(k, v);
  fd.append('file', new Blob([bytes]), name);
  return fetch(base + path, { method: 'POST', headers: { Authorization: `Bearer ${token()}` }, body: fd });
};

before(async () => {
  await new Promise((r) => fakePython.listen(0, r));
  pyPort = fakePython.address().port;
  process.env.JWT_SECRET = 'test-jwt-secret';
  process.env.GATEWAY_SECRET = SECRET;
  process.env.PYTHON_AI_URL = `http://localhost:${pyPort}`;
  const { default: app } = await import('../app.js');
  server = app.listen(0);
  base = `http://localhost:${server.address().port}`;
});
after(() => { server.close(); fakePython.close(); });

test('2FA bypass closed: pre-2FA purpose tokens cannot call protected endpoints', async () => {
  for (const purpose of ['totp_login', 'totp_setup']) {
    const t = jwt.sign({ _id: '64b000000000000000000002', purpose }, process.env.JWT_SECRET, { expiresIn: '15m' });
    for (const path of ['/analyze-report', '/predictions', '/api/user/settings']) {
      const r = await fetch(base + path, { method: path === '/analyze-report' ? 'POST' : 'GET', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${t}` }, body: path === '/analyze-report' ? '{"reportText":"x"}' : undefined });
      assert.equal(r.status, 403, `${purpose} on ${path}`);
    }
  }
});

test('rejects unauthenticated AI calls', async () => {
  const r = await fetch(base + '/analyze-report', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
  assert.equal(r.status, 401);
});

test('image: valid PNG is relayed to Python with the server-side secret, never exposed', async () => {
  const r = await upload('/analyze-image', png, 'scan.png', { scan_type: 'xray' });
  assert.equal(r.status, 200);
  const body = await r.text();
  assert.ok(!body.includes(SECRET), 'secret must not appear in the response');
  const hit = seen.find((s) => s.url === '/api/v1/diagnostics/imaging');
  assert.equal(hit.auth, `Bearer ${SECRET}`);
  assert.match(hit.body, /xray/);
});

test('image: type is decided by bytes, not by file name', async () => {
  const r = await upload('/analyze-image', Buffer.from('MZ\x90\x00 not an image'), 'evil.png');
  assert.equal(r.status, 415);
});

test('image: oversize file is refused', async () => {
  const r = await upload('/analyze-image', Buffer.concat([png, Buffer.alloc(26 * 1024 * 1024)]), 'big.png');
  assert.equal(r.status, 413);
});

test('report: text and file paths both work; empty is refused', async () => {
  const ok = await fetch(base + '/analyze-report', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` }, body: JSON.stringify({ reportText: 'Hb 13.2 g/dL' }) });
  assert.equal(ok.status, 200);
  const empty = await fetch(base + '/analyze-report', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` }, body: JSON.stringify({ reportText: '  ' }) });
  assert.equal(empty.status, 400);
  const file = await upload('/analyze-report', Buffer.from('%PDF-1.4 fake'), 'lab.pdf');
  assert.equal(file.status, 200);
  assert.ok(seen.some((s) => s.url === '/api/v1/diagnostics/lab-report-file'));
});

test('per-user rate limit returns 429 with Retry-After', async () => {
  let last;
  for (let i = 0; i < 25; i++) last = await upload('/analyze-image', png, 'scan.png');
  assert.equal(last.status, 429);
  assert.ok(last.headers.get('retry-after'));
});

test('health reports python reachability', async () => {
  const j = await (await fetch(base + '/health')).json();
  assert.equal(j.python, 'ok');
});
