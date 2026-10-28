import { Prediction } from '../models/Prediction.js';

export async function savePrediction(req, res) {
  try {
    const newPrediction = new Prediction({ ...req.body, userId: req.user._id });
    const saved = await newPrediction.save();
    res.json(saved);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getPredictions(req, res) {
  try {
    const predictions = await Prediction.find({ userId: req.user._id }).sort({ timestamp: -1 });
    res.json({ predictions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function deletePrediction(req, res) {
  try {
    await Prediction.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
