import { Router } from 'express';
import { verifyToken, requireMongo } from '../middleware/auth.js';
import { syncAppleHealth, getWearableStatus } from '../controllers/wearable.controller.js';

const router = Router();

router.post('/api/wearables/apple-health/sync', verifyToken, requireMongo, syncAppleHealth);
router.get('/api/wearables/apple-health/status', verifyToken, requireMongo, getWearableStatus);

export default router;
