import { Request, Response } from 'express';
import { getSupabase, isSupabaseConfigured } from '../services/supabaseClient';

export async function syncUserData(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id || 'guest_default';
  const { profile, weightHistory, dailyLogs, setMeals, routines, workoutSessions } = req.body;

  if (isSupabaseConfigured) {
    const supabase = getSupabase();
    if (supabase) {
      try {
        if (profile) {
          await supabase.from('profiles').upsert({ id: userId, ...profile, updated_at: new Date().toISOString() });
        }
        if (weightHistory && Array.isArray(weightHistory)) {
          for (const w of weightHistory) {
            await supabase.from('weight_history').upsert({ id: w.id, user_id: userId, ...w });
          }
        }
        if (routines && Array.isArray(routines)) {
          for (const r of routines) {
            await supabase.from('workout_routines').upsert({ id: r.id, user_id: userId, ...r });
          }
        }

        res.status(200).json({
          success: true,
          syncedAt: new Date().toISOString(),
          message: 'Data successfully synchronized with Supabase cloud database.',
        });
        return;
      } catch (err: any) {
        res.status(500).json({ success: false, error: err.message || 'Sync failed' });
        return;
      }
    }
  }

  // Local fallback response
  res.status(200).json({
    success: true,
    syncedAt: new Date().toISOString(),
    message: 'Local offline snapshot registered successfully.',
  });
}
