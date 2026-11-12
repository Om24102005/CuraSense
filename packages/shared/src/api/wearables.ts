import { fetchAPI } from './client';

export interface WearableData {
  restingHeartRate:     number | null;
  heartRateVariability: number | null;
  sleepDuration:        number | null;
  bloodOxygenAverage:   number | null;
  lastSyncedAt:         string | null;
}

export interface WearableSyncPayload {
  restingHeartRate?:     number;
  heartRateVariability?: number;
  sleepDuration?:        number;
  bloodOxygenAverage?:   number;
}

/**
 * Fetch the current wearable sync state and biometric data for the
 * authenticated user from MongoDB.
 */
export async function getWearableStatus() {
  return fetchAPI<{ wearableData: WearableData | null }>(
    '/api/wearables/apple-health/status',
    { method: 'GET' }
  );
}

/**
 * Post a biometric payload to the Apple Health sync endpoint.
 * In production this is called by the health aggregator webhook.
 * The Force Resync button triggers this to demonstrate the full pipeline.
 */
export async function syncAppleHealth(payload: WearableSyncPayload) {
  return fetchAPI<{ success: boolean; wearableData: WearableData }>(
    '/api/wearables/apple-health/sync',
    { method: 'POST', body: JSON.stringify(payload) }
  );
}
