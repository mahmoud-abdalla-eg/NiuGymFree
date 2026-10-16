import React, { useState } from 'react';
import { Plus, Search, Utensils, Camera, Trash2 } from 'lucide-react';
import { FoodItem } from '../../types';
import { compressUploadedImage } from '../../lib/imageCompression';

interface FoodVaultViewProps {
  foodVault: FoodItem[];
  onUpdateFoodVault: (foods: FoodItem[]) => void;
  onLogFoodToToday: (food: FoodItem) => void;
  onShowToast: (msg: string) => void;
}

export const FoodVaultView: React.FC<FoodVaultViewProps> = ({
  foodVault,
  onUpdateFoodVault,
  onLogFoodToToday,
  onShowToast,
}) => {
  const [foodSearch, setFoodSearch] = useState('');
  const [foodCatFilter, setFoodCatFilter] = useState('All');
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string | null>(null);

  const [newFood, setNewFood] = useState<{
    name: string;
    category: 'Protein' | 'Carbs' | 'Fats' | 'Dairy' | 'Produce' | 'Drinks' | 'Custom';
    label: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    emoji: string;
  }>({
    name: '',
    category: 'Protein',
    label: '100g',
    calories: 160,
    protein: 22,
    carbs: 5,
    fat: 4,
    emoji: '🍽️',
  });

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressUploadedImage(file, 480, 0.75);
      setCustomPhotoUrl(compressed);
      onShowToast('📸 Attached custom food photo');
    } catch {
      onShowToast('❌ Image processing failed');
    }
  };

  const handleAddCustomFood = () => {
    if (!newFood.name.trim()) {
      onShowToast('⚠️ Please enter a food name');
      return;
    }

    const item: FoodItem = {
      id: `custom_${Date.now()}`,
      name: newFood.name.trim(),
      category: newFood.category,
      baseAmount: 1,
      unit: 'serving',
      label: newFood.label,
      calories: Number(newFood.calories) || 0,
      protein: Number(newFood.protein) || 0,
      carbs: Number(newFood.carbs) || 0,
      fat: Number(newFood.fat) || 0,
      emoji: newFood.emoji || '🍽️',
      photoUrl: customPhotoUrl,
    };

    onUpdateFoodVault([item, ...foodVault]);
    setNewFood({
      name: '',
      category: 'Protein',
      label: '100g',
      calories: 160,
      protein: 22,
      carbs: 5,
      fat: 4,
      emoji: '🍽️',
    });
    setCustomPhotoUrl(null);
    onShowToast('🍽️ Added custom food to Vault!');
  };

  const handleDeleteCustomFood = (id: string) => {
    onUpdateFoodVault(foodVault.filter((f) => f.id !== id));
    onShowToast('🗑️ Food removed from vault');
  };

  const filteredFoods = foodVault.filter((f) => {
    const matchesCat = foodCatFilter === 'All' || f.category === foodCatFilter;
    const matchesSearch = f.name.toLowerCase().includes(foodSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left 4 Cols: Add Custom Food */}
      <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl p-5 border border-slate-800/80 space-y-4 h-fit">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Plus className="w-4 h-4 text-emerald-400" />
          Add Custom Food to Vault
        </h2>
        <div className="space-y-3 text-xs">
          <input
            type="text"
            placeholder="Food or Drink Name"
            value={newFood.name}
            onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-emerald-500 outline-none"
          />

          <div className="grid grid-cols-2 gap-2">
            <select
              value={newFood.category}
              onChange={(e) =>
                setNewFood({ ...newFood, category: e.target.value as any })
              }
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
            >
              {['Protein', 'Carbs', 'Fats', 'Dairy', 'Produce', 'Drinks', 'Custom'].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Serving (e.g. 100g, 1 cup)"
              value={newFood.label}
              onChange={(e) => setNewFood({ ...newFood, label: e.target.value })}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-emerald-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-4 gap-2">
            <div>
              <label className="text-[10px] text-slate-400">Kcal</label>
              <input
                type="number"
                value={newFood.calories}
                onChange={(e) => setNewFood({ ...newFood, calories: Number(e.target.value) })}
                className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-center font-bold"
              />
            </div>
            <div>
              <label className="text-[10px] text-sky-400">Protein (g)</label>
              <input
                type="number"
                value={newFood.protein}
                onChange={(e) => setNewFood({ ...newFood, protein: Number(e.target.value) })}
                className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-center font-bold"
              />
            </div>
            <div>
              <label className="text-[10px] text-amber-400">Carbs (g)</label>
              <input
                type="number"
                value={newFood.carbs}
                onChange={(e) => setNewFood({ ...newFood, carbs: Number(e.target.value) })}
                className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-center font-bold"
              />
            </div>
            <div>
              <label className="text-[10px] text-rose-400">Fat (g)</label>
              <input
                type="number"
                value={newFood.fat}
                onChange={(e) => setNewFood({ ...newFood, fat: Number(e.target.value) })}
                className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-center font-bold"
              />
            </div>
          </div>

          {/* Optional Photo Attachment */}
          <div>
            <label className="block text-[10px] text-slate-400 mb-1">Optional Photo Upload</label>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500 cursor-pointer text-slate-300 text-xs transition">
                <Camera className="w-4 h-4 text-emerald-400" />
                <span>Upload Food Photo</span>
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
              {customPhotoUrl && (
                <img
                  src={customPhotoUrl}
                  alt="preview"
                  className="w-9 h-9 rounded-lg object-cover border border-emerald-500"
                />
              )}
            </div>
          </div>

          <button
            onClick={handleAddCustomFood}
            className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold transition shadow-md shadow-emerald-500/20"
          >
            Save to Food Vault
          </button>
        </div>
      </div>

      {/* Right 8 Cols: Food Vault Gallery & Search */}
      <div className="lg:col-span-8 bg-slate-900/90 rounded-2xl p-5 border border-slate-800/80 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search staple foods, espresso, salmon, chicken..."
              value={foodSearch}
              onChange={(e) => setFoodSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-emerald-500 outline-none"
            />
          </div>
          <div className="flex gap-1 overflow-x-auto py-1">
            {['All', 'Protein', 'Carbs', 'Fats', 'Dairy', 'Produce', 'Drinks', 'Custom'].map((c) => (
              <button
                key={c}
                onClick={() => setFoodCatFilter(c)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                  foodCatFilter === c
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[520px] overflow-y-auto pr-1">
          {filteredFoods.map((f) => (
            <div
              key={f.id}
              className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 hover:border-slate-700 transition"
            >
              <div className="min-w-0 flex items-center gap-2.5">
                {f.photoUrl ? (
                  <img
                    src={f.photoUrl}
                    alt={f.name}
                    className="w-10 h-10 rounded-lg object-cover shrink-0 border border-slate-700"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-lg shrink-0">
                    {f.emoji}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">{f.name}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {f.label} • <strong className="text-emerald-400">{f.calories} kcal</strong>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {f.protein}g P • {f.carbs}g C • {f.fat}g F
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => onLogFoodToToday(f)}
                  className="px-2.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 text-xs font-bold transition shadow-sm"
                  title="Add to today's meal log"
                >
                  + Log
                </button>
                {f.id.startsWith('custom_') && (
                  <button
                    onClick={() => handleDeleteCustomFood(f.id)}
                    className="p-1.5 text-slate-600 hover:text-rose-400 transition"
                    title="Delete custom food"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
