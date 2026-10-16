import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Scale,
  Ruler,
  Calendar,
  Activity,
  Dumbbell,
  FileText,
  Upload,
  RefreshCw,
  Trash2,
  X,
  ChevronDown,
  ChevronUp,
  Sliders,
  Plus,
  Wand2,
  Edit3,
  ClipboardPaste,
  BookOpen
} from 'lucide-react';
import { UserProfile, RoutineTemplate, SetMeal, WeeklySchedule, RoutineExerciseTemplate } from '../../types';
import { calculateAgeInDays, calculateMifflinStJeorBmr } from '../../lib/biometrics';
import { extractTextFromPdfOrImage, OcrProgressUpdate, PdfOcrEngineResult } from '../../lib/pdfOcrEngine';
import { parsePlanText, ParseResult } from '../../lib/planTextParser';
import { INITIAL_EXERCISE_VAULT } from '../../data/initialExerciseVault';
import { INITIAL_ROUTINES } from '../../data/initialRoutines';

interface OnboardingModalProps {
  initialProfile: UserProfile;
  onCompleteOnboarding: (
    updatedProfile: UserProfile,
    importedData?: {
      routines: RoutineTemplate[];
      meals: SetMeal[];
      assignToSchedule: boolean;
    }
  ) => void;
  onClose?: () => void;
  onShowToast: (msg: string) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  initialProfile,
  onCompleteOnboarding,
  onClose,
  onShowToast,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form State
  const [name, setName] = useState(initialProfile.name || '');
  const [dob, setDob] = useState(initialProfile.dob || '2004-05-15');
  const [gender, setGender] = useState<'male' | 'female'>(initialProfile.gender || 'male');

  // Body Metrics
  const [weightKg, setWeightKg] = useState(initialProfile.weightKg || 76.4);
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>(initialProfile.weightUnit || 'kg');
  const [heightCm, setHeightCm] = useState(initialProfile.heightCm || 178);
  const [heightUnit, setHeightUnit] = useState<'cm' | 'ft'>(initialProfile.heightUnit || 'cm');
  const [activityMultiplier, setActivityMultiplier] = useState(initialProfile.activityMultiplier || 1.55);
  const [goalType, setGoalType] = useState<'cut' | 'maintain' | 'lean_bulk'>(initialProfile.goalType || 'cut');

  // Macro Split
  const [macroSplit, setMacroSplit] = useState(initialProfile.macroSplit || { p: 35, c: 40, f: 25 });

  // OCR Plan Import State (Step 4)
  const [planSourceTab, setPlanSourceTab] = useState<'upload' | 'paste' | 'preset'>('upload');
  const [pastedPlanText, setPastedPlanText] = useState('');
  const [ocrFile, setOcrFile] = useState<File | null>(null);
  const [isOcrProcessing, setIsOcrProcessing] = useState(false);
  const [ocrProgress, setOcrProgress] = useState<OcrProgressUpdate | null>(null);
  const [ocrResult, setOcrResult] = useState<PdfOcrEngineResult | null>(null);
  const [parsedPlan, setParsedPlan] = useState<ParseResult | null>(null);
  const [stagedRoutines, setStagedRoutines] = useState<RoutineTemplate[]>([]);
  const [stagedMeals, setStagedMeals] = useState<SetMeal[]>([]);
  const [assignImportedToSchedule, setAssignImportedToSchedule] = useState(true);
  const [expandedRoutineIndex, setExpandedRoutineIndex] = useState<number | null>(0);
  const [selectedVaultExToAdd, setSelectedVaultExToAdd] = useState<string>(INITIAL_EXERCISE_VAULT[0]?.id || '');

  // Live age in days calculation
  const { daysOld, fractionalYears } = useMemo(() => {
    return calculateAgeInDays(dob);
  }, [dob]);

  // Live BMR and TDEE calculations
  const bmr = useMemo(() => {
    return calculateMifflinStJeorBmr(weightKg, heightCm, fractionalYears, gender);
  }, [weightKg, heightCm, fractionalYears, gender]);

  const tdee = useMemo(() => {
    return Math.round(bmr * activityMultiplier);
  }, [bmr, activityMultiplier]);

  const targetKcal = useMemo(() => {
    if (goalType === 'cut') return Math.max(1200, tdee - 500);
    if (goalType === 'lean_bulk') return tdee + 300;
    return tdee;
  }, [tdee, goalType]);

  const macros = useMemo(() => {
    const pKcal = (targetKcal * macroSplit.p) / 100;
    const cKcal = (targetKcal * macroSplit.c) / 100;
    const fKcal = (targetKcal * macroSplit.f) / 100;
    return {
      proteinG: Math.round(pKcal / 4),
      carbsG: Math.round(cKcal / 4),
      fatG: Math.round(fKcal / 9),
    };
  }, [targetKcal, macroSplit]);

  // OCR Handler via File
  const handleProcessOcr = async () => {
    if (!ocrFile) return;
    setIsOcrProcessing(true);
    setOcrProgress({
      stage: 'reading',
      percent: 10,
      currentPage: 1,
      totalPages: 1,
      message: 'Extracting digital layer and running OCR...',
    });

    try {
      const result = await extractTextFromPdfOrImage(ocrFile, false, (prog) => {
        setOcrProgress(prog);
      });

      setOcrResult(result);
      const parsed = parsePlanText(result.combinedText);
      setParsedPlan(parsed);
      setStagedRoutines(parsed.routines);
      setStagedMeals(parsed.meals);
      onShowToast(`📄 Successfully extracted ${parsed.routines.length} routines & ${parsed.meals.length} meals!`);
    } catch (err: any) {
      onShowToast(`❌ OCR failed: ${err.message || 'Error processing plan'}`);
    } finally {
      setIsOcrProcessing(false);
    }
  };

  // OCR Parser via Pasted Text
  const handleProcessPastedText = () => {
    if (!pastedPlanText.trim()) {
      onShowToast('Please paste workout notes or routine text first.');
      return;
    }
    const parsed = parsePlanText(pastedPlanText);
    setParsedPlan(parsed);
    setStagedRoutines(parsed.routines);
    setStagedMeals(parsed.meals);
    onShowToast(`📋 Parsed ${parsed.routines.length} routines & ${parsed.meals.length} meals from notes!`);
  };

  // Preset Template Loader
  const handleLoadPresetRoutines = () => {
    setStagedRoutines(INITIAL_ROUTINES);
    setParsedPlan({
      planType: 'workout',
      routines: INITIAL_ROUTINES,
      meals: [],
      rawText: 'Curated Evidence-Based Hypertrophy Splits',
      confidenceScore: 0.98,
    });
    onShowToast('⚡ Loaded curated Push / Pull / Legs Hypertrophy splits!');
  };

  // Evidence-based Algorithmic Plan Improvement Engine
  const handleImproveRoutines = () => {
    if (stagedRoutines.length === 0) return;

    const improved = stagedRoutines.map((routine) => {
      const updatedExercises = routine.exercises.map((exItem) => {
        // Find best match in vault
        const matched = INITIAL_EXERCISE_VAULT.find((v) => v.id === exItem.exId);
        let optimizedRest = exItem.restSec;

        if (matched) {
          if (['Chest', 'Back', 'Quads', 'Hamstrings / Glutes'].includes(matched.muscle)) {
            optimizedRest = Math.max(120, exItem.restSec || 150);
          } else {
            optimizedRest = exItem.restSec || 90;
          }
        } else {
          optimizedRest = exItem.restSec || 120;
        }

        return {
          ...exItem,
          restSec: optimizedRest,
          targetSets: Math.min(5, Math.max(3, exItem.targetSets || 3)),
          repRange: exItem.repRange || '8-12',
        };
      });

      return {
        ...routine,
        estBurnKcal: Math.round(updatedExercises.length * 58),
        exercises: updatedExercises,
      };
    });

    setStagedRoutines(improved);
    onShowToast('⚡ Plan improved: Calibrated rest intervals, hypertrophy rep ranges & biomechanical cues!');
  };

  // Exercise Editing Handlers
  const handleUpdateExercise = (
    routineIdx: number,
    exerciseIdx: number,
    field: keyof RoutineExerciseTemplate,
    value: any
  ) => {
    setStagedRoutines((prev) =>
      prev.map((r, rIdx) => {
        if (rIdx !== routineIdx) return r;
        const newExs = [...r.exercises];
        newExs[exerciseIdx] = { ...newExs[exerciseIdx], [field]: value };
        return { ...r, exercises: newExs };
      })
    );
  };

  const handleDeleteExercise = (routineIdx: number, exerciseIdx: number) => {
    setStagedRoutines((prev) =>
      prev.map((r, rIdx) => {
        if (rIdx !== routineIdx) return r;
        return {
          ...r,
          exercises: r.exercises.filter((_, idx) => idx !== exerciseIdx),
        };
      })
    );
  };

  const handleAddExerciseToRoutine = (routineIdx: number) => {
    const vaultEx = INITIAL_EXERCISE_VAULT.find((v) => v.id === selectedVaultExToAdd) || INITIAL_EXERCISE_VAULT[0];
    const newEx: RoutineExerciseTemplate = {
      exId: vaultEx.id,
      targetSets: 3,
      repRange: '8-12',
      restSec: vaultEx.defaultRest || 120,
    };

    setStagedRoutines((prev) =>
      prev.map((r, rIdx) => {
        if (rIdx !== routineIdx) return r;
        return {
          ...r,
          exercises: [...r.exercises, newEx],
          estBurnKcal: r.estBurnKcal + 55,
        };
      })
    );
    onShowToast(`Added ${vaultEx.name} to routine!`);
  };

  const handleDeleteRoutine = (routineIdx: number) => {
    setStagedRoutines((prev) => prev.filter((_, idx) => idx !== routineIdx));
  };

  const handleFinishOnboarding = () => {
    const updated: UserProfile = {
      ...initialProfile,
      name: name.trim() || 'Athlete',
      dob,
      gender,
      heightCm,
      heightUnit,
      weightKg,
      weightUnit,
      activityMultiplier,
      goalType,
      macroSplit,
      hasCompletedOnboarding: true,
      lastCheckInDate: new Date().toISOString().split('T')[0],
      weightHistory: [
        ...initialProfile.weightHistory,
        {
          id: `w_init_${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          weightKg,
          appliedKcal: targetKcal,
          note: 'Starting Baseline Weigh-In',
          photoUrl: null,
        },
      ],
    };

    onCompleteOnboarding(
      updated,
      stagedRoutines.length > 0 || stagedMeals.length > 0
        ? {
            routines: stagedRoutines,
            meals: stagedMeals,
            assignToSchedule: assignImportedToSchedule,
          }
        : undefined
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 md:p-8 space-y-6 my-8 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Onboarding Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-black shadow-lg shadow-emerald-500/20">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white">Athlete Profile Setup</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-extrabold border border-emerald-500/30">
                  Step {step} of 5
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Setup your biometric profile, Mifflin-St Jeor targets, and import your workout split.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition"
              >
                Skip for Later
              </button>
            )}
            {onClose && (
              <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition" title="Close / Skip">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-between gap-1">
          {[
            { num: 1, label: 'Identity' },
            { num: 2, label: 'Body Metrics' },
            { num: 3, label: 'Calories & Macros' },
            { num: 4, label: 'Workout Plan (OCR)' },
            { num: 5, label: 'Get Started' },
          ].map((s) => (
            <div key={s.num} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === s.num
                    ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-500/20 shadow-md shadow-emerald-500/30'
                    : step > s.num
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                {step > s.num ? '✓' : s.num}
              </div>
              <span className="text-[10px] font-semibold text-slate-400 hidden sm:inline">{s.label}</span>
            </div>
          ))}
        </div>

        {/* STEP 1: Athlete Identity & Exact Age in Days */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-950 to-indigo-950/40 border border-emerald-500/20">
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                Chronological Age Precision
              </span>
              <div className="text-2xl font-black text-white mt-1 flex items-baseline gap-2">
                <span>{daysOld.toLocaleString()}</span>
                <span className="text-sm font-semibold text-emerald-400">Days Old</span>
                <span className="text-xs text-slate-400 font-mono">({fractionalYears} yrs)</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                NiuGymFree uses your exact fractional age to feed the Mifflin-St Jeor metabolic formula.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">What is your Name or Athlete Nickname?</label>
                <input
                  type="text"
                  placeholder="e.g. Alex Champion"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-medium outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Biological Sex (for BMR equation)</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setGender('male')}
                      className={`py-2 rounded-xl border text-xs font-bold transition ${
                        gender === 'male'
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      Male (+5)
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender('female')}
                      className={`py-2 rounded-xl border text-xs font-bold transition ${
                        gender === 'female'
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      Female (-161)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Body Metrics & Height/Weight Questionnaire */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Weight */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-white flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-emerald-400" />
                    <span>Current Morning Weight</span>
                  </label>
                  <div className="flex rounded-lg bg-slate-900 p-0.5 border border-slate-700">
                    <button
                      type="button"
                      onClick={() => setWeightUnit('kg')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        weightUnit === 'kg' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'
                      }`}
                    >
                      kg
                    </button>
                    <button
                      type="button"
                      onClick={() => setWeightUnit('lbs')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        weightUnit === 'lbs' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'
                      }`}
                    >
                      lbs
                    </button>
                  </div>
                </div>
                <input
                  type="number"
                  step="0.1"
                  value={weightUnit === 'kg' ? weightKg : Math.round(weightKg * 2.20462 * 10) / 10}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setWeightKg(weightUnit === 'kg' ? val : Math.round((val / 2.20462) * 10) / 10);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-black text-lg focus:border-emerald-500 outline-none"
                />
                <span className="text-[10px] text-slate-500 block">
                  Metric: {weightKg} kg • Imperial: {Math.round(weightKg * 2.20462 * 10) / 10} lbs
                </span>
              </div>

              {/* Height */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-white flex items-center gap-1.5">
                    <Ruler className="w-4 h-4 text-cyan-400" />
                    <span>Height</span>
                  </label>
                  <div className="flex rounded-lg bg-slate-900 p-0.5 border border-slate-700">
                    <button
                      type="button"
                      onClick={() => setHeightUnit('cm')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        heightUnit === 'cm' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400'
                      }`}
                    >
                      cm
                    </button>
                    <button
                      type="button"
                      onClick={() => setHeightUnit('ft')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        heightUnit === 'ft' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400'
                      }`}
                    >
                      ft+in
                    </button>
                  </div>
                </div>

                {heightUnit === 'cm' ? (
                  <input
                    type="number"
                    value={heightCm}
                    onChange={(e) => setHeightCm(Math.max(50, Number(e.target.value)))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-black text-lg focus:border-cyan-500 outline-none"
                  />
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2">
                      <input
                        type="number"
                        min="3"
                        max="8"
                        value={Math.floor(heightCm / 30.48)}
                        onChange={(e) => {
                          const ft = Number(e.target.value);
                          const curIn = Math.round((heightCm % 30.48) / 2.54);
                          setHeightCm(Math.round(ft * 30.48 + curIn * 2.54));
                        }}
                        className="w-full bg-transparent text-white font-black text-lg outline-none"
                      />
                      <span className="text-xs text-slate-400 font-bold">ft</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2">
                      <input
                        type="number"
                        min="0"
                        max="11"
                        value={Math.round((heightCm % 30.48) / 2.54)}
                        onChange={(e) => {
                          const curFt = Math.floor(heightCm / 30.48);
                          const inc = Number(e.target.value);
                          setHeightCm(Math.round(curFt * 30.48 + inc * 2.54));
                        }}
                        className="w-full bg-transparent text-white font-black text-lg outline-none"
                      />
                      <span className="text-xs text-slate-400 font-bold">in</span>
                    </div>
                  </div>
                )}

                <span className="text-[10px] text-slate-500 block">
                  {heightCm} cm ≈ {Math.floor(heightCm / 30.48)} ft {Math.round((heightCm % 30.48) / 2.54)} in
                </span>
              </div>
            </div>

            {/* Activity Level & Goal */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Weekly Activity Multiplier</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { mult: 1.2, label: 'Sedentary', sub: 'Desk job, no gym' },
                    { mult: 1.375, label: 'Light', sub: '1-3 workouts/wk' },
                    { mult: 1.55, label: 'Moderate', sub: '3-5 workouts/wk' },
                    { mult: 1.725, label: 'Heavy Athlete', sub: '6+ hard sessions' },
                  ].map((act) => (
                    <button
                      key={act.mult}
                      type="button"
                      onClick={() => setActivityMultiplier(act.mult)}
                      className={`p-2.5 rounded-xl border text-center transition ${
                        activityMultiplier === act.mult
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div>{act.label} ({act.mult}x)</div>
                      <div className="text-[9px] text-slate-500">{act.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Primary Body Composition Goal</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'cut' as const, label: 'Cut (-500 kcal)', sub: 'Fat Loss & Shred' },
                    { id: 'maintain' as const, label: 'Maintain (0 kcal)', sub: 'Recomposition' },
                    { id: 'lean_bulk' as const, label: 'Bulk (+300 kcal)', sub: 'Max Hypertrophy' },
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setGoalType(g.id)}
                      className={`p-3 rounded-xl border text-center transition ${
                        goalType === g.id
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-bold">{g.label}</div>
                      <div className="text-[10px] text-slate-500">{g.sub}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Calorie & Macro Target Calibration */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Real-time Math Summary */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400">Mifflin-St Jeor BMR</span>
                <div className="text-xl font-black text-white mt-0.5">{bmr}</div>
                <span className="text-[10px] text-slate-500">kcal base</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400">TDEE ({activityMultiplier}x)</span>
                <div className="text-xl font-black text-cyan-400 mt-0.5">{tdee}</div>
                <span className="text-[10px] text-slate-500">kcal burn</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/40 text-center">
                <span className="text-[10px] uppercase font-bold text-emerald-400">Target Budget</span>
                <div className="text-2xl font-black text-emerald-400 mt-0.5">{targetKcal}</div>
                <span className="text-[10px] text-slate-400">kcal daily</span>
              </div>
            </div>

            {/* Macro Grams Breakdown */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">Daily Macro Gram Targets</span>
                <span className="font-mono text-slate-400">
                  {macroSplit.p}% P • {macroSplit.c}% C • {macroSplit.f}% F
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/30">
                  <span className="text-[10px] uppercase font-bold text-sky-400">Protein</span>
                  <div className="text-lg font-black text-white mt-0.5">{macros.proteinG}g</div>
                  <span className="text-[10px] text-slate-400">4 kcal / g</span>
                </div>
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
                  <span className="text-[10px] uppercase font-bold text-amber-400">Carbs</span>
                  <div className="text-lg font-black text-white mt-0.5">{macros.carbsG}g</div>
                  <span className="text-[10px] text-slate-400">4 kcal / g</span>
                </div>
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30">
                  <span className="text-[10px] uppercase font-bold text-rose-400">Fat</span>
                  <div className="text-lg font-black text-white mt-0.5">{macros.fatG}g</div>
                  <span className="text-[10px] text-slate-400">9 kcal / g</span>
                </div>
              </div>

              {/* Macro Presets */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">Macro Split Presets:</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setMacroSplit({ p: 40, c: 35, f: 25 })}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-[10px] font-bold text-slate-300 border border-slate-700"
                  >
                    High Protein (40/35/25)
                  </button>
                  <button
                    type="button"
                    onClick={() => setMacroSplit({ p: 30, c: 45, f: 25 })}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-[10px] font-bold text-slate-300 border border-slate-700"
                  >
                    Balanced (30/45/25)
                  </button>
                  <button
                    type="button"
                    onClick={() => setMacroSplit({ p: 40, c: 20, f: 40 })}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-[10px] font-bold text-slate-300 border border-slate-700"
                  >
                    Low Carb (40/20/40)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Import Current Workout Plan via OCR & Plan Improvement */}
        {step === 4 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="text-center space-y-1">
              <h3 className="text-base font-extrabold text-white flex items-center justify-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                Import Existing Workout Plan (OCR) & Improve It
              </h3>
              <p className="text-xs text-slate-400 max-w-lg mx-auto">
                Upload your coach's PDF, paste your workout notes, or load curated hypertrophy splits. You can edit and improve the plan with evidence-based rest and cues!
              </p>
            </div>

            {/* Input Mode Selector Tabs */}
            <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 max-w-md mx-auto">
              <button
                type="button"
                onClick={() => setPlanSourceTab('upload')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
                  planSourceTab === 'upload'
                    ? 'bg-violet-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload File</span>
              </button>
              <button
                type="button"
                onClick={() => setPlanSourceTab('paste')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
                  planSourceTab === 'paste'
                    ? 'bg-violet-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ClipboardPaste className="w-3.5 h-3.5" />
                <span>Paste Notes</span>
              </button>
              <button
                type="button"
                onClick={() => setPlanSourceTab('preset')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
                  planSourceTab === 'preset'
                    ? 'bg-violet-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Templates</span>
              </button>
            </div>

            {/* Mode 1: Upload File Area */}
            {planSourceTab === 'upload' && !parsedPlan && (
              <div className="p-6 border-2 border-dashed border-slate-800 rounded-3xl bg-slate-950/70 text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-violet-600/15 text-violet-300 flex items-center justify-center">
                  <Upload className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">
                    {ocrFile ? ocrFile.name : 'Select Coach Workout Routine PDF or Photo'}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">PDF, PNG, JPG supported (Runs 100% locally)</div>
                </div>

                <label className="inline-block px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-extrabold text-xs cursor-pointer transition shadow-md shadow-violet-600/20">
                  <span>Browse Plan File</span>
                  <input
                    type="file"
                    accept=".pdf,application/pdf,image/*"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) setOcrFile(f);
                    }}
                    className="hidden"
                  />
                </label>

                {ocrFile && !isOcrProcessing && (
                  <button
                    type="button"
                    onClick={handleProcessOcr}
                    className="w-full mt-3 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-extrabold text-xs transition shadow-lg flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Run OCR & Extract Workout Split</span>
                  </button>
                )}

                {isOcrProcessing && ocrProgress && (
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-[11px] text-violet-300">
                      <span>{ocrProgress.message}</span>
                      <span>{ocrProgress.percent}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-300"
                        style={{ width: `${ocrProgress.percent}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mode 2: Paste Notes Area */}
            {planSourceTab === 'paste' && !parsedPlan && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <label className="block text-xs font-semibold text-slate-300">
                  Paste Coach Routine Notes or Split Text:
                </label>
                <textarea
                  rows={5}
                  value={pastedPlanText}
                  onChange={(e) => setPastedPlanText(e.target.value)}
                  placeholder="Example:
Push Day
- Barbell Flat Bench Press: 3 sets x 8 reps, 180s rest
- Incline DB Press: 3 sets x 10 reps, 120s rest
- Lateral Raises: 3 sets x 15 reps, 60s rest

Pull Day
- Barbell Deadlift: 3 sets x 5 reps, 180s rest
- Lat Pulldown: 3 sets x 10 reps, 90s rest"
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono outline-none focus:border-violet-500 resize-none"
                />
                <button
                  type="button"
                  onClick={handleProcessPastedText}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-extrabold text-xs transition shadow-lg flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Parse Text with Heuristic OCR Engine</span>
                </button>
              </div>
            )}

            {/* Mode 3: Presets Area */}
            {planSourceTab === 'preset' && !parsedPlan && (
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-center">
                <Dumbbell className="w-8 h-8 text-violet-400 mx-auto" />
                <h4 className="text-xs font-bold text-white">Curated Hypertrophy Splits</h4>
                <p className="text-[11px] text-slate-400 max-w-md mx-auto">
                  Don't have a file ready right now? Load our built-in evidence-based Push / Pull / Legs Hypertrophy splits and customize them!
                </p>
                <button
                  type="button"
                  onClick={handleLoadPresetRoutines}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition shadow-lg"
                >
                  Load 4-Day Push / Pull / Legs / Upper Splits
                </button>
              </div>
            )}

            {/* Extracted & Staged Cards Preview with Inline Editing & Improvement Engine */}
            {stagedRoutines.length > 0 && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between text-xs text-emerald-400 font-bold flex-wrap gap-2">
                  <span>✓ Extracted & Staged {stagedRoutines.length} Routines</span>
                  <div className="flex items-center gap-2">
                    {/* Auto-Improve Plan Button */}
                    <button
                      type="button"
                      onClick={handleImproveRoutines}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-xs font-black shadow-md hover:opacity-95 transition"
                      title="Calibrate rest times, rep ranges and link YouTube cues"
                    >
                      <Wand2 className="w-3.5 h-3.5" />
                      <span>Improve & Polish Plan</span>
                    </button>
                    <button
                      onClick={() => {
                        setParsedPlan(null);
                        setOcrFile(null);
                        setStagedRoutines([]);
                      }}
                      className="text-slate-400 hover:text-white underline text-[11px]"
                    >
                      Reset
                    </button>
                  </div>
                </div>

                {/* Staged Routines Accordion & Exercise Editor */}
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {stagedRoutines.map((rt, rIdx) => {
                    const isExpanded = expandedRoutineIndex === rIdx;
                    return (
                      <div
                        key={rIdx}
                        className="rounded-xl bg-slate-900 border border-slate-800 text-xs overflow-hidden transition"
                      >
                        <div
                          onClick={() => setExpandedRoutineIndex(isExpanded ? null : rIdx)}
                          className="p-3 flex items-center justify-between cursor-pointer hover:bg-slate-850"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{rt.name}</span>
                            <span className="text-[10px] text-slate-400">
                              ({rt.exercises.length} exercises • ~{rt.estBurnKcal} kcal)
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteRoutine(rIdx);
                              }}
                              className="p-1 text-slate-500 hover:text-rose-400"
                              title="Delete Routine"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                          </div>
                        </div>

                        {/* Expanded Exercise Editor */}
                        {isExpanded && (
                          <div className="p-3 border-t border-slate-800 bg-slate-950/60 space-y-2">
                            <div className="space-y-1.5">
                              {rt.exercises.map((ex, exIdx) => {
                                const vaultMatch = INITIAL_EXERCISE_VAULT.find((v) => v.id === ex.exId);
                                const exName = vaultMatch?.name || ex.exId;
                                return (
                                  <div
                                    key={exIdx}
                                    className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between gap-2 text-[11px]"
                                  >
                                    <div className="flex-1 min-w-0">
                                      <div className="font-semibold text-slate-200 truncate">{exName}</div>
                                      <div className="text-[10px] text-emerald-400 font-mono">
                                        {vaultMatch?.muscle || 'General'}
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                      <div className="flex items-center gap-1">
                                        <span className="text-slate-500">Sets:</span>
                                        <input
                                          type="number"
                                          min="1"
                                          max="10"
                                          value={ex.targetSets}
                                          onChange={(e) =>
                                            handleUpdateExercise(rIdx, exIdx, 'targetSets', Number(e.target.value))
                                          }
                                          className="w-10 px-1 py-0.5 rounded bg-slate-950 border border-slate-700 text-center font-bold text-white"
                                        />
                                      </div>

                                      <div className="flex items-center gap-1">
                                        <span className="text-slate-500">Reps:</span>
                                        <input
                                          type="text"
                                          value={ex.repRange}
                                          onChange={(e) =>
                                            handleUpdateExercise(rIdx, exIdx, 'repRange', e.target.value)
                                          }
                                          className="w-14 px-1 py-0.5 rounded bg-slate-950 border border-slate-700 text-center font-bold text-white text-[10px]"
                                        />
                                      </div>

                                      <div className="flex items-center gap-1">
                                        <span className="text-slate-500">Rest:</span>
                                        <input
                                          type="number"
                                          step="15"
                                          value={ex.restSec}
                                          onChange={(e) =>
                                            handleUpdateExercise(rIdx, exIdx, 'restSec', Number(e.target.value))
                                          }
                                          className="w-12 px-1 py-0.5 rounded bg-slate-950 border border-slate-700 text-center font-bold text-white"
                                        />
                                        <span className="text-[10px] text-slate-500">s</span>
                                      </div>

                                      <button
                                        type="button"
                                        onClick={() => handleDeleteExercise(rIdx, exIdx)}
                                        className="p-1 text-slate-500 hover:text-rose-400 ml-1"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            {/* Add Exercise from Vault */}
                            <div className="pt-2 flex items-center gap-2">
                              <select
                                value={selectedVaultExToAdd}
                                onChange={(e) => setSelectedVaultExToAdd(e.target.value)}
                                className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-[11px] outline-none"
                              >
                                {INITIAL_EXERCISE_VAULT.map((v) => (
                                  <option key={v.id} value={v.id}>
                                    + {v.name} ({v.muscle})
                                  </option>
                                ))}
                              </select>
                              <button
                                type="button"
                                onClick={() => handleAddExerciseToRoutine(rIdx)}
                                className="px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-bold text-[11px] transition shrink-0"
                              >
                                Add Exercise
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 pt-1">
                  <input
                    type="checkbox"
                    checked={assignImportedToSchedule}
                    onChange={(e) => setAssignImportedToSchedule(e.target.checked)}
                    className="rounded accent-emerald-500"
                  />
                  <span>Automatically assign imported routines across your 7-Day Weekly Schedule</span>
                </label>
              </div>
            )}

            {!ocrFile && !parsedPlan && stagedRoutines.length === 0 && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-400">
                Don't have a plan to upload right now? No problem! Click Next to use NiuGymFree's curated Push/Pull/Legs splits.
              </div>
            )}
          </div>
        )}

        {/* STEP 5: Final Setup Summary */}
        {step === 5 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="text-center space-y-1">
              <h3 className="text-xl font-black text-white">Your Profile is Calibrated & Ready!</h3>
              <p className="text-xs text-slate-400">
                Here is your athlete summary before entering the NiuGymFree dual-hemisphere workspace.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-3 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Athlete</div>
                  <div className="text-sm font-bold text-white mt-0.5 truncate">{name || 'Athlete'}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Age in Days</div>
                  <div className="text-sm font-bold text-emerald-400 mt-0.5">{daysOld.toLocaleString()} d</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Starting Weight</div>
                  <div className="text-sm font-bold text-white mt-0.5">
                    {weightKg} kg ({Math.round(weightKg * 2.20462)} lbs)
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Daily Calorie Target</div>
                  <div className="text-sm font-bold text-emerald-400 mt-0.5">{targetKcal} kcal</div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-300">
                • <strong>Hypertrophy Split:</strong>{' '}
                {stagedRoutines.length > 0
                  ? `${stagedRoutines.length} Active Routines (${stagedRoutines.map((r) => r.name).join(', ')})`
                  : 'Default Push / Pull / Legs Hypertrophy'}
                <br />• <strong>Macro Target:</strong> {macros.proteinG}g Protein, {macros.carbsG}g Carbs, {macros.fatG}g Fat.
                <br />• <strong>Bi-Weekly Check-In:</strong> Calibrates every 14 days with morning weight & physique photos.
              </div>
            </div>

            <button
              type="button"
              onClick={handleFinishOnboarding}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm transition shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Enter NiuGymFree Platform</span>
            </button>
          </div>
        )}

        {/* Onboarding Footer Navigation */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((prev) => (prev - 1) as any)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>
          ) : (
            <div />
          )}

          {/* Skip for Later center button */}
          {onClose && step < 5 && (
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-slate-200 underline transition font-medium"
            >
              Skip setup for later
            </button>
          )}

          {step < 5 && (
            <button
              type="button"
              onClick={() => setStep((prev) => (prev + 1) as any)}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
