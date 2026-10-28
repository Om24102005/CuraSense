import { PYTHON_AI_URL, GATEWAY_SECRET } from '../config/env.js';

/**
 * Proxies a symptom-triage request to the Python AI gateway.
 * Returns the raw fetch Response — caller handles status/json/error shaping.
 */
export async function requestSymptomTriage({ patientId, symptoms, wearableContext }) {
  return fetch(`${PYTHON_AI_URL}/api/v1/diagnostics/symptoms`, {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${GATEWAY_SECRET}`,
    },
    body: JSON.stringify({
      patient_id:       patientId,
      symptoms,
      wearable_context: wearableContext,
    }),
    signal: AbortSignal.timeout(45000),
  });
}
