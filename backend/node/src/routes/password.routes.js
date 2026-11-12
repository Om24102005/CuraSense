import { Router } from 'express';
import { requireMongo } from '../middleware/auth.js';
import { userRateLimit } from '../middleware/rateLimit.js';
import { forgotPassword, verifyResetCode, resetPassword } from '../controllers/password.controller.js';

const router = Router();

// One bucket for the whole reset flow (about five full flows per IP per 15 minutes), checked before the database is touched.
// shortcut: per IP; behind a reverse proxy call app.set('trust proxy', 1) first, or every user shares one bucket.
const resetLimit = userRateLimit({ windowMs: 15 * 60_000, max: 15, name: 'password reset' });

router.post('/forgot-password', resetLimit, requireMongo, forgotPassword);
router.post('/verify-reset-code', resetLimit, requireMongo, verifyResetCode);
router.post('/reset-password', resetLimit, requireMongo, resetPassword);

export default router;
