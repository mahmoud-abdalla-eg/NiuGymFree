import { UserProfile, WeightHistoryEntry } from '../types';

export interface AdaptiveAnalysis {
  prevWeightKg: number;
  currentWeightKg: number;
  weightDeltaKg: number;
  daysElapsed: number;
  actualWeeklyRateKg: number;
  targetWeeklyRateKg: number;
  discrepancyKgPerWeek: number;
  recommendedKcalAdjustment: number;
  suggestedNewDailyKcal: number;
  confidence: 'high' | 'moderate' | 'preliminary';
  reasoning: string;
}

/**
 * Evaluates weight change velocity against user's goal (1 kg fat ≈ 7,700 kcal)
 * and calculates adaptive calorie recommendation.
 */
export function analyzeAdaptiveTdee(
  profile: UserProfile,
  newWeightKg: number,
  checkInDate: string
): AdaptiveAnalysis {
  const history = [...(profile.weightHistory || [])].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const lastEntry = history.length > 0 ? history[history.length - 1] : null;

  // Defaults if no prior history
  if (!lastEntry) {
    return {
      prevWeightKg: newWeightKg,
      currentWeightKg: newWeightKg,
      weightDeltaKg: 0,
      daysElapsed: profile.checkInIntervalDays || 14,
      actualWeeklyRateKg: 0,
      targetWeeklyRateKg: profile.goalType === 'cut' ? -0.5 : profile.goalType === 'lean_bulk' ? 0.25 : 0,
      discrepancyKgPerWeek: 0,
      recommendedKcalAdjustment: 0,
      suggestedNewDailyKcal: profile.manualKcalOverride || 2200,
      confidence: 'preliminary',
      reasoning: 'First recorded check-in. Baseline established; continue current caloric targets.',
    };
  }

  const prevDate = new Date(lastEntry.date);
  const curDate = new Date(checkInDate);
  const diffDays = Math.max(1, Math.round((curDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)));

  const weightDeltaKg = parseFloat((newWeightKg - lastEntry.weightKg).toFixed(2));
  const actualWeeklyRateKg = parseFloat(((weightDeltaKg / diffDays) * 7).toFixed(2));

  // Target weekly rates
  let targetWeeklyRateKg = 0;
  if (profile.goalType === 'cut') {
    targetWeeklyRateKg = -0.5; // ~0.5kg per week loss
  } else if (profile.goalType === 'lean_bulk') {
    targetWeeklyRateKg = 0.25; // ~0.25kg per week lean gain
  } else {
    targetWeeklyRateKg = 0; // maintenance
  }

  const discrepancyKgPerWeek = parseFloat((actualWeeklyRateKg - targetWeeklyRateKg).toFixed(2));
  
  // 1 kg of body tissue delta ≈ 7,700 kcal => discrepancy per day = (discrepancyKg * 7700) / 7 = discrepancyKg * 1100
  // If discrepancy is positive (weight loss slower or gaining), we need to reduce kcal
  // If discrepancy is negative (weight loss faster or losing in bulk), we need to add kcal
  const rawKcalAdjustment = -Math.round(discrepancyKgPerWeek * 1100);

  // Safety clamp: max +/- 300 kcal per bi-weekly interval to protect metabolic adaptation
  const recommendedKcalAdjustment = Math.max(-300, Math.min(300, rawKcalAdjustment));

  const currentDailyKcal = lastEntry.appliedKcal || profile.manualKcalOverride || 2200;
  const suggestedNewDailyKcal = Math.max(1200, currentDailyKcal + recommendedKcalAdjustment);

  let confidence: 'high' | 'moderate' | 'preliminary' = 'moderate';
  if (diffDays >= 14 && history.length >= 3) {
    confidence = 'high';
  } else if (diffDays < 7) {
    confidence = 'preliminary';
  }

  let reasoning = '';
  if (profile.goalType === 'cut') {
    if (actualWeeklyRateKg > -0.2) {
      reasoning = `Weight loss velocity (${actualWeeklyRateKg > 0 ? '+' : ''}${actualWeeklyRateKg}kg/wk) is slower than the optimal -0.5kg/wk target. Decreasing daily intake by ${Math.abs(recommendedKcalAdjustment)} kcal will restore fat oxidation rate.`;
    } else if (actualWeeklyRateKg < -0.8) {
      reasoning = `Weight loss velocity (${actualWeeklyRateKg}kg/wk) is faster than recommended (-0.8kg/wk+), indicating potential lean muscle catabolism. Increasing daily intake by ${recommendedKcalAdjustment} kcal protects muscle mass.`;
    } else {
      reasoning = `Pace is right in the sweet spot (${actualWeeklyRateKg}kg/wk vs -0.5kg/wk target). Minor calibration of ${recommendedKcalAdjustment >= 0 ? '+' : ''}${recommendedKcalAdjustment} kcal suggested.`;
    }
  } else if (profile.goalType === 'lean_bulk') {
    if (actualWeeklyRateKg > 0.4) {
      reasoning = `Weight gain velocity (+${actualWeeklyRateKg}kg/wk) exceeds the lean hypertrophy target (+0.25kg/wk), risking excess adiposity. Adjusting intake by ${recommendedKcalAdjustment} kcal.`;
    } else if (actualWeeklyRateKg < 0.1) {
      reasoning = `Weight gain velocity (+${actualWeeklyRateKg}kg/wk) is below target. Adding ${recommendedKcalAdjustment} kcal to provide sufficient anabolic surplus.`;
    } else {
      reasoning = `Optimal lean mass accrual rate (+${actualWeeklyRateKg}kg/wk). Targets are properly calibrated.`;
    }
  } else {
    reasoning = `Maintenance velocity: ${actualWeeklyRateKg >= 0 ? '+' : ''}${actualWeeklyRateKg}kg/wk. Calibration ${recommendedKcalAdjustment >= 0 ? '+' : ''}${recommendedKcalAdjustment} kcal keeps weight stable.`;
  }

  return {
    prevWeightKg: lastEntry.weightKg,
    currentWeightKg: newWeightKg,
    weightDeltaKg,
    daysElapsed: diffDays,
    actualWeeklyRateKg,
    targetWeeklyRateKg,
    discrepancyKgPerWeek,
    recommendedKcalAdjustment,
    suggestedNewDailyKcal,
    confidence,
    reasoning,
  };
}
