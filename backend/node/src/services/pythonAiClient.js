import { PYTHON_AI_URL, GATEWAY_SECRET } from '../config/env.js';

/* All calls to the Python AI gateway. GATEWAY_SECRET lives only here, on the
   server; browsers never see it. Functions return the raw fetch Response. */

const auth = { Authorization: `Bearer ${GATEWAY_SECRET}` };
// Every page of a file is checked and read (up to 40, several at a time), so uploads get minutes, not seconds.
const FILE_TIMEOUT = 240000;
const url = (p) => `${PYTHON_AI_URL}/api/v1/diagnostics/${p}`;

export function requestSymptomTriage({ patientId, symptoms, wearableContext }) {
  return fetch(url('symptoms'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...auth },
    body: JSON.stringify({ patient_id: patientId, symptoms, wearable_context: wearableContext }),
    signal: AbortSignal.timeout(60000),
  });
}

const fileForm = (patientId, file, extra = {}) => {
  const fd = new FormData();
  fd.append('patient_id', patientId);
  for (const [k, v] of Object.entries(extra)) fd.append(k, v);
  fd.append('file', new Blob([file.buffer], { type: file.mimetype }), file.originalname);
  return fd;
};

export function requestImaging({ patientId, scanType, study, context, regions, file }) {
  return fetch(url('imaging'), { method: 'POST', headers: auth, body: fileForm(patientId, file, { scan_type: scanType, study, context, regions }), signal: AbortSignal.timeout(FILE_TIMEOUT) });
}

export function requestLabReport({ patientId, reportText, context }) {
  return fetch(url('lab-report'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...auth },
    body: JSON.stringify({ patient_id: patientId, report_text: reportText, context }),
    signal: AbortSignal.timeout(90000),
  });
}

export function requestLabReportFile({ patientId, file, context }) {
  return fetch(url('lab-report-file'), { method: 'POST', headers: auth, body: fileForm(patientId, file, { context }), signal: AbortSignal.timeout(FILE_TIMEOUT) });
}

/** Reachability probe for /health. No secret needed. */
export async function pythonIsUp() {
  try {
    const r = await fetch(`${PYTHON_AI_URL}/health`, { signal: AbortSignal.timeout(2000) });
    return r.ok;
  } catch { return false; }
}
