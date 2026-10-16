import { Router } from 'express';
import { processInBodyOcr, processPlanOcr } from '../controllers/ocrController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/inbody', authMiddleware, processInBodyOcr);
router.post('/plan', authMiddleware, processPlanOcr);

export default router;
