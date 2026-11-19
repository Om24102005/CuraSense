import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';

// A reset code must only ever reach the account's owner, by email, and no mail service is set up yet. Until one is, the whole reset flow is off.
// RESET_CODE_IN_RESPONSE=1 (set by start-dev.sh and the e2e tests only) turns it on and returns the code in the response, which lets anyone
// who knows an email address take over that account: never set it on a server other people can reach.
const resetEnabled = () => process.env.RESET_CODE_IN_RESPONSE === '1';
const resetOff = (res) => res.status(503).json({ error: 'Password reset by email is not set up yet. Please contact the CuraSense team.' });

export async function forgotPassword(req, res) {
  if (!resetEnabled()) return resetOff(res);
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ error: 'Email required.' });

    const user = await User.findOne({ $or: [{ email }, { name: email }] });
    if (!user) return res.status(404).json({ error: 'No account found with that email or username.' });

    const code = String(crypto.randomInt(100000, 1000000));
    user.resetCode = code;
    user.resetCodeExpiry = new Date(Date.now() + 30 * 60 * 1000);
    await user.save();

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
}

export async function verifyResetCode(req, res) {
  if (!resetEnabled()) return resetOff(res);
  try {
    const { email, code } = req.body || {};
    if (!email || !code) return res.status(400).json({ error: 'email and code are required.' });

    const user = await User.findOne({ $or: [{ email }, { name: email }] });
    if (!user) return res.status(404).json({ error: 'Account not found.' });

    if (!user.resetCode || String(user.resetCode) !== String(code).trim())
      return res.status(400).json({ error: 'Invalid code.' });
    if (!user.resetCodeExpiry || user.resetCodeExpiry < new Date())
      return res.status(400).json({ error: 'Code expired. Request a new one.' });

    res.json({ valid: true, email: user.email });
  } catch (error) {
    console.error('[/verify-reset-code] failed:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function resetPassword(req, res) {
  if (!resetEnabled()) return resetOff(res);
  try {
    const { email, code, password } = req.body || {};
    if (!email || !code || !password)
      return res.status(400).json({ error: 'email, code, and password are required.' });
    if (password.length < 6)
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });

    const user = await User.findOne({ $or: [{ email }, { name: email }] });
    if (!user) return res.status(404).json({ error: 'Account not found.' });

    if (!user.resetCode || String(user.resetCode) !== String(code).trim())
      return res.status(400).json({ error: 'Invalid reset code.' });
    if (!user.resetCodeExpiry || user.resetCodeExpiry < new Date())
      return res.status(400).json({ error: 'Reset code has expired. Request a new one.' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetCode = null;
    user.resetCodeExpiry = null;
    await user.save();

    res.json({ success: true, message: 'Password updated. You can log in with your new password.' });
  } catch (error) {
    console.error('[/reset-password] failed:', error);
    res.status(500).json({ error: error.message });
  }
}
