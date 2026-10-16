import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  ActiveSide,
  NutritionTab,
  GymTab,
  UserProfile,
  FoodItem,
  SetMeal,
  WeeklySchedule,
  DailyNutritionLog,
  ExerciseVaultItem,
  RoutineTemplate,
  WorkoutSession,
  RestTimerState,
  DailyFoodEntry,
  AuthUser,
  InBodyScanRecord
} from './types';
import { calculateBiometrics } from './lib/biometrics';
import { playTimerBeep } from './lib/audio';
import { StorageAdapter } from './services/storageAdapter';
import { INITIAL_FOOD_VAULT } from './data/initialFoodVault';
import { INITIAL_EXERCISE_VAULT } from './data/initialExerciseVault';
import { INITIAL_ROUTINES } from './data/initialRoutines';
import { INITIAL_SET_MEALS, INITIAL_WEEKLY_SCHEDULE, DAYS_OF_WEEK } from './data/initialSchedule';
import { createPresetSvgPhoto } from './lib/imageCompression';

// Layout Components
import { Header } from './components/layout/Header';
import { SubNav } from './components/layout/SubNav';
import { RestTimerHUD } from './components/layout/RestTimerHUD';

// Nutrition Views
import { DailyMacroTracker } from './components/nutrition/DailyMacroTracker';
import { MealStudioPlanner } from './components/nutrition/MealStudioPlanner';
import { FoodVaultView } from './components/nutrition/FoodVaultView';
import { BiometricsView } from './components/nutrition/BiometricsView';

// Gym Views
import { ActiveWorkoutRecorder } from './components/gym/ActiveWorkoutRecorder';
import { RoutineSplitBuilder } from './components/gym/RoutineSplitBuilder';
import { StrengthAnalyticsVault } from './components/gym/StrengthAnalyticsVault';
import { ExerciseVideoModal } from './components/gym/ExerciseVideoModal';

// Modals
import { PdfImportModal } from './components/modals/PdfImportModal';
import { InBodyImportModal } from './components/modals/InBodyImportModal';
import { BiometricsModal } from './components/modals/BiometricsModal';
import { AddFoodModal } from './components/modals/AddFoodModal';
import { BackupModal } from './components/modals/BackupModal';
import { AiCoachDrawer } from './components/modals/AiCoachDrawer';
import { PhotoLightboxModal } from './components/modals/PhotoLightboxModal';
import { AuthModal } from './components/modals/AuthModal';
import { OnboardingModal } from './components/onboarding/OnboardingModal';
import { CheckCircle2, X } from 'lucide-react';

export default function App() {
  // --- Global Navigation ---
  const [activeSide, setActiveSide] = useState<ActiveSide>('nutrition');
  const [nutritionTab, setNutritionTab] = useState<NutritionTab>('tracker');
  const [gymTab, setGymTab] = useState<GymTab>('workout');
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [showSetupBanner, setShowSetupBanner] = useState<boolean>(true);

  const handleJumpToToday = () => {
    setSelectedDate(todayStr);
    showToast('📅 Returned to Today');
  };

  // --- Purge Previous Test Data Once from LocalStorage for Clean Empty State ---
  useEffect(() => {
    try {
      if (!localStorage.getItem('niugymfree_cleaned_test_data_v4')) {
        localStorage.removeItem('niugymfree_workout_sessions');
        localStorage.removeItem('niugymfree_nutrition_logs');
        localStorage.removeItem('niugymfree_setmeals');
        localStorage.removeItem('niugymfree_routines');
        localStorage.removeItem('niugymfree_schedule');
        localStorage.removeItem('niugymfree_profile');
        localStorage.removeItem('niugymfree_auth_user');
        localStorage.setItem('niugymfree_cleaned_test_data_v4', 'true');
        // If profile was cleared, reload state values
        setProfile({
          name: '',
          dob: '2004-05-15',
          gender: 'male',
          heightCm: 178,
          heightUnit: 'cm',
          weightKg: 75.0,
          weightUnit: 'kg',
          activityMultiplier: 1.55,
          goalType: 'cut',
          macroSplit: { p: 35, c: 40, f: 25 },
          includeGymBonusKcal: true,
          manualKcalOverride: null,
          checkInIntervalDays: 14,
          lastCheckInDate: '',
          hasCompletedOnboarding: false,
          weightHistory: [],
        });
        setCurrentUser(null);
        setSetMeals([]);
        setRoutines([]);
        setDailyNutritionLogs({});
        setWorkoutSessions({});
        setShowAuthModal(true);
        setShowOnboardingModal(false);
      }
    } catch {
      // ignore storage error
    }
  }, []);

  // --- Auth & User Account State ---
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() =>
    StorageAdapter.loadLocal<AuthUser | null>('auth_user', null)
  );

  // Floating signin or login card is the FIRST THING when opening the website!
  const [showAuthModal, setShowAuthModal] = useState<boolean>(() => {
    const saved = StorageAdapter.loadLocal<AuthUser | null>('auth_user', null);
    return !saved;
  });

  // When signed in, don't show onboarding if it's done; if not, keep showing!
  const [showOnboardingModal, setShowOnboardingModal] = useState<boolean>(() => {
    const savedUser = StorageAdapter.loadLocal<AuthUser | null>('auth_user', null);
    if (savedUser) {
      const savedProfile = StorageAdapter.loadLocal<UserProfile | null>('profile', null);
      return savedProfile ? !savedProfile.hasCompletedOnboarding : true;
    }
    // If not signed in yet, floating signin card opens first
    return false;
  });

  // --- Modals & Overlays ---
  const [showBiometricsModal, setShowBiometricsModal] = useState(false);
  const [showPdfImportModal, setShowPdfImportModal] = useState(false);
  const [showInBodyModal, setShowInBodyModal] = useState(false);
  const [showAddFoodModal, setShowAddFoodModal] = useState(false);
  const [addFoodSlot, setAddFoodSlot] = useState<'breakfast' | 'lunch' | 'dinner' | 'snacks'>('lunch');
  const [showAiDrawer, setShowAiDrawer] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [lightboxPhoto, setLightboxPhoto] = useState<{ url: string; title: string } | null>(null);
  const [activeVideoExercise, setActiveVideoExercise] = useState<ExerciseVaultItem | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => {
      setToast((prev) => (prev === message ? null : prev));
    }, 3200);
  };

  // --- Keyboard Shortcuts (Cmd/Ctrl + Shift + M to toggle hemispheres) ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        setActiveSide((prev) => (prev === 'nutrition' ? 'gym' : 'nutrition'));
        showToast(`Flipped to ${activeSide === 'nutrition' ? '🏋️ Gym Side' : '🥗 Nutrition Side'}`);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSide]);

  // --- Core State (Empty State with Only Food & Exercise Vault Preserved) ---
  const [profile, setProfile] = useState<UserProfile>(() => {
    const fallback: UserProfile = {
      name: '',
      dob: '2004-05-15',
      gender: 'male',
      heightCm: 178,
      heightUnit: 'cm',
      weightKg: 75.0,
      weightUnit: 'kg',
      activityMultiplier: 1.55,
      goalType: 'cut',
      macroSplit: { p: 35, c: 40, f: 25 },
      includeGymBonusKcal: true,
      manualKcalOverride: null,
      checkInIntervalDays: 14,
      lastCheckInDate: '',
      hasCompletedOnboarding: false,
      weightHistory: [], // Clean empty state: no mock weigh-ins!
    };
    return StorageAdapter.loadLocal('profile', fallback);
  });

  // Food vault preserved for food search & logging
  const [foodVault, setFoodVault] = useState<FoodItem[]>(() =>
    StorageAdapter.loadLocal('foods', INITIAL_FOOD_VAULT)
  );

  // Exercise vault preserved for YouTube cues & exercise library
  const [exerciseVault, setExerciseVault] = useState<ExerciseVaultItem[]>(() =>
    StorageAdapter.loadLocal('exercises', INITIAL_EXERCISE_VAULT)
  );

  // Empty state for Set Meals (no test meals)
  const [setMeals, setSetMeals] = useState<SetMeal[]>(() =>
    StorageAdapter.loadLocal('setmeals', [])
  );

  // Empty state for 7-day schedule (all rest days until scheduled)
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklySchedule>(() => {
    const emptySchedule: WeeklySchedule = {
      Monday: { gymRoutineId: 'rest', meals: { breakfast: '', lunch: '', dinner: '' } },
      Tuesday: { gymRoutineId: 'rest', meals: { breakfast: '', lunch: '', dinner: '' } },
      Wednesday: { gymRoutineId: 'rest', meals: { breakfast: '', lunch: '', dinner: '' } },
      Thursday: { gymRoutineId: 'rest', meals: { breakfast: '', lunch: '', dinner: '' } },
      Friday: { gymRoutineId: 'rest', meals: { breakfast: '', lunch: '', dinner: '' } },
      Saturday: { gymRoutineId: 'rest', meals: { breakfast: '', lunch: '', dinner: '' } },
      Sunday: { gymRoutineId: 'rest', meals: { breakfast: '', lunch: '', dinner: '' } },
    };
    return StorageAdapter.loadLocal('schedule', emptySchedule);
  });

  // Empty state for Daily Nutrition Logs (no fake breakfast/lunch logged)
  const [dailyNutritionLogs, setDailyNutritionLogs] = useState<Record<string, DailyNutritionLog>>(() =>
    StorageAdapter.loadLocal('nutrition_logs', {})
  );

  // Empty state for Routines (no mock routines)
  const [routines, setRoutines] = useState<RoutineTemplate[]>(() =>
    StorageAdapter.loadLocal('routines', [])
  );

  // Empty state for Workout Sessions (no fake bench press sessions logged)
  const [workoutSessions, setWorkoutSessions] = useState<Record<string, WorkoutSession>>(() =>
    StorageAdapter.loadLocal('workout_sessions', {})
  );

  // --- Auto-persist State to LocalStorage ---
  useEffect(() => { StorageAdapter.saveLocal('profile', profile); }, [profile]);
  useEffect(() => { StorageAdapter.saveLocal('auth_user', currentUser); }, [currentUser]);
  useEffect(() => { StorageAdapter.saveLocal('foods', foodVault); }, [foodVault]);
  useEffect(() => { StorageAdapter.saveLocal('setmeals', setMeals); }, [setMeals]);
  useEffect(() => { StorageAdapter.saveLocal('schedule', weeklySchedule); }, [weeklySchedule]);
  useEffect(() => { StorageAdapter.saveLocal('nutrition_logs', dailyNutritionLogs); }, [dailyNutritionLogs]);
  useEffect(() => { StorageAdapter.saveLocal('exercises', exerciseVault); }, [exerciseVault]);
  useEffect(() => { StorageAdapter.saveLocal('routines', routines); }, [routines]);
  useEffect(() => { StorageAdapter.saveLocal('workout_sessions', workoutSessions); }, [workoutSessions]);

  // --- Current Selected Day Data ---
  const currentDayNutritionLog: DailyNutritionLog = useMemo(() => {
    return (
      dailyNutritionLogs[selectedDate] || {
        waterMl: 0,
        meals: { breakfast: [], lunch: [], dinner: [], snacks: [] },
      }
    );
  }, [dailyNutritionLogs, selectedDate]);

  const currentWorkout: WorkoutSession = useMemo(() => {
    if (workoutSessions[selectedDate]) {
      return workoutSessions[selectedDate];
    }
    const dayOfWeek = DAYS_OF_WEEK[new Date(selectedDate + 'T12:00:00').getDay() === 0 ? 6 : new Date(selectedDate + 'T12:00:00').getDay() - 1];
    const schedRoutineId = weeklySchedule[dayOfWeek]?.gymRoutineId;
    const routine = routines.find((r) => r.id === schedRoutineId);

    if (!routine) {
      return {
        routineId: 'empty',
        title: schedRoutineId === 'rest' ? 'Rest & Recovery Day' : 'No Routine Scheduled',
        durationSec: 0,
        pumpPhotoUrl: null,
        exercises: [],
      };
    }

    return {
      routineId: routine.id,
      title: routine.name,
      durationSec: 0,
      pumpPhotoUrl: null,
      exercises: routine.exercises.map((re, idx) => {
        const vEx = exerciseVault.find((ex) => ex.id === re.exId) || exerciseVault[0];
        return {
          id: `we_${Date.now()}_${idx}`,
          exId: vEx.id,
          name: vEx.name,
          muscle: vEx.muscle,
          restSec: re.restSec,
          prevBest: vEx.prevBest,
          pr1RM: vEx.pr1RM,
          cue: vEx.cue,
          sets: Array.from({ length: re.targetSets }).map((_, sIdx) => ({
            id: `s_${Date.now()}_${idx}_${sIdx}`,
            type: 'Working',
            weight: parseFloat(vEx.prevBest) || 60,
            reps: 8,
            rpe: 8,
            completed: false,
          })),
        };
      }),
    };
  }, [workoutSessions, selectedDate, weeklySchedule, routines, exerciseVault]);

  // --- Rest Timer & Stopwatch Engines ---
  const [workoutRunning, setWorkoutRunning] = useState(false);
  const [restTimer, setRestTimer] = useState<RestTimerState>({
    active: false,
    remainingSec: 0,
    totalSec: 90,
    exerciseName: 'Bench Press Rest',
    soundEnabled: true,
  });

  // Stopwatch interval
  useEffect(() => {
    let interval: any = null;
    if (workoutRunning) {
      interval = setInterval(() => {
        setWorkoutSessions((prev) => {
          const cur = prev[selectedDate] || currentWorkout;
          return {
            ...prev,
            [selectedDate]: { ...cur, durationSec: (cur.durationSec || 0) + 1 }
          };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [workoutRunning, selectedDate, currentWorkout]);

  // Rest Timer countdown interval
  useEffect(() => {
    let interval: any = null;
    if (restTimer.active && restTimer.remainingSec > 0) {
      interval = setInterval(() => {
        setRestTimer((p) => {
          if (p.remainingSec <= 1) {
            if (p.soundEnabled) playTimerBeep();
            showToast('🔔 Rest break complete! Ready for next set.');
            return { ...p, active: false, remainingSec: 0 };
          }
          return { ...p, remainingSec: p.remainingSec - 1 };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [restTimer.active, restTimer.remainingSec, restTimer.soundEnabled]);

  const triggerRestTimer = (seconds: number, exerciseName: string) => {
    setRestTimer((p) => ({
      ...p,
      active: true,
      remainingSec: seconds,
      totalSec: seconds,
      exerciseName,
    }));
  };

  const adjustRestTimer = (deltaSec: number) => {
    setRestTimer((p) => ({
      ...p,
      remainingSec: Math.max(0, p.remainingSec + deltaSec),
      totalSec: Math.max(p.totalSec, p.remainingSec + deltaSec),
    }));
  };

  const skipRestTimer = () => {
    setRestTimer((p) => ({ ...p, active: false, remainingSec: 0 }));
    showToast('Rest timer skipped.');
  };

  // --- Biometrics & Calendar Metrics ---
  const dayOfWeekIndex = new Date(selectedDate + 'T12:00:00').getDay();
  const dayOfWeekName = DAYS_OF_WEEK[dayOfWeekIndex === 0 ? 6 : dayOfWeekIndex - 1] || 'Monday';
  const scheduledSplit = weeklySchedule[dayOfWeekName];
  const hasWorkoutToday = Boolean(scheduledSplit?.gymRoutineId && scheduledSplit.gymRoutineId !== 'rest');
  const scheduledRoutine = routines.find((r) => r.id === scheduledSplit?.gymRoutineId);

  const biometricMetrics = useMemo(() => {
    return calculateBiometrics(
      profile,
      selectedDate,
      hasWorkoutToday,
      scheduledRoutine?.estBurnKcal || 280
    );
  }, [profile, selectedDate, hasWorkoutToday, scheduledRoutine]);

  const changeDateByDays = (delta: number) => {
    const cur = new Date(selectedDate);
    cur.setDate(cur.getDate() + delta);
    setSelectedDate(cur.toISOString().split('T')[0]);
  };

  // Session Tonnage volume for HUD
  const workoutTonnage = useMemo(() => {
    let t = 0;
    currentWorkout.exercises.forEach((ex) => {
      ex.sets.forEach((s) => {
        if (s.completed) t += s.weight * s.reps;
      });
    });
    return Math.round(t);
  }, [currentWorkout]);

  // Aggregate consumed calories for AI coach
  const consumedStats = useMemo(() => {
    let cal = 0, p = 0, c = 0, f = 0;
    const slots = ['breakfast', 'lunch', 'dinner', 'snacks'] as const;
    slots.forEach((slot) => {
      currentDayNutritionLog.meals[slot]?.forEach((item) => {
        const m = item.multiplier || 1;
        cal += item.baseCal * m;
        p += item.baseP * m;
        c += item.baseC * m;
        f += item.baseF * m;
      });
    });
    return {
      cal: Math.round(cal),
      p: Math.round(p),
      c: Math.round(c),
      f: Math.round(f)
    };
  }, [currentDayNutritionLog]);

  // --- Nutrition Handlers ---
  const handleUpdateDayLog = (updater: (prev: DailyNutritionLog) => DailyNutritionLog) => {
    setDailyNutritionLogs((prev) => ({
      ...prev,
      [selectedDate]: updater(currentDayNutritionLog),
    }));
  };

  const handleApplyScheduledMeals = () => {
    const assigned = weeklySchedule[dayOfWeekName]?.meals;
    if (!assigned) return;

    handleUpdateDayLog((prev) => {
      const nextMeals = { ...prev.meals };
      (['breakfast', 'lunch', 'dinner'] as const).forEach((slot) => {
        const presetId = assigned[slot];
        if (presetId) {
          const foundPreset = setMeals.find((p) => p.id === presetId);
          if (foundPreset) {
            nextMeals[slot] = foundPreset.items.map((i) => ({
              id: `m_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
              name: i.name,
              amountLabel: i.unitLabel,
              multiplier: i.multiplier,
              baseCal: i.calories,
              baseP: i.protein,
              baseC: i.carbs,
              baseF: i.fat,
              photoUrl: foundPreset.photoUrl || createPresetSvgPhoto(foundPreset.photoType || 'chicken_rice')
            }));
          }
        }
      });
      return { ...prev, meals: nextMeals };
    });
    showToast(`✨ Loaded ${dayOfWeekName}'s assigned Set Meals!`);
  };

  const handleLogSingleFood = (
    food: FoodItem,
    mult: number,
    slot: 'breakfast' | 'lunch' | 'dinner' | 'snacks',
    photoUrl?: string | null
  ) => {
    const entry: DailyFoodEntry = {
      id: `m_${Date.now()}`,
      name: food.name,
      amountLabel: food.label,
      multiplier: mult,
      baseCal: food.calories,
      baseP: food.protein,
      baseC: food.carbs,
      baseF: food.fat,
      photoUrl: photoUrl || food.photoUrl || null,
    };

    handleUpdateDayLog((prev) => ({
      ...prev,
      meals: {
        ...prev.meals,
        [slot]: [...prev.meals[slot], entry],
      },
    }));
    showToast(`🍽️ Logged ${food.name} to ${slot}!`);
  };

  const handleLogSetMeal = (preset: SetMeal, targetSlot?: 'breakfast' | 'lunch' | 'dinner' | 'snacks') => {
    const slot = targetSlot || preset.defaultSlot || 'lunch';
    const entries: DailyFoodEntry[] = preset.items.map((i) => ({
      id: `m_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: i.name,
      amountLabel: i.unitLabel,
      multiplier: i.multiplier,
      baseCal: i.calories,
      baseP: i.protein,
      baseC: i.carbs,
      baseF: i.fat,
      photoUrl: preset.photoUrl || createPresetSvgPhoto(preset.photoType || 'chicken_rice'),
    }));

    handleUpdateDayLog((prev) => ({
      ...prev,
      meals: {
        ...prev.meals,
        [slot]: [...prev.meals[slot], ...entries],
      },
    }));
    showToast(`🍽️ Logged ${preset.name} to ${slot}!`);
  };

  // --- Gym Handlers ---
  const handleUpdateWorkout = (updater: (prev: WorkoutSession) => WorkoutSession) => {
    setWorkoutSessions((prev) => ({
      ...prev,
      [selectedDate]: updater(currentWorkout),
    }));
  };

  const handleSelectRoutine = (routineId: string) => {
    const found = routines.find((r) => r.id === routineId);
    if (!found) return;

    setWorkoutSessions((prev) => ({
      ...prev,
      [selectedDate]: {
        routineId: found.id,
        title: found.name,
        durationSec: 0,
        pumpPhotoUrl: null,
        exercises: found.exercises.map((re, idx) => {
          const vEx = exerciseVault.find((ex) => ex.id === re.exId) || exerciseVault[0];
          return {
            id: `we_${Date.now()}_${idx}`,
            exId: vEx.id,
            name: vEx.name,
            muscle: vEx.muscle,
            restSec: re.restSec,
            prevBest: vEx.prevBest,
            pr1RM: vEx.pr1RM,
            cue: vEx.cue,
            sets: Array.from({ length: re.targetSets }).map((_, sIdx) => ({
              id: `s_${Date.now()}_${idx}_${sIdx}`,
              type: 'Working',
              weight: parseFloat(vEx.prevBest) || 60,
              reps: 8,
              rpe: 8,
              completed: false,
            })),
          };
        }),
      },
    }));
    showToast(`🏋️ Switched session split to: ${found.name}`);
  };

  // --- PDF Import Callback Handler ---
  const handlePdfImportSuccess = (parsed: {
    routines: RoutineTemplate[];
    meals: SetMeal[];
    assignToSchedule: boolean;
  }) => {
    if (parsed.routines.length > 0) {
      setRoutines((prev) => [...prev, ...parsed.routines]);
    }
    if (parsed.meals.length > 0) {
      setSetMeals((prev) => [...prev, ...parsed.meals]);
    }

    if (parsed.assignToSchedule && (parsed.routines.length > 0 || parsed.meals.length > 0)) {
      setWeeklySchedule((prev) => {
        const next = { ...prev };
        DAYS_OF_WEEK.forEach((day, idx) => {
          if (parsed.routines[idx % parsed.routines.length]) {
            next[day] = {
              ...next[day],
              gymRoutineId: parsed.routines[idx % parsed.routines.length].id,
            };
          }
          if (parsed.meals.length > 0) {
            next[day] = {
              ...next[day],
              meals: {
                breakfast: parsed.meals[0]?.id || next[day]?.meals?.breakfast || '',
                lunch: parsed.meals[1 % parsed.meals.length]?.id || next[day]?.meals?.lunch || '',
                dinner: parsed.meals[2 % parsed.meals.length]?.id || next[day]?.meals?.dinner || '',
              },
            };
          }
        });
        return next;
      });
      showToast('🎉 Saved and assigned routines & meals across 7-Day Weekly Schedule!');
    } else {
      showToast('🎉 Saved routines & meals to vaults!');
    }
  };

  // --- Auth Handlers ---
  const handleAuthSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    if (user.name && user.name !== 'Guest Athlete') {
      setProfile((prev) => ({ ...prev, name: user.name }));
    }
    setShowAuthModal(false);
    showToast(`👋 Welcome back, ${user.name}!`);

    // When signed in: only show onboarding if user is an authenticated account and has not completed it.
    // Guests specifically clicked "Continue as Guest (Skip for Later)" and shouldn't be interrupted.
    if (!user.isGuest && !profile.hasCompletedOnboarding) {
      setShowOnboardingModal(true);
    } else {
      setShowOnboardingModal(false);
    }
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    StorageAdapter.saveLocal('auth_user', null);
    setShowAuthModal(true);
    setShowOnboardingModal(false);
    showToast('Logged out of account. Operating in local offline mode.');
  };

  // --- Onboarding Completion Handler ---
  const handleCompleteOnboarding = (
    updatedProfile: UserProfile,
    importedData?: {
      routines: RoutineTemplate[];
      meals: SetMeal[];
      assignToSchedule: boolean;
    }
  ) => {
    const finalizedProfile = {
      ...updatedProfile,
      hasCompletedOnboarding: true,
    };
    setProfile(finalizedProfile);
    StorageAdapter.saveLocal('profile', finalizedProfile);

    if (importedData) {
      if (importedData.routines.length > 0) {
        setRoutines((prev) => [...importedData.routines, ...prev]);
        handleSelectRoutine(importedData.routines[0].id);
      }
      if (importedData.meals.length > 0) {
        setSetMeals((prev) => [...importedData.meals, ...prev]);
      }
      if (importedData.assignToSchedule && (importedData.routines.length > 0 || importedData.meals.length > 0)) {
        setWeeklySchedule((prev) => {
          const next = { ...prev };
          DAYS_OF_WEEK.forEach((day, idx) => {
            if (importedData.routines[idx % importedData.routines.length]) {
              next[day] = {
                ...next[day],
                gymRoutineId: importedData.routines[idx % importedData.routines.length].id,
              };
            }
            if (importedData.meals.length > 0) {
              next[day] = {
                ...next[day],
                meals: {
                  breakfast: importedData.meals[0]?.id || next[day]?.meals?.breakfast || '',
                  lunch: importedData.meals[1 % importedData.meals.length]?.id || next[day]?.meals?.lunch || '',
                  dinner: importedData.meals[2 % importedData.meals.length]?.id || next[day]?.meals?.dinner || '',
                },
              };
            }
          });
          return next;
        });
      }
    }

    setShowOnboardingModal(false);
    showToast(`🚀 Welcome, ${finalizedProfile.name}! Profile calibrated & plan synced.`);
  };

  // --- InBody Scan Handler ---
  const handleApplyInBodyScan = (
    scan: InBodyScanRecord,
    updatedFields: Partial<UserProfile>
  ) => {
    setProfile((prev) => {
      const nextHistory = [
        ...prev.weightHistory,
        {
          id: `wh_${Date.now()}`,
          date: scan.date,
          weightKg: scan.weightKg,
          appliedKcal: biometricMetrics.effectiveTargetKcal,
          note: `InBody Scan: ${scan.bodyFatPercent ? scan.bodyFatPercent + '% BF' : ''} ${scan.skeletalMuscleMassKg ? '• ' + scan.skeletalMuscleMassKg + 'kg SMM' : ''} ${scan.inBodyScore ? '• Score: ' + scan.inBodyScore : ''}`.trim(),
          photoUrl: scan.photoUrl || null,
          bodyFatPercent: scan.bodyFatPercent,
          skeletalMuscleMassKg: scan.skeletalMuscleMassKg,
          bodyFatMassKg: scan.bodyFatMassKg,
          bmrKcal: scan.bmrKcal,
          visceralFatLevel: scan.visceralFatLevel,
          inBodyScore: scan.inBodyScore,
        },
      ];

      const nextInBodyScans = [scan, ...(prev.inBodyScans || [])];

      const updated: UserProfile = {
        ...prev,
        ...updatedFields,
        lastCheckInDate: scan.date,
        inBodyScans: nextInBodyScans,
        weightHistory: nextHistory,
      };

      StorageAdapter.saveLocal('profile', updated);
      return updated;
    });

    showToast(`🎉 InBody Scan verified & synced (${scan.weightKg}kg • ${scan.bodyFatPercent || '--'}% BF)!`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500/30 pb-28">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-20 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900/95 border border-emerald-500/50 text-white shadow-2xl shadow-emerald-500/10 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{toast}</span>
        </div>
      )}

      {/* Global Header */}
      <Header
        activeSide={activeSide}
        onSideChange={setActiveSide}
        selectedDate={selectedDate}
        onDateChange={changeDateByDays}
        onJumpToToday={handleJumpToToday}
        isToday={selectedDate === todayStr}
        profile={profile}
        biometricMetrics={biometricMetrics}
        restTimer={restTimer}
        onOpenBiometrics={() => {
          setActiveSide('nutrition');
          setNutritionTab('biometrics');
        }}
        onOpenPdfImport={() => setShowPdfImportModal(true)}
        onOpenInBodyImport={() => setShowInBodyModal(true)}
        onOpenAiDrawer={() => setShowAiDrawer(true)}
        onOpenBackup={() => setShowBackupModal(true)}
        currentUser={currentUser}
        onOpenAuth={() => setShowAuthModal(true)}
        onOpenOnboarding={() => setShowOnboardingModal(true)}
      />

      {/* Sub Navigation Bar */}
      <SubNav
        activeSide={activeSide}
        nutritionTab={nutritionTab}
        onNutritionTabChange={setNutritionTab}
        gymTab={gymTab}
        onGymTabChange={setGymTab}
        profile={profile}
        biometricMetrics={biometricMetrics}
      />

      {/* Main Workspace Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 pb-12 space-y-5">
        {/* Onboarding Invitation Banner if not completed */}
        {!profile.hasCompletedOnboarding && showSetupBanner && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-indigo-950/80 border border-emerald-500/40 flex items-center justify-between gap-3 text-xs shadow-lg shadow-emerald-950/30 animate-in fade-in duration-200">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 font-black flex items-center justify-center shrink-0">
                ⚡
              </span>
              <div>
                <span className="font-bold text-white">Athlete Profile Setup:</span>{' '}
                <span className="text-slate-300">
                  Calibrate your weight, height, BMR, and import/improve your workout plan with OCR.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setShowOnboardingModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition shadow-md shadow-emerald-500/20"
              >
                Start Setup
              </button>
              <button
                onClick={() => setShowSetupBanner(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                title="Dismiss banner"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
        {activeSide === 'nutrition' ? (
          <>
            {nutritionTab === 'tracker' && (
              <DailyMacroTracker
                currentDayLog={currentDayNutritionLog}
                onUpdateDayLog={handleUpdateDayLog}
                biometricMetrics={biometricMetrics}
                profile={profile}
                onUpdateProfile={setProfile}
                hasWorkoutToday={hasWorkoutToday}
                scheduledRoutineName={scheduledRoutine?.name}
                onApplyScheduledMeals={handleApplyScheduledMeals}
                onOpenAddFoodModal={(slot) => {
                  setAddFoodSlot(slot);
                  setShowAddFoodModal(true);
                }}
                onOpenLightbox={(url, title) => setLightboxPhoto({ url, title })}
                onShowToast={showToast}
              />
            )}

            {nutritionTab === 'planner' && (
              <MealStudioPlanner
                foodVault={foodVault}
                setMeals={setMeals}
                onUpdateSetMeals={setSetMeals}
                weeklySchedule={weeklySchedule}
                onUpdateWeeklySchedule={setWeeklySchedule}
                routines={routines}
                onLogSetMealNow={(preset) => handleLogSetMeal(preset)}
                onShowToast={showToast}
              />
            )}

            {nutritionTab === 'vault' && (
              <FoodVaultView
                foodVault={foodVault}
                onUpdateFoodVault={setFoodVault}
                onLogFoodToToday={(food) => handleLogSingleFood(food, 1, 'lunch')}
                onShowToast={showToast}
              />
            )}

            {nutritionTab === 'biometrics' && (
              <BiometricsView
                profile={profile}
                onUpdateProfile={setProfile}
                biometricMetrics={biometricMetrics}
                selectedDate={selectedDate}
                onOpenLightbox={(url, title) => setLightboxPhoto({ url, title })}
                onShowToast={showToast}
                onOpenInBodyScan={() => setShowInBodyModal(true)}
              />
            )}
          </>
        ) : (
          <>
            {gymTab === 'workout' && (
              <ActiveWorkoutRecorder
                currentWorkout={currentWorkout}
                onUpdateWorkout={handleUpdateWorkout}
                workoutRunning={workoutRunning}
                onToggleStopwatch={() => setWorkoutRunning(!workoutRunning)}
                routines={routines}
                exerciseVault={exerciseVault}
                onSelectRoutine={handleSelectRoutine}
                restTimer={restTimer}
                onSetRestTimer={setRestTimer}
                onTriggerRestTimer={triggerRestTimer}
                onOpenExerciseVideo={(ex) => setActiveVideoExercise(ex)}
                onShowToast={showToast}
                estBurnKcal={biometricMetrics.gymBonusKcal || scheduledRoutine?.estBurnKcal || 280}
              />
            )}

            {gymTab === 'routines' && (
              <RoutineSplitBuilder
                routines={routines}
                onUpdateRoutines={setRoutines}
                weeklySchedule={weeklySchedule}
                onUpdateWeeklySchedule={setWeeklySchedule}
                exerciseVault={exerciseVault}
                onLoadRoutineToToday={(rt) => handleSelectRoutine(rt.id)}
                onShowToast={showToast}
              />
            )}

            {gymTab === 'analytics' && (
              <StrengthAnalyticsVault
                exerciseVault={exerciseVault}
                workoutSessions={workoutSessions}
                onOpenExerciseVideo={(ex) => setActiveVideoExercise(ex)}
                onAddCustomExercise={(item) => setExerciseVault((prev) => [item, ...prev])}
                onShowToast={showToast}
              />
            )}
          </>
        )}
      </main>

      {/* Persistent Floating Rest Timer & Workout HUD */}
      <RestTimerHUD
        activeSide={activeSide}
        gymTab={gymTab}
        onSideChange={setActiveSide}
        restTimer={restTimer}
        onAdjustTimer={adjustRestTimer}
        onSkipTimer={skipRestTimer}
        workoutRunning={workoutRunning}
        currentWorkout={currentWorkout}
        workoutTonnage={workoutTonnage}
      />

      {/* Universal PDF Plan Importer & OCR Staging Modal */}
      {showPdfImportModal && (
        <PdfImportModal
          onClose={() => setShowPdfImportModal(false)}
          onImportSuccess={handlePdfImportSuccess}
          onShowToast={showToast}
        />
      )}

      {/* InBody Body Composition OCR Importer Modal */}
      {showInBodyModal && (
        <InBodyImportModal
          isOpen={showInBodyModal}
          onClose={() => setShowInBodyModal(false)}
          onApplyInBodyScan={handleApplyInBodyScan}
          profile={profile}
          onShowToast={showToast}
        />
      )}

      {/* Biometrics & Adaptive Weight Check-In Modal */}
      {showBiometricsModal && (
        <BiometricsModal
          onClose={() => setShowBiometricsModal(false)}
          profile={profile}
          onUpdateProfile={setProfile}
          biometricMetrics={biometricMetrics}
          selectedDate={selectedDate}
          onOpenLightbox={(url, title) => setLightboxPhoto({ url, title })}
          onShowToast={showToast}
        />
      )}

      {/* Quick Add Food / Set Meal Modal */}
      {showAddFoodModal && (
        <AddFoodModal
          initialSlot={addFoodSlot}
          onClose={() => setShowAddFoodModal(false)}
          foodVault={foodVault}
          setMeals={setMeals}
          onLogFood={(food, mult, slot, photo) => handleLogSingleFood(food, mult, slot, photo)}
          onLogSetMeal={(preset) => handleLogSetMeal(preset, addFoodSlot)}
        />
      )}

      {/* YouTube Form Demonstration & Biomechanical Cues Modal */}
      {activeVideoExercise && (
        <ExerciseVideoModal
          exercise={activeVideoExercise}
          onClose={() => setActiveVideoExercise(null)}
          onUpdateExerciseVideo={(id, url, videoId) => {
            setExerciseVault((prev) =>
              prev.map((e) =>
                e.id === id ? { ...e, customYoutubeUrl: url, youtubeVideoId: videoId } : e
              )
            );
            showToast('🎥 Updated custom YouTube demonstration link!');
          }}
        />
      )}

      {/* AI Performance Coach Drawer */}
      {showAiDrawer && (
        <AiCoachDrawer
          onClose={() => setShowAiDrawer(false)}
          profile={profile}
          biometricMetrics={biometricMetrics}
          selectedDate={selectedDate}
          consumedCalories={consumedStats.cal}
          consumedProtein={consumedStats.p}
          consumedCarbs={consumedStats.c}
          consumedFat={consumedStats.f}
          workoutTitle={currentWorkout.title}
          workoutTonnage={workoutTonnage}
          completedSets={currentWorkout.exercises.reduce(
            (acc, ex) => acc + ex.sets.filter((s) => s.completed).length,
            0
          )}
          prCount={currentWorkout.exercises.reduce(
            (acc, ex) =>
              acc +
              ex.sets.filter((s) => s.completed && s.weight * (1 + s.reps / 30) > (ex.pr1RM || 0)).length,
            0
          )}
          recommendedSetMeal={setMeals[2] || setMeals[0]}
          onLogRecommendedMeal={(meal) => handleLogSetMeal(meal, 'dinner')}
          onShowToast={showToast}
        />
      )}

      {/* Dual-Mode Storage & JSON Backup Modal */}
      {showBackupModal && (
        <BackupModal
          onClose={() => setShowBackupModal(false)}
          onExport={() => {
            StorageAdapter.exportBackupJson({
              profile,
              foodVault,
              setMeals,
              exerciseVault,
              routines,
              weeklySchedule,
              dailyNutritionLogs,
              workoutSessions,
            });
            showToast('💾 Exported JSON backup!');
          }}
          onImport={async (file) => {
            try {
              const data = await StorageAdapter.importBackupJson(file);
              if (data.profile) setProfile(data.profile);
              if (data.foodVault) setFoodVault(data.foodVault);
              if (data.setMeals) setSetMeals(data.setMeals);
              if (data.exerciseVault) setExerciseVault(data.exerciseVault);
              if (data.routines) setRoutines(data.routines);
              if (data.weeklySchedule) setWeeklySchedule(data.weeklySchedule);
              if (data.dailyNutritionLogs) setDailyNutritionLogs(data.dailyNutritionLogs);
              if (data.workoutSessions) setWorkoutSessions(data.workoutSessions);
              setShowBackupModal(false);
              showToast('✅ Imported backup successfully!');
            } catch (err: any) {
              showToast(`❌ Import error: ${err.message || 'Invalid format'}`);
            }
          }}
          onResetDatabase={() => {
            if (window.confirm('Reset application to built-in factory defaults?')) {
              localStorage.clear();
              window.location.reload();
            }
          }}
        />
      )}

      {/* Photo Lightbox Viewer */}
      {lightboxPhoto && (
        <PhotoLightboxModal
          photoUrl={lightboxPhoto.url}
          title={lightboxPhoto.title}
          onClose={() => setLightboxPhoto(null)}
        />
      )}

      {/* Auth Modal (Login / Sign Up) */}
      {showAuthModal && (
        <AuthModal
          currentUser={currentUser}
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={handleAuthSuccess}
          onSignOut={handleSignOut}
          onShowToast={showToast}
        />
      )}

      {/* Athlete Onboarding Questionnaire & OCR Plan Importer */}
      {showOnboardingModal && (
        <OnboardingModal
          initialProfile={profile}
          onCompleteOnboarding={handleCompleteOnboarding}
          onClose={() => setShowOnboardingModal(false)}
          onShowToast={showToast}
        />
      )}
    </div>
  );
}
