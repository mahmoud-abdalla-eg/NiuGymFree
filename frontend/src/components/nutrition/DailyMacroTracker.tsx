import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Plus,
  Minus,
  Trash2,
  Droplets,
  Sunrise,
  Sun,
  Sunset,
  Coffee,
  Camera,
  Activity,
  Zap
} from 'lucide-react';
import { DailyNutritionLog, DailyFoodEntry, UserProfile } from '../../types';
import { BiometricCalculations } from '../../lib/biometrics';
import { ProgressRing } from '../common/ProgressRing';
import { MacroDonutChart } from '../common/MacroDonut';
import { compressUploadedImage } from '../../lib/imageCompression';

interface DailyMacroTrackerProps {
  currentDayLog: DailyNutritionLog;
  onUpdateDayLog: (updater: (prev: DailyNutritionLog) => DailyNutritionLog) => void;
  biometricMetrics: BiometricCalculations;
  profile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  hasWorkoutToday: boolean;
  scheduledRoutineName?: string;
  onApplyScheduledMeals: () => void;
  onOpenAddFoodModal: (slot: 'breakfast' | 'lunch' | 'dinner' | 'snacks') => void;
  onOpenLightbox: (photoUrl: string, title: string) => void;
  onShowToast: (msg: string) => void;
}

export const DailyMacroTracker: React.FC<DailyMacroTrackerProps> = ({
  currentDayLog,
  onUpdateDayLog,
  biometricMetrics,
  profile,
  onUpdateProfile,
  hasWorkoutToday,
  scheduledRoutineName,
  onApplyScheduledMeals,
  onOpenAddFoodModal,
  onOpenLightbox,
  onShowToast,
}) => {
  const [selectedMealSlot, setSelectedMealSlot] = useState<'all' | 'breakfast' | 'lunch' | 'dinner' | 'snacks'>('all');

  // Aggregate consumed macros
  const consumedMacros = useMemo(() => {
    let calories = 0;
    let protein = 0;
    let carbs = 0;
    let fat = 0;

    const slots = ['breakfast', 'lunch', 'dinner', 'snacks'] as const;
    slots.forEach((slot) => {
      currentDayLog.meals[slot]?.forEach((item) => {
        const mult = item.multiplier || 1;
        calories += item.baseCal * mult;
        protein += item.baseP * mult;
        carbs += item.baseC * mult;
        fat += item.baseF * mult;
      });
    });

    return {
      calories: Math.round(calories),
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fat: Math.round(fat),
    };
  }, [currentDayLog]);

  const addWater = (deltaMl: number) => {
    onUpdateDayLog((prev) => ({
      ...prev,
      waterMl: Math.max(0, (prev.waterMl || 0) + deltaMl),
    }));
    onShowToast(`💧 Water updated: ${deltaMl > 0 ? '+' : ''}${deltaMl}ml`);
  };

  const updateItemMultiplier = (
    slot: 'breakfast' | 'lunch' | 'dinner' | 'snacks',
    itemId: string,
    delta: number
  ) => {
    onUpdateDayLog((prev) => ({
      ...prev,
      meals: {
        ...prev.meals,
        [slot]: prev.meals[slot].map((item) => {
          if (item.id === itemId) {
            const newMult = Math.max(0.1, parseFloat(((item.multiplier || 1) + delta).toFixed(2)));
            return { ...item, multiplier: newMult };
          }
          return item;
        }),
      },
    }));
  };

  const removeItem = (slot: 'breakfast' | 'lunch' | 'dinner' | 'snacks', itemId: string) => {
    onUpdateDayLog((prev) => ({
      ...prev,
      meals: {
        ...prev.meals,
        [slot]: prev.meals[slot].filter((item) => item.id !== itemId),
      },
    }));
    onShowToast('🗑️ Food removed');
  };

  const handleAttachMealPhoto = async (
    slot: 'breakfast' | 'lunch' | 'dinner' | 'snacks',
    itemId: string,
    file: File
  ) => {
    try {
      const compressedDataUrl = await compressUploadedImage(file, 640, 0.75);
      onUpdateDayLog((prev) => ({
        ...prev,
        meals: {
          ...prev.meals,
          [slot]: prev.meals[slot].map((item) =>
            item.id === itemId ? { ...item, photoUrl: compressedDataUrl } : item
          ),
        },
      }));
      onShowToast('📸 Meal photo attached (compressed WebP)!');
    } catch {
      onShowToast('❌ Failed to process image');
    }
  };

  const mealSlots = [
    { key: 'breakfast' as const, title: 'Breakfast', icon: Sunrise, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { key: 'lunch' as const, title: 'Lunch', icon: Sun, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { key: 'dinner' as const, title: 'Dinner', icon: Sunset, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { key: 'snacks' as const, title: 'Snacks & Specialty Drinks', icon: Coffee, color: 'text-rose-400', bg: 'bg-rose-500/10' }
  ];

  return (
    <div className="space-y-6">
      {/* Cross-Side Gym-to-Nutrition Sync Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/30 to-slate-900 rounded-2xl p-4 border border-emerald-500/25 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold text-sm">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">
                Hemisphere Training-Day Calorie Sync
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                {hasWorkoutToday ? 'Workout Scheduled / Active' : 'Rest Day'}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {hasWorkoutToday ? (
                <>
                  Today matches routine <strong className="text-white">{scheduledRoutineName || 'Push / Pull / Legs'}</strong>.
                  Caloric target auto-adjusted with <strong className="text-emerald-400">+{biometricMetrics.gymBonusKcal} kcal</strong> training allowance.
                </>
              ) : (
                'Rest day active. Baseline Mifflin-St Jeor target calibrated for recovery and fat loss.'
              )}
            </p>
          </div>
        </div>

        <label className="flex items-center gap-2.5 cursor-pointer bg-slate-950/80 px-3.5 py-2 rounded-xl border border-slate-800 text-xs">
          <input
            type="checkbox"
            checked={profile.includeGymBonusKcal}
            onChange={(e) =>
              onUpdateProfile({ ...profile, includeGymBonusKcal: e.target.checked })
            }
            className="w-4 h-4 rounded text-emerald-500 focus:ring-0 bg-slate-900 border-slate-700"
          />
          <span className="text-slate-300 font-medium">Auto-Sync Training Day Calorie Bonus</span>
        </label>
      </div>

      {/* TOP BENTO ANALYTICS: 4 Rings + Macro Donut + Hydration */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: 4 SVG Circular Progress Rings */}
        <div className="lg:col-span-7 bg-slate-900/90 rounded-2xl p-5 border border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Daily Nutrition Analytics
              </span>
              <h2 className="text-base font-extrabold text-white">Macro Budget vs. Consumed</h2>
            </div>
            <div className="text-right text-xs">
              <span className="text-slate-400">Target Budget: </span>
              <strong className="text-emerald-400 font-bold">{biometricMetrics.effectiveTargetKcal} kcal</strong>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Calories Ring */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col items-center">
              <ProgressRing
                progress={(consumedMacros.calories / biometricMetrics.effectiveTargetKcal) * 100}
                strokeColor="#10b981"
              >
                <span className="text-sm font-extrabold text-white">{consumedMacros.calories}</span>
                <span className="text-[10px] text-slate-400">/ {biometricMetrics.effectiveTargetKcal}</span>
              </ProgressRing>
              <span className="mt-2 text-xs font-bold text-emerald-400">Calories</span>
              <span className="text-[11px] text-slate-400">
                {biometricMetrics.effectiveTargetKcal - consumedMacros.calories >= 0
                  ? `${biometricMetrics.effectiveTargetKcal - consumedMacros.calories} left`
                  : `${Math.abs(biometricMetrics.effectiveTargetKcal - consumedMacros.calories)} over`}
              </span>
            </div>

            {/* Protein Ring */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col items-center">
              <ProgressRing
                progress={(consumedMacros.protein / biometricMetrics.macros.proteinGrams) * 100}
                strokeColor="#0ea5e9"
              >
                <span className="text-sm font-extrabold text-white">{consumedMacros.protein}g</span>
                <span className="text-[10px] text-slate-400">/ {biometricMetrics.macros.proteinGrams}g</span>
              </ProgressRing>
              <span className="mt-2 text-xs font-bold text-sky-400">Protein</span>
              <span className="text-[11px] text-slate-400">
                {Math.max(0, biometricMetrics.macros.proteinGrams - consumedMacros.protein)}g to go
              </span>
            </div>

            {/* Carbs Ring */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col items-center">
              <ProgressRing
                progress={(consumedMacros.carbs / biometricMetrics.macros.carbsGrams) * 100}
                strokeColor="#f59e0b"
              >
                <span className="text-sm font-extrabold text-white">{consumedMacros.carbs}g</span>
                <span className="text-[10px] text-slate-400">/ {biometricMetrics.macros.carbsGrams}g</span>
              </ProgressRing>
              <span className="mt-2 text-xs font-bold text-amber-400">Carbs</span>
              <span className="text-[11px] text-slate-400">
                {Math.max(0, biometricMetrics.macros.carbsGrams - consumedMacros.carbs)}g to go
              </span>
            </div>

            {/* Fat Ring */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col items-center">
              <ProgressRing
                progress={(consumedMacros.fat / biometricMetrics.macros.fatGrams) * 100}
                strokeColor="#f43f5e"
              >
                <span className="text-sm font-extrabold text-white">{consumedMacros.fat}g</span>
                <span className="text-[10px] text-slate-400">/ {biometricMetrics.macros.fatGrams}g</span>
              </ProgressRing>
              <span className="mt-2 text-xs font-bold text-rose-400">Dietary Fat</span>
              <span className="text-[11px] text-slate-400">
                {Math.max(0, biometricMetrics.macros.fatGrams - consumedMacros.fat)}g to go
              </span>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Donut Breakdown + Hydration Tracker */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
          <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Consumed Caloric Split
            </h3>
            <MacroDonutChart
              proteinG={consumedMacros.protein}
              carbsG={consumedMacros.carbs}
              fatG={consumedMacros.fat}
              totalKcal={consumedMacros.calories}
            />
          </div>

          <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/15 text-sky-400 flex items-center justify-center">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">
                  Hydration: {currentDayLog.waterMl || 0} / 3,000 ml
                </div>
                <div className="w-36 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1.5">
                  <div
                    className="h-full bg-sky-400 transition-all duration-300"
                    style={{ width: `${Math.min(100, ((currentDayLog.waterMl || 0) / 3000) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => addWater(250)}
                className="px-2.5 py-1.5 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 text-xs font-bold transition"
              >
                +250ml
              </button>
              <button
                onClick={() => addWater(500)}
                className="px-2.5 py-1.5 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 text-xs font-bold transition"
              >
                +500ml
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Segmented Meal Slot Filter Tabs & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900 border border-slate-800 overflow-x-auto no-scrollbar">
          {[
            { key: 'all' as const, label: 'All Meals', count: Object.values(currentDayLog.meals).flat().length },
            { key: 'breakfast' as const, label: 'Breakfast', count: currentDayLog.meals.breakfast?.length || 0 },
            { key: 'lunch' as const, label: 'Lunch', count: currentDayLog.meals.lunch?.length || 0 },
            { key: 'dinner' as const, label: 'Dinner', count: currentDayLog.meals.dinner?.length || 0 },
            { key: 'snacks' as const, label: 'Snacks', count: currentDayLog.meals.snacks?.length || 0 },
          ].map((tab) => {
            const active = selectedMealSlot === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setSelectedMealSlot(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  active
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      active ? 'bg-slate-950 text-emerald-300' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onApplyScheduledMeals}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition"
            title="Load scheduled preset meals"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Auto-Load Schedule</span>
          </button>
          <button
            onClick={() => onOpenAddFoodModal(selectedMealSlot === 'all' ? 'lunch' : selectedMealSlot)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold transition shadow-md shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Food</span>
          </button>
        </div>
      </div>

      {/* Categorized Meal Slots (Filtered or All) */}
      <div className={selectedMealSlot === 'all' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-4'}>
        {mealSlots
          .filter((slot) => selectedMealSlot === 'all' || slot.key === selectedMealSlot)
          .map((slot) => {
          const Icon = slot.icon;
          const items = currentDayLog.meals[slot.key] || [];
          const slotCalories = items.reduce((acc, i) => acc + i.baseCal * (i.multiplier || 1), 0);
          const slotProtein = items.reduce((acc, i) => acc + i.baseP * (i.multiplier || 1), 0);
          const slotCarbs = items.reduce((acc, i) => acc + i.baseC * (i.multiplier || 1), 0);
          const slotFat = items.reduce((acc, i) => acc + i.baseF * (i.multiplier || 1), 0);

          return (
            <div
              key={slot.key}
              className="bg-slate-900/90 rounded-2xl border border-slate-800/80 p-4 flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-xl ${slot.bg} ${slot.color} flex items-center justify-center`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{slot.title}</h3>
                    <div className="text-[11px] text-slate-400">
                      {Math.round(slotCalories)} kcal • {Math.round(slotProtein)}g P • {Math.round(slotCarbs)}g C • {Math.round(slotFat)}g F
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onOpenAddFoodModal(slot.key)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                  title={`Add food to ${slot.title}`}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Items List */}
              <div className="space-y-2 flex-1 min-h-[60px]">
                {items.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-xs text-slate-500 py-4 border border-dashed border-slate-800 rounded-xl">
                    No items logged in {slot.title} yet.
                  </div>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between gap-2 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {item.photoUrl ? (
                          <img
                            src={item.photoUrl}
                            alt={item.name}
                            onClick={() => onOpenLightbox(item.photoUrl!, item.name)}
                            className="w-9 h-9 rounded-lg object-cover cursor-pointer hover:opacity-80 border border-slate-700 shrink-0"
                          />
                        ) : (
                          <label className="w-9 h-9 rounded-lg bg-slate-900 border border-dashed border-slate-700 flex items-center justify-center cursor-pointer hover:border-emerald-500 shrink-0 text-slate-400">
                            <Camera className="w-4 h-4" />
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) handleAttachMealPhoto(slot.key, item.id, f);
                              }}
                            />
                          </label>
                        )}
                        <div className="min-w-0">
                          <div className="font-semibold text-white truncate">{item.name}</div>
                          <div className="text-[10px] text-slate-400">
                            {Math.round(item.baseCal * (item.multiplier || 1))} kcal •{' '}
                            {Math.round(item.baseP * (item.multiplier || 1))}g P •{' '}
                            {Math.round(item.baseC * (item.multiplier || 1))}g C •{' '}
                            {Math.round(item.baseF * (item.multiplier || 1))}g F ({item.amountLabel})
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => updateItemMultiplier(slot.key, item.id, -0.25)}
                          className="p-1 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono font-bold text-emerald-400 w-9 text-center text-xs">
                          {item.multiplier || 1}x
                        </span>
                        <button
                          onClick={() => updateItemMultiplier(slot.key, item.id, 0.25)}
                          className="p-1 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => removeItem(slot.key, item.id)}
                          className="p-1 text-slate-500 hover:text-rose-400 transition ml-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
