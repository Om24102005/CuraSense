import { Router } from 'express';
import { verifyToken, requireMongo } from '../middleware/auth.js';
import { analyzeSymptoms, analyzeImage, analyzeReport } from '../controllers/analysis.controller.js';

const router = Router();

router.post('/analyze-symptoms', verifyToken, requireMongo, analyzeSymptoms);
router.post('/analyze-image', verifyToken, analyzeImage);
router.post('/analyze-report', verifyToken, analyzeReport);

export default router;
