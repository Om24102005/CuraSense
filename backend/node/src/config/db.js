import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { MONGODB_URI } from './env.js';
import { User } from '../models/User.js';

// The log line names the host and the database, never the credentials in the address.
export const withoutCredentials = (uri = '') => uri.replace(/\/\/[^@/]*@/, '//');

/**
 * The first admin comes from the environment, never from source code: set ADMIN_EMAIL and ADMIN_PASSWORD and the account is created on
 * the first start. Changing ADMIN_PASSWORD later changes that admin's password on the next start. Returns what it did, for the log and the tests.
 */
export async function ensureAdmin({ email = process.env.ADMIN_EMAIL, password = process.env.ADMIN_PASSWORD } = {}) {
  if (!email || !password) return 'skipped';
  if (password.length < 12) return 'weak';
  const hash = await bcrypt.hash(password, 10);
  const existing = await User.findOne({ email });
  if (!existing) {
    await User.create({ name: 'Admin', email, password: hash, role: 'admin' });
    return 'created';
  }
  if (existing.role !== 'admin') return 'refused';
  if (await bcrypt.compare(password, existing.password)) return 'ok';
  existing.password = hash;
  await existing.save();
  return 'rotated';
}

export function connectDB() {
  mongoose.set('bufferCommands', false);

  if (!MONGODB_URI) {
    console.error('[FATAL] MONGODB_URI is not set. Check backend/.env');
  }

  // Keeps trying: a hosted database can be slow at boot or be fixed later, and the API must recover without a restart.
  const attempt = () => mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 10_000,
  })
    .then(async () => {
      console.log('Connected to MongoDB:', withoutCredentials(MONGODB_URI));
      const admin = await ensureAdmin();
      if (admin === 'created' || admin === 'rotated') console.log(`[admin] Admin account ${admin}.`);
      if (admin === 'weak') console.error('[admin] ADMIN_PASSWORD must be at least 12 characters; the admin account was not created.');
      if (admin === 'refused') console.error('[admin] ADMIN_EMAIL belongs to a normal account; it was not promoted to admin.');
      // Older versions created this admin with a password that was in the source code, so it is not a secret.
      if (process.env.NODE_ENV === 'production') {
        const legacy = await User.findOne({ name: 'Curasense_D_Hawk', role: 'admin' }).select('email');
        if (legacy && legacy.email !== process.env.ADMIN_EMAIL)
          console.warn('[admin] The admin account "Curasense_D_Hawk" from older versions exists. Its password was in the source code: delete it or set ADMIN_EMAIL to its address to change its password.');
      }
    })
    .catch(err => {
      console.error('[MongoDB] Connection failed:', err.message);
      console.error('[MongoDB] Is mongod running on the host in MONGODB_URI?');
      if (MONGODB_URI && mongoose.connection.readyState !== 1) setTimeout(attempt, 15_000);
    });
  attempt();
}
