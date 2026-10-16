import React, { useState } from 'react';
import { X, Search, Plus, Layers, Utensils } from 'lucide-react';
import { FoodItem, SetMeal } from '../../types';
import { createPresetSvgPhoto } from '../../lib/imageCompression';

interface AddFoodModalProps {
  initialSlot: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
  onClose: () => void;
  foodVault: FoodItem[];
  setMeals: SetMeal[];
  onLogFood: (food: FoodItem, multiplier: number, slot: 'breakfast' | 'lunch' | 'dinner' | 'snacks', photoUrl?: string | null) => void;
  onLogSetMeal: (preset: SetMeal) => void;
}

export const AddFoodModal: React.FC<AddFoodModalProps> = ({
  initialSlot,
  onClose,
  foodVault,
  setMeals,
  onLogFood,
  onLogSetMeal,
}) => {
  const [activeSlot, setActiveSlot] = useState(initialSlot);
  const [tab, setTab] = useState<'foods' | 'presets'>('foods');
  const [search, setSearch] = useState('');
  const [multiplier, setMultiplier] = useState(1);

  const filteredFoods = foodVault.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredPresets = setMeals.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-extrabold text-white">
              Add Food or Set Meal
            </h3>
            <div className="flex items-center gap-1.5 mt-1">
              {(['breakfast', 'lunch', 'dinner', 'snacks'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setActiveSlot(s)}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase transition ${
                    activeSlot === s
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher: Individual Food vs Set Meals */}
        <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
          <button
            onClick={() => setTab('foods')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
              tab === 'foods'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Staple Foods ({foodVault.length})
          </button>
          <button
            onClick={() => setTab('presets')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
              tab === 'presets'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Set Meal Combos ({setMeals.length})
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={tab === 'foods' ? 'Search chicken, oats, rice, espresso...' : 'Search set meal combos...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-emerald-500"
          />
        </div>

        {/* Items List */}
        <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60 pr-1">
          {tab === 'foods' ? (
            filteredFoods.map((f) => (
              <div
                key={f.id}
                className="py-2.5 px-2 flex items-center justify-between gap-2 hover:bg-slate-800/40 rounded-lg transition"
              >
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>{f.emoji}</span>
                    <span>{f.name}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {f.label} • <strong className="text-emerald-400">{f.calories} kcal</strong> ({f.protein}g P / {f.carbs}g C / {f.fat}g F)
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => {
                      onLogFood(f, multiplier, activeSlot, createPresetSvgPhoto('chicken_rice'));
                      onClose();
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-emerald-300 font-semibold"
                    title="Log with auto-generated visual thumbnail"
                  >
                    + Photo
                  </button>
                  <button
                    onClick={() => {
                      onLogFood(f, multiplier, activeSlot);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold transition shadow-sm"
                  >
                    + Add
                  </button>
                </div>
              </div>
            ))
          ) : (
            filteredPresets.map((preset) => {
              const totals = preset.items.reduce(
                (a, b) => ({ cal: a.cal + b.calories, p: a.p + b.protein, c: a.c + b.carbs, f: a.f + b.fat }),
                { cal: 0, p: 0, c: 0, f: 0 }
              );

              return (
                <div
                  key={preset.id}
                  className="py-3 px-2 flex items-center justify-between gap-3 hover:bg-slate-800/40 rounded-lg transition"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate">{preset.name}</div>
                    <div className="text-[11px] text-emerald-400 font-semibold mt-0.5">
                      {Math.round(totals.cal)} kcal • {Math.round(totals.p)}g P • {Math.round(totals.c)}g C • {Math.round(totals.f)}g F
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {preset.items.map((i) => i.name).join(' + ')}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onLogSetMeal(preset);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold transition shrink-0"
                  >
                    Load Combo
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
