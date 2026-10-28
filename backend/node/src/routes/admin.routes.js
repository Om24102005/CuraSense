import { Router } from 'express';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';
import { getStats, getUsers, deleteUser, getAllPredictions } from '../controllers/admin.controller.js';

const router = Router();

router.get('/admin/stats', verifyToken, verifyAdmin, getStats);
router.get('/admin/users', verifyToken, verifyAdmin, getUsers);
router.delete('/admin/users/:id', verifyToken, verifyAdmin, deleteUser);
router.get('/admin/predictions', verifyToken, verifyAdmin, getAllPredictions);

export default router;
