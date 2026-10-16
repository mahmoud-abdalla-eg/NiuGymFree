import { Request, Response } from 'express';
import { ExerciseItem, RoutineTemplate, WorkoutSession } from '../types';
import { SEED_EXERCISES } from '../data/seedExercises';

const inMemoryExercises: Map<string, ExerciseItem> = new Map(SEED_EXERCISES.map((e) => [e.id, e]));
const inMemoryRoutines: Map<string, RoutineTemplate[]> = new Map();
const inMemorySessions: Map<string, WorkoutSession[]> = new Map();

export const STARTER_PPL_ROUTINES: RoutineTemplate[] = [
  {
    id: 'rt_push',
    name: 'Push Hypertrophy (Chest, Delts, Triceps)',
    targetDaysPerWeek: 2,
    exercises: [
      { exerciseId: 'ex_bb_bench', targetSets: 4, targetRepsRange: '6-8', defaultRestSec: 120, notes: 'Warm up thoroughly up to working weight' },
      { exerciseId: 'ex_incline_db_press', targetSets: 3, targetRepsRange: '8-10', defaultRestSec: 90, notes: 'Focus on deep clavicular stretch at bottom' },
      { exerciseId: 'ex_db_lat_raise', targetSets: 4, targetRepsRange: '12-15', defaultRestSec: 60, notes: 'Lead with elbows in scapular plane' }
    ]
  },
  {
    id: 'rt_pull',
    name: 'Pull Strength & Width (Back & Biceps)',
    targetDaysPerWeek: 2,
    exercises: [
      { exerciseId: 'ex_lat_pulldown', targetSets: 4, targetRepsRange: '8-10', defaultRestSec: 90, notes: 'Depress shoulder blades first, full stretch at top' }
    ]
  },
  {
    id: 'rt_legs',
    name: 'Legs & Core Power (Quads, Hamstrings)',
    targetDaysPerWeek: 2,
    exercises: [
      { exerciseId: 'ex_bb_squat', targetSets: 4, targetRepsRange: '6-8', defaultRestSec: 180, notes: 'Hit parallel or below with strong abdominal brace' },
      { exerciseId: 'ex_rdl_bb', targetSets: 3, targetRepsRange: '8-10', defaultRestSec: 120, notes: 'Pure hip hinge, keep bar brushing thighs/shins' }
    ]
  }
];

export async function getExerciseVault(req: Request, res: Response): Promise<void> {
  const exercises = Array.from(inMemoryExercises.values());
  res.status(200).json({ success: true, exercises });
}

export async function createExercise(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id || 'guest_default';
  const exercise: ExerciseItem = {
    id: `ex_custom_${Date.now()}`,
    userId,
    name: req.body.name,
    primaryMuscle: req.body.primaryMuscle || 'chest',
    secondaryMuscles: req.body.secondaryMuscles || [],
    equipment: req.body.equipment || 'barbell',
    defaultRestSec: Number(req.body.defaultRestSec) || 90,
    youtubeVideoId: req.body.youtubeVideoId || 'rT7DgCr-3pg',
    videoStartSec: Number(req.body.videoStartSec) || 0,
    formCues: req.body.formCues || [],
    commonMistakes: req.body.commonMistakes || [],
    isCustom: true,
  };

  inMemoryExercises.set(exercise.id, exercise);
  res.status(201).json({ success: true, exercise });
}

export async function getRoutines(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id || 'guest_default';
  const routines = inMemoryRoutines.get(userId) || [];
  res.status(200).json({ success: true, routines });
}

export async function saveRoutine(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id || 'guest_default';
  const routine: RoutineTemplate = {
    id: req.body.id || `routine_${Date.now()}`,
    userId,
    name: req.body.name,
    targetDaysPerWeek: Number(req.body.targetDaysPerWeek) || 3,
    exercises: req.body.exercises || [],
  };

  const list = inMemoryRoutines.get(userId) || [];
  const idx = list.findIndex((r) => r.id === routine.id);
  if (idx >= 0) {
    list[idx] = routine;
  } else {
    list.push(routine);
  }
  inMemoryRoutines.set(userId, list);

  res.status(201).json({ success: true, routine });
}

export async function loadStarterRoutines(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id || 'guest_default';
  inMemoryRoutines.set(userId, [...STARTER_PPL_ROUTINES]);
  res.status(200).json({ success: true, routines: STARTER_PPL_ROUTINES });
}

export async function deleteRoutine(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id || 'guest_default';
  const { id } = req.params;

  const list = inMemoryRoutines.get(userId) || [];
  inMemoryRoutines.set(userId, list.filter((r) => r.id !== id));

  res.status(200).json({ success: true, message: 'Routine deleted' });
}

export async function getWorkoutSessions(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id || 'guest_default';
  const sessions = inMemorySessions.get(userId) || [];
  res.status(200).json({ success: true, sessions });
}

export async function logWorkoutSession(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id || 'guest_default';
  const session: WorkoutSession = {
    id: req.body.id || `session_${Date.now()}`,
    userId,
    date: req.body.date || new Date().toISOString().split('T')[0],
    routineId: req.body.routineId,
    routineName: req.body.routineName || 'Custom Session',
    startTime: req.body.startTime || new Date().toISOString(),
    endTime: req.body.endTime || new Date().toISOString(),
    durationSec: Number(req.body.durationSec) || 0,
    exercises: req.body.exercises || [],
    totalTonnageKg: Number(req.body.totalTonnageKg) || 0,
    notes: req.body.notes,
  };

  const list = inMemorySessions.get(userId) || [];
  inMemorySessions.set(userId, [session, ...list]);

  res.status(201).json({ success: true, session });
}

export async function calculateOneRepMax(req: Request, res: Response): Promise<void> {
  const { weightKg, reps } = req.body;

  if (!weightKg || !reps) {
    res.status(400).json({ success: false, error: 'weightKg and reps are required' });
    return;
  }

  const weight = Number(weightKg);
  const repCount = Number(reps);

  // Epley Formula: 1RM = Weight * (1 + Reps / 30)
  const epley1RM = Math.round(weight * (1 + repCount / 30));
  // Brzycki Formula: 1RM = Weight * (36 / (37 - Reps))
  const brzycki1RM = repCount < 37 ? Math.round(weight * (36 / (37 - repCount))) : epley1RM;

  res.status(200).json({
    success: true,
    data: {
      epley1RM,
      brzycki1RM,
      percentages: {
        '100%': epley1RM,
        '95%': Math.round(epley1RM * 0.95),
        '90%': Math.round(epley1RM * 0.90),
        '85%': Math.round(epley1RM * 0.85),
        '80%': Math.round(epley1RM * 0.80),
        '75%': Math.round(epley1RM * 0.75),
        '70%': Math.round(epley1RM * 0.70),
      },
    },
  });
}
