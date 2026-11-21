import { User } from '../models/User.js';

/**
 * Production webhook receiver for Apple Health aggregator payloads.
 * Accepts a biometric data object, validates each field, then persists
 * it to the authenticated user's wearableData subdocument in MongoDB.
 * In production, this endpoint is called by a health aggregator service
 * (e.g., a HealthKit export pipeline) — not directly by the client UI.
 */
export async function syncAppleHealth(req, res) {
  try {
    const { restingHeartRate, heartRateVariability, sleepDuration, bloodOxygenAverage } = req.body || {};

    const $set = { 'wearableData.lastSyncedAt': new Date() };

    if (typeof restingHeartRate === 'number' && restingHeartRate > 0 && restingHeartRate < 300)
      $set['wearableData.restingHeartRate'] = restingHeartRate;

    if (typeof heartRateVariability === 'number' && heartRateVariability >= 0 && heartRateVariability < 500)
      $set['wearableData.heartRateVariability'] = heartRateVariability;

    if (typeof sleepDuration === 'number' && sleepDuration >= 0 && sleepDuration <= 1440)
      $set['wearableData.sleepDuration'] = Math.round(sleepDuration);

    if (typeof bloodOxygenAverage === 'number' && bloodOxygenAverage >= 50 && bloodOxygenAverage <= 100)
      $set['wearableData.bloodOxygenAverage'] = parseFloat(bloodOxygenAverage.toFixed(1));

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set },
      { new: true, runValidators: false }
    ).select('wearableData');

    if (!user) return res.status(404).json({ error: 'User not found.' });

    res.json({ success: true, wearableData: user.wearableData });
  } catch (error) {
    console.error('[POST /api/wearables/apple-health/sync] failed:', error);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}

/**
 * Returns the current wearableData state for the authenticated user,
 * including all biometric fields and the last sync timestamp.
 */
export async function getWearableStatus(req, res) {
  try {
    const user = await User.findById(req.user._id).select('wearableData');
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json({ wearableData: user.wearableData ?? null });
  } catch (error) {
    console.error('[GET /api/wearables/apple-health/status] failed:', error);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}
