import { Request, Response } from 'express';
import { WeightHistoryEntry, InBodyScanRecord } from '../types';
import { computeAdaptiveAdjustment } from '../services/adaptiveTdeeService';
import { getSupabase, isSupabaseConfigured } from '../services/supabaseClient';

const inMemoryWeights: Map<string, WeightHistoryEntry[]> = new Map();
const inMemoryInBodyScans: Map<string, InBodyScanRecord[]> = new Map();

export async function getWeightHistory(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id || 'guest_default';

  if (isSupabaseConfigured) {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from('weight_history')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (!error && data) {
        res.status(200).json({ success: true, history: data });
        return;
      }
    }
  }

  const list = inMemoryWeights.get(userId) || [
    {
      id: 'w1',
      userId,
      date: new Date(Date.now() - 14 * 86400000).toISOString().split('T')[0],
      weightKg: 75.8,
      notes: 'Baseline check-in',
      bodyFatPercent: 14.5,
      skeletalMuscleMassKg: 36.2,
    },
    {
      id: 'w2',
      userId,
      date: new Date().toISOString().split('T')[0],
      weightKg: 75.0,
      notes: 'Current check-in',
      bodyFatPercent: 14.2,
      skeletalMuscleMassKg: 36.4,
    },
  ];

  res.status(200).json({ success: true, history: list });
}

export async function logWeight(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id || 'guest_default';
  const entry: WeightHistoryEntry = {
    id: req.body.id || `weight_${Date.now()}`,
    userId,
    date: req.body.date || new Date().toISOString().split('T')[0],
    weightKg: Number(req.body.weightKg),
    notes: req.body.notes,
    photoUrl: req.body.photoUrl,
    skeletalMuscleMassKg: req.body.skeletalMuscleMassKg ? Number(req.body.skeletalMuscleMassKg) : undefined,
    bodyFatMassKg: req.body.bodyFatMassKg ? Number(req.body.bodyFatMassKg) : undefined,
    bodyFatPercent: req.body.bodyFatPercent ? Number(req.body.bodyFatPercent) : undefined,
    bmi: req.body.bmi ? Number(req.body.bmi) : undefined,
    bmrKcal: req.body.bmrKcal ? Number(req.body.bmrKcal) : undefined,
    totalBodyWaterL: req.body.totalBodyWaterL ? Number(req.body.totalBodyWaterL) : undefined,
    visceralFatLevel: req.body.visceralFatLevel ? Number(req.body.visceralFatLevel) : undefined,
    inBodyScore: req.body.inBodyScore ? Number(req.body.inBodyScore) : undefined,
  };

  if (isSupabaseConfigured) {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from('weight_history')
        .insert({
          id: entry.id,
          user_id: userId,
          date: entry.date,
          weight_kg: entry.weightKg,
          notes: entry.notes,
          photo_url: entry.photoUrl,
          skeletal_muscle_mass_kg: entry.skeletalMuscleMassKg,
          body_fat_mass_kg: entry.bodyFatMassKg,
          body_fat_percent: entry.bodyFatPercent,
          bmi: entry.bmi,
          bmr_kcal: entry.bmrKcal,
          total_body_water_l: entry.totalBodyWaterL,
          visceral_fat_level: entry.visceralFatLevel,
          inbody_score: entry.inBodyScore,
        })
        .select()
        .single();

      if (error) {
        res.status(400).json({ success: false, error: error.message });
        return;
      }

      res.status(201).json({ success: true, entry: data });
      return;
    }
  }

  const current = inMemoryWeights.get(userId) || [];
  inMemoryWeights.set(userId, [entry, ...current]);

  res.status(201).json({ success: true, entry });
}

export async function getInBodyScans(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id || 'guest_default';
  const list = inMemoryInBodyScans.get(userId) || [];
  res.status(200).json({ success: true, scans: list });
}

export async function saveInBodyScan(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id || 'guest_default';
  const scan: InBodyScanRecord = {
    id: req.body.id || `inbody_${Date.now()}`,
    userId,
    scanDate: req.body.scanDate || new Date().toISOString().split('T')[0],
    rawOcrText: req.body.rawOcrText,
    weightKg: req.body.weightKg ? Number(req.body.weightKg) : undefined,
    skeletalMuscleMassKg: req.body.skeletalMuscleMassKg ? Number(req.body.skeletalMuscleMassKg) : undefined,
    bodyFatMassKg: req.body.bodyFatMassKg ? Number(req.body.bodyFatMassKg) : undefined,
    bodyFatPercent: req.body.bodyFatPercent ? Number(req.body.bodyFatPercent) : undefined,
    bmi: req.body.bmi ? Number(req.body.bmi) : undefined,
    bmrKcal: req.body.bmrKcal ? Number(req.body.bmrKcal) : undefined,
    totalBodyWaterL: req.body.totalBodyWaterL ? Number(req.body.totalBodyWaterL) : undefined,
    visceralFatLevel: req.body.visceralFatLevel ? Number(req.body.visceralFatLevel) : undefined,
    inBodyScore: req.body.inBodyScore ? Number(req.body.inBodyScore) : undefined,
    hasIssues: req.body.hasIssues || false,
    notes: req.body.notes,
    createdAt: new Date().toISOString(),
  };

  const current = inMemoryInBodyScans.get(userId) || [];
  inMemoryInBodyScans.set(userId, [scan, ...current]);

  res.status(201).json({ success: true, scan });
}

export async function evaluateAdaptiveTdee(req: Request, res: Response): Promise<void> {
  const { previousWeightKg, currentWeightKg, daysElapsed, goal, currentTargetKcal } = req.body;

  if (!previousWeightKg || !currentWeightKg || !daysElapsed || !goal || !currentTargetKcal) {
    res.status(400).json({ success: false, error: 'Missing required parameters for adaptive TDEE evaluation' });
    return;
  }

  const evaluation = computeAdaptiveAdjustment(
    Number(previousWeightKg),
    Number(currentWeightKg),
    Number(daysElapsed),
    goal,
    Number(currentTargetKcal)
  );

  res.status(200).json({ success: true, data: evaluation });
}
