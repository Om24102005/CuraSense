import { Router } from 'express';
import { requireMongo } from '../middleware/auth.js';
import { userRateLimit } from '../middleware/rateLimit.js';
import { register, totpSetup, totpVerify, login, loginTotp } from '../controllers/auth.controller.js';

const router = Router();

// Password and 2FA-code guessing, counted per IP before the database is touched. Sign-up (register, totp-setup, totp-verify) is not limited: it only creates new accounts.
// shortcut: per IP; behind a reverse proxy call app.set('trust proxy', 1) first, or every user shares one bucket.
const signInLimit = userRateLimit({ windowMs: 15 * 60_000, max: 30, name: 'sign-in' });
const codeLimit   = userRateLimit({ windowMs: 15 * 60_000, max: 15, name: 'verification code' });

router.post('/register', requireMongo, register);
router.post('/totp-setup', requireMongo, totpSetup);
router.post('/totp-verify', requireMongo, totpVerify);
router.post('/login', signInLimit, requireMongo, login);
router.post('/login-totp', codeLimit, requireMongo, loginTotp);

export default router;
