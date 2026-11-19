import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';

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
    console.error('[PATCH /api/user/profile] failed:', error);
    res.status(500).json({ error: error.message });
  }
}

/**
 * Change the signed-in user's password; the current one must be given. Tokens already issued stay valid until they expire (24 h).
 * shortcut: no token revocation, because tokens carry no version; add a passwordChangedAt claim check when sessions must end at once.
 */
export async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body || {};
    if (typeof currentPassword !== 'string' || typeof newPassword !== 'string' || !currentPassword || !newPassword)
      return res.status(400).json({ error: 'currentPassword and newPassword are required.' });
    if (newPassword.length < 8) return res.status(400).json({ error: 'The new password must be at least 8 characters.' });
    if (newPassword === currentPassword) return res.status(400).json({ error: 'The new password must be different from the current one.' });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'Account not found.' });
    if (!(await bcrypt.compare(currentPassword, user.password))) return res.status(400).json({ error: 'The current password is not right.' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ success: true });
  } catch (error) {
    console.error('[POST /api/user/password] failed:', error);
    res.status(500).json({ error: error.message });
  }
}
