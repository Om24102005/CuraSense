import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';

export const requireMongo = (_req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      error: 'Database unavailable. Start MongoDB (mongod) and try again.',
      readyState: mongoose.connection.readyState,
    });
  }
  next();
};

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied.' });
  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch {
    res.status(400).json({ error: 'Invalid token.' });
  }
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
  jwt.sign({ _id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });

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
