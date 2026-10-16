import React, { useState, useEffect, useMemo } from 'react';
import {
  Flame,
  Utensils,
  Calculator,
  Plus,
  Trash2,
  Search,
  Sun,
  Moon,
  RotateCcw,
  Sparkles,
  Check,
  ChevronDown,
  ChevronUp,
  Coffee,
  Sunrise,
  Sunset,
  Apple,
  Sliders,
  Info,
  Scale,
  Activity,
  Target,
  Award,
  ArrowRight,
  PlusCircle,
  X
} from 'lucide-react';

// --- BUILT-IN STAPLE FOOD DATABASE ---
const FOOD_DATABASE = [
  // Proteins
  { id: 'f1', name: 'Chicken Breast (Cooked)', category: 'Protein', baseAmount: 100, unit: 'g', label: '100g', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  { id: 'f2', name: 'Large Whole Egg', category: 'Protein', baseAmount: 1, unit: 'large egg (50g)', label: '1 egg', calories: 72, protein: 6.3, carbs: 0.4, fat: 4.8 },
  { id: 'f3', name: 'Egg Whites', category: 'Protein', baseAmount: 100, unit: 'g', label: '100g', calories: 52, protein: 11, carbs: 0.7, fat: 0.2 },
  { id: 'f4', name: 'Whey Protein Isolate', category: 'Protein', baseAmount: 1, unit: 'scoop (30g)', label: '1 scoop', calories: 120, protein: 25, carbs: 2, fat: 1 },
  { id: 'f5', name: 'Greek Yogurt (0% Non-Fat)', category: 'Dairy', baseAmount: 170, unit: 'g', label: '1 container (170g)', calories: 100, protein: 17, carbs: 6, fat: 0 },
  { id: 'f6', name: 'Atlantic Salmon (Cooked)', category: 'Protein', baseAmount: 100, unit: 'g', label: '100g', calories: 206, protein: 22, carbs: 0, fat: 12 },
  { id: 'f7', name: 'Lean Ground Beef (93/7)', category: 'Protein', baseAmount: 100, unit: 'g', label: '100g', calories: 164, protein: 21, carbs: 0, fat: 8.5 },
  { id: 'f8', name: 'Tofu (Firm)', category: 'Protein', baseAmount: 100, unit: 'g', label: '100g', calories: 144, protein: 17, carbs: 3, fat: 9 },
  { id: 'f9', name: 'Canned Tuna (in Water)', category: 'Protein', baseAmount: 1, unit: 'can (120g drained)', label: '1 can', calories: 130, protein: 29, carbs: 0, fat: 1 },

  // Carbs & Grains
  { id: 'f10', name: 'White Jasmine Rice (Cooked)', category: 'Carbs', baseAmount: 100, unit: 'g', label: '100g', calories: 130, protein: 2.7, carbs: 28, fat: 0.3 },
  { id: 'f11', name: 'Brown Rice (Cooked)', category: 'Carbs', baseAmount: 100, unit: 'g', label: '100g', calories: 112, protein: 2.3, carbs: 24, fat: 0.8 },
  { id: 'f12', name: 'Rolled Oats (Dry)', category: 'Carbs', baseAmount: 50, unit: 'g', label: '50g (1/2 cup)', calories: 190, protein: 6.5, carbs: 34, fat: 3.3 },
  { id: 'f13', name: 'Sweet Potato (Baked)', category: 'Carbs', baseAmount: 150, unit: 'g', label: '1 medium (150g)', calories: 135, protein: 3, carbs: 31, fat: 0.2 },
  { id: 'f14', name: 'Sourdough Bread', category: 'Carbs', baseAmount: 1, unit: 'slice (50g)', label: '1 slice', calories: 130, protein: 5, carbs: 25, fat: 0.8 },
  { id: 'f15', name: 'Quinoa (Cooked)', category: 'Carbs', baseAmount: 100, unit: 'g', label: '100g', calories: 120, protein: 4.4, carbs: 21, fat: 1.9 },

  // Fats & Oils
  { id: 'f16', name: 'Extra Virgin Olive Oil', category: 'Fats', baseAmount: 1, unit: 'tbsp (14g)', label: '1 tbsp', calories: 119, protein: 0, carbs: 0, fat: 13.5 },
  { id: 'f17', name: 'Hass Avocado', category: 'Fats', baseAmount: 100, unit: 'g', label: '100g (~1/2 medium)', calories: 160, protein: 2, carbs: 8.5, fat: 14.7 },
  { id: 'f18', name: 'Natural Peanut Butter', category: 'Fats', baseAmount: 1, unit: 'tbsp (16g)', label: '1 tbsp', calories: 95, protein: 4, carbs: 3, fat: 8 },
  { id: 'f19', name: 'Raw Almonds', category: 'Fats', baseAmount: 28, unit: 'g', label: '28g (1 oz)', calories: 164, protein: 6, carbs: 6, fat: 14 },
  { id: 'f20', name: 'Chia Seeds', category: 'Fats', baseAmount: 15, unit: 'g', label: '1 tbsp (15g)', calories: 73, protein: 2.5, carbs: 6.3, fat: 4.6 },

  // Fruits & Veggies
  { id: 'f21', name: 'Medium Banana', category: 'Produce', baseAmount: 1, unit: 'medium (118g)', label: '1 medium', calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
  { id: 'f22', name: 'Blueberries (Fresh)', category: 'Produce', baseAmount: 100, unit: 'g', label: '100g', calories: 57, protein: 0.7, carbs: 14.5, fat: 0.3 },
  { id: 'f23', name: 'Broccoli (Steamed)', category: 'Produce', baseAmount: 100, unit: 'g', label: '100g', calories: 35, protein: 2.4, carbs: 7.2, fat: 0.4 },
  { id: 'f24', name: 'Spinach (Raw)', category: 'Produce', baseAmount: 100, unit: 'g', label: '100g', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 },
  { id: 'f25', name: 'Honeycrisp Apple', category: 'Produce', baseAmount: 1, unit: 'medium (182g)', label: '1 apple', calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },

  // Drinks & Beverages
  { id: 'f26', name: 'Double Shot Espresso', category: 'Drinks', baseAmount: 1, unit: 'serving (60ml)', label: '2 shots', calories: 5, protein: 0.3, carbs: 0.8, fat: 0.1 },
  { id: 'f27', name: 'Caffe Latte (Whole Milk)', category: 'Drinks', baseAmount: 1, unit: 'cup (240ml)', label: '8 oz cup', calories: 135, protein: 7, carbs: 11, fat: 7 },
  { id: 'f28', name: 'Oat Milk Latte', category: 'Drinks', baseAmount: 1, unit: 'cup (240ml)', label: '8 oz cup', calories: 130, protein: 2, carbs: 16, fat: 6 },
  { id: 'f29', name: 'Homemade Lemonade', category: 'Drinks', baseAmount: 250, unit: 'ml', label: '1 glass (250ml)', calories: 105, protein: 0.2, carbs: 27, fat: 0.1 },
  { id: 'f30', name: 'Unsweetened Almond Milk', category: 'Drinks', baseAmount: 240, unit: 'ml', label: '1 cup (240ml)', calories: 30, protein: 1, carbs: 1, fat: 2.5 },
];

const MACRO_PRESETS = {
  balanced: { name: 'Balanced', p: 30, c: 40, f: 30, desc: 'Standard sustainable split for general fitness' },
  highProtein: { name: 'High Protein', p: 40, c: 35, f: 25, desc: 'Optimal for muscle retention & satiety' },
  lowCarb: { name: 'Low Carb', p: 35, c: 20, f: 45, desc: 'Reduced glycemic load with healthy fats' },
  keto: { name: 'Ketogenic', p: 25, c: 5, f: 70, desc: 'Ultra-low carb to promote ketosis' },
  custom: { name: 'Custom Split', p: 30, c: 40, f: 30, desc: 'Fine-tune your exact macro ratios' }
};

const ACTIVITY_LEVELS = [
  { value: 1.2, label: 'Sedentary', desc: 'Desk job, little to no formal exercise' },
  { value: 1.375, label: 'Lightly Active', desc: 'Light exercise or sports 1-3 days/week' },
  { value: 1.55, label: 'Moderately Active', desc: 'Moderate training 3-5 days/week' },
  { value: 1.725, label: 'Very Active', desc: 'Hard training or sports 6-7 days/week' },
  { value: 1.9, label: 'Extra Active', desc: 'Intense daily training or physical job' }
];

const GOALS = [
  { id: 'cut', label: 'Cut (-20%)', multiplier: 0.8, badge: '-20% Cal', desc: 'Lose fat while preserving muscle' },
  { id: 'maintain', label: 'Maintain', multiplier: 1.0, badge: '100% TDEE', desc: 'Stay at current weight & recomposition' },
  { id: 'bulk', label: 'Lean Bulk (+12%)', multiplier: 1.12, badge: '+12% Cal', desc: 'Controlled surplus for muscle growth' }
];

const SAMPLE_MEALS = {
  breakfast: [
    { id: 's1', name: 'Rolled Oats (Dry)', amount: '60g', calories: 228, protein: 7.8, carbs: 40.8, fat: 4.0 },
    { id: 's2', name: 'Whey Protein Isolate', amount: '1 scoop (30g)', calories: 120, protein: 25, carbs: 2, fat: 1 },
    { id: 's3', name: 'Blueberries (Fresh)', amount: '80g', calories: 46, protein: 0.6, carbs: 11.6, fat: 0.2 },
    { id: 's4', name: 'Double Shot Espresso', amount: '1 serving (60ml)', calories: 5, protein: 0.3, carbs: 0.8, fat: 0.1 }
  ],
  lunch: [
    { id: 's5', name: 'Chicken Breast (Cooked)', amount: '180g', calories: 297, protein: 55.8, carbs: 0, fat: 6.5 },
    { id: 's6', name: 'White Jasmine Rice (Cooked)', amount: '200g', calories: 260, protein: 5.4, carbs: 56, fat: 0.6 },
    { id: 's7', name: 'Hass Avocado', amount: '75g', calories: 120, protein: 1.5, carbs: 6.4, fat: 11.0 },
    { id: 's8', name: 'Broccoli (Steamed)', amount: '120g', calories: 42, protein: 2.9, carbs: 8.6, fat: 0.5 }
  ],
  dinner: [
    { id: 's9', name: 'Atlantic Salmon (Cooked)', amount: '160g', calories: 330, protein: 35.2, carbs: 0, fat: 19.2 },
    { id: 's10', name: 'Sweet Potato (Baked)', amount: '200g', calories: 180, protein: 4.0, carbs: 41.3, fat: 0.3 },
    { id: 's11', name: 'Extra Virgin Olive Oil', amount: '0.5 tbsp (7g)', calories: 60, protein: 0, carbs: 0, fat: 6.8 }
  ],
  snacks: [
    { id: 's12', name: 'Greek Yogurt (0% Non-Fat)', amount: '170g', calories: 100, protein: 17, carbs: 6, fat: 0 },
    { id: 's13', name: 'Raw Almonds', amount: '20g', calories: 117, protein: 4.3, carbs: 4.3, fat: 10.0 },
    { id: 's14', name: 'Homemade Lemonade', amount: '250ml', calories: 105, protein: 0.2, carbs: 27, fat: 0.1 }
  ]
};

const MEAL_CONFIG = [
  { key: 'breakfast', title: 'Breakfast', icon: Sunrise, accent: 'text-amber-500', bgAccent: 'bg-amber-500/10' },
  { key: 'lunch', title: 'Lunch', icon: Sun, accent: 'text-emerald-500', bgAccent: 'bg-emerald-500/10' },
  { key: 'dinner', title: 'Dinner', icon: Sunset, accent: 'text-indigo-500', bgAccent: 'bg-indigo-500/10' },
  { key: 'snacks', title: 'Snacks & Drinks', icon: Coffee, accent: 'text-rose-500', bgAccent: 'bg-rose-500/10' }
];

// --- HELPER COMPONENTS ---

// Circular Progress Ring SVG Component
const ProgressRing = ({ radius = 56, stroke = 8, progress, colorClass, children }) => {
  const normalizedRadius = radius - stroke;
  const circumference = normalizedRadius * 2 * Math.PI;
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  const strokeDashoffset = circumference - (clampedProgress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg height={radius * 2} width={radius * 2} className="-rotate-90 transform">
        <circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="text-slate-200 dark:text-slate-800 transition-colors"
        />
        <circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className={`${colorClass} transition-all duration-500 ease-out`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {children}
      </div>
    </div>
  );
};

// Multi-Segment Macro Donut Chart SVG
const MacroDonutChart = ({ proteinGrams, carbsGrams, fatGrams, totalCalories }) => {
  const pCal = proteinGrams * 4;
  const cCal = carbsGrams * 4;
  const fCal = fatGrams * 9;
  const totalMacroCal = pCal + cCal + fCal;

  const radius = 64;
  const stroke = 16;
  const normalizedRadius = radius - stroke;
  const circumference = normalizedRadius * 2 * Math.PI;

  if (totalMacroCal <= 0) {
    return (
      <div className="flex flex-col items-center justify-center py-4">
        <div className="relative inline-flex items-center justify-center">
          <svg height={radius * 2} width={radius * 2}>
            <circle
              stroke="currentColor"
              fill="transparent"
              strokeWidth={stroke}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              className="text-slate-200 dark:text-slate-800"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-xs text-slate-400">No Data</span>
          </div>
        </div>
      </div>
    );
  }

  const pPct = (pCal / totalMacroCal) * 100;
  const cPct = (cCal / totalMacroCal) * 100;
  const fPct = (fCal / totalMacroCal) * 100;

  const pStroke = (pPct / 100) * circumference;
  const cStroke = (cPct / 100) * circumference;
  const fStroke = (fPct / 100) * circumference;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative inline-flex items-center justify-center shrink-0">
        <svg height={radius * 2} width={radius * 2} className="-rotate-90 transform">
          {/* Background */}
          <circle
            stroke="currentColor"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="text-slate-100 dark:text-slate-800"
          />
          {/* Protein Segment (Blue) */}
          <circle
            stroke="#3b82f6"
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={`${pStroke} ${circumference}`}
            strokeDashoffset={0}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="transition-all duration-500"
          />
          {/* Carbs Segment (Emerald) */}
          <circle
            stroke="#10b981"
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={`${cStroke} ${circumference}`}
            strokeDashoffset={-pStroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="transition-all duration-500"
          />
          {/* Fat Segment (Amber) */}
          <circle
            stroke="#f59e0b"
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={`${fStroke} ${circumference}`}
            strokeDashoffset={-(pStroke + cStroke)}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-slate-800 dark:text-slate-100">{Math.round(totalCalories)}</span>
          <span className="text-[10px] uppercase tracking-wider text-slate-400">kcal</span>
        </div>
      </div>

      <div className="flex-1 w-full space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span>
            <span className="font-medium text-slate-700 dark:text-slate-300">Protein (4 kcal/g)</span>
          </div>
          <div className="font-semibold text-slate-900 dark:text-white">
            {Math.round(pPct)}% <span className="text-slate-400 font-normal">({Math.round(pCal)} kcal)</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
            <span className="font-medium text-slate-700 dark:text-slate-300">Carbs (4 kcal/g)</span>
          </div>
          <div className="font-semibold text-slate-900 dark:text-white">
            {Math.round(cPct)}% <span className="text-slate-400 font-normal">({Math.round(cCal)} kcal)</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
            <span className="font-medium text-slate-700 dark:text-slate-300">Fat (9 kcal/g)</span>
          </div>
          <div className="font-semibold text-slate-900 dark:text-white">
            {Math.round(fPct)}% <span className="text-slate-400 font-normal">({Math.round(fCal)} kcal)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APPLICATION ---

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('macroApp_darkMode');
      return saved ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  // User Profile & TDEE Calculator State
  const [profile, setProfile] = useState(() => {
    const defaultProfile = {
      age: 28,
      gender: 'male',
      weightUnit: 'kg',
      weight: 75,
      heightUnit: 'cm',
      heightCm: 178,
      heightFt: 5,
      heightIn: 10,
      activity: 1.55,
      goal: 'maintain',
      preset: 'highProtein',
      macroSplit: { p: 40, c: 35, f: 25 }
    };
    try {
      const saved = localStorage.getItem('macroApp_profile');
      return saved ? { ...defaultProfile, ...JSON.parse(saved) } : defaultProfile;
    } catch {
      return defaultProfile;
    }
  });

  // Logged Daily Meals State
  const [meals, setMeals] = useState(() => {
    try {
      const saved = localStorage.getItem('macroApp_meals');
      return saved ? JSON.parse(saved) : SAMPLE_MEALS;
    } catch {
      return SAMPLE_MEALS;
    }
  });

  // UI Control States
  const [activeMealSlot, setActiveMealSlot] = useState('breakfast');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [portionMultipliers, setPortionMultipliers] = useState({});
  const [customFood, setCustomFood] = useState({
    name: '',
    amount: '100g',
    calories: '',
    protein: '',
    carbs: '',
    fat: ''
  });
  const [toastMessage, setToastMessage] = useState(null);
  const [showCalculatorMobile, setShowCalculatorMobile] = useState(false);

  // Save to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('macroApp_darkMode', JSON.stringify(darkMode));
    } catch (e) {
      console.error(e);
    }
  }, [darkMode]);

  useEffect(() => {
    try {
      localStorage.setItem('macroApp_profile', JSON.stringify(profile));
    } catch (e) {
      console.error(e);
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem('macroApp_meals', JSON.stringify(meals));
    } catch (e) {
      console.error(e);
    }
  }, [meals]);

  // Toast helper
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2600);
  };

  // --- CALCULATE BMR, TDEE & MACRO TARGETS ---
  const targets = useMemo(() => {
    const weightKg = profile.weightUnit === 'kg'
      ? Number(profile.weight) || 70
      : (Number(profile.weight) || 154) * 0.453592;

    const heightCm = profile.heightUnit === 'cm'
      ? Number(profile.heightCm) || 175
      : ((Number(profile.heightFt) || 5) * 12 + (Number(profile.heightIn) || 9)) * 2.54;

    const age = Number(profile.age) || 25;

    // Mifflin-St Jeor Equation
    let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
    bmr += profile.gender === 'male' ? 5 : -161;

    const tdee = Math.round(bmr * Number(profile.activity));
    const goalObj = GOALS.find((g) => g.id === profile.goal) || GOALS[1];
    const targetCalories = Math.max(1200, Math.round(tdee * goalObj.multiplier));

    const { p, c, f } = profile.macroSplit;
    const proteinGrams = Math.round((targetCalories * (p / 100)) / 4);
    const carbsGrams = Math.round((targetCalories * (c / 100)) / 4);
    const fatGrams = Math.round((targetCalories * (f / 100)) / 9);

    return {
      bmr: Math.round(bmr),
      tdee,
      calories: targetCalories,
      protein: proteinGrams,
      carbs: carbsGrams,
      fat: fatGrams
    };
  }, [profile]);

  // --- CALCULATE CONSUMED TOTALS & SUBTOTALS ---
  const consumed = useMemo(() => {
    const subtotals = {};
    let totalCal = 0;
    let totalP = 0;
    let totalC = 0;
    let totalF = 0;

    MEAL_CONFIG.forEach(({ key }) => {
      const list = meals[key] || [];
      const mealTotals = list.reduce(
        (acc, item) => ({
          calories: acc.calories + (Number(item.calories) || 0),
          protein: acc.protein + (Number(item.protein) || 0),
          carbs: acc.carbs + (Number(item.carbs) || 0),
          fat: acc.fat + (Number(item.fat) || 0)
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      );
      subtotals[key] = mealTotals;
      totalCal += mealTotals.calories;
      totalP += mealTotals.protein;
      totalC += mealTotals.carbs;
      totalF += mealTotals.fat;
    });

    return {
      calories: Math.round(totalCal),
      protein: Number(totalP.toFixed(1)),
      carbs: Number(totalC.toFixed(1)),
      fat: Number(totalF.toFixed(1)),
      subtotals
    };
  }, [meals]);

  // --- PROFILE HANDLERS ---
  const handleWeightUnitToggle = (newUnit) => {
    if (newUnit === profile.weightUnit) return;
    const converted = newUnit === 'lbs'
      ? Math.round(profile.weight * 2.20462)
      : Math.round(profile.weight / 2.20462);
    setProfile((prev) => ({ ...prev, weightUnit: newUnit, weight: converted }));
  };

  const handlePresetChange = (presetKey) => {
    if (presetKey === 'custom') {
      setProfile((prev) => ({ ...prev, preset: 'custom' }));
    } else {
      const split = MACRO_PRESETS[presetKey];
      setProfile((prev) => ({
        ...prev,
        preset: presetKey,
        macroSplit: { p: split.p, c: split.c, f: split.f }
      }));
    }
  };

  const handleCustomSliderChange = (macroKey, newVal) => {
    const val = Math.max(0, Math.min(100, Number(newVal)));
    setProfile((prev) => {
      const current = prev.macroSplit;
      const otherKeys = ['p', 'c', 'f'].filter((k) => k !== macroKey);
      const remaining = 100 - val;
      const otherSum = current[otherKeys[0]] + current[otherKeys[1]];

      let nextOther0, nextOther1;
      if (otherSum === 0) {
        nextOther0 = Math.round(remaining / 2);
        nextOther1 = remaining - nextOther0;
      } else {
        nextOther0 = Math.round((current[otherKeys[0]] / otherSum) * remaining);
        nextOther1 = remaining - nextOther0;
      }

      return {
        ...prev,
        preset: 'custom',
        macroSplit: {
          ...current,
          [macroKey]: val,
          [otherKeys[0]]: nextOther0,
          [otherKeys[1]]: nextOther1
        }
      };
    });
  };

  // --- MEAL LOGGING HANDLERS ---
  const addFoodToMeal = (foodItem, multiplier = 1, targetMeal = activeMealSlot) => {
    const scale = Number(multiplier) || 1;
    const scaledAmount = foodItem.unit === 'g' || foodItem.unit === 'ml'
      ? `${Math.round(foodItem.baseAmount * scale)}${foodItem.unit}`
      : `${scale} × ${foodItem.label}`;

    const newEntry = {
      id: `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: foodItem.name,
      amount: scaledAmount,
      calories: Math.round(foodItem.calories * scale),
      protein: Number((foodItem.protein * scale).toFixed(1)),
      carbs: Number((foodItem.carbs * scale).toFixed(1)),
      fat: Number((foodItem.fat * scale).toFixed(1))
    };

    setMeals((prev) => ({
      ...prev,
      [targetMeal]: [...(prev[targetMeal] || []), newEntry]
    }));

    const mealTitle = MEAL_CONFIG.find((m) => m.key === targetMeal)?.title || 'Meal';
    triggerToast(`Added ${foodItem.name} to ${mealTitle}`);
  };

  const handleAddCustomFood = (e) => {
    e.preventDefault();
    if (!customFood.name.trim()) return;

    const p = Number(customFood.protein) || 0;
    const c = Number(customFood.carbs) || 0;
    const f = Number(customFood.fat) || 0;
    const cal = customFood.calories !== ''
      ? Number(customFood.calories)
      : Math.round(p * 4 + c * 4 + f * 9);

    const newEntry = {
      id: `custom_${Date.now()}`,
      name: customFood.name.trim(),
      amount: customFood.amount.trim() || '1 serving',
      calories: cal,
      protein: p,
      carbs: c,
      fat: f
    };

    setMeals((prev) => ({
      ...prev,
      [activeMealSlot]: [...(prev[activeMealSlot] || []), newEntry]
    }));

    setCustomFood({ name: '', amount: '100g', calories: '', protein: '', carbs: '', fat: '' });
    const mealTitle = MEAL_CONFIG.find((m) => m.key === activeMealSlot)?.title || 'Meal';
    triggerToast(`Added custom item to ${mealTitle}`);
  };

  const removeFoodFromMeal = (mealKey, itemId) => {
    setMeals((prev) => ({
      ...prev,
      [mealKey]: prev[mealKey].filter((item) => item.id !== itemId)
    }));
  };

  const handleResetDay = () => {
    setMeals({ breakfast: [], lunch: [], dinner: [], snacks: [] });
    triggerToast('Cleared all logged meals for the day');
  };

  const handleLoadSampleDay = () => {
    setMeals(SAMPLE_MEALS);
    triggerToast('Loaded balanced sample day meal plan');
  };

  // Filtered quick-add foods
  const filteredFoods = useMemo(() => {
    return FOOD_DATABASE.filter((item) => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const categories = ['All', 'Protein', 'Carbs', 'Fats', 'Dairy', 'Produce', 'Drinks'];

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 pb-16">
        
        {/* Top Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg shadow-emerald-600/20 border border-emerald-500 animate-bounce">
            <Check className="w-4 h-4 shrink-0" />
            <span className="text-sm font-medium">{toastMessage}</span>
          </div>
        )}

        {/* Header Navigation */}
        <header className="sticky top-0 z-30 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                <Flame className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  MacroPulse
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                  Precision TDEE & Daily Nutrition Planner
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={handleLoadSampleDay}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200/60 dark:border-indigo-800/60 transition"
                title="Populate with sample balanced meals"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Load Sample Day</span>
                <span className="sm:hidden">Sample</span>
              </button>

              <button
                onClick={handleResetDay}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50 border border-rose-200/60 dark:border-rose-800/60 transition"
                title="Clear all meals for today"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset Day</span>
                <span className="sm:hidden">Reset</span>
              </button>

              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                aria-label="Toggle theme"
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
          
          {/* TOP ANALYTICS & PROGRESS RINGS DASHBOARD */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Real-time Calorie & Macro Progress Cards */}
            <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-500" />
                    Daily Nutrition Targets & Live Progress
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    TDEE Maintenance: <span className="font-semibold text-slate-700 dark:text-slate-300">{targets.tdee} kcal</span> • BMR: <span className="font-semibold text-slate-700 dark:text-slate-300">{targets.bmr} kcal</span>
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Goal: {GOALS.find((g) => g.id === profile.goal)?.label}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {/* Total Calories Ring */}
                <div className="flex flex-col items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <ProgressRing
                    radius={52}
                    stroke={8}
                    progress={(consumed.calories / targets.calories) * 100}
                    colorClass={consumed.calories > targets.calories ? 'text-rose-500' : 'text-emerald-500'}
                  >
                    <span className="text-base font-extrabold text-slate-900 dark:text-white">
                      {consumed.calories}
                    </span>
                    <span className="text-[10px] text-slate-400">/ {targets.calories}</span>
                  </ProgressRing>
                  <span className="mt-2 text-xs font-semibold text-slate-700 dark:text-slate-200">Calories</span>
                  <span className={`text-[11px] font-medium ${
                    targets.calories - consumed.calories >= 0
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-rose-500'
                  }`}>
                    {targets.calories - consumed.calories >= 0
                      ? `${targets.calories - consumed.calories} kcal left`
                      : `${Math.abs(targets.calories - consumed.calories)} kcal over`}
                  </span>
                </div>

                {/* Protein Ring */}
                <div className="flex flex-col items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <ProgressRing
                    radius={52}
                    stroke={8}
                    progress={(consumed.protein / targets.protein) * 100}
                    colorClass="text-blue-500"
                  >
                    <span className="text-base font-extrabold text-slate-900 dark:text-white">
                      {Math.round(consumed.protein)}g
                    </span>
                    <span className="text-[10px] text-slate-400">/ {targets.protein}g</span>
                  </ProgressRing>
                  <span className="mt-2 text-xs font-semibold text-blue-600 dark:text-blue-400">Protein ({profile.macroSplit.p}%)</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {targets.protein - consumed.protein >= 0
                      ? `${Math.round(targets.protein - consumed.protein)}g remaining`
                      : `${Math.round(consumed.protein - targets.protein)}g over`}
                  </span>
                </div>

                {/* Carbohydrates Ring */}
                <div className="flex flex-col items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <ProgressRing
                    radius={52}
                    stroke={8}
                    progress={(consumed.carbs / targets.carbs) * 100}
                    colorClass="text-emerald-500"
                  >
                    <span className="text-base font-extrabold text-slate-900 dark:text-white">
                      {Math.round(consumed.carbs)}g
                    </span>
                    <span className="text-[10px] text-slate-400">/ {targets.carbs}g</span>
                  </ProgressRing>
                  <span className="mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">Carbs ({profile.macroSplit.c}%)</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {targets.carbs - consumed.carbs >= 0
                      ? `${Math.round(targets.carbs - consumed.carbs)}g remaining`
                      : `${Math.round(consumed.carbs - targets.carbs)}g over`}
                  </span>
                </div>

                {/* Dietary Fat Ring */}
                <div className="flex flex-col items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <ProgressRing
                    radius={52}
                    stroke={8}
                    progress={(consumed.fat / targets.fat) * 100}
                    colorClass="text-amber-500"
                  >
                    <span className="text-base font-extrabold text-slate-900 dark:text-white">
                      {Math.round(consumed.fat)}g
                    </span>
                    <span className="text-[10px] text-slate-400">/ {targets.fat}g</span>
                  </ProgressRing>
                  <span className="mt-2 text-xs font-semibold text-amber-600 dark:text-amber-400">Fat ({profile.macroSplit.f}%)</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {targets.fat - consumed.fat >= 0
                      ? `${Math.round(targets.fat - consumed.fat)}g remaining`
                      : `${Math.round(consumed.fat - targets.fat)}g over`}
                  </span>
                </div>
              </div>
            </div>

            {/* Consumed Caloric Ratio Donut Card */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                  Consumed Macro Breakdown
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                  Actual caloric distribution from logged meals
                </p>
              </div>
              <MacroDonutChart
                proteinGrams={consumed.protein}
                carbsGrams={consumed.carbs}
                fatGrams={consumed.fat}
                totalCalories={consumed.calories}
              />
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Target Ratio:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {profile.macroSplit.p}% P / {profile.macroSplit.c}% C / {profile.macroSplit.f}% F
                </span>
              </div>
            </div>

          </section>

          {/* MAIN WORKSPACE: LEFT (TDEE & FOOD FINDER) / RIGHT (MEAL PLANNER) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT COLUMN: TDEE CONFIGURATOR & QUICK-ADD DATABASE */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* TDEE & Macro Target Calculator Card */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
                <div
                  onClick={() => setShowCalculatorMobile(!showCalculatorMobile)}
                  className="p-5 flex items-center justify-between cursor-pointer lg:cursor-default bg-slate-50/60 dark:bg-slate-800/40 border-b border-slate-200/60 dark:border-slate-800"
                >
                  <div className="flex items-center gap-2.5">
                    <Calculator className="w-5 h-5 text-emerald-500" />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        1. TDEE & Macro Target Calculator
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Customize biometrics, goal & macro split
                      </p>
                    </div>
                  </div>
                  <button className="lg:hidden text-slate-400">
                    {showCalculatorMobile ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>

                <div className={`p-5 space-y-5 ${showCalculatorMobile ? 'block' : 'hidden lg:block'}`}>
                  {/* Gender & Age Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                        Biological Sex
                      </label>
                      <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                        {['male', 'female'].map((g) => (
                          <button
                            key={g}
                            type="button"
                            onClick={() => setProfile({ ...profile, gender: g })}
                            className={`py-1.5 text-xs font-semibold rounded-lg capitalize transition ${
                              profile.gender === g
                                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                            }`}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                        Age (Years)
                      </label>
                      <input
                        type="number"
                        min="15"
                        max="100"
                        value={profile.age}
                        onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Weight & Height Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Weight Input */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Weight
                        </label>
                        <div className="flex rounded-md bg-slate-100 dark:bg-slate-800 p-0.5 text-[11px]">
                          {['kg', 'lbs'].map((u) => (
                            <button
                              key={u}
                              type="button"
                              onClick={() => handleWeightUnitToggle(u)}
                              className={`px-2 py-0.5 rounded font-semibold transition ${
                                profile.weightUnit === u
                                  ? 'bg-emerald-500 text-white'
                                  : 'text-slate-500'
                              }`}
                            >
                              {u}
                            </button>
                          ))}
                        </div>
                      </div>
                      <input
                        type="number"
                        min="30"
                        max="400"
                        value={profile.weight}
                        onChange={(e) => setProfile({ ...profile, weight: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    {/* Height Input */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Height
                        </label>
                        <div className="flex rounded-md bg-slate-100 dark:bg-slate-800 p-0.5 text-[11px]">
                          {['cm', 'ft'].map((u) => (
                            <button
                              key={u}
                              type="button"
                              onClick={() => setProfile({ ...profile, heightUnit: u })}
                              className={`px-2 py-0.5 rounded font-semibold transition ${
                                profile.heightUnit === u
                                  ? 'bg-emerald-500 text-white'
                                  : 'text-slate-500'
                              }`}
                            >
                              {u}
                            </button>
                          ))}
                        </div>
                      </div>

                      {profile.heightUnit === 'cm' ? (
                        <input
                          type="number"
                          min="100"
                          max="250"
                          value={profile.heightCm}
                          onChange={(e) => setProfile({ ...profile, heightCm: e.target.value })}
                          placeholder="cm"
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      ) : (
                        <div className="grid grid-cols-2 gap-2">
                          <div className="relative">
                            <input
                              type="number"
                              min="3"
                              max="8"
                              value={profile.heightFt}
                              onChange={(e) => setProfile({ ...profile, heightFt: e.target.value })}
                              className="w-full pl-3 pr-7 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                            <span className="absolute right-2.5 top-2.5 text-xs text-slate-400">ft</span>
                          </div>
                          <div className="relative">
                            <input
                              type="number"
                              min="0"
                              max="11"
                              value={profile.heightIn}
                              onChange={(e) => setProfile({ ...profile, heightIn: e.target.value })}
                              className="w-full pl-3 pr-7 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                            <span className="absolute right-2.5 top-2.5 text-xs text-slate-400">in</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Activity Level */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                      Activity Level
                    </label>
                    <select
                      value={profile.activity}
                      onChange={(e) => setProfile({ ...profile, activity: Number(e.target.value) })}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {ACTIVITY_LEVELS.map((act) => (
                        <option key={act.value} value={act.value}>
                          {act.label} — {act.desc}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Goal Selection */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                      Primary Goal
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {GOALS.map((g) => {
                        const active = profile.goal === g.id;
                        return (
                          <button
                            key={g.id}
                            type="button"
                            onClick={() => setProfile({ ...profile, goal: g.id })}
                            className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                              active
                                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                                : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                          >
                            <div className="text-xs font-bold">{g.label.split(' ')[0]}</div>
                            <div className="text-[10px] opacity-75 mt-0.5">{g.badge}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Macro Split Presets & Sliders */}
                  <div className="pt-2 border-t border-slate-200/70 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                        <Sliders className="w-3.5 h-3.5 text-emerald-500" />
                        Macro Split Preset
                      </label>
                      <span className="text-[11px] text-slate-400">
                        {MACRO_PRESETS[profile.preset]?.desc}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {Object.entries(MACRO_PRESETS).map(([key, item]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => handlePresetChange(key)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                            profile.preset === key
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                          }`}
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>

                    {/* Interactive Custom Percentage Sliders */}
                    <div className="space-y-3 bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
                      {/* Protein Slider */}
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-semibold text-blue-600 dark:text-blue-400">
                            Protein: {profile.macroSplit.p}%
                          </span>
                          <span className="font-bold text-slate-700 dark:text-slate-300">
                            {targets.protein}g ({targets.protein * 4} kcal)
                          </span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="65"
                          value={profile.macroSplit.p}
                          onChange={(e) => handleCustomSliderChange('p', e.target.value)}
                          className="w-full accent-blue-500 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                        />
                      </div>

                      {/* Carbs Slider */}
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                            Carbs: {profile.macroSplit.c}%
                          </span>
                          <span className="font-bold text-slate-700 dark:text-slate-300">
                            {targets.carbs}g ({targets.carbs * 4} kcal)
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="75"
                          value={profile.macroSplit.c}
                          onChange={(e) => handleCustomSliderChange('c', e.target.value)}
                          className="w-full accent-emerald-500 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                        />
                      </div>

                      {/* Fat Slider */}
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-semibold text-amber-600 dark:text-amber-400">
                            Fat: {profile.macroSplit.f}%
                          </span>
                          <span className="font-bold text-slate-700 dark:text-slate-300">
                            {targets.fat}g ({targets.fat * 9} kcal)
                          </span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="80"
                          value={profile.macroSplit.f}
                          onChange={(e) => handleCustomSliderChange('f', e.target.value)}
                          className="w-full accent-amber-500 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick-Add Staple Food Database with Dynamic Scaling */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-200/60 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <Utensils className="w-5 h-5 text-emerald-500" />
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                          2. Quick-Add Staple Foods
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Scale portion size & add directly to active meal slot
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Target Meal Selector Pill */}
                  <div className="flex items-center gap-1.5 bg-slate-200/70 dark:bg-slate-800 p-1 rounded-xl mb-3">
                    {MEAL_CONFIG.map((m) => {
                      const Icon = m.icon;
                      const isActive = activeMealSlot === m.key;
                      return (
                        <button
                          key={m.key}
                          type="button"
                          onClick={() => setActiveMealSlot(m.key)}
                          className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition ${
                            isActive
                              ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{m.title.split(' ')[0]}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Search Input */}
                  <div className="relative mb-3">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search chicken, rice, oats, espresso, lemonade..."
                      className="w-full pl-9 pr-8 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Category Filter Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium shrink-0 transition ${
                          selectedCategory === cat
                            ? 'bg-emerald-500 text-white'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Food Database List */}
                <div className="max-h-96 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80">
                  {filteredFoods.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-400">
                      No matching foods found. Try adding a custom food item on the right!
                    </div>
                  ) : (
                    filteredFoods.map((food) => {
                      const mult = portionMultipliers[food.id] ?? 1;
                      const scaledCal = Math.round(food.calories * mult);
                      const scaledP = (food.protein * mult).toFixed(1);
                      const scaledC = (food.carbs * mult).toFixed(1);
                      const scaledF = (food.fat * mult).toFixed(1);

                      return (
                        <div
                          key={food.id}
                          className="p-3.5 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition flex items-center justify-between gap-3"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                                {food.name}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                                {food.category}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex flex-wrap items-center gap-x-2">
                              <span className="font-semibold text-slate-700 dark:text-slate-300">
                                {scaledCal} kcal
                              </span>
                              <span>•</span>
                              <span className="text-blue-600 dark:text-blue-400">{scaledP}g P</span>
                              <span className="text-emerald-600 dark:text-emerald-400">{scaledC}g C</span>
                              <span className="text-amber-600 dark:text-amber-400">{scaledF}g F</span>
                            </div>
                          </div>

                          {/* Portion Multiplier Selector & Add Button */}
                          <div className="flex items-center gap-2 shrink-0">
                            <div className="flex flex-col items-end">
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  min="0.25"
                                  max="20"
                                  step="0.25"
                                  value={mult}
                                  onChange={(e) =>
                                    setPortionMultipliers({
                                      ...portionMultipliers,
                                      [food.id]: e.target.value
                                    })
                                  }
                                  className="w-14 px-2 py-1 text-center rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                  title="Portion multiplier"
                                />
                                <span className="text-[10px] text-slate-400">× {food.label}</span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => addFoodToMeal(food, mult)}
                              className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm transition"
                              title={`Add to ${activeMealSlot}`}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: CATEGORIZED DAILY MEAL PLANNER & CUSTOM ENTRY */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Custom Food Quick Entry Form */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <PlusCircle className="w-4 h-4 text-emerald-500" />
                    Log Custom Food or Recipe
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Adding to:{' '}
                    <strong className="text-emerald-600 dark:text-emerald-400 capitalize">
                      {MEAL_CONFIG.find((m) => m.key === activeMealSlot)?.title}
                    </strong>
                  </span>
                </div>

                <form onSubmit={handleAddCustomFood} className="grid grid-cols-2 sm:grid-cols-6 gap-2.5">
                  <input
                    type="text"
                    required
                    placeholder="Food name (e.g. Protein Bar)"
                    value={customFood.name}
                    onChange={(e) => setCustomFood({ ...customFood, name: e.target.value })}
                    className="col-span-2 sm:col-span-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <input
                    type="text"
                    placeholder="Portion (1 bar)"
                    value={customFood.amount}
                    onChange={(e) => setCustomFood({ ...customFood, amount: e.target.value })}
                    className="col-span-1 sm:col-span-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <input
                    type="number"
                    min="0"
                    placeholder="Calories (opt)"
                    value={customFood.calories}
                    onChange={(e) => setCustomFood({ ...customFood, calories: e.target.value })}
                    className="col-span-1 sm:col-span-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <div className="col-span-2 sm:col-span-2 grid grid-cols-3 gap-1.5">
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      placeholder="P (g)"
                      value={customFood.protein}
                      onChange={(e) => setCustomFood({ ...customFood, protein: e.target.value })}
                      className="px-2 py-2 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 text-xs font-medium text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      placeholder="C (g)"
                      value={customFood.carbs}
                      onChange={(e) => setCustomFood({ ...customFood, carbs: e.target.value })}
                      className="px-2 py-2 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-xs font-medium text-center focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      placeholder="F (g)"
                      value={customFood.fat}
                      onChange={(e) => setCustomFood({ ...customFood, fat: e.target.value })}
                      className="px-2 py-2 rounded-xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs font-medium text-center focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="col-span-2 sm:col-span-6 py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Custom Food to {MEAL_CONFIG.find((m) => m.key === activeMealSlot)?.title}
                  </button>
                </form>
              </div>

              {/* Categorized Meal Slots */}
              <div className="space-y-4">
                {MEAL_CONFIG.map(({ key, title, icon: Icon, accent, bgAccent }) => {
                  const mealItems = meals[key] || [];
                  const subtotal = consumed.subtotals[key] || { calories: 0, protein: 0, carbs: 0, fat: 0 };
                  const isSelectedSlot = activeMealSlot === key;

                  return (
                    <div
                      key={key}
                      onClick={() => setActiveMealSlot(key)}
                      className={`bg-white dark:bg-slate-900 rounded-2xl border transition cursor-pointer overflow-hidden ${
                        isSelectedSlot
                          ? 'border-emerald-500/80 ring-2 ring-emerald-500/15 shadow-md'
                          : 'border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      {/* Meal Slot Header & Subtotals */}
                      <div className="p-4 sm:px-5 flex flex-wrap items-center justify-between gap-2 bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl ${bgAccent} ${accent} flex items-center justify-center`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                {title}
                              </h4>
                              {isSelectedSlot && (
                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                  Active Slot
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {mealItems.length} {mealItems.length === 1 ? 'item' : 'items'} logged
                            </p>
                          </div>
                        </div>

                        {/* Per-Meal Macro Subtotals */}
                        <div className="flex items-center gap-3 text-xs">
                          <div className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-200">
                            {Math.round(subtotal.calories)} <span className="font-normal text-slate-400">kcal</span>
                          </div>
                          <div className="hidden sm:flex items-center gap-2.5 font-semibold">
                            <span className="text-blue-600 dark:text-blue-400">
                              {subtotal.protein.toFixed(1)}g P
                            </span>
                            <span className="text-emerald-600 dark:text-emerald-400">
                              {subtotal.carbs.toFixed(1)}g C
                            </span>
                            <span className="text-amber-600 dark:text-amber-400">
                              {subtotal.fat.toFixed(1)}g F
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Logged Food Items Table/List */}
                      <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                        {mealItems.length === 0 ? (
                          <div className="p-6 text-center text-xs text-slate-400 dark:text-slate-500">
                            No items logged for {title.toLowerCase()} yet. Select items from the food database on the left or log a custom item above.
                          </div>
                        ) : (
                          mealItems.map((item) => (
                            <div
                              key={item.id}
                              className="px-4 sm:px-5 py-3 flex items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition"
                            >
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate">
                                    {item.name}
                                  </span>
                                  <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                                    ({item.amount})
                                  </span>
                                </div>
                                <div className="flex items-center gap-3 mt-0.5 text-[11px]">
                                  <span className="font-bold text-slate-700 dark:text-slate-300">
                                    {item.calories} kcal
                                  </span>
                                  <span className="text-blue-600 dark:text-blue-400 font-medium">
                                    P: {item.protein}g
                                  </span>
                                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                                    C: {item.carbs}g
                                  </span>
                                  <span className="text-amber-600 dark:text-amber-400 font-medium">
                                    F: {item.fat}g
                                  </span>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeFoodFromMeal(key, item.id);
                                }}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition"
                                title="Remove item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>

        </main>
      </div>
    </div>
  );
}