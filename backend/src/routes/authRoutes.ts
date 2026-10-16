import { Router } from 'express';
import { signUp, signIn, createGuestSession, getCurrentUser } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/guest', createGuestSession);
router.get('/me', authMiddleware, getCurrentUser);

export default router;
