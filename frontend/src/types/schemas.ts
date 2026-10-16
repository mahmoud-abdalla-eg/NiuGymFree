import { z } from 'zod';

export const MacroSplitSchema = z.object({
  p: z.number().min(0).max(100),
  c: z.number().min(0).max(100),
  f: z.number().min(0).max(100),
});

export const InBodyScanRecordSchema = z.object({
  id: z.string(),
  date: z.string(),
  weightKg: z.number().positive(),
  heightCm: z.number().positive().optional(),
  skeletalMuscleMassKg: z.number().positive().optional(),
  bodyFatMassKg: z.number().nonnegative().optional(),
  bodyFatPercent: z.number().min(0).max(100).optional(),
  bmi: z.number().positive().optional(),
  bmrKcal: z.number().positive().optional(),
  totalBodyWaterL: z.number().positive().optional(),
  visceralFatLevel: z.number().int().min(1).max(30).optional(),
  inBodyScore: z.number().min(0).max(120).optional(),
  rawText: z.string().optional(),
  scannedAt: z.string(),
  photoUrl: z.string().nullable().optional(),
});

export const WeightHistoryEntrySchema = z.object({
  id: z.string(),
  date: z.string(),
  weightKg: z.number().positive(),
  appliedKcal: z.number().positive(),
  note: z.string(),
  photoUrl: z.string().nullable().optional(),
  bodyFatPercent: z.number().min(0).max(100).optional(),
  skeletalMuscleMassKg: z.number().positive().optional(),
  bodyFatMassKg: z.number().nonnegative().optional(),
  bmrKcal: z.number().positive().optional(),
  visceralFatLevel: z.number().int().min(1).max(30).optional(),
  inBodyScore: z.number().min(0).max(120).optional(),
});

export const UserProfileSchema = z.object({
  name: z.string().min(1),
  email: z.string().optional(),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  gender: z.enum(['male', 'female']),
  heightCm: z.number().positive(),
  heightUnit: z.enum(['cm', 'ft']),
  weightKg: z.number().positive(),
  weightUnit: z.enum(['kg', 'lbs']),
  activityMultiplier: z.number().min(1.0).max(2.5),
  goalType: z.enum(['cut', 'maintain', 'lean_bulk']),
  macroSplit: MacroSplitSchema,
  includeGymBonusKcal: z.boolean(),
  manualKcalOverride: z.number().nullable().optional(),
  checkInIntervalDays: z.number().int().positive(),
  lastCheckInDate: z.string(),
  hasCompletedOnboarding: z.boolean().optional(),
  bodyFatPercent: z.number().min(0).max(100).optional(),
  skeletalMuscleMassKg: z.number().positive().optional(),
  inBodyScans: z.array(InBodyScanRecordSchema).optional(),
  weightHistory: z.array(WeightHistoryEntrySchema),
});

export const FoodItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  category: z.enum(['Protein', 'Carbs', 'Fats', 'Produce', 'Dairy', 'Drinks', 'Custom']),
  baseAmount: z.number().positive(),
  unit: z.string(),
  label: z.string(),
  calories: z.number().nonnegative(),
  protein: z.number().nonnegative(),
  carbs: z.number().nonnegative(),
  fat: z.number().nonnegative(),
  emoji: z.string(),
  photoUrl: z.string().nullable().optional(),
});

export const MealItemSchema = z.object({
  foodId: z.string(),
  name: z.string(),
  multiplier: z.number().positive(),
  unitLabel: z.string(),
  calories: z.number().nonnegative(),
  protein: z.number().nonnegative(),
  carbs: z.number().nonnegative(),
  fat: z.number().nonnegative(),
  photoUrl: z.string().nullable().optional(),
});

export const SetMealSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  defaultSlot: z.enum(['breakfast', 'lunch', 'dinner', 'snacks']),
  notes: z.string(),
  photoType: z.string().optional(),
  photoUrl: z.string().nullable().optional(),
  items: z.array(MealItemSchema),
});

export const ExerciseVaultItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  muscle: z.string(),
  equipment: z.string(),
  defaultRest: z.number().nonnegative(),
  prevBest: z.string(),
  pr1RM: z.number().nonnegative(),
  cue: z.string(),
  commonMistakes: z.array(z.string()).optional(),
  formCues: z.array(z.string()).optional(),
  youtubeVideoId: z.string().optional(),
  videoStartSec: z.number().nonnegative().optional(),
  customYoutubeUrl: z.string().optional(),
});

export const RoutineExerciseTemplateSchema = z.object({
  exId: z.string(),
  targetSets: z.number().int().positive(),
  repRange: z.string(),
  restSec: z.number().int().nonnegative(),
});

export const RoutineTemplateSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  estBurnKcal: z.number().nonnegative(),
  targetDurationMin: z.number().positive(),
  exercises: z.array(RoutineExerciseTemplateSchema),
});

export const WorkoutSetSchema = z.object({
  id: z.string(),
  type: z.enum(['Warmup', 'Working', 'Drop', 'Failure']),
  weight: z.number().nonnegative(),
  reps: z.number().int().nonnegative(),
  rpe: z.number().min(5).max(10),
  completed: z.boolean(),
});

export const WorkoutExerciseSchema = z.object({
  id: z.string(),
  exId: z.string(),
  name: z.string(),
  muscle: z.string(),
  restSec: z.number().nonnegative(),
  prevBest: z.string(),
  pr1RM: z.number().nonnegative(),
  cue: z.string(),
  sets: z.array(WorkoutSetSchema),
});

export const WorkoutSessionSchema = z.object({
  routineId: z.string(),
  title: z.string(),
  durationSec: z.number().int().nonnegative(),
  pumpPhotoUrl: z.string().nullable().optional(),
  exercises: z.array(WorkoutExerciseSchema),
});

export const AppBackupDataSchema = z.object({
  version: z.string(),
  exportedAt: z.string(),
  profile: UserProfileSchema,
  foodVault: z.array(FoodItemSchema),
  setMeals: z.array(SetMealSchema),
  exerciseVault: z.array(ExerciseVaultItemSchema),
  routines: z.array(RoutineTemplateSchema),
  weeklySchedule: z.record(z.any()),
  dailyNutritionLogs: z.record(z.any()),
  workoutSessions: z.record(z.any()),
});
