import mongoose from 'mongoose';

const predictionSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type:      String,
  diagnosis: String,
  confidence:Number,
  details:   String,
  recommendations: [String],
  timestamp: { type: Date, default: Date.now },
  liked:     { type: Boolean, default: false },
  urgency:   { type: String, enum: ['low', 'medium', 'high', 'emergency'], default: null },
  conditions:  [{ name: String, probability: Number }],
  biomarkers:  [{ name: String, value: Number, unit: String, status: String, normal_min: Number, normal_max: Number }],
  scanSections:[{ title: String, findings: [String] }],
});

export const Prediction = mongoose.model('Prediction', predictionSchema);
