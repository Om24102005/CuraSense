import { Router } from 'express';
import { analyzeSymptoms, analyzeImage, analyzeReport } from '../controllers/analysis.controller.js';
import { verifyToken, requireMongo } from '../middleware/auth.js';
import { userRateLimit } from '../middleware/rateLimit.js';
import { acceptUpload, acceptUploadIfMultipart, UPLOAD_RULES } from '../middleware/upload.js';

const router = Router();

// Every AI call costs money, so each is limited per user (not just per IP).
const aiLimit = (name) => userRateLimit({ windowMs: 10 * 60 * 1000, max: 20, name });

router.post('/analyze-symptoms', verifyToken, aiLimit('symptom analysis'), requireMongo, analyzeSymptoms);
router.post('/analyze-image', verifyToken, aiLimit('image analysis'), acceptUpload(UPLOAD_RULES.imaging), analyzeImage);
router.post('/analyze-report', verifyToken, aiLimit('report analysis'), acceptUploadIfMultipart(UPLOAD_RULES.labReport), analyzeReport);

export default router;
