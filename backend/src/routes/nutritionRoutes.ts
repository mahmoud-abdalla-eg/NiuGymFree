import { Router } from 'express';
import {
  getFoodVault,
  createFood,
  getSetMeals,
  saveSetMeal,
  deleteSetMeal,
  getDailyMealLog,
  saveDailyMealLog,
  updateWaterIntake,
} from '../controllers/nutritionController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get('/foods', authMiddleware, getFoodVault);
router.post('/foods', authMiddleware, createFood);

router.get('/set-meals', authMiddleware, getSetMeals);
router.post('/set-meals', authMiddleware, saveSetMeal);
router.delete('/set-meals/:id', authMiddleware, deleteSetMeal);

router.get('/logs/:date', authMiddleware, getDailyMealLog);
router.post('/logs/:date', authMiddleware, saveDailyMealLog);
router.post('/logs/:date/water', authMiddleware, updateWaterIntake);

export default router;
