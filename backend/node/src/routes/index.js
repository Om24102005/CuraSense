import { Router } from 'express';
import authRoutes from './auth.routes.js';
import passwordRoutes from './password.routes.js';
import analysisRoutes from './analysis.routes.js';
import predictionRoutes from './prediction.routes.js';
import adminRoutes from './admin.routes.js';
import settingsRoutes from './settings.routes.js';
import profileRoutes from './profile.routes.js';
import wearableRoutes from './wearable.routes.js';

const router = Router();

router.use(authRoutes);
router.use(passwordRoutes);
router.use(analysisRoutes);
router.use(predictionRoutes);
router.use(adminRoutes);
router.use(settingsRoutes);
router.use(profileRoutes);
router.use(wearableRoutes);

export default router;
