export type Sex = 'male' | 'female';
export type UnitSystem = 'metric' | 'imperial';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very_active' | 'extra_active';
export type Goal = 'cut' | 'maintain' | 'bulk';
export type CheckInCadenceDays = 7 | 14 | 21 | 28;

export interface MacroSplitPercent {
  proteinPct: number;
  carbsPct: number;
  fatPct: number;
}

export interface InBodyScanRecord {
  id: string;
  userId: string;
  scanDate: string;
  rawOcrText?: string;
  weightKg?: number;
  skeletalMuscleMassKg?: number;
  bodyFatMassKg?: number;
  bodyFatPercent?: number;
  bmi?: number;
  bmrKcal?: number;
  totalBodyWaterL?: number;
  visceralFatLevel?: number;
  inBodyScore?: number;
  hasIssues?: boolean;
  notes?: string;
  createdAt: string;
}

export interface WeightHistoryEntry {
  id: string;
  userId: string;
  date: string;
  weightKg: number;
  photoUrl?: string;
  notes?: string;
  skeletalMuscleMassKg?: number;
  bodyFatMassKg?: number;
  bodyFatPercent?: number;
  bmi?: number;
  bmrKcal?: number;
  totalBodyWaterL?: number;
  visceralFatLevel?: number;
  inBodyScore?: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  dob: string;
  sex: Sex;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  goal: Goal;
  targetKcal: number;
  macroSplit: MacroSplitPercent;
  trainingDayCalorieBonus: number;
  checkInCadenceDays: CheckInCadenceDays;
  lastCheckInDate: string;
  skeletalMuscleMassKg?: number;
  bodyFatMassKg?: number;
  bodyFatPercent?: number;
  bmi?: number;
  bmrKcal?: number;
  inBodyScore?: number;
  isGuest?: boolean;
  onboardingCompleted?: boolean;
}

export interface FoodItem {
  id: string;
  userId?: string;
  name: string;
  category: 'protein' | 'carb' | 'fat' | 'beverage' | 'snack';
  unit: string;
  label: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  emoji?: string;
  photoUrl?: string;
  isCustom?: boolean;
}

export interface SetMealItem {
  foodId: string;
  name: string;
  multiplier: number;
  unitLabel: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface SetMeal {
  id: string;
  userId?: string;
  name: string;
  defaultSlot: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
  notes?: string;
  photoType?: string;
  photoUrl?: string;
  items: SetMealItem[];
}

export interface MealSlotEntry {
  id: string;
  foodId: string;
  name: string;
  multiplier: number;
  unitLabel: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  timeLogged: string;
  photoUrl?: string;
}

export interface DailyMealLog {
  id: string;
  userId: string;
  date: string;
  breakfast: MealSlotEntry[];
  lunch: MealSlotEntry[];
  dinner: MealSlotEntry[];
  snacks: MealSlotEntry[];
  waterMl: number;
  syncTrainingDayBonus: boolean;
  targetKcalSnapshot: number;
}

export type MuscleGroup = 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'core';
export type EquipmentType = 'barbell' | 'dumbbell' | 'cable' | 'machine' | 'bodyweight' | 'smith';

export interface ExerciseItem {
  id: string;
  userId?: string;
  name: string;
  primaryMuscle: MuscleGroup;
  secondaryMuscles?: MuscleGroup[];
  equipment: EquipmentType;
  defaultRestSec: number;
  youtubeVideoId: string;
  videoStartSec?: number;
  formCues: string[];
  commonMistakes: string[];
  isCustom?: boolean;
}

export interface RoutineExerciseTemplate {
  exerciseId: string;
  targetSets: number;
  targetRepsRange: string;
  defaultRestSec: number;
  notes?: string;
}

export interface RoutineTemplate {
  id: string;
  userId?: string;
  name: string;
  targetDaysPerWeek: number;
  exercises: RoutineExerciseTemplate[];
}

export type SetType = 'W' | '1' | '2' | '3' | '4' | '5' | 'D' | 'F';

export interface CompletedSet {
  setNumber: number;
  setType: SetType;
  weightKg: number;
  reps: number;
  rpe?: number;
  completed: boolean;
  completedAt?: string;
  isPR?: boolean;
  epleyOneRepMax?: number;
}

export interface CompletedExerciseSession {
  exerciseId: string;
  sets: CompletedSet[];
}

export interface WorkoutSession {
  id: string;
  userId: string;
  date: string;
  routineId?: string;
  routineName: string;
  startTime: string;
  endTime?: string;
  durationSec: number;
  exercises: CompletedExerciseSession[];
  totalTonnageKg: number;
  notes?: string;
}

export interface DaySchedule {
  gymRoutineId: string;
  meals: {
    breakfast: string;
    lunch: string;
    dinner: string;
  };
}

export type WeeklySchedule = Record<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday', DaySchedule>;
