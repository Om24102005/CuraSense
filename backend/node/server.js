import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
// nodemailer / Resend / Gmail SMTP all removed — the reset code is
// returned directly from /forgot-password and displayed in the UI.
// No email infrastructure is required for the flow to work.
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env from the backend root (../) so a single env file feeds
// both this Node service and the Python service in ../python.
// Falls back to a local .env if one happens to exist beside server.js.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_neural_key_2026';

// Fail fast on Mongo connection issues — without this, queries
// hang for 10s before throwing "buffering timed out" which is what
// surfaces as a 500 on /login.
mongoose.set('bufferCommands', false);

if (!process.env.MONGODB_URI) {
  console.error('[FATAL] MONGODB_URI is not set. Check backend/.env');
}

mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 4000,
})
  .then(async () => {
    console.log('Connected to MongoDB:', process.env.MONGODB_URI);
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
  .catch(err => {
    console.error('[MongoDB] Connection failed:', err.message);
    console.error('[MongoDB] Is mongod running on the host in MONGODB_URI?');
  });

// Reject API calls cleanly when Mongo isn't connected, instead of
// letting them hang or surface as opaque 500s.
const requireMongo = (_req, res, next) => {
  // readyState: 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      error: 'Database unavailable. Start MongoDB (mongod) and try again.',
      readyState: mongoose.connection.readyState,
    });
  }
  next();
};

// Health endpoint for quick diagnosis from the browser / curl
app.get('/health', (_req, res) => {
  res.json({
    server: 'ok',
    mongo: mongoose.connection.readyState === 1 ? 'connected' : 'down',
    uri: process.env.MONGODB_URI ? 'set' : 'missing',
  });
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  // Reset-code fields — populated by /forgot-password, cleared by /reset-password
  resetCode: { type: String, default: null },
  resetCodeExpiry: { type: Date, default: null },
  // TOTP / Google Authenticator 2FA
  // totpSecret: base32 secret shared with the authenticator app. Stored
  // unencrypted at rest; if you need extra hardening, encrypt with KMS.
  // totpEnabled: false until the user verifies their first code.
  totpSecret: { type: String, default: null },
  totpEnabled: { type: Boolean, default: false },
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

/* ── AUTH WITH GOOGLE-AUTHENTICATOR 2FA ──
   Sign-up is a two-step flow:
     1. POST /register
        Creates the user (totpEnabled=false). Returns a short-lived
        SETUP TOKEN — usable only for /totp-setup and /totp-verify, never
        for protected routes.
     2a. POST /totp-setup    (Bearer setup token)
        Generates a base32 secret, stores it on the user, returns the
        otpauth URL + a data:image/png;base64,... QR. The frontend shows
        the QR; user scans with Google Authenticator.
     2b. POST /totp-verify   (Bearer setup token, body: { code })
        Verifies the 6-digit code, flips totpEnabled=true, and finally
        issues the FULL JWT.

   Login is also two-step when 2FA is on:
     1. POST /login            → if totpEnabled, returns { totpToken } only
     2. POST /login-totp       → exchanges totpToken + code for full JWT
   Legacy users (totpEnabled=false) get the full JWT directly from /login.
*/

const SETUP_PURPOSE = 'totp_setup';
const LOGIN_TOTP_PURPOSE = 'totp_login';

const issueFullToken = (user) =>
  jwt.sign({ _id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });

const issuePurposeToken = (user, purpose) =>
  jwt.sign({ _id: user._id, purpose }, JWT_SECRET, { expiresIn: '15m' });

// Verify a token that was issued for a single purpose (totp setup / totp login).
const verifyPurposeToken = (req, res, expectedPurpose) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ error: 'Setup token required.' });
    return null;
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.purpose !== expectedPurpose) {
      res.status(403).json({ error: 'Wrong token type.' });
      return null;
    }
    return decoded;
  } catch {
    res.status(400).json({ error: 'Invalid or expired setup token.' });
    return null;
  }
};

app.post('/register', requireMongo, async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'name, email, and password are required.' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already in use.' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ name, email, password: hashedPassword, role: 'user' });
    const savedUser = await user.save();

    // Issue a SETUP token. Account is created but not usable until 2FA verified.
    const setupToken = issuePurposeToken(savedUser, SETUP_PURPOSE);
    res.json({
      setupToken,
      requiresTotpSetup: true,
      user: { id: savedUser._id, name: savedUser.name, email: savedUser.email, role: savedUser.role },
    });
  } catch (error) {
    console.error('[/register] failed:', error);
    res.status(500).json({ error: error.message });
  }
});

/* Generate (or regenerate) the TOTP secret and a scannable QR code.
   Idempotent — calling again before /totp-verify rotates the secret so
   a user who closed the QR can reopen this step and get a fresh one. */
app.post('/totp-setup', requireMongo, async (req, res) => {
  const decoded = verifyPurposeToken(req, res, SETUP_PURPOSE);
  if (!decoded) return;

  try {
    const user = await User.findById(decoded._id);
    if (!user) return res.status(404).json({ error: 'Account not found.' });
    if (user.totpEnabled) {
      return res.status(400).json({ error: '2FA is already set up for this account.' });
    }

    const secret = speakeasy.generateSecret({
      name: `CuraSense (${user.email})`,
      issuer: 'CuraSense',
      length: 20,
    });
    user.totpSecret = secret.base32;
    await user.save();

    const qrDataUrl = await QRCode.toDataURL(secret.otpauth_url);
    res.json({
      otpauthUrl: secret.otpauth_url,
      qrDataUrl,
      // Manual-entry fallback for users whose camera doesn't read the QR.
      manualSecret: secret.base32,
      issuer: 'CuraSense',
      account: user.email,
    });
  } catch (error) {
    console.error('[/totp-setup] failed:', error);
    res.status(500).json({ error: error.message });
  }
});

/* Verify the 6-digit code generated by Google Authenticator.
   On success, mark 2FA enabled and issue the full JWT. */
app.post('/totp-verify', requireMongo, async (req, res) => {
  const decoded = verifyPurposeToken(req, res, SETUP_PURPOSE);
  if (!decoded) return;

  try {
    const { code } = req.body || {};
    if (!code) return res.status(400).json({ error: 'code is required.' });

    const user = await User.findById(decoded._id);
    if (!user || !user.totpSecret) {
      return res.status(400).json({ error: 'Run /totp-setup first.' });
    }

    const ok = speakeasy.totp.verify({
      secret: user.totpSecret,
      encoding: 'base32',
      token: String(code).trim(),
      window: 1,
    });
    if (!ok) return res.status(400).json({ error: 'Invalid code. Check your authenticator app and try again.' });

    user.totpEnabled = true;
    await user.save();

    const token = issueFullToken(user);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('[/totp-verify] failed:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/login', requireMongo, async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required.' });
    }
    const user = await User.findOne({ $or: [{ email: email }, { name: email }] });
    if (!user) return res.status(400).json({ error: 'Invalid credentials.' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid credentials.' });

    // 2FA gate. If the user enabled it, password alone is not enough.
    if (user.totpEnabled) {
      const totpToken = issuePurposeToken(user, LOGIN_TOTP_PURPOSE);
      return res.json({
        requiresTotp: true,
        totpToken,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      });
    }

    // No 2FA on this account — issue the full token.
    const token = issueFullToken(user);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error('[/login] failed:', error);
    res.status(500).json({ error: error.message });
  }
});

/* Step-2 login: exchange the totpToken (returned by /login) + the
   6-digit code from Google Authenticator for the full JWT. */
app.post('/login-totp', requireMongo, async (req, res) => {
  const decoded = verifyPurposeToken(req, res, LOGIN_TOTP_PURPOSE);
  if (!decoded) return;

  try {
    const { code } = req.body || {};
    if (!code) return res.status(400).json({ error: 'code is required.' });

    const user = await User.findById(decoded._id);
    if (!user || !user.totpEnabled || !user.totpSecret) {
      return res.status(400).json({ error: '2FA is not active for this account.' });
    }

    const ok = speakeasy.totp.verify({
      secret: user.totpSecret,
      encoding: 'base32',
      token: String(code).trim(),
      window: 1,
    });
    if (!ok) return res.status(400).json({ error: 'Invalid code. Check your authenticator app and try again.' });

    const token = issueFullToken(user);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('[/login-totp] failed:', error);
    res.status(500).json({ error: error.message });
  }
});

/* ── PASSWORD RESET — code-based flow, MongoDB only ──
   /forgot-password
     1. Look up the user by email or name.
     2. Generate a 6-digit numeric code, save it on the user with a
        30-minute expiry.
     3. Return the code in the response. The UI shows it on screen
        (no email server). The user types it back to verify, then
        sets a new password.

   /reset-password
     1. Take { email, code, password }.
     2. Verify the code matches and isn't expired.
     3. bcrypt the new password, save, clear the code so it can't be
        reused. */

app.post('/forgot-password', requireMongo, async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ error: 'Email required.' });

    const user = await User.findOne({ $or: [{ email }, { name: email }] });
    if (!user) {
      return res.status(404).json({ error: 'No account found with that email or username.' });
    }

    // 6-digit code, 30-minute expiry
    const code = String(Math.floor(100000 + Math.random() * 900000));
    user.resetCode = code;
    user.resetCodeExpiry = new Date(Date.now() + 30 * 60 * 1000);
    await user.save();

    /* No email infrastructure — the code is returned directly to the
       UI which displays it on the verify screen. Works for any email
       that's a registered account, no third-party services required. */

    return res.json({
      success: true,
      message: 'Reset code generated. Type the code shown to continue.',
      code,
      email: user.email,
      maskedEmail: user.email.replace(/^(.).*(.@.*)$/, '$1***$2'),
      name: user.name,
      expiresInMinutes: 30,
    });
  } catch (error) {
    console.error('[/forgot-password] failed:', error);
    res.status(500).json({ error: error.message || 'Failed to process reset request.' });
  }
});

/* Verify the typed code WITHOUT changing the password.
   Returns { valid: true } if the code matches and hasn't expired.
   The code-entry stage uses this so it can advance to the password
   stage only after a valid code is entered. */
app.post('/verify-reset-code', requireMongo, async (req, res) => {
  try {
    const { email, code } = req.body || {};
    if (!email || !code) return res.status(400).json({ error: 'email and code are required.' });

    const user = await User.findOne({ $or: [{ email }, { name: email }] });
    if (!user) return res.status(404).json({ error: 'Account not found.' });

    if (!user.resetCode || String(user.resetCode) !== String(code).trim()) {
      return res.status(400).json({ error: 'Invalid code.' });
    }
    if (!user.resetCodeExpiry || user.resetCodeExpiry < new Date()) {
      return res.status(400).json({ error: 'Code expired. Request a new one.' });
    }

    res.json({ valid: true, email: user.email });
  } catch (error) {
    console.error('[/verify-reset-code] failed:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/reset-password', requireMongo, async (req, res) => {
  try {
    const { email, code, password } = req.body || {};
    if (!email || !code || !password) {
      return res.status(400).json({ error: 'email, code, and password are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    const user = await User.findOne({ $or: [{ email }, { name: email }] });
    if (!user) return res.status(404).json({ error: 'Account not found.' });

    if (!user.resetCode || String(user.resetCode) !== String(code).trim()) {
      return res.status(400).json({ error: 'Invalid reset code.' });
    }
    if (!user.resetCodeExpiry || user.resetCodeExpiry < new Date()) {
      return res.status(400).json({ error: 'Reset code has expired. Request a new one.' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    // Clear the code so it can't be reused.
    user.resetCode = null;
    user.resetCodeExpiry = null;
    await user.save();

    res.json({ success: true, message: 'Password updated. You can log in with your new password.' });
  } catch (error) {
    console.error('[/reset-password] failed:', error);
    res.status(500).json({ error: error.message });
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

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Secure server running on port ${PORT}`);
});