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

test('image: the chosen scan type, study and context reach Python; unknown types fall back to "scan"', async () => {
  const field = (body, name) => new RegExp(`name="${name}"\\r\\n\\r\\n([^\\r]*)`).exec(body)?.[1];
  await upload('/analyze-image', png, 'scan.png', { scan_type: 'ct', study: 'CT Head / Brain', context: 'sudden headache' });
  let hit = seen.findLast((s) => s.url === '/api/v1/diagnostics/imaging');
  assert.deepEqual([field(hit.body, 'scan_type'), field(hit.body, 'study'), field(hit.body, 'context')], ['ct', 'CT Head / Brain', 'sudden headache']);
  await upload('/analyze-image', png, 'scan.png', { scan_type: 'xray-chest' });
  hit = seen.findLast((s) => s.url === '/api/v1/diagnostics/imaging');
  assert.equal(field(hit.body, 'scan_type'), 'scan');
});

test('DICOM: accepted for scans, refused on the lab-report endpoint (it is not a lab report)', async () => {
  const dicom = Buffer.concat([Buffer.alloc(128), Buffer.from('DICM'), Buffer.alloc(64)]);
  assert.equal((await upload('/analyze-image', dicom, 'ct.dcm', { scan_type: 'ct' })).status, 200);
  assert.equal((await upload('/analyze-report', dicom, 'ct.dcm')).status, 415);
});

test('DICOM whose preamble looks like a TIFF is still DICOM', async () => {
  const dicom = Buffer.concat([Buffer.from([0x49, 0x49, 0x2a, 0x00]), Buffer.alloc(124), Buffer.from('DICM'), Buffer.alloc(64)]);
  assert.equal((await upload('/analyze-report', dicom, 'ct.dcm')).status, 415);
});

test('ZIP: accepted on both upload endpoints (Python reads what is inside), with its own larger size cap', async () => {
  const zip = Buffer.concat([Buffer.from('PK\x03\x04'), Buffer.alloc(64)]);
  assert.equal((await upload('/analyze-image', zip, 'study.zip', { scan_type: 'ct' })).status, 200);
  assert.equal((await upload('/analyze-report', zip, 'labs.zip')).status, 200);
  const big = (mb) => Buffer.concat([Buffer.from('PK\x03\x04'), Buffer.alloc(mb * 1024 * 1024)]);
  assert.equal((await upload('/analyze-image', big(40), 'big.zip')).status, 200);   // over the 25 MB file cap, under the 60 MB ZIP cap
  assert.equal((await upload('/analyze-image', big(61), 'huge.zip')).status, 413);
  assert.equal((await upload('/analyze-report', big(30), 'office.zip')).status, 200);  // over the 25 MB file cap, under the 40 MB ZIP / Office cap
  assert.equal((await upload('/analyze-report', big(41), 'huge.zip')).status, 413);
});

test('reports accept any common document: Word / Excel (zips), iPhone photos, old Office, Windows text, HTML, RTF, JSON', async () => {
  const docx = Buffer.concat([Buffer.from('PK\x03\x04'), Buffer.alloc(64)]);
  assert.equal((await upload('/analyze-report', docx, 'labs.docx')).status, 200);
  assert.equal((await upload('/analyze-report', docx, 'labs.xlsx')).status, 200);
  const heic = Buffer.concat([Buffer.alloc(4), Buffer.from('ftypheic'), Buffer.alloc(64)]);
  assert.equal((await upload('/analyze-report', heic, 'IMG_0001.HEIC')).status, 200);
  assert.equal((await upload('/analyze-image', heic, 'IMG_0002.HEIC', { scan_type: 'xray' })).status, 200);
  const ole = Buffer.concat([Buffer.from('d0cf11e0a1b11ae1', 'hex'), Buffer.alloc(600)]);
  assert.equal((await upload('/analyze-report', ole, 'old.doc')).status, 200);   // Python explains how to convert it
  assert.equal((await upload('/analyze-image', ole, 'old.doc')).status, 415);    // never a scan
  const utf16 = Buffer.concat([Buffer.from([0xff, 0xfe]), Buffer.from('Hemoglobin 13.2', 'utf16le')]);
  assert.equal((await upload('/analyze-report', utf16, 'labs.txt')).status, 200);
  assert.equal((await upload('/analyze-report', Buffer.from('<!DOCTYPE html><table></table>'), 'report')).status, 200);
  assert.equal((await upload('/analyze-report', Buffer.from('{\\rtf1\\ansi Hemoglobin 13.2}'), 'report')).status, 200);
  assert.equal((await upload('/analyze-report', Buffer.from('{"hb": 13.2}'), 'labs.json')).status, 200);
  const bad = await upload('/analyze-report', Buffer.from('MZ\x90\x00 not a document'), 'virus.exe');
  assert.equal(bad.status, 415);
  assert.match((await bad.json()).error, /Upload a PDF, photo or scan, Word \/ Excel \/ text file, or a ZIP/);
});

test('DICOM saved without the preamble is still passed to Python; random bytes starting the same way are Python\'s call', async () => {
  const bare = Buffer.concat([Buffer.from([0x08, 0x00, 0x05, 0x00]), Buffer.alloc(64)]);
  assert.equal((await upload('/analyze-image', bare, 'IM0001', { scan_type: 'ct' })).status, 200);
  assert.equal((await upload('/analyze-report', bare, 'IM0001')).status, 415);   // never a lab report
  assert.equal((await upload('/analyze-image', Buffer.from([0x08, 0x01, 0x05, 0x00, 1, 2, 3, 4, 5]), 'x')).status, 415);
});

test('image: study regions reach Python, unknown ones are dropped', async () => {
  const field = (body, name) => new RegExp(`name="${name}"\\r\\n\\r\\n([^\\r]*)`).exec(body)?.[1];
  await upload('/analyze-image', png, 'scan.png', { scan_type: 'ct', regions: 'abdomen, pelvis,lungs,abdomen,whole_body' });
  const hit = seen.findLast((s) => s.url === '/api/v1/diagnostics/imaging');
  assert.equal(field(hit.body, 'regions'), 'abdomen,pelvis,whole_body');
  await upload('/analyze-image', png, 'scan.png', { scan_type: 'ecg' });
  assert.equal(field(seen.findLast((s) => s.url === '/api/v1/diagnostics/imaging').body, 'regions'), '');
});

test('image: type is decided by bytes, not by file name', async () => {
  const r = await upload('/analyze-image', Buffer.from('MZ\x90\x00 not an image'), 'evil.png');
  assert.equal(r.status, 415);
});

test('image: oversize file is refused', async () => {
  const r = await upload('/analyze-image', Buffer.concat([png, Buffer.alloc(26 * 1024 * 1024)]), 'big.png');
  assert.equal(r.status, 413);
});

test('report: context is forwarded for pasted text and for uploads', async () => {
  const post = (body) => fetch(base + '/analyze-report', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` }, body: JSON.stringify(body) });
  await post({ reportText: 'Hb 13.2 g/dL', context: 'diabetic' });
  assert.match(JSON.parse(seen.findLast((s) => s.url === '/api/v1/diagnostics/lab-report').body).context, /^diabetic$/);
  await upload('/analyze-report', Buffer.from('Hb 13.2 g/dL (12-16)\nWBC 6.1'), 'lab.txt', { context: 'pregnant' });
  assert.match(seen.findLast((s) => s.url === '/api/v1/diagnostics/lab-report-file').body, /name="context"\r\n\r\npregnant/);
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
