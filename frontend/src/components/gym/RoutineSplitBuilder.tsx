import React, { useState } from 'react';
import { Calendar, Plus, Dumbbell, Trash2, CheckCircle2, Sparkles } from 'lucide-react';
import { RoutineTemplate, WeeklySchedule, ExerciseVaultItem } from '../../types';
import { DAYS_OF_WEEK } from '../../data/initialSchedule';
import { INITIAL_ROUTINES } from '../../data/initialRoutines';

interface RoutineSplitBuilderProps {
  routines: RoutineTemplate[];
  onUpdateRoutines: (routines: RoutineTemplate[]) => void;
  weeklySchedule: WeeklySchedule;
  onUpdateWeeklySchedule: (schedule: WeeklySchedule) => void;
  exerciseVault: ExerciseVaultItem[];
  onLoadRoutineToToday: (routine: RoutineTemplate) => void;
  onShowToast: (msg: string) => void;
}

export const RoutineSplitBuilder: React.FC<RoutineSplitBuilderProps> = ({
  routines,
  onUpdateRoutines,
  weeklySchedule,
  onUpdateWeeklySchedule,
  exerciseVault,
  onLoadRoutineToToday,
  onShowToast,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRoutineName, setNewRoutineName] = useState('');
  const [newBurnKcal, setNewBurnKcal] = useState(300);
  const [newDurationMin, setNewDurationMin] = useState(60);
  const [selectedExIds, setSelectedExIds] = useState<string[]>([]);

  const handleCreateRoutine = () => {
    if (!newRoutineName.trim() || selectedExIds.length === 0) {
      onShowToast('⚠️ Please specify a routine name and select at least 1 exercise');
      return;
    }

    const newTemplate: RoutineTemplate = {
      id: `rt_custom_${Date.now()}`,
      name: newRoutineName.trim(),
      estBurnKcal: Number(newBurnKcal) || 300,
      targetDurationMin: Number(newDurationMin) || 60,
      exercises: selectedExIds.map((exId) => {
        const found = exerciseVault.find((v) => v.id === exId);
        return {
          exId,
          targetSets: 3,
          repRange: '8-12',
          restSec: found?.defaultRest || 90,
        };
      }),
    };

    onUpdateRoutines([...routines, newTemplate]);
    setNewRoutineName('');
    setSelectedExIds([]);
    setShowCreateModal(false);
    onShowToast(`🏋️ Created new routine: ${newTemplate.name}!`);
  };

  const handleDeleteRoutine = (id: string) => {
    onUpdateRoutines(routines.filter((r) => r.id !== id));
    onShowToast('🗑️ Routine deleted');
  };

  const handleLoadStarterRoutines = () => {
    onUpdateRoutines(INITIAL_ROUTINES);
    onShowToast('🚀 Loaded 4 science-based starter splits (Push, Pull, Legs, Upper)!');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 6 Cols: 7-Day Gym Split Schedule */}
        <div className="lg:col-span-6 bg-slate-900/90 rounded-2xl p-5 border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-violet-400" />
                7-Day Gym Split Schedule (Mon–Sun)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Assigning a split here automatically updates your Training Day Calorie Bonus on the Nutrition Side.
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {DAYS_OF_WEEK.map((day) => {
              const currentId = weeklySchedule[day]?.gymRoutineId || 'rest';
              return (
                <div
                  key={day}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 hover:border-slate-700 transition"
                >
                  <span className="text-xs font-bold text-white w-28">{day}</span>
                  <select
                    value={currentId}
                    onChange={(e) =>
                      onUpdateWeeklySchedule({
                        ...weeklySchedule,
                        [day]: {
                          ...weeklySchedule[day],
                          gymRoutineId: e.target.value,
                        },
                      })
                    }
                    className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-violet-300 font-semibold outline-none focus:border-violet-500"
                  >
                    <option value="rest">🛋️ Rest & Active Recovery Day (+0 kcal)</option>
                    {routines.map((r) => (
                      <option key={r.id} value={r.id}>
                        🏋️ {r.name} (+{r.estBurnKcal} kcal)
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 6 Cols: Routines Templates Gallery & Builder */}
        <div className="lg:col-span-6 bg-slate-900/90 rounded-2xl p-5 border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Hypertrophy & Strength Routines</h2>
              <p className="text-xs text-slate-400 mt-0.5">Custom templates, target sets, reps & rest intervals.</p>
            </div>
            <button
              onClick={() => setShowCreateModal(!showCreateModal)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs transition shadow-md shadow-violet-600/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showCreateModal ? 'Cancel' : 'Create Routine'}</span>
            </button>
          </div>

          {/* Inline Create Routine Form */}
          {showCreateModal && (
            <div className="p-4 rounded-xl bg-slate-950 border border-violet-500/40 space-y-3 animate-in fade-in duration-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-violet-300">
                New Workout Routine Template
              </h3>
              <input
                type="text"
                placeholder="Routine Name (e.g. Upper Body Explosive)"
                value={newRoutineName}
                onChange={(e) => setNewRoutineName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-violet-500"
              />
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] text-slate-400">Est. Burn Kcal</label>
                  <input
                    type="number"
                    value={newBurnKcal}
                    onChange={(e) => setNewBurnKcal(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-center font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400">Target Duration (min)</label>
                  <input
                    type="number"
                    value={newDurationMin}
                    onChange={(e) => setNewDurationMin(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-center font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Select Exercises:</label>
                <div className="max-h-40 overflow-y-auto divide-y divide-slate-800 bg-slate-900 rounded-lg p-2 border border-slate-700 text-xs">
                  {exerciseVault.map((ex) => {
                    const isChecked = selectedExIds.includes(ex.id);
                    return (
                      <label key={ex.id} className="flex items-center justify-between py-1 px-1.5 cursor-pointer hover:bg-slate-800 rounded">
                        <span className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              setSelectedExIds((prev) =>
                                isChecked ? prev.filter((id) => id !== ex.id) : [...prev, ex.id]
                              );
                            }}
                            className="accent-violet-500"
                          />
                          <span>{ex.name}</span>
                        </span>
                        <span className="text-[10px] text-slate-500">{ex.muscle}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={handleCreateRoutine}
                className="w-full py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs transition"
              >
                Save Routine Template
              </button>
            </div>
          )}

          {/* Routine Cards List */}
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {routines.length === 0 ? (
              <div className="p-8 rounded-xl bg-slate-950 border border-dashed border-slate-800 text-center space-y-3">
                <Dumbbell className="w-8 h-8 text-slate-500 mx-auto" />
                <div>
                  <h3 className="text-sm font-bold text-white">No Workout Splits Created Yet</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    Build a custom routine using the form above, import your coach's PDF via OCR, or load our built-in evidence-based splits.
                  </p>
                </div>
                <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs transition shadow-md shadow-violet-600/20"
                  >
                    + Create Custom Split
                  </button>
                  <button
                    onClick={handleLoadStarterRoutines}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-violet-500/40 text-violet-300 hover:text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Load Starter PPL Splits</span>
                  </button>
                </div>
              </div>
            ) : (
              routines.map((rt) => (
                <div
                  key={rt.id}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 hover:border-slate-700 transition"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-violet-300">{rt.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-400">~{rt.estBurnKcal} kcal</span>
                      <button
                        onClick={() => onLoadRoutineToToday(rt)}
                        className="px-2.5 py-1 rounded-lg bg-violet-600/20 hover:bg-violet-600 text-violet-300 hover:text-white text-xs font-bold transition"
                      >
                        Load into Session
                      </button>
                      <button
                        onClick={() => handleDeleteRoutine(rt.id)}
                        className="p-1 text-slate-600 hover:text-rose-400 transition"
                        title="Delete routine"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-slate-400 space-y-1">
                    {rt.exercises.map((re, i) => {
                      const exObj = exerciseVault.find((e) => e.id === re.exId);
                      return (
                        <div key={i} className="flex justify-between py-0.5">
                          <span className="text-slate-300">• {exObj?.name || 'Custom Exercise'}</span>
                          <span className="text-slate-500 font-mono">
                            {re.targetSets} sets × {re.repRange} ({re.restSec}s rest)
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
