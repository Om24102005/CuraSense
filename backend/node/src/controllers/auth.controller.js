import bcrypt from 'bcryptjs';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { User } from '../models/User.js';
import { findAccount, openSecret, passwordProblem, sealSecret, str, validEmail } from '../services/accounts.js';
import {
  SETUP_PURPOSE, LOGIN_TOTP_PURPOSE,
  issueFullToken, issuePurposeToken, verifyPurposeToken,
} from '../middleware/auth.js';

// The same work is done for an unknown email as for a wrong password, so the response time does not reveal who has an account.
const NO_ACCOUNT_HASH = bcrypt.hashSync('no-account-placeholder', 10);

// Wrong authenticator codes per account, on top of the per-IP limit, so guessing from many addresses gets nowhere.
// shortcut: in-memory, per process; move it to a shared store before running more than one Node instance.
const codeFails = new Map();
const CODE_WINDOW_MS = 15 * 60_000, MAX_CODE_FAILS = 10;
const codeLocked = (id) => {
  const f = codeFails.get(String(id));
  if (f && f.until < Date.now()) { codeFails.delete(String(id)); return false; }
  return !!f && f.n >= MAX_CODE_FAILS;
};
const noteCodeFail = (id) => {
  const f = codeFails.get(String(id)) ?? { n: 0, until: Date.now() + CODE_WINDOW_MS };
  f.n++;
  codeFails.set(String(id), f);
};
const validCode = (user, code) => speakeasy.totp.verify({ secret: openSecret(user.totpSecret), encoding: 'base32', token: str(code), window: 1 });
const publicUser = (u) => ({ id: u._id, name: u.name, email: u.email, role: u.role });
const failed = (res, where, error) => {
  console.error(`[${where}] failed:`, error.message);
  res.status(500).json({ error: 'Something went wrong. Please try again.' });
};

export async function register(req, res) {
  try {
    const name = str(req.body?.name), email = str(req.body?.email).toLowerCase(), { password } = req.body || {};
    if (!name || !email || !password)
      return res.status(400).json({ error: 'name, email, and password are required.' });
    if (name.length > 80 || name.includes('@')) return res.status(400).json({ error: 'Enter a name of 1 to 80 characters, without @.' });
    if (!validEmail(email)) return res.status(400).json({ error: 'Enter a valid email address.' });
    const problem = passwordProblem(password);
    if (problem) return res.status(400).json({ error: problem });

    if (await User.findOne({ email })) return res.status(400).json({ error: 'Email already in use.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const savedUser = await new User({ name, email, password: hashedPassword, role: 'user' }).save();

    const setupToken = issuePurposeToken(savedUser, SETUP_PURPOSE);
    res.json({ setupToken, requiresTotpSetup: true, user: publicUser(savedUser) });
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ error: 'Email already in use.' });
    failed(res, '/register', error);
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
    user.totpSecret = sealSecret(secret.base32);
    await user.save();

    const qrDataUrl = await QRCode.toDataURL(secret.otpauth_url);
    res.json({ otpauthUrl: secret.otpauth_url, qrDataUrl, manualSecret: secret.base32, issuer: 'CuraSense', account: user.email });
  } catch (error) {
    failed(res, '/totp-setup', error);
  }
}

export async function totpVerify(req, res) {
  const decoded = verifyPurposeToken(req, res, SETUP_PURPOSE);
  if (!decoded) return;
  try {
    const code = str(req.body?.code);
    if (!code) return res.status(400).json({ error: 'code is required.' });

    const user = await User.findById(decoded._id);
    if (!user || !user.totpSecret) return res.status(400).json({ error: 'Run /totp-setup first.' });
    if (user.totpEnabled) return res.status(400).json({ error: '2FA is already set up for this account.' });
    if (codeLocked(user._id)) return res.status(429).json({ error: 'Too many wrong codes. Try again in 15 minutes.' });

    if (!validCode(user, code)) {
      noteCodeFail(user._id);
      return res.status(400).json({ error: 'Invalid code. Check your authenticator app and try again.' });
    }
    codeFails.delete(String(user._id));

    user.totpEnabled = true;
    await user.save();

    res.json({ token: issueFullToken(user), user: publicUser(user) });
  } catch (error) {
    failed(res, '/totp-verify', error);
  }
}

export async function login(req, res) {
  try {
    const email = str(req.body?.email), { password } = req.body || {};
    if (!email || typeof password !== 'string' || !password)
      return res.status(400).json({ error: 'email and password are required.' });

    const user = await findAccount(email);
    const validPassword = await bcrypt.compare(password, user?.password ?? NO_ACCOUNT_HASH);
    if (!user || !validPassword) return res.status(400).json({ error: 'Invalid credentials.' });

    if (user.totpEnabled) {
      return res.json({ requiresTotp: true, totpToken: issuePurposeToken(user, LOGIN_TOTP_PURPOSE), user: publicUser(user) });
    }
    // No authenticator yet (a sign-up left unfinished, or a new admin): the password alone never opens the account, it opens the setup step.
    res.json({ requiresTotpSetup: true, setupToken: issuePurposeToken(user, SETUP_PURPOSE), user: publicUser(user) });
  } catch (error) {
    failed(res, '/login', error);
  }
}

export async function loginTotp(req, res) {
  const decoded = verifyPurposeToken(req, res, LOGIN_TOTP_PURPOSE);
  if (!decoded) return;
  try {
    const code = str(req.body?.code);
    if (!code) return res.status(400).json({ error: 'code is required.' });
    if (codeLocked(decoded._id)) return res.status(429).json({ error: 'Too many wrong codes. Try again in 15 minutes.' });

    const user = await User.findById(decoded._id);
    if (!user || !user.totpEnabled || !user.totpSecret)
      return res.status(400).json({ error: '2FA is not active for this account.' });

    if (!validCode(user, code)) {
      noteCodeFail(user._id);
      return res.status(400).json({ error: 'Invalid code. Check your authenticator app and try again.' });
    }
    codeFails.delete(String(user._id));
    res.json({ token: issueFullToken(user), user: publicUser(user) });
  } catch (error) {
    failed(res, '/login-totp', error);
  }
}
