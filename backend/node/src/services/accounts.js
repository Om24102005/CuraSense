import crypto from 'crypto';
import { User } from '../models/User.js';

/** Request fields are untrusted: anything that is not a string (such as a {"$ne": null} query object) becomes empty. */
export const str = (v) => (typeof v === 'string' ? v.trim() : '');

export const validEmail = (email) => email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

/** bcrypt ignores everything past 72 bytes, so a longer password would be weaker than it looks. */
export function passwordProblem(password) {
  if (typeof password !== 'string' || password.length < 8) return 'Password must be at least 8 characters.';
  if (Buffer.byteLength(password) > 72) return 'Password must be at most 72 bytes.';
  return null;
}

/** By email. Outside production a name also works, for development accounts made before sign-in moved to email. */
export async function findAccount(identifier) {
  const id = str(identifier);
  if (!id) return null;
  const byEmail = await User.findOne({ email: { $in: [id, id.toLowerCase()] } });
  if (byEmail || id.includes('@') || process.env.NODE_ENV === 'production') return byEmail;
  return User.findOne({ name: id });
}

const PREFIX = 'enc1:';
const keySource = () => process.env.DATA_KEY || (process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : '');
const keyFrom = (source) => crypto.createHash('sha256').update(`curasense-totp:${source}`).digest();

/** Encrypts an authenticator secret for storage. shortcut: without DATA_KEY outside production it stays plain, so a dev server with a random JWT secret cannot lock its accounts out. */
export function sealSecret(plain) {
  const source = keySource();
  if (!source) return plain;
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', keyFrom(source), iv);
  const body = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  return PREFIX + Buffer.concat([iv, cipher.getAuthTag(), body]).toString('base64');
}

/** Reads a stored authenticator secret; ones saved before encryption was added are returned as they are. */
export function openSecret(stored) {
  if (!stored?.startsWith(PREFIX)) return stored;
  const raw = Buffer.from(stored.slice(PREFIX.length), 'base64');
  const decipher = crypto.createDecipheriv('aes-256-gcm', keyFrom(keySource()), raw.subarray(0, 12));
  decipher.setAuthTag(raw.subarray(12, 28));
  return Buffer.concat([decipher.update(raw.subarray(28)), decipher.final()]).toString('utf8');
}
