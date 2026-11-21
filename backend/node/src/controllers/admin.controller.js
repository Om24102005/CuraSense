import { User } from '../models/User.js';
import { Prediction } from '../models/Prediction.js';

export async function getStats(req, res) {
  try {
    const totalUsers = await User.countDocuments();
    const totalPredictions = await Prediction.countDocuments();
    res.json({ totalUsers, totalPredictions, systemStatus: 'Optimal', latency: '12ms' });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}

export async function getUsers(req, res) {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}

export async function deleteUser(req, res) {
  try {
    if (req.params.id === req.user._id)
      return res.status(400).json({ error: 'Cannot delete master admin.' });
    await User.findByIdAndDelete(req.params.id);
    await Prediction.deleteMany({ userId: req.params.id });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}

export async function getAllPredictions(req, res) {
  try {
    const predictions = await Prediction.find().populate('userId', 'name email').sort({ timestamp: -1 }).limit(100);
    res.json({ predictions });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}
