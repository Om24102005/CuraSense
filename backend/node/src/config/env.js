import crypto from 'crypto';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// backend/node/src/config -> backend/.env (shared with the Python AI gateway)
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config();

// The token-signing secret has no default: a secret that is in the source code lets anyone sign a token for any account.
// In production a missing or short one stops the server. Elsewhere a random one is made for this run, so sign-ins end when the server restarts.
if (process.env.NODE_ENV === 'production' && (process.env.JWT_SECRET || '').length < 32) {
  console.error('[FATAL] JWT_SECRET must be set to at least 32 characters in production.');
  process.exit(1);
}
if (!process.env.JWT_SECRET) console.warn('[auth] JWT_SECRET is not set: using a random secret for this run. Sign-ins end when the server restarts.');

export const JWT_SECRET     = process.env.JWT_SECRET     || crypto.randomBytes(32).toString('hex');
export const PYTHON_AI_URL  = process.env.PYTHON_AI_URL  || 'http://localhost:8000';
export const GATEWAY_SECRET = process.env.GATEWAY_SECRET || '';
export const MONGODB_URI    = process.env.MONGODB_URI;
export const PORT           = process.env.PORT || 5001;
