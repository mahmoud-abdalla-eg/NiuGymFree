import React, { useState } from 'react';
import { Layers, Plus, Sparkles, Trash2, Utensils, Check } from 'lucide-react';
import { FoodItem, SetMeal, WeeklySchedule, RoutineTemplate } from '../../types';
import { DAYS_OF_WEEK, INITIAL_SET_MEALS } from '../../data/initialSchedule';
import { createPresetSvgPhoto } from '../../lib/imageCompression';

interface MealStudioPlannerProps {
  foodVault: FoodItem[];
  setMeals: SetMeal[];
  onUpdateSetMeals: (meals: SetMeal[]) => void;
  weeklySchedule: WeeklySchedule;
  onUpdateWeeklySchedule: (sched: WeeklySchedule) => void;
  routines: RoutineTemplate[];
  onLogSetMealNow: (preset: SetMeal) => void;
  onShowToast: (msg: string) => void;
}

export const MealStudioPlanner: React.FC<MealStudioPlannerProps> = ({
  foodVault,
  setMeals,
  onUpdateSetMeals,
  weeklySchedule,
  onUpdateWeeklySchedule,
  routines,
  onLogSetMealNow,
  onShowToast,
}) => {
  const [newMeal, setNewMeal] = useState<{
    name: string;
    defaultSlot: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
    notes: string;
    photoType: string;
    selectedFoodIds: string[];
  }>({
    name: '',
    defaultSlot: 'lunch',
    notes: '',
    photoType: 'chicken_rice',
    selectedFoodIds: [],
  });

  const handleCreateSetMeal = () => {
    if (!newMeal.name.trim() || newMeal.selectedFoodIds.length === 0) {
      onShowToast('⚠️ Please provide a name and select at least one food');
      return;
    }

    const items = newMeal.selectedFoodIds.map((fid) => {
      const found = foodVault.find((f) => f.id === fid) || foodVault[0];
      return {
        foodId: found.id,
        name: found.name,
        multiplier: 1,
        unitLabel: found.label,
        calories: found.calories,
        protein: found.protein,
        carbs: found.carbs,
        fat: found.fat,
      };
    });

    const newPreset: SetMeal = {
      id: `preset_${Date.now()}`,
      name: newMeal.name.trim(),
      defaultSlot: newMeal.defaultSlot,
      notes: newMeal.notes || 'Custom balanced macro combo',
      photoType: newMeal.photoType,
      items,
    };

    onUpdateSetMeals([...setMeals, newPreset]);
    setNewMeal({
      name: '',
      defaultSlot: 'lunch',
      notes: '',
      photoType: 'chicken_rice',
      selectedFoodIds: [],
    });
    onShowToast('✨ Saved new Set Meal preset combo!');
  };

  const handleDeleteSetMeal = (id: string) => {
    onUpdateSetMeals(setMeals.filter((m) => m.id !== id));
    onShowToast('🗑️ Set Meal deleted');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left 5 Cols: Set Meal Combo Builder */}
      <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl p-5 border border-slate-800/80 space-y-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            Create Reusable "Set Meal" Combo
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Bundle multiple staple foods + prep notes into 1-click reusable combos.
          </p>
        </div>

        <div className="space-y-3">
          <input
            type="text"
            placeholder="Set Meal Name (e.g., Post-Workout Chicken & Jasmine Rice)"
            value={newMeal.name}
            onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-emerald-500 outline-none"
          />

          <div className="grid grid-cols-2 gap-2">
            <select
              value={newMeal.defaultSlot}
              onChange={(e) =>
                setNewMeal({ ...newMeal, defaultSlot: e.target.value as any })
              }
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
            >
              <option value="breakfast">Default: Breakfast</option>
              <option value="lunch">Default: Lunch</option>
              <option value="dinner">Default: Dinner</option>
              <option value="snacks">Default: Snacks</option>
            </select>

            <select
              value={newMeal.photoType}
              onChange={(e) => setNewMeal({ ...newMeal, photoType: e.target.value })}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
            >
              <option value="chicken_rice">Cover: Chicken & Rice Bowl</option>
              <option value="oats">Cover: Espresso & Oats</option>
              <option value="salmon">Cover: Salmon & Sweet Potato</option>
              <option value="generic_food">Cover: Clean Macro Bowl</option>
            </select>
          </div>

          <input
            type="text"
            placeholder="Prep note / timing (e.g., Cook in bulk on Sunday, high carb reload)"
            value={newMeal.notes}
            onChange={(e) => setNewMeal({ ...newMeal, notes: e.target.value })}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-emerald-500 outline-none"
          />

          <div className="text-xs font-semibold text-slate-300">Select Foods to Include:</div>
          <div className="max-h-52 overflow-y-auto divide-y divide-slate-800/60 bg-slate-950 rounded-xl border border-slate-800 p-2">
            {foodVault.map((f) => {
              const isChecked = newMeal.selectedFoodIds.includes(f.id);
              return (
                <label
                  key={f.id}
                  className="flex items-center justify-between py-1.5 px-2 text-xs cursor-pointer hover:bg-slate-900 rounded-lg transition"
                >
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {
                        setNewMeal((prev) => ({
                          ...prev,
                          selectedFoodIds: isChecked
                            ? prev.selectedFoodIds.filter((id) => id !== f.id)
                            : [...prev.selectedFoodIds, f.id],
                        }));
                      }}
                      className="accent-emerald-500 rounded"
                    />
                    <span>
                      {f.emoji} {f.name}
                    </span>
                  </span>
                  <span className="text-slate-400 font-mono">
                    {f.calories} kcal ({f.protein}g P)
                  </span>
                </label>
              );
            })}
          </div>

          <button
            onClick={handleCreateSetMeal}
            className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition shadow-md shadow-emerald-500/20"
          >
            Save Set Meal Preset
          </button>
        </div>

        {/* Saved Set Meals Gallery */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Saved Set Meals ({setMeals.length})
          </h3>
          <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
            {setMeals.length === 0 ? (
              <div className="p-6 rounded-xl bg-slate-950 border border-dashed border-slate-800 text-center space-y-2.5">
                <Utensils className="w-6 h-6 text-slate-500 mx-auto" />
                <div className="text-xs font-semibold text-slate-300">No Set Meals Saved Yet</div>
                <p className="text-[10px] text-slate-500 max-w-xs mx-auto">
                  Combine staple foods using the builder above, or load dialed-in starter meal combos.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onUpdateSetMeals(INITIAL_SET_MEALS);
                    onShowToast('⚡ Loaded starter Set Meal combos!');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold transition"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Load Starter Set Meals
                </button>
              </div>
            ) : (
              setMeals.map((preset) => {
              const totals = preset.items.reduce(
                (a, b) => ({
                  cal: a.cal + b.calories,
                  p: a.p + b.protein,
                  c: a.c + b.carbs,
                  f: a.f + b.fat,
                }),
                { cal: 0, p: 0, c: 0, f: 0 }
              );

              return (
                <div
                  key={preset.id}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3"
                >
                  <img
                    src={preset.photoUrl || createPresetSvgPhoto(preset.photoType || 'chicken_rice')}
                    alt={preset.name}
                    className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-800"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-white truncate">{preset.name}</div>
                    <div className="text-[11px] text-emerald-400 font-semibold">
                      {Math.round(totals.cal)} kcal • {Math.round(totals.p)}g P • {Math.round(totals.c)}g C • {Math.round(totals.f)}g F
                    </div>
                    <div className="text-[10px] text-slate-400 truncate mt-0.5">
                      {preset.items.map((i) => i.name).join(' + ')}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    <button
                      onClick={() => onLogSetMealNow(preset)}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold transition"
                    >
                      Log Now
                    </button>
                    <button
                      onClick={() => handleDeleteSetMeal(preset.id)}
                      className="p-1 text-slate-600 hover:text-rose-400 transition self-center"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            }))}
          </div>
        </div>
      </div>

      {/* Right 7 Cols: 7-Day Weekly Meal Assignment Matrix */}
      <div className="lg:col-span-7 bg-slate-900/90 rounded-2xl p-5 border border-slate-800/80 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white">7-Day Meal & Training Matrix (Mon–Sun)</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Assign Set Meals to any day of the week for seamless 1-click loading into your daily tracker.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {DAYS_OF_WEEK.map((day) => {
              const dayPlan = weeklySchedule[day] || { gymRoutineId: 'rest', meals: { breakfast: '', lunch: '', dinner: '' } };
              const routineName = routines.find((r) => r.id === dayPlan.gymRoutineId)?.name || 'Rest Day';

              return (
                <div
                  key={day}
                  className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="min-w-[120px]">
                    <div className="text-xs font-bold text-white">{day}</div>
                    <span className="text-[10px] font-semibold text-violet-400">
                      Gym: {routineName.split('(')[0]}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1">
                    {(['breakfast', 'lunch', 'dinner'] as const).map((slot) => (
                      <div key={slot}>
                        <label className="block text-[10px] uppercase font-bold text-slate-500 mb-0.5">
                          {slot}
                        </label>
                        <select
                          value={dayPlan.meals?.[slot] || ''}
                          onChange={(e) =>
                            onUpdateWeeklySchedule({
                              ...weeklySchedule,
                              [day]: {
                                ...dayPlan,
                                meals: { ...dayPlan.meals, [slot]: e.target.value },
                              },
                            })
                          }
                          className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-200 outline-none focus:border-emerald-500"
                        >
                          <option value="">-- Unassigned --</option>
                          {setMeals.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
          <Sparkles className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>
            Tip: From the <strong>Daily Macro Tracker</strong>, click "Auto-Load Today's Assigned Set Meals" to load all 3 meals in 1 click!
          </span>
        </div>
      </div>
    </div>
  );
};
