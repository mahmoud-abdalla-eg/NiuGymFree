import { Request, Response } from 'express';
import { FoodItem, SetMeal, DailyMealLog } from '../types';
import { SEED_FOODS } from '../data/seedFoods';
import { getSupabase, isSupabaseConfigured } from '../services/supabaseClient';

const inMemoryFoods: Map<string, FoodItem> = new Map(SEED_FOODS.map((f) => [f.id, f]));
const inMemorySetMeals: Map<string, SetMeal[]> = new Map();
const inMemoryDailyLogs: Map<string, DailyMealLog> = new Map();

export async function getFoodVault(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id;

  if (isSupabaseConfigured) {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from('foods')
        .select('*')
        .or(`is_custom.eq.false,user_id.eq.${userId}`);

      if (!error && data) {
        res.status(200).json({ success: true, foods: data });
        return;
      }
    }
  }

  const allFoods = Array.from(inMemoryFoods.values());
  res.status(200).json({ success: true, foods: allFoods });
}

export async function createFood(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id || 'guest_default';
  const food: FoodItem = {
    id: `food_custom_${Date.now()}`,
    userId,
    name: req.body.name,
    category: req.body.category || 'protein',
    unit: req.body.unit || 'g',
    label: req.body.label || '100g',
    calories: Number(req.body.calories) || 0,
    protein: Number(req.body.protein) || 0,
    carbs: Number(req.body.carbs) || 0,
    fat: Number(req.body.fat) || 0,
    emoji: req.body.emoji || '🥗',
    photoUrl: req.body.photoUrl,
    isCustom: true,
  };

  inMemoryFoods.set(food.id, food);
  res.status(201).json({ success: true, food });
}

export async function getSetMeals(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id || 'guest_default';
  const list = inMemorySetMeals.get(userId) || [];
  res.status(200).json({ success: true, setMeals: list });
}

export async function saveSetMeal(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id || 'guest_default';
  const setMeal: SetMeal = {
    id: req.body.id || `preset_${Date.now()}`,
    userId,
    name: req.body.name,
    defaultSlot: req.body.defaultSlot || 'lunch',
    notes: req.body.notes,
    photoType: req.body.photoType || 'chicken_rice',
    photoUrl: req.body.photoUrl,
    items: req.body.items || [],
  };

  const list = inMemorySetMeals.get(userId) || [];
  const existingIdx = list.findIndex((m) => m.id === setMeal.id);
  if (existingIdx >= 0) {
    list[existingIdx] = setMeal;
  } else {
    list.push(setMeal);
  }
  inMemorySetMeals.set(userId, list);

  res.status(201).json({ success: true, setMeal });
}

export async function deleteSetMeal(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id || 'guest_default';
  const { id } = req.params;

  const list = inMemorySetMeals.get(userId) || [];
  inMemorySetMeals.set(userId, list.filter((m) => m.id !== id));

  res.status(200).json({ success: true, message: 'Set meal deleted' });
}

export async function getDailyMealLog(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id || 'guest_default';
  const date = String(req.params.date);
  const key = `${userId}_${date}`;

  const log: DailyMealLog = inMemoryDailyLogs.get(key) || {
    id: `log_${key}`,
    userId,
    date,
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: [],
    waterMl: 0,
    syncTrainingDayBonus: false,
    targetKcalSnapshot: 2150,
  };

  res.status(200).json({ success: true, log });
}

export async function saveDailyMealLog(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id || 'guest_default';
  const date = String(req.params.date);
  const key = `${userId}_${date}`;

  const log: DailyMealLog = {
    ...req.body,
    id: req.body.id || `log_${key}`,
    userId,
    date,
  };

  inMemoryDailyLogs.set(key, log);
  res.status(200).json({ success: true, log });
}

export async function updateWaterIntake(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id || 'guest_default';
  const date = String(req.params.date);
  const { amountMl } = req.body;
  const key = `${userId}_${date}`;

  const log: DailyMealLog = inMemoryDailyLogs.get(key) || {
    id: `log_${key}`,
    userId,
    date,
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: [],
    waterMl: 0,
    syncTrainingDayBonus: false,
    targetKcalSnapshot: 2150,
  };

  log.waterMl = Math.max(0, log.waterMl + Number(amountMl || 0));
  inMemoryDailyLogs.set(key, log);

  res.status(200).json({ success: true, waterMl: log.waterMl });
}
