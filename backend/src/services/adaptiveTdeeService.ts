import { ActivityLevel, Goal, Sex, MacroSplitPercent } from '../types';

export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very_active: 1.725,
  extra_active: 1.9,
};

export const GOAL_ADJUSTMENTS: Record<Goal, number> = {
  cut: -500,
  maintain: 0,
  bulk: 300,
};

export function calculateAgeInDays(dobString: string, referenceDate: Date = new Date()): { daysOld: number; exactYears: number } {
  const birth = new Date(dobString);
  const diffMs = referenceDate.getTime() - birth.getTime();
  const daysOld = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  const exactYears = daysOld / 365.2425;
  return { daysOld, exactYears };
}

export function calculateMifflinStJeorBmr(weightKg: number, heightCm: number, exactAgeYears: number, sex: Sex): number {
  if (sex === 'male') {
    return 10 * weightKg + 6.25 * heightCm - 5 * exactAgeYears + 5;
  } else {
    return 10 * weightKg + 6.25 * heightCm - 5 * exactAgeYears - 161;
  }
}

export function calculateTdee(
  weightKg: number,
  heightCm: number,
  dobString: string,
  sex: Sex,
  activityLevel: ActivityLevel,
  goal: Goal
): { bmr: number; tdee: number; targetKcal: number; daysOld: number; exactYears: number } {
  const { daysOld, exactYears } = calculateAgeInDays(dobString);
  const bmr = calculateMifflinStJeorBmr(weightKg, heightCm, exactYears, sex);
  const activityMultiplier = ACTIVITY_MULTIPLIERS[activityLevel] || 1.375;
  const tdee = bmr * activityMultiplier;
  const targetKcal = Math.max(1200, Math.round(tdee + (GOAL_ADJUSTMENTS[goal] || 0)));

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    targetKcal,
    daysOld,
    exactYears: Number(exactYears.toFixed(2)),
  };
}

export function calculateMacrosInGrams(targetKcal: number, split: MacroSplitPercent) {
  const proteinKcal = (targetKcal * split.proteinPct) / 100;
  const carbsKcal = (targetKcal * split.carbsPct) / 100;
  const fatKcal = (targetKcal * split.fatPct) / 100;

  return {
    proteinGrams: Math.round(proteinKcal / 4),
    carbsGrams: Math.round(carbsKcal / 4),
    fatGrams: Math.round(fatKcal / 9),
  };
}

export function computeAdaptiveAdjustment(
  previousWeightKg: number,
  currentWeightKg: number,
  daysElapsed: number,
  goal: Goal,
  currentTargetKcal: number
): { recommendedKcal: number; deltaKcal: number; reason: string } {
  if (daysElapsed < 5) {
    return {
      recommendedKcal: currentTargetKcal,
      deltaKcal: 0,
      reason: 'Check-in period is too short for meaningful metabolic adaptation adjustment.',
    };
  }

  const weightDeltaKg = currentWeightKg - previousWeightKg;
  const weeksElapsed = daysElapsed / 7;
  const weeklyRateKg = weightDeltaKg / weeksElapsed;

  let recommendedDelta = 0;
  let reason = '';

  if (goal === 'cut') {
    // Target cut velocity: -0.4kg to -0.8kg per week
    if (weeklyRateKg > -0.2) {
      recommendedDelta = -150;
      reason = `Fat loss plateau detected (${weeklyRateKg.toFixed(2)} kg/week). Calorie reduction recommended.`;
    } else if (weeklyRateKg < -1.0) {
      recommendedDelta = +150;
      reason = `Fat loss rate is too aggressive (${weeklyRateKg.toFixed(2)} kg/week). Calorie increase recommended to spare muscle mass.`;
    } else {
      reason = `Target cut rate on track (${weeklyRateKg.toFixed(2)} kg/week). Maintain current calories.`;
    }
  } else if (goal === 'bulk') {
    // Target lean bulk: +0.2kg to +0.4kg per week
    if (weeklyRateKg < 0.1) {
      recommendedDelta = +150;
      reason = `Weight gain stalled (${weeklyRateKg.toFixed(2)} kg/week). Calorie surplus increase recommended.`;
    } else if (weeklyRateKg > 0.6) {
      recommendedDelta = -150;
      reason = `Weight gain velocity too rapid (${weeklyRateKg.toFixed(2)} kg/week). Calorie adjustment recommended to minimize fat gain.`;
    } else {
      reason = `Target lean bulk rate on track (${weeklyRateKg.toFixed(2)} kg/week). Maintain current calories.`;
    }
  } else {
    // Maintenance
    if (Math.abs(weightDeltaKg) > 1.2) {
      recommendedDelta = weightDeltaKg > 0 ? -100 : +100;
      reason = `Body weight shifting from baseline (${weightDeltaKg.toFixed(1)} kg). Caloric adjustment suggested.`;
    } else {
      reason = `Maintenance stabilized (${weightDeltaKg.toFixed(1)} kg delta). Maintain current target.`;
    }
  }

  const newTarget = Math.max(1200, currentTargetKcal + recommendedDelta);
  return {
    recommendedKcal: newTarget,
    deltaKcal: recommendedDelta,
    reason,
  };
}
