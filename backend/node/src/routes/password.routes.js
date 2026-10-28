import { Router } from 'express';
import { requireMongo } from '../middleware/auth.js';
import { forgotPassword, verifyResetCode, resetPassword } from '../controllers/password.controller.js';

const router = Router();

router.post('/forgot-password', requireMongo, forgotPassword);
router.post('/verify-reset-code', requireMongo, verifyResetCode);
router.post('/reset-password', requireMongo, resetPassword);

export default router;
