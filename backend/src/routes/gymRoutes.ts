import { Router } from 'express';
import {
  getExerciseVault,
  createExercise,
  getRoutines,
  saveRoutine,
  deleteRoutine,
  loadStarterRoutines,
  getWorkoutSessions,
  logWorkoutSession,
  calculateOneRepMax,
} from '../controllers/gymController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get('/exercises', authMiddleware, getExerciseVault);
router.post('/exercises', authMiddleware, createExercise);

router.get('/routines', authMiddleware, getRoutines);
router.post('/routines', authMiddleware, saveRoutine);
router.post('/routines/starters', authMiddleware, loadStarterRoutines);
router.delete('/routines/:id', authMiddleware, deleteRoutine);

router.get('/sessions', authMiddleware, getWorkoutSessions);
router.post('/sessions', authMiddleware, logWorkoutSession);

router.post('/calculate-1rm', calculateOneRepMax);

export default router;
