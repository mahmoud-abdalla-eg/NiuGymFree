export type ActiveSide = 'nutrition' | 'gym';
export type NutritionTab = 'tracker' | 'planner' | 'vault' | 'biometrics';
export type GymTab = 'workout' | 'routines' | 'analytics';

export type Gender = 'male' | 'female';
export type GoalType = 'cut' | 'maintain' | 'lean_bulk';
export type UnitSystem = 'metric' | 'imperial';

export interface InBodyScanRecord {
  id: string;
  date: string; // YYYY-MM-DD
  weightKg: number;
  heightCm?: number;
  skeletalMuscleMassKg?: number; // SMM
  bodyFatMassKg?: number; // BFM
  bodyFatPercent?: number; // PBF
  bmi?: number;
  bmrKcal?: number;
  totalBodyWaterL?: number; // TBW
  visceralFatLevel?: number;
  inBodyScore?: number;
  rawText?: string;
  scannedAt: string;
  photoUrl?: string | null;
}

export interface WeightHistoryEntry {
  id: string;
  date: string;
  weightKg: number;
  appliedKcal: number;
  note: string;
  photoUrl: string | null;
  // InBody scan metrics
  bodyFatPercent?: number;
  skeletalMuscleMassKg?: number;
  bodyFatMassKg?: number;
  bmrKcal?: number;
  visceralFatLevel?: number;
  inBodyScore?: number;
}

export interface MacroSplit {
  p: number; // percentage (e.g., 35)
  c: number; // percentage (e.g., 40)
  f: number; // percentage (e.g., 25)
}

export interface UserProfile {
  name: string;
  email?: string;
  dob: string; // YYYY-MM-DD
  gender: Gender;
  heightCm: number;
  heightUnit: 'cm' | 'ft';
  weightKg: number;
  weightUnit: 'kg' | 'lbs';
  activityMultiplier: number;
  goalType: GoalType;
  macroSplit: MacroSplit;
  includeGymBonusKcal: boolean;
  manualKcalOverride: number | null;
  checkInIntervalDays: number;
  lastCheckInDate: string;
  hasCompletedOnboarding?: boolean;
  bodyFatPercent?: number;
  skeletalMuscleMassKg?: number;
  inBodyScans?: InBodyScanRecord[];
  weightHistory: WeightHistoryEntry[];
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  isGuest: boolean;
  provider: 'local' | 'supabase';
}

export interface FoodItem {
  id: string;
  name: string;
  category: 'Protein' | 'Carbs' | 'Fats' | 'Produce' | 'Dairy' | 'Drinks' | 'Custom';
  baseAmount: number;
  unit: string;
  label: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  emoji: string;
  photoUrl?: string | null;
}

export interface MealItem {
  foodId: string;
  name: string;
  multiplier: number;
  unitLabel: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  photoUrl?: string | null;
}

export interface SetMeal {
  id: string;
  name: string;
  defaultSlot: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
  notes: string;
  photoType?: string;
  photoUrl?: string | null;
  items: MealItem[];
}

export interface DailyFoodEntry {
  id: string;
  name: string;
  amountLabel: string;
  multiplier: number;
  baseCal: number;
  baseP: number;
  baseC: number;
  baseF: number;
  photoUrl?: string | null;
}

export interface DailyNutritionLog {
  waterMl: number;
  meals: {
    breakfast: DailyFoodEntry[];
    lunch: DailyFoodEntry[];
    dinner: DailyFoodEntry[];
    snacks: DailyFoodEntry[];
  };
}

export type SetType = 'Warmup' | 'Working' | 'Drop' | 'Failure';

export interface WorkoutExerciseSet {
  id: string;
  type: SetType;
  weight: number;
  reps: number;
  rpe: number;
  completed: boolean;
}

export interface WorkoutExercise {
  id: string;
  exId: string;
  name: string;
  muscle: string;
  restSec: number;
  prevBest: string;
  pr1RM: number;
  cue: string;
  sets: WorkoutExerciseSet[];
}

export interface WorkoutSession {
  routineId: string;
  title: string;
  durationSec: number;
  pumpPhotoUrl: string | null;
  exercises: WorkoutExercise[];
}

export interface RoutineExerciseTemplate {
  exId: string;
  targetSets: number;
  repRange: string;
  restSec: number;
}

export interface RoutineTemplate {
  id: string;
  name: string;
  estBurnKcal: number;
  targetDurationMin: number;
  exercises: RoutineExerciseTemplate[];
}

export interface DaySchedule {
  gymRoutineId: string;
  meals: {
    breakfast: string;
    lunch: string;
    dinner: string;
  };
}

export type WeeklySchedule = Record<string, DaySchedule>;

export interface ExerciseVaultItem {
  id: string;
  name: string;
  muscle: string;
  equipment: string;
  defaultRest: number;
  prevBest: string;
  pr1RM: number;
  cue: string;
  commonMistakes?: string[];
  formCues?: string[];
  youtubeVideoId?: string;
  videoStartSec?: number;
  customYoutubeUrl?: string;
}

export interface RestTimerState {
  active: boolean;
  remainingSec: number;
  totalSec: number;
  exerciseName: string;
  soundEnabled: boolean;
}

export interface ParsedOcrPlan {
  type: 'workout' | 'nutrition' | 'hybrid';
  detectedRoutines: RoutineTemplate[];
  detectedMeals: SetMeal[];
  rawText: string;
  pageCount: number;
  confidenceScore: number;
}
