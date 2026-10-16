import { Router } from 'express';
import { getProfile, updateProfile, calculateCalorieTarget } from '../controllers/profileController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authMiddleware, getProfile);
router.put('/', authMiddleware, updateProfile);
router.post('/calculate', calculateCalorieTarget);

export default router;
