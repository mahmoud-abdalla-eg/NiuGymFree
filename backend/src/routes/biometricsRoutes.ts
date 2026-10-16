import { Router } from 'express';
import {
  getWeightHistory,
  logWeight,
  getInBodyScans,
  saveInBodyScan,
  evaluateAdaptiveTdee,
} from '../controllers/biometricsController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get('/weight', authMiddleware, getWeightHistory);
router.post('/weight', authMiddleware, logWeight);
router.get('/inbody', authMiddleware, getInBodyScans);
router.post('/inbody', authMiddleware, saveInBodyScan);
router.post('/adaptive-evaluate', evaluateAdaptiveTdee);

export default router;
