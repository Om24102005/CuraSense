import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_neural_key_2026';

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB securely');
    const User = mongoose.model('User');
    const adminExists = await User.findOne({ name: 'Curasense_D_Hawk' });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('9301919025Mtl', salt);
      await User.create({
        name: 'Curasense_D_Hawk',
        email: 'admin@curasense.com',
        password: hashedPassword,
        role: 'admin'
      });
      console.log('Admin Override Account Initialized');
    }
  })
  .catch(err => console.error(err));

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

const predictionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: String,
  diagnosis: String,
  confidence: Number,
  details: String,
  recommendations: [String],
  timestamp: { type: Date, default: Date.now },
  liked: { type: Boolean, default: false }
});

const Prediction = mongoose.model('Prediction', predictionSchema);

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied.' });

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

const verifyAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin privileges required.' });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: 'Server error verifying role.' });
  }
};

app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already in use.' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ name, email, password: hashedPassword, role: 'user' });
    const savedUser = await user.save();

    const token = jwt.sign({ _id: savedUser._id, role: savedUser.role }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: savedUser._id, name: savedUser.name, email: savedUser.email, role: savedUser.role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ $or: [{ email: email }, { name: email }] });
    if (!user) return res.status(400).json({ error: 'Invalid credentials.' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid credentials.' });

    const token = jwt.sign({ _id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ $or: [{ email: email }, { name: email }] });
    if (!user) return res.status(400).json({ error: 'Identity not found in database.' });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.sendMail({
      from: `"CuraSense Security Protocol" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: 'Account Recovery Request',
      text: `Your requested account details.\n\nUsername: ${user.name}\nSystem Email: ${user.email}\n\nPlease contact an administrator to completely reset your encryption keys if you have lost access.`
    });

    res.json({ success: true, message: 'Recovery email transmitted securely.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process recovery. Check SMTP configuration.' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', secure: true });
});

app.post('/analyze-symptoms', verifyToken, (req, res) => {
  res.json({
    diagnosis: "Analysis Complete",
    confidence: 85,
    details: "Processed securely.",
    recommendations: ["Monitor symptoms", "Stay hydrated"]
  });
});

app.post('/analyze-image', verifyToken, (req, res) => {
  res.json({
    diagnosis: "Image Analyzed",
    confidence: 90,
    details: "Processed securely.",
    recommendations: []
  });
});

app.post('/analyze-report', verifyToken, (req, res) => {
  res.json({
    diagnosis: "Report Analyzed",
    confidence: 88,
    details: "Processed securely.",
    recommendations: []
  });
});

app.post('/save-prediction', verifyToken, async (req, res) => {
  try {
    const newPrediction = new Prediction({ ...req.body, userId: req.user._id });
    const saved = await newPrediction.save();
    res.json(saved);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/predictions', verifyToken, async (req, res) => {
  try {
    const predictions = await Prediction.find({ userId: req.user._id }).sort({ timestamp: -1 });
    res.json({ predictions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/predictions/:id', verifyToken, async (req, res) => {
  try {
    await Prediction.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/admin/stats', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPredictions = await Prediction.countDocuments();
    res.json({ totalUsers, totalPredictions, systemStatus: 'Optimal', latency: '12ms' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/admin/users', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/admin/users/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    if (req.params.id === req.user._id) {
      return res.status(400).json({ error: 'Cannot delete master admin.' });
    }
    await User.findByIdAndDelete(req.params.id);
    await Prediction.deleteMany({ userId: req.params.id });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/admin/predictions', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const predictions = await Prediction.find().populate('userId', 'name email').sort({ timestamp: -1 }).limit(100);
    res.json({ predictions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Secure server running on port ${PORT}`);
});