import { Router } from 'express';
import { verifyToken, requireMongo } from '../middleware/auth.js';
import { userRateLimit } from '../middleware/rateLimit.js';
import { updateProfile, changePassword } from '../controllers/profile.controller.js';

const router = Router();

// The current password is checked on every change, so guessing it through this route is limited per signed-in user.
const passwordLimit = userRateLimit({ windowMs: 15 * 60_000, max: 10, name: 'password change' });

router.patch('/api/user/profile', verifyToken, requireMongo, updateProfile);
router.post('/api/user/password', verifyToken, passwordLimit, requireMongo, changePassword);

export default router;
