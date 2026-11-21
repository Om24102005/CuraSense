import { Router } from 'express';
import { verifyToken, requireMongo } from '../middleware/auth.js';
import { userRateLimit } from '../middleware/rateLimit.js';
import { updateProfile, changePassword, deleteAccount, getConsent, giveConsent } from '../controllers/profile.controller.js';

const router = Router();

// The current password is checked on every change, so guessing it through this route is limited per signed-in user.
const passwordLimit = userRateLimit({ windowMs: 15 * 60_000, max: 10, name: 'password change' });
const deleteLimit = userRateLimit({ windowMs: 15 * 60_000, max: 10, name: 'account deletion' });

router.patch('/api/user/profile', verifyToken, requireMongo, updateProfile);
router.post('/api/user/password', verifyToken, passwordLimit, requireMongo, changePassword);
router.post('/api/user/delete-account', verifyToken, deleteLimit, requireMongo, deleteAccount);
router.get('/api/user/consent', verifyToken, requireMongo, getConsent);
router.post('/api/user/consent', verifyToken, requireMongo, giveConsent);

export default router;
