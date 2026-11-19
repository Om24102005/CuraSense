import { Router } from 'express';
import { requireMongo } from '../middleware/auth.js';
import { userRateLimit } from '../middleware/rateLimit.js';
import { register, totpSetup, totpVerify, login, loginTotp } from '../controllers/auth.controller.js';

const router = Router();

// Password and 2FA-code guessing, counted per IP before the database is touched. Sign-up is limited too, because every account gets its own AI quota
// and the AI costs money; a venue where many people share one address can raise it with REGISTER_LIMIT_PER_HOUR. totp-setup and totp-verify need a setup token.
// shortcut: per IP; behind a reverse proxy set TRUST_PROXY=1 (app.js), or every user shares one bucket.
const signInLimit = userRateLimit({ windowMs: 15 * 60_000, max: 30, name: 'sign-in' });
const codeLimit   = userRateLimit({ windowMs: 15 * 60_000, max: 15, name: 'verification code' });
const signUpLimit = userRateLimit({ windowMs: 60 * 60_000, max: Number(process.env.REGISTER_LIMIT_PER_HOUR) || 60, name: 'sign-up' });

router.post('/register', signUpLimit, requireMongo, register);
router.post('/totp-setup', requireMongo, totpSetup);
router.post('/totp-verify', requireMongo, totpVerify);
router.post('/login', signInLimit, requireMongo, login);
router.post('/login-totp', codeLimit, requireMongo, loginTotp);

export default router;
