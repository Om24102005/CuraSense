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

http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  if (req.url === '/health') return res.end('{"status":"ok","service":"fake-ai"}');
  if (req.headers.authorization !== `Bearer ${SECRET}`) { res.statusCode = 403; return res.end('{"detail":"Invalid Gateway Token"}'); }
  req.resume();
  req.on('end', () => {
    const body = { '/api/v1/diagnostics/symptoms': symptoms, '/api/v1/diagnostics/imaging': imaging,
      '/api/v1/diagnostics/lab-report': lab, '/api/v1/diagnostics/lab-report-file': lab }[req.url];
    if (!body) { res.statusCode = 404; return res.end('{"detail":"Not Found"}'); }
    res.end(JSON.stringify(body));
  });
}).listen(PORT, () => console.log(`fake AI gateway on ${PORT}`));
