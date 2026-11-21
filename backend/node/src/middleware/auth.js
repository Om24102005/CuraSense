import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';
import { User } from '../models/User.js';

/** Raise this when the privacy notice changes in a way people must agree to again. */
export const CONSENT_VERSION = '2026-11-21';

export const requireMongo = (_req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      error: 'Database unavailable. Start MongoDB (mongod) and try again.',
      readyState: mongoose.connection.readyState,
    });
  }
  next();
};

export const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied.' });
  let verified;
  try {
    verified = jwt.verify(token, JWT_SECRET);
  } catch {
    return res.status(400).json({ error: 'Invalid token.' });
  }
  // Setup / login-TOTP tokens (15 min, `purpose` claim) are issued before the
  // second factor is complete; they must never authorise normal API calls.
  if (verified.purpose) return res.status(403).json({ error: 'Wrong token type.' });

  // The account is read on every request, so a deleted account, a changed password or a removed admin role takes effect at once.
  if (mongoose.connection.readyState !== 1) {
    if (process.env.NODE_ENV === 'production') return res.status(503).json({ error: 'Database unavailable. Please try again shortly.' });
    req.user = verified;   // development without a database: the routes that need one answer 503 themselves
    return next();
  }
  try {
    const account = await User.findById(verified._id).select('role tokenVersion consentAt consentVersion').lean();
    if (!account || (account.tokenVersion ?? 0) !== (verified.tv ?? 0)) return res.status(401).json({ error: 'Your session has ended. Please sign in again.' });
    req.user = { ...verified, role: account.role, consented: !!account.consentAt && account.consentVersion === CONSENT_VERSION };
    next();
  } catch {
    res.status(503).json({ error: 'Database unavailable. Please try again shortly.' });
  }
};

/** Health data goes to a third-party AI provider only after the person has agreed to that. */
export const requireConsent = (req, res, next) => {
  // Enforced in production. The phone app in apps/mobile has no consent screen yet, so a development server must keep working for it.
  if (process.env.NODE_ENV !== 'production' && process.env.CONSENT_REQUIRED !== '1') return next();
  if (req.user.consented === undefined) return next();   // development without a database (see verifyToken)
  if (req.user.consented) return next();
  res.status(403).json({ error: 'Please review and accept how your data is processed before running an analysis.', consentRequired: true });
};

export const verifyAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin privileges required.' });
    next();
  } catch (error) {
    res.status(500).json({ error: 'Server error verifying role.' });
  }
};

/* ── AUTH WITH GOOGLE-AUTHENTICATOR 2FA ── */

export const SETUP_PURPOSE      = 'totp_setup';
export const LOGIN_TOTP_PURPOSE = 'totp_login';

export const issueFullToken = (user) =>
  jwt.sign({ _id: user._id, role: user.role, tv: user.tokenVersion ?? 0 }, JWT_SECRET, { expiresIn: '24h' });

export const issuePurposeToken = (user, purpose) =>
  jwt.sign({ _id: user._id, purpose }, JWT_SECRET, { expiresIn: '15m' });

export const verifyPurposeToken = (req, res, expectedPurpose) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) { res.status(401).json({ error: 'Setup token required.' }); return null; }
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
