import { User } from '../models/User.js';
import { requestSymptomTriage, requestImaging, requestLabReport, requestLabReportFile } from '../services/pythonAiClient.js';

const MAX_SYMPTOM_CHARS = 2000;
const MAX_REPORT_CHARS = 60000;
const SCAN_TYPES = new Set(['scan', 'xray', 'ct', 'mri', 'ultrasound', 'mammogram', 'pet', 'dermatology', 'other']);

/* Relay a Python response. Health data is never logged: only the status code. */
async function relay(res, aiRes, label) {
  if (!aiRes.ok) {
    console.error(`[${label}] Python AI error ${aiRes.status}`);
    return res.status(502).json({ error: 'AI service returned an error.' });
  }
  return res.json(await aiRes.json());
}

const unavailable = (res, label, err) => {
  console.error(`[${label}] Proxy error:`, err.message);
  return res.status(502).json({ error: 'AI service unavailable. Please try again shortly.' });
};

/**
 * Fetches the authenticated user's wearableData from MongoDB, builds an
 * immutable biometric baseline string, then proxies the request to the
 * Python AI service with that context injected into the payload.
 * Falls back gracefully if Python is unreachable.
 */
export async function analyzeSymptoms(req, res) {
  try {
    const user = await User.findById(req.user._id).select('wearableData');
    const wd   = user?.wearableData;

    let wearableContext = null;
    if (wd?.lastSyncedAt && wd.restingHeartRate != null) {
      wearableContext = (
        '[System Notice: Activating real-time patient biometric stream. ' +
        `Current Baseline: RHR: ${wd.restingHeartRate} BPM, ` +
        `HRV: ${wd.heartRateVariability ?? 'N/A'}ms, ` +
        `Avg SpO2: ${wd.bloodOxygenAverage != null ? wd.bloodOxygenAverage.toFixed(1) : 'N/A'}%, ` +
        `Sleep: ${wd.sleepDuration ?? 'N/A'} mins. ` +
        'Analyze symptoms against these real objective parameters.]'
      );
    }

    const { symptoms } = req.body || {};
    const symptomsText = Array.isArray(symptoms)
      ? symptoms.join(', ')
      : (typeof symptoms === 'string' ? symptoms : '');

    if (!symptomsText.trim()) return res.status(400).json({ error: 'Describe at least one symptom.' });
    if (symptomsText.length > MAX_SYMPTOM_CHARS) return res.status(400).json({ error: `Symptoms too long (max ${MAX_SYMPTOM_CHARS} characters).` });

    const aiRes = await requestSymptomTriage({
      patientId: req.user._id.toString(),
      symptoms: symptomsText,
      wearableContext,
    });

    return await relay(res, aiRes, '/analyze-symptoms');
  } catch (err) {
    return unavailable(res, '/analyze-symptoms', err);
  }
}

/** POST /analyze-image  multipart: file, scan_type. Replaces the former fake stub. */
export async function analyzeImage(req, res) {
  try {
    const scanType = SCAN_TYPES.has(req.body?.scan_type) ? req.body.scan_type : 'scan';
    const aiRes = await requestImaging({ patientId: req.user._id.toString(), scanType, file: req.file });
    return await relay(res, aiRes, '/analyze-image');
  } catch (err) {
    return unavailable(res, '/analyze-image', err);
  }
}

/** POST /analyze-report  multipart (file) or JSON { reportText | report_text }. Replaces the former fake stub. */
export async function analyzeReport(req, res) {
  try {
    const patientId = req.user._id.toString();
    if (req.file) return await relay(res, await requestLabReportFile({ patientId, file: req.file }), '/analyze-report');
    const reportText = req.body?.reportText ?? req.body?.report_text;
    if (typeof reportText !== 'string' || !reportText.trim()) return res.status(400).json({ error: 'Provide report text or a file.' });
    if (reportText.length > MAX_REPORT_CHARS) return res.status(400).json({ error: `Report too long (max ${MAX_REPORT_CHARS} characters).` });
    return await relay(res, await requestLabReport({ patientId, reportText }), '/analyze-report');
  } catch (err) {
    return unavailable(res, '/analyze-report', err);
  }
}
