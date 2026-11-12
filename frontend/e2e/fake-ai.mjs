// Stand-in for the Python AI gateway: same routes and response shapes, no model calls, no cost.
import http from 'node:http';

const SECRET = process.env.GATEWAY_SECRET;
const PORT = Number(process.env.FAKE_AI_PORT || 8101);

const symptoms = { status: 'success', module: 'NLP Symptom Triage', analysis: {
  assessment: 'E2E assessment: symptoms are consistent with a mild viral illness.',
  urgency: 'low', confidence: 82,
  conditions: [{ name: 'Common cold', probability: 70, description: 'Mild viral upper respiratory infection.' }],
  recommendations: ['Rest and hydrate', 'See a clinician if symptoms worsen'],
} };
const imaging = { status: 'success', module: 'AI Medical Vision', vision_analysis: { analysis: 'E2E imaging analysis: no acute abnormality described.', detected_kind: 'scan', detected_confidence: 90 } };
const lab = { status: 'success', module: 'Clinical Lab AI', analysis: {
  assessment: 'E2E lab assessment: values within expected ranges.', urgency: 'low', confidence: 88, detected_kind: 'lab_report',
  biomarkers: [{ name: 'Hemoglobin', value: '13.2', unit: 'g/dL', range: '12-16', status: 'normal' }],
  recommendations: ['Routine follow-up'],
} };

// Same refusal shape as the real gateway: the content belongs on another page.
const refusal = (page, scan_type = null) => ({ error: `E2E refusal: this belongs on the ${page} page.`, redirect: { page, scan_type } });

let lastImaging = null; // the form fields of the latest /imaging call, so a test can check what the browser sent through Node
const field = (raw, name) => new RegExp(`name="${name}"\\r\\n\\r\\n([^\\r]*)`).exec(raw)?.[1];

// A request that mentions "slow-please" is answered only when a test calls GET /_release (or after 30 s, so a test that
// died cannot leave the stack hanging). It lets a test look at the loading screen for as long as it needs.
const held = new Set();

http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  if (req.url === '/health') return res.end('{"status":"ok","service":"fake-ai"}');
  if (req.url === '/_last-imaging') return res.end(JSON.stringify(lastImaging));
  if (req.url === '/_release') { const released = held.size; for (const send of [...held]) send(); return res.end(JSON.stringify({ released })); }
  if (req.headers.authorization !== `Bearer ${SECRET}`) { res.statusCode = 403; return res.end('{"detail":"Invalid Gateway Token"}'); }
  let raw = '';
  req.on('data', (c) => { raw += c.toString('latin1'); });
  req.on('end', () => {
    let body = { '/api/v1/diagnostics/symptoms': symptoms, '/api/v1/diagnostics/imaging': imaging,
      '/api/v1/diagnostics/lab-report': lab, '/api/v1/diagnostics/lab-report-file': lab }[req.url];
    if (!body) { res.statusCode = 404; return res.end('{"detail":"Not Found"}'); }
    if (req.url.endsWith('/imaging')) lastImaging = { scan_type: field(raw, 'scan_type'), study: field(raw, 'study'), regions: field(raw, 'regions') };
    if (raw.includes('wrong-page')) { // any request mentioning "wrong-page" is refused
      body = req.url.endsWith('/imaging') ? { status: 'success', vision_analysis: refusal('reports') }
        : req.url.endsWith('/symptoms') ? { status: 'success', analysis: refusal('scans') }
        : { status: 'success', analysis: refusal('scans', 'ct') };
    }
    if (raw.includes('slow-please')) {
      const send = () => { if (!held.delete(send)) return; clearTimeout(timer); res.end(JSON.stringify(body)); };
      const timer = setTimeout(send, 30_000);
      held.add(send);
      return;
    }
    res.end(JSON.stringify(body));
  });
}).listen(PORT, () => console.log(`fake AI gateway on ${PORT}`));
