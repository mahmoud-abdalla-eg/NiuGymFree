import React, { useMemo } from 'react';
import {
  Play,
  Pause,
  Clock,
  Volume2,
  VolumeX,
  Trophy,
  Check,
  Video,
  Plus,
  Trash2,
  Dumbbell,
  Sparkles
} from 'lucide-react';
import {
  WorkoutSession,
  RoutineTemplate,
  ExerciseVaultItem,
  RestTimerState,
  SetType,
  WorkoutExercise
} from '../../types';
import { ProgressRing } from '../common/ProgressRing';

interface ActiveWorkoutRecorderProps {
  currentWorkout: WorkoutSession;
  onUpdateWorkout: (updater: (prev: WorkoutSession) => WorkoutSession) => void;
  workoutRunning: boolean;
  onToggleStopwatch: () => void;
  routines: RoutineTemplate[];
  exerciseVault: ExerciseVaultItem[];
  onSelectRoutine: (routineId: string) => void;
  restTimer: RestTimerState;
  onSetRestTimer: React.Dispatch<React.SetStateAction<RestTimerState>>;
  onTriggerRestTimer: (seconds: number, exerciseName: string) => void;
  onOpenExerciseVideo: (exercise: ExerciseVaultItem) => void;
  onShowToast: (msg: string) => void;
  estBurnKcal?: number;
}

export const ActiveWorkoutRecorder: React.FC<ActiveWorkoutRecorderProps> = ({
  currentWorkout,
  onUpdateWorkout,
  workoutRunning,
  onToggleStopwatch,
  routines,
  exerciseVault,
  onSelectRoutine,
  restTimer,
  onSetRestTimer,
  onTriggerRestTimer,
  onOpenExerciseVideo,
  onShowToast,
  estBurnKcal = 280,
}) => {
  // Aggregate session summary metrics
  const workoutSummary = useMemo(() => {
    let tonnageKg = 0;
    let completedSets = 0;
    let totalSets = 0;
    let prCount = 0;

    currentWorkout.exercises.forEach((ex) => {
      ex.sets.forEach((s) => {
        totalSets++;
        if (s.completed) {
          completedSets++;
          tonnageKg += s.weight * s.reps;
          const est1RM = s.weight * (1 + s.reps / 30);
          if (est1RM > (ex.pr1RM || 0) && s.reps > 0) {
            prCount++;
          }
        }
      });
    });

    return { tonnageKg: Math.round(tonnageKg), completedSets, totalSets, prCount };
  }, [currentWorkout]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const cycleSetType = (exIndex: number, sIndex: number) => {
    const cycle: SetType[] = ['Warmup', 'Working', 'Drop', 'Failure'];
    onUpdateWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex, eIdx) => {
        if (eIdx !== exIndex) return ex;
        return {
          ...ex,
          sets: ex.sets.map((s, idx) => {
            if (idx !== sIndex) return s;
            const currentIdx = cycle.indexOf(s.type);
            const nextType = cycle[(currentIdx + 1) % cycle.length];
            return { ...s, type: nextType };
          }),
        };
      }),
    }));
  };

  const updateSetField = (
    exIndex: number,
    sIndex: number,
    field: 'weight' | 'reps' | 'rpe',
    value: number
  ) => {
    onUpdateWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex, eIdx) => {
        if (eIdx !== exIndex) return ex;
        return {
          ...ex,
          sets: ex.sets.map((s, idx) => {
            if (idx !== sIndex) return s;
            return { ...s, [field]: value };
          }),
        };
      }),
    }));
  };

  const toggleSetCompleted = (exIndex: number, sIndex: number) => {
    const targetExercise = currentWorkout.exercises[exIndex];
    const targetSet = targetExercise.sets[sIndex];
    const willBeCompleted = !targetSet.completed;

    onUpdateWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex, eIdx) => {
        if (eIdx !== exIndex) return ex;
        return {
          ...ex,
          sets: ex.sets.map((s, idx) => {
            if (idx !== sIndex) return s;
            return { ...s, completed: willBeCompleted };
          }),
        };
      }),
    }));

    if (willBeCompleted) {
      onTriggerRestTimer(targetExercise.restSec || 90, targetExercise.name);
      onShowToast(`⏱️ Completed Set #${sIndex + 1}! Rest timer started.`);
    }
  };

  const addSetToExercise = (exIndex: number) => {
    onUpdateWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex, idx) => {
        if (idx !== exIndex) return ex;
        const lastSet = ex.sets[ex.sets.length - 1];
        const newSet = {
          id: `s_${Date.now()}_${ex.sets.length}`,
          type: (lastSet?.type || 'Working') as SetType,
          weight: lastSet?.weight || 60,
          reps: lastSet?.reps || 8,
          rpe: 8,
          completed: false,
        };
        return { ...ex, sets: [...ex.sets, newSet] };
      }),
    }));
    onShowToast('➕ Added new set');
  };

  const removeSetFromExercise = (exIndex: number, sIndex: number) => {
    onUpdateWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex, idx) => {
        if (idx !== exIndex) return ex;
        return { ...ex, sets: ex.sets.filter((_, sIdx) => sIdx !== sIndex) };
      }),
    }));
  };

  const addExerciseToSession = (vaultItem: ExerciseVaultItem) => {
    const newEx: WorkoutExercise = {
      id: `we_${Date.now()}_${currentWorkout.exercises.length}`,
      exId: vaultItem.id,
      name: vaultItem.name,
      muscle: vaultItem.muscle,
      restSec: vaultItem.defaultRest || 90,
      prevBest: vaultItem.prevBest || '70kg × 8',
      pr1RM: vaultItem.pr1RM || 85,
      cue: vaultItem.cue || 'Control the eccentric',
      sets: [
        { id: `s_${Date.now()}_0`, type: 'Working', weight: parseFloat(vaultItem.prevBest) || 60, reps: 8, rpe: 8, completed: false },
        { id: `s_${Date.now()}_1`, type: 'Working', weight: parseFloat(vaultItem.prevBest) || 60, reps: 8, rpe: 8, completed: false },
        { id: `s_${Date.now()}_2`, type: 'Working', weight: parseFloat(vaultItem.prevBest) || 60, reps: 8, rpe: 8, completed: false },
      ],
    };

    onUpdateWorkout((prev) => ({
      ...prev,
      exercises: [...prev.exercises, newEx],
    }));
    onShowToast(`🏋️ Added ${vaultItem.name} to session`);
  };

  return (
    <div className="space-y-6">
      {/* Top Session Telemetry & Break Time Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Session Telemetry & Stopwatch */}
        <div className="lg:col-span-8 bg-slate-900/90 rounded-2xl p-5 border border-violet-500/30 flex flex-col justify-between gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                Active Hypertrophy & Strength Recorder
              </span>
              <h2 className="text-lg font-extrabold text-white mt-1.5">{currentWorkout.title}</h2>
            </div>

            {/* Routine Switcher & Stopwatch */}
            <div className="flex items-center gap-2">
              <select
                value={currentWorkout.routineId}
                onChange={(e) => onSelectRoutine(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-200 outline-none"
              >
                {routines.map((r) => (
                  <option key={r.id} value={r.id}>
                    Switch Split: {r.name.split('(')[0]}
                  </option>
                ))}
              </select>

              <button
                onClick={onToggleStopwatch}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold transition ${
                  workoutRunning
                    ? 'bg-amber-500 text-slate-950 animate-pulse'
                    : 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/25'
                }`}
              >
                {workoutRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{formatTime(currentWorkout.durationSec)}</span>
              </button>
            </div>
          </div>

          {/* 4 Session KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="text-[11px] text-slate-400">Total Volume</div>
              <div className="text-lg font-extrabold text-cyan-400 mt-0.5">
                {workoutSummary.tonnageKg.toLocaleString()} kg
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="text-[11px] text-slate-400">Completed Sets</div>
              <div className="text-lg font-extrabold text-violet-400 mt-0.5">
                {workoutSummary.completedSets} / {workoutSummary.totalSets}
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="text-[11px] text-slate-400">1RM PRs Hit</div>
              <div className="text-lg font-extrabold text-amber-400 mt-0.5 flex items-center gap-1.5">
                <Trophy className="w-4 h-4" /> {workoutSummary.prCount} PRs
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="text-[11px] text-slate-400">Nutrition Sync Burn</div>
              <div className="text-lg font-extrabold text-emerald-400 mt-0.5">
                +{estBurnKcal} kcal
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Interactive Circular SVG Break Time / Rest Timer */}
        <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl p-5 border border-amber-500/30 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Break Time / Rest Timer
              </h3>
            </div>
            <button
              onClick={() => onSetRestTimer((p) => ({ ...p, soundEnabled: !p.soundEnabled }))}
              className="text-slate-400 hover:text-white"
              title="Toggle completion audio beep"
            >
              {restTimer.soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex items-center gap-4 my-2">
            <ProgressRing
              radius={48}
              stroke={7}
              progress={restTimer.totalSec > 0 ? (restTimer.remainingSec / restTimer.totalSec) * 100 : 0}
              strokeColor="#f59e0b"
            >
              <span className="text-base font-extrabold text-white">{formatTime(restTimer.remainingSec)}</span>
              <span className="text-[9px] text-amber-400 uppercase">{restTimer.active ? 'Resting' : 'Ready'}</span>
            </ProgressRing>

            <div className="flex-1 space-y-2">
              <div className="text-xs font-semibold text-slate-300 truncate">
                {restTimer.exerciseName}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[60, 90, 120, 180].map((sec) => (
                  <button
                    key={sec}
                    onClick={() =>
                      onSetRestTimer((p) => ({ ...p, active: true, remainingSec: sec, totalSec: sec }))
                    }
                    className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-[11px] font-bold text-slate-300 transition"
                  >
                    {sec}s
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onSetRestTimer((p) => ({ ...p, remainingSec: Math.max(0, p.remainingSec - 15) }))}
                  className="px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300"
                >
                  -15s
                </button>
                <button
                  onClick={() =>
                    onSetRestTimer((p) => ({
                      ...p,
                      remainingSec: p.remainingSec + 15,
                      totalSec: Math.max(p.totalSec, p.remainingSec + 15),
                    }))
                  }
                  className="px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300"
                >
                  +15s
                </button>
                <button
                  onClick={() => onSetRestTimer((p) => ({ ...p, active: false, remainingSec: 0 }))}
                  className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 text-[11px] font-bold"
                >
                  Skip
                </button>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-slate-400">
            💡 Checking off any set (<strong className="text-emerald-400">✓</strong>) automatically starts that exercise's break timer.
          </p>
        </div>
      </div>

      {/* Exercise Set-by-Set Cards */}
      <div className="space-y-4">
        {currentWorkout.exercises.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-violet-600/10 text-violet-400 border border-violet-500/20 flex items-center justify-center">
              <Dumbbell className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">No Workout Recorded for Today</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                Your session is ready to log. Add an exercise from the vault below, create a routine split, or import a plan with OCR!
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              {exerciseVault.slice(0, 4).map((vEx) => (
                <button
                  key={vEx.id}
                  onClick={() => addExerciseToSession(vEx)}
                  className="px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition shadow-md shadow-violet-600/20"
                >
                  + Add {vEx.name}
                </button>
              ))}
            </div>
          </div>
        ) : (
          currentWorkout.exercises.map((ex, exIndex) => {
          const vaultItem = exerciseVault.find((v) => v.id === ex.exId) || {
            id: ex.exId,
            name: ex.name,
            muscle: ex.muscle,
            equipment: 'Barbell',
            defaultRest: ex.restSec,
            prevBest: ex.prevBest,
            pr1RM: ex.pr1RM,
            cue: ex.cue,
            youtubeVideoId: 'vcBig73ojpE',
          };

          return (
            <div key={ex.id} className="bg-slate-900/90 rounded-2xl border border-slate-800/80 overflow-hidden shadow-lg">
              {/* Exercise Header */}
              <div className="p-4 bg-slate-950/60 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-extrabold text-white">{ex.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/30 font-bold">
                      {ex.muscle}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Prev Best: <strong className="text-slate-200">{ex.prevBest}</strong>
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">🎯 Cue: {ex.cue}</p>
                </div>

                <div className="flex items-center gap-2">
                  {/* YouTube Form Video Trigger */}
                  <button
                    onClick={() => onOpenExerciseVideo(vaultItem)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/40 text-violet-300 text-xs font-bold transition"
                    title="Watch High-Def Form Demonstration Video"
                  >
                    <Video className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Watch Form Video</span>
                  </button>

                  <span className="text-xs text-slate-400 hidden sm:inline">Break:</span>
                  <select
                    value={ex.restSec}
                    onChange={(e) => {
                      const newRest = Number(e.target.value);
                      onUpdateWorkout((s) => ({
                        ...s,
                        exercises: s.exercises.map((item, idx) =>
                          idx === exIndex ? { ...item, restSec: newRest } : item
                        ),
                      }));
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-amber-300 font-bold"
                  >
                    {[60, 75, 90, 120, 150, 180, 240].map((sec) => (
                      <option key={sec} value={sec}>
                        {sec}s rest
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => addSetToExercise(exIndex)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition"
                  >
                    + Add Set
                  </button>
                </div>
              </div>

              {/* Set-by-Set Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800/80 text-[10px] uppercase tracking-wider text-slate-400 bg-slate-950/30">
                      <th className="py-2.5 px-4">Set & Type</th>
                      <th className="py-2.5 px-3">Previous Ghost</th>
                      <th className="py-2.5 px-3">Weight (kg)</th>
                      <th className="py-2.5 px-3">Reps</th>
                      <th className="py-2.5 px-3">RPE</th>
                      <th className="py-2.5 px-3">Est. 1RM (Epley)</th>
                      <th className="py-2.5 px-4 text-right">Complete & Rest</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50 text-xs">
                    {ex.sets.map((s, sIndex) => {
                      const est1RM = Number((s.weight * (1 + s.reps / 30)).toFixed(1));
                      const isPR = est1RM > (ex.pr1RM || 0) && s.reps > 0;

                      return (
                        <tr
                          key={s.id}
                          className={`transition ${s.completed ? 'bg-emerald-500/10' : 'hover:bg-slate-800/30'}`}
                        >
                          <td className="py-2.5 px-4">
                            <button
                              onClick={() => cycleSetType(exIndex, sIndex)}
                              className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold transition ${
                                s.type === 'Warmup'
                                  ? 'bg-amber-500/20 text-amber-300'
                                  : s.type === 'Drop'
                                  ? 'bg-cyan-500/20 text-cyan-300'
                                  : s.type === 'Failure'
                                  ? 'bg-rose-500/20 text-rose-300'
                                  : 'bg-violet-500/20 text-violet-300'
                              }`}
                              title="Click to cycle Warmup / Working / Drop / Failure"
                            >
                              #{sIndex + 1} {s.type}
                            </button>
                          </td>
                          <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">
                            {ex.prevBest}
                          </td>
                          <td className="py-2.5 px-3">
                            <input
                              type="number"
                              step="0.5"
                              value={s.weight}
                              onChange={(e) => updateSetField(exIndex, sIndex, 'weight', Number(e.target.value))}
                              className="w-20 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-700 text-white font-bold text-center"
                            />
                          </td>
                          <td className="py-2.5 px-3">
                            <input
                              type="number"
                              value={s.reps}
                              onChange={(e) => updateSetField(exIndex, sIndex, 'reps', Number(e.target.value))}
                              className="w-16 px-2 py-1 rounded-lg bg-slate-950 border border-slate-700 text-white font-bold text-center"
                            />
                          </td>
                          <td className="py-2.5 px-3">
                            <input
                              type="number"
                              min="5"
                              max="10"
                              step="0.5"
                              value={s.rpe}
                              onChange={(e) => updateSetField(exIndex, sIndex, 'rpe', Number(e.target.value))}
                              className="w-16 px-2 py-1 rounded-lg bg-slate-950 border border-slate-700 text-slate-300 text-center"
                            />
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-200">{est1RM} kg</span>
                              {isPR && (
                                <span className="px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-extrabold flex items-center gap-0.5 animate-pulse">
                                  <Trophy className="w-3 h-3" /> PR
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-2.5 px-4 text-right">
                            <div className="inline-flex items-center gap-2">
                              <button
                                onClick={() => toggleSetCompleted(exIndex, sIndex)}
                                className={`px-3 py-1.5 rounded-xl font-extrabold text-xs transition inline-flex items-center gap-1 ${
                                  s.completed
                                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                                }`}
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>{s.completed ? 'Done' : 'Log Set'}</span>
                              </button>
                              <button
                                onClick={() => removeSetFromExercise(exIndex, sIndex)}
                                className="p-1 text-slate-600 hover:text-rose-400 transition"
                                title="Delete Set"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        }))}

        {/* Quick Add Exercise from Vault Bar */}
        <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-violet-400" />
            Add Exercise from Vault to Today's Session:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {exerciseVault.slice(0, 8).map((vEx) => (
              <button
                key={vEx.id}
                onClick={() => addExerciseToSession(vEx)}
                className="px-2.5 py-1.5 rounded-xl bg-slate-950 hover:bg-violet-600/20 border border-slate-800 hover:border-violet-500/40 text-xs text-slate-300 hover:text-violet-300 transition"
              >
                + {vEx.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
