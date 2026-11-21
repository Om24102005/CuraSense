import bcrypt from 'bcryptjs';
import speakeasy from 'speakeasy';
import { User } from '../models/User.js';
import { Prediction } from '../models/Prediction.js';
import { CONSENT_VERSION, issueFullToken } from '../middleware/auth.js';
import { openSecret, passwordProblem, str } from '../services/accounts.js';

const publicUser = (u) => ({ id: u._id, name: u.name, email: u.email, role: u.role });

/** Change the signed-in user's display name. The email is the account's identity and is not editable here. */
export async function updateProfile(req, res) {
  try {
    const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
    if (!name || name.length > 80) return res.status(400).json({ error: 'Enter a name of 1 to 80 characters.' });
    // The name can also be typed to sign in, so it must never look like somebody's email address.
    if (name.includes('@')) return res.status(400).json({ error: 'A name cannot contain @.' });

    const user = await User.findByIdAndUpdate(req.user._id, { $set: { name } }, { new: true });
    if (!user) return res.status(404).json({ error: 'Account not found.' });
    res.json({ user: publicUser(user) });
  } catch (error) {
    console.error('[PATCH /api/user/profile] failed:', error.message);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}

/** Change the signed-in user's password; the current one must be given. Every other session ends, and this one gets a fresh token. */
export async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body || {};
    if (typeof currentPassword !== 'string' || typeof newPassword !== 'string' || !currentPassword || !newPassword)
      return res.status(400).json({ error: 'currentPassword and newPassword are required.' });
    const problem = passwordProblem(newPassword);
    if (problem) return res.status(400).json({ error: problem.replace('Password', 'The new password') });
    if (newPassword === currentPassword) return res.status(400).json({ error: 'The new password must be different from the current one.' });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'Account not found.' });
    if (!(await bcrypt.compare(currentPassword, user.password))) return res.status(400).json({ error: 'The current password is not right.' });

    user.password = await bcrypt.hash(newPassword, 10);
    user.tokenVersion = (user.tokenVersion || 0) + 1;
    await user.save();
    res.json({ success: true, token: issueFullToken(user) });
  } catch (error) {
    console.error('[POST /api/user/password] failed:', error.message);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}

/** Deletes the account and every saved analysis. It asks for the password, and the authenticator code when one is set up. */
export async function deleteAccount(req, res) {
  try {
    const { password } = req.body || {};
    if (typeof password !== 'string' || !password) return res.status(400).json({ error: 'Enter your password to delete the account.' });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'Account not found.' });
    if (user.role === 'admin') return res.status(403).json({ error: 'The administrator account cannot be deleted here.' });
    if (!(await bcrypt.compare(password, user.password))) return res.status(400).json({ error: 'The password is not right.' });
    if (user.totpEnabled && !speakeasy.totp.verify({ secret: openSecret(user.totpSecret), encoding: 'base32', token: str(req.body.code), window: 1 }))
      return res.status(400).json({ error: 'The authenticator code is not right.' });

    await Prediction.deleteMany({ userId: user._id });   // first: if this fails the account still exists and the person can try again
    await User.deleteOne({ _id: user._id });
    res.json({ success: true });
  } catch (error) {
    console.error('[POST /api/user/delete-account] failed:', error.message);
    res.status(500).json({ error: 'Something went wrong. Nothing was deleted from your account sign-in; please try again.' });
  }
}

export const getConsent = (req, res) => res.json({ accepted: req.user.consented !== false, version: CONSENT_VERSION });

export async function giveConsent(req, res) {
  try {
    if (req.body?.accepted !== true) return res.status(400).json({ error: 'Consent must be given explicitly.' });
    await User.updateOne({ _id: req.user._id }, { $set: { consentAt: new Date(), consentVersion: CONSENT_VERSION } });
    res.json({ accepted: true, version: CONSENT_VERSION });
  } catch (error) {
    console.error('[POST /api/user/consent] failed:', error.message);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}
