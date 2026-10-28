import { Router } from 'express';
import { requireMongo } from '../middleware/auth.js';
import { register, totpSetup, totpVerify, login, loginTotp } from '../controllers/auth.controller.js';

const router = Router();

router.post('/register', requireMongo, register);
router.post('/totp-setup', requireMongo, totpSetup);
router.post('/totp-verify', requireMongo, totpVerify);
router.post('/login', requireMongo, login);
router.post('/login-totp', requireMongo, loginTotp);

export default router;
