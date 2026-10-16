import { Router } from 'express';
import { syncUserData } from '../controllers/syncController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/', authMiddleware, syncUserData);

export default router;
