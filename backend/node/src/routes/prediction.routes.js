import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import { savePrediction, getPredictions, deletePrediction } from '../controllers/prediction.controller.js';

const router = Router();

router.post('/save-prediction', verifyToken, savePrediction);
router.get('/predictions', verifyToken, getPredictions);
router.delete('/predictions/:id', verifyToken, deletePrediction);

export default router;
