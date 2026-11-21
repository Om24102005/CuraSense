import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { JWT_SECRET } from '../config/env.js';
import { findAccount, passwordProblem, str } from '../services/accounts.js';
import { mailConfigured, sendResetCode } from '../services/mailer.js';

// A reset code must only ever reach the account's owner, by email: PASSWORD_RESET_EMAIL=1 with the SMTP settings turns that on.
// RESET_CODE_IN_RESPONSE=1 (set by start-dev.sh and the e2e tests only) returns the code in the response, which lets anyone who knows
// an email address take over that account, so it is ignored in production.
const devCode = () => process.env.RESET_CODE_IN_RESPONSE === '1' && process.env.NODE_ENV !== 'production';
const mailOn = () => process.env.PASSWORD_RESET_EMAIL === '1' && mailConfigured();
const resetEnabled = () => devCode() || mailOn();
const resetOff = (res) => res.status(503).json({ error: 'Password reset by email is not set up yet. Please contact the CuraSense team.' });

const CODE_MINUTES = 15, MAX_ATTEMPTS = 5, RESEND_AFTER_MS = 60_000;
const hashCode = (user, code) => crypto.createHmac('sha256', JWT_SECRET).update(`${user._id}:${code}`).digest('hex');
const masked = (email) => email.replace(/^(.).*(.@.*)$/, '$1***$2');
const wipeCode = (user) => { user.resetCode = null; user.resetCodeExpiry = null; user.resetAttempts = 0; };

/** A wrong guess counts against the code, and the fifth one ends it. */
async function codeIsRight(user, code) {
  if (!user?.resetCode || !user.resetCodeExpiry || user.resetCodeExpiry < new Date()) return false;
  const given = Buffer.from(hashCode(user, str(code))), stored = Buffer.from(user.resetCode);
  if (given.length === stored.length && crypto.timingSafeEqual(given, stored)) return true;
  user.resetAttempts = (user.resetAttempts || 0) + 1;
  if (user.resetAttempts >= MAX_ATTEMPTS) wipeCode(user);
  await user.save();
  return false;
}

export async function forgotPassword(req, res) {
  if (!resetEnabled()) return resetOff(res);
  try {
    const email = str(req.body?.email);
    if (!email) return res.status(400).json({ error: 'Email required.' });
    // By email the answer is the same whether or not the account exists, so this form cannot be used to find out who has one.
    const sent = { success: true, message: 'If that email has an account, a code is on its way.', email, maskedEmail: masked(email), expiresInMinutes: CODE_MINUTES };

    const user = await findAccount(email);
    if (!user) return devCode() ? res.status(404).json({ error: 'No account found with that email or username.' }) : res.json(sent);

    const issuedAt = user.resetCodeExpiry ? user.resetCodeExpiry.getTime() - CODE_MINUTES * 60_000 : 0;
    if (!devCode() && Date.now() - issuedAt < RESEND_AFTER_MS) return res.json(sent);   // one email a minute per account

    const code = String(crypto.randomInt(100000, 1000000));
    user.resetCode = hashCode(user, code);
    user.resetCodeExpiry = new Date(Date.now() + CODE_MINUTES * 60_000);
    user.resetAttempts = 0;
    await user.save();

    if (devCode()) return res.json({ ...sent, message: 'Reset code generated. Type the code shown to continue.', code, email: user.email, maskedEmail: masked(user.email), name: user.name });
    // Not awaited: a slow mail server must not reveal, by timing, that this address has an account.
    sendResetCode(user.email, code).catch((err) => console.error('[/forgot-password] email failed:', err.code || err.message));
    res.json(sent);
  } catch (error) {
    console.error('[/forgot-password] failed:', error.message);
    res.status(500).json({ error: 'Failed to process reset request.' });
  }
}

export async function verifyResetCode(req, res) {
  if (!resetEnabled()) return resetOff(res);
  try {
    const email = str(req.body?.email), code = str(req.body?.code);
    if (!email || !code) return res.status(400).json({ error: 'email and code are required.' });
    const user = await findAccount(email);
    if (!(await codeIsRight(user, code))) return res.status(400).json({ error: 'Invalid or expired code.' });
    res.json({ valid: true, email: user.email });
  } catch (error) {
    console.error('[/verify-reset-code] failed:', error.message);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}

export async function resetPassword(req, res) {
  if (!resetEnabled()) return resetOff(res);
  try {
    const email = str(req.body?.email), code = str(req.body?.code), { password } = req.body || {};
    if (!email || !code || !password) return res.status(400).json({ error: 'email, code, and password are required.' });
    const problem = passwordProblem(password);
    if (problem) return res.status(400).json({ error: problem });

    const user = await findAccount(email);
    if (!(await codeIsRight(user, code))) return res.status(400).json({ error: 'Invalid or expired code.' });

    user.password = await bcrypt.hash(password, 10);
    user.tokenVersion = (user.tokenVersion || 0) + 1;   // every session on every device ends
    wipeCode(user);
    await user.save();
    res.json({ success: true, message: 'Password updated. You can log in with your new password.' });
  } catch (error) {
    console.error('[/reset-password] failed:', error.message);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}
