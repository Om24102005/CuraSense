import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name:            { type: String, required: true },
  email:           { type: String, required: true, unique: true },
  password:        { type: String, required: true },
  role:            { type: String, default: 'user' },
  resetCode:       { type: String, default: null },
  resetCodeExpiry: { type: Date,   default: null },
  totpSecret:      { type: String, default: null },
  totpEnabled:     { type: Boolean, default: false },
  createdAt:       { type: Date,   default: Date.now },

  // ── User Settings (non-destructive: added alongside existing fields) ──
  settings: {
    aiPreferences: {
      explainLevel: { type: String, default: 'clinical' },
      outputDepth:  { type: String, default: 'concise'  },
    },
    dependents: [{
      _id:       false,
      id:        { type: String },
      name:      { type: String },
      dob:       { type: String, default: '' },
      sex:       { type: String, default: 'male' },
      allergies: { type: String, default: '' },
    }],
    emergencyProtocols: {
      contacts: [{
        _id:      false,
        id:       { type: String },
        name:     { type: String },
        relation: { type: String, default: '' },
        phone:    { type: String },
      }],
      autoAlertsEnabled: { type: Boolean, default: false },
    },
    localization: {
      measurementStandard: { type: String,  default: 'metric' },
      language:            { type: String,  default: 'en'     },
      highContrast:        { type: Boolean, default: false    },
      largeText:           { type: Boolean, default: false    },
    },
  },

  // ── Wearable Biometric Data (non-destructive append) ─────────────────
  wearableData: {
    restingHeartRate:     { type: Number, default: null },
    heartRateVariability: { type: Number, default: null },
    sleepDuration:        { type: Number, default: null },
    bloodOxygenAverage:   { type: Number, default: null },
    lastSyncedAt:         { type: Date,   default: null },
  },
});

export const User = mongoose.model('User', userSchema);
