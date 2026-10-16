import { Request, Response } from 'express';
import { UserProfile } from '../types';
import { calculateTdee, calculateMacrosInGrams } from '../services/adaptiveTdeeService';
import { getSupabase, isSupabaseConfigured } from '../services/supabaseClient';

const inMemoryProfiles: Map<string, UserProfile> = new Map();

export async function getProfile(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id || 'guest_default';

  if (isSupabaseConfigured) {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!error && data) {
        res.status(200).json({ success: true, profile: data });
        return;
      }
    }
  }

  const profile = inMemoryProfiles.get(userId) || {
    id: userId,
    name: 'Athlete',
    dob: '2001-05-15',
    sex: 'male',
    heightCm: 178,
    weightKg: 75.0,
    activityLevel: 'moderate',
    goal: 'cut',
    targetKcal: 2150,
    macroSplit: { proteinPct: 35, carbsPct: 40, fatPct: 25 },
    trainingDayCalorieBonus: 250,
    checkInCadenceDays: 14,
    lastCheckInDate: new Date().toISOString().split('T')[0],
    isGuest: req.user?.isGuest || false,
    onboardingCompleted: false,
  };

  res.status(200).json({ success: true, profile });
}

export async function updateProfile(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id || 'guest_default';
  const updates: Partial<UserProfile> = req.body;

  if (isSupabaseConfigured) {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from('profiles')
        .upsert({ id: userId, ...updates, updated_at: new Date().toISOString() })
        .select()
        .single();

      if (error) {
        res.status(400).json({ success: false, error: error.message });
        return;
      }

      res.status(200).json({ success: true, profile: data });
      return;
    }
  }

  const current = inMemoryProfiles.get(userId) || {
    id: userId,
    name: 'Athlete',
    dob: '2001-05-15',
    sex: 'male',
    heightCm: 178,
    weightKg: 75.0,
    activityLevel: 'moderate',
    goal: 'cut',
    targetKcal: 2150,
    macroSplit: { proteinPct: 35, carbsPct: 40, fatPct: 25 },
    trainingDayCalorieBonus: 250,
    checkInCadenceDays: 14,
    lastCheckInDate: new Date().toISOString().split('T')[0],
    isGuest: req.user?.isGuest || false,
    onboardingCompleted: true,
  };

  const updated: UserProfile = { ...current, ...updates, id: userId };
  inMemoryProfiles.set(userId, updated);

  res.status(200).json({ success: true, profile: updated });
}

export async function calculateCalorieTarget(req: Request, res: Response): Promise<void> {
  const { weightKg, heightCm, dob, sex, activityLevel, goal, macroSplit } = req.body;

  if (!weightKg || !heightCm || !dob || !sex || !activityLevel || !goal) {
    res.status(400).json({
      success: false,
      error: 'weightKg, heightCm, dob, sex, activityLevel, and goal are required parameters',
    });
    return;
  }

  const calculation = calculateTdee(
    Number(weightKg),
    Number(heightCm),
    String(dob),
    sex,
    activityLevel,
    goal
  );

  const split = macroSplit || { proteinPct: 35, carbsPct: 40, fatPct: 25 };
  const macros = calculateMacrosInGrams(calculation.targetKcal, split);

  res.status(200).json({
    success: true,
    data: {
      ...calculation,
      macros,
    },
  });
}
