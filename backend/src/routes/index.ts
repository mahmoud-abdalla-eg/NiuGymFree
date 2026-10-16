import { Router } from 'express';
import authRoutes from './authRoutes';
import profileRoutes from './profileRoutes';
import biometricsRoutes from './biometricsRoutes';
import nutritionRoutes from './nutritionRoutes';
import gymRoutes from './gymRoutes';
import ocrRoutes from './ocrRoutes';
import syncRoutes from './syncRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/biometrics', biometricsRoutes);
router.use('/nutrition', nutritionRoutes);
router.use('/gym', gymRoutes);
router.use('/ocr', ocrRoutes);
router.use('/sync', syncRoutes);

router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    platform: 'NiuGymFree Dual-Hemisphere API',
  });
});

export default router;
