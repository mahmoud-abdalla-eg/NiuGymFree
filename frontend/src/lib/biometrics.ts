import { UserProfile, MacroSplit } from '../types';

export interface BiometricCalculations {
  exactDaysOld: number;
  exactYearsOld: number;
  bmr: number;
  tdee: number;
  goalDeltaKcal: number;
  baseTargetKcal: number;
  gymBonusKcal: number;
  effectiveTargetKcal: number;
  macros: {
    proteinGrams: number;
    carbsGrams: number;
    fatGrams: number;
    proteinKcal: number;
    carbsKcal: number;
    fatKcal: number;
  };
  isCheckInDue: boolean;
  daysSinceLastCheckIn: number;
  dayOfWeekName: string;
}

/**
 * Calculates exact chronological age in days and fractional years from Date of Birth.
 * Days Old = floor((Current Date - DOB) / 86400000)
 * Fractional Age = Days Old / 365.2425
 */
export function calculateAgeInDays(dobString: string, referenceDateString?: string): { daysOld: number; fractionalYears: number } {
  try {
    const refDate = referenceDateString ? new Date(referenceDateString) : new Date();
    const dob = new Date(dobString);
    const diffMs = refDate.getTime() - dob.getTime();
    const daysOld = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
    const fractionalYears = parseFloat((daysOld / 365.2425).toFixed(2));
    return { daysOld, fractionalYears };
  } catch {
    return { daysOld: 0, fractionalYears: 0 };
  }
}

/**
 * Computes Mifflin-St Jeor Basal Metabolic Rate using exact fractional age.
 */
export function calculateMifflinStJeorBmr(
  weightKg: number,
  heightCm: number,
  fractionalYears: number,
  gender: 'male' | 'female'
): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * fractionalYears;
  return Math.round(gender === 'male' ? base + 5 : base - 161);
}

/**
 * Full biometric analysis engine for NiuGymFree.
 */
export function calculateBiometrics(
  profile: UserProfile,
  selectedDate: string,
  hasWorkoutToday: boolean,
  workoutBurnKcal: number = 280
): BiometricCalculations {
  const { daysOld, fractionalYears } = calculateAgeInDays(profile.dob, selectedDate);
  const bmr = calculateMifflinStJeorBmr(profile.weightKg, profile.heightCm, fractionalYears, profile.gender);
  const tdee = Math.round(bmr * (profile.activityMultiplier || 1.55));

  let goalDelta = 0;
  if (profile.goalType === 'cut') goalDelta = -500;
  else if (profile.goalType === 'lean_bulk') goalDelta = 300;

  const baseCalculatedTarget = Math.max(1200, tdee + goalDelta);
  const baseTargetKcal = profile.manualKcalOverride !== null && profile.manualKcalOverride !== undefined
    ? profile.manualKcalOverride
    : baseCalculatedTarget;

  const gymBonus = (profile.includeGymBonusKcal && hasWorkoutToday) ? workoutBurnKcal : 0;
  const effectiveTargetKcal = baseTargetKcal + gymBonus;

  // Macro distribution
  const split = profile.macroSplit || { p: 35, c: 40, f: 25 };
  const pKcal = (effectiveTargetKcal * split.p) / 100;
  const cKcal = (effectiveTargetKcal * split.c) / 100;
  const fKcal = (effectiveTargetKcal * split.f) / 100;

  const proteinGrams = Math.round(pKcal / 4);
  const carbsGrams = Math.round(cKcal / 4);
  const fatGrams = Math.round(fKcal / 9);

  // Check-in interval verification
  const curMs = new Date(selectedDate).getTime();
  const lastCheckMs = new Date(profile.lastCheckInDate || '2026-09-01').getTime();
  const daysSinceLastCheckIn = Math.max(0, Math.floor((curMs - lastCheckMs) / (1000 * 60 * 60 * 24)));
  const isCheckInDue = daysSinceLastCheckIn >= (profile.checkInIntervalDays || 14);

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayOfWeekName = daysOfWeek[new Date(selectedDate + 'T12:00:00').getDay()] || 'Monday';

  return {
    exactDaysOld: daysOld,
    exactYearsOld: fractionalYears,
    bmr,
    tdee,
    goalDeltaKcal: goalDelta,
    baseTargetKcal,
    gymBonusKcal: gymBonus,
    effectiveTargetKcal,
    macros: {
      proteinGrams,
      carbsGrams,
      fatGrams,
      proteinKcal: Math.round(pKcal),
      carbsKcal: Math.round(cKcal),
      fatKcal: Math.round(fKcal)
    },
    isCheckInDue,
    daysSinceLastCheckIn,
    dayOfWeekName
  };
}
