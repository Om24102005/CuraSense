import { Router } from 'express';
import { verifyToken, requireMongo } from '../middleware/auth.js';
import { getSettings, updateSettings } from '../controllers/settings.controller.js';

const router = Router();

router.get('/api/user/settings', verifyToken, requireMongo, getSettings);
router.patch('/api/user/settings', verifyToken, requireMongo, updateSettings);

export default router;
