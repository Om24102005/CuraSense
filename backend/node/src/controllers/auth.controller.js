import bcrypt from 'bcryptjs';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { User } from '../models/User.js';
import {
  SETUP_PURPOSE, LOGIN_TOTP_PURPOSE,
  issueFullToken, issuePurposeToken, verifyPurposeToken,
} from '../middleware/auth.js';

export async function register(req, res) {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password)
      return res.status(400).json({ error: 'name, email, and password are required.' });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already in use.' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({ name, email, password: hashedPassword, role: 'user' });
    const savedUser = await user.save();

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
}

export async function totpSetup(req, res) {
  const decoded = verifyPurposeToken(req, res, SETUP_PURPOSE);
  if (!decoded) return;
  try {
    const user = await User.findById(decoded._id);
    if (!user) return res.status(404).json({ error: 'Account not found.' });
    if (user.totpEnabled)
      return res.status(400).json({ error: '2FA is already set up for this account.' });

    const secret = speakeasy.generateSecret({
      name: `CuraSense (${user.email})`, issuer: 'CuraSense', length: 20,
    });
    user.totpSecret = secret.base32;
    await user.save();

    const qrDataUrl = await QRCode.toDataURL(secret.otpauth_url);
    res.json({ otpauthUrl: secret.otpauth_url, qrDataUrl, manualSecret: secret.base32, issuer: 'CuraSense', account: user.email });
  } catch (error) {
    console.error('[/totp-setup] failed:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function totpVerify(req, res) {
  const decoded = verifyPurposeToken(req, res, SETUP_PURPOSE);
  if (!decoded) return;
  try {
    const { code } = req.body || {};
    if (!code) return res.status(400).json({ error: 'code is required.' });

    const user = await User.findById(decoded._id);
    if (!user || !user.totpSecret) return res.status(400).json({ error: 'Run /totp-setup first.' });

    const ok = speakeasy.totp.verify({
      secret: user.totpSecret, encoding: 'base32', token: String(code).trim(), window: 1,
    });
    if (!ok) return res.status(400).json({ error: 'Invalid code. Check your authenticator app and try again.' });

    user.totpEnabled = true;
    await user.save();

    const token = issueFullToken(user);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error('[/totp-verify] failed:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password)
      return res.status(400).json({ error: 'email and password are required.' });

    const user = await User.findOne({ $or: [{ email }, { name: email }] });
    if (!user) return res.status(400).json({ error: 'Invalid credentials.' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid credentials.' });

    if (user.totpEnabled) {
      const totpToken = issuePurposeToken(user, LOGIN_TOTP_PURPOSE);
      return res.json({
        requiresTotp: true, totpToken,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      });
    }

    const token = issueFullToken(user);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error('[/login] failed:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function loginTotp(req, res) {
  const decoded = verifyPurposeToken(req, res, LOGIN_TOTP_PURPOSE);
  if (!decoded) return;
  try {
    const { code } = req.body || {};
    if (!code) return res.status(400).json({ error: 'code is required.' });

    const user = await User.findById(decoded._id);
    if (!user || !user.totpEnabled || !user.totpSecret)
      return res.status(400).json({ error: '2FA is not active for this account.' });

    const ok = speakeasy.totp.verify({
      secret: user.totpSecret, encoding: 'base32', token: String(code).trim(), window: 1,
    });
    if (!ok) return res.status(400).json({ error: 'Invalid code. Check your authenticator app and try again.' });

    const token = issueFullToken(user);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error('[/login-totp] failed:', error);
    res.status(500).json({ error: error.message });
  }
}
