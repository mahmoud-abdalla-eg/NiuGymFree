import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Flame,
  Utensils,
  Dumbbell,
  Calculator,
  Plus,
  Minus,
  Trash2,
  Search,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Camera,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Trophy,
  Activity,
  Scale,
  Droplets,
  Download,
  Upload,
  Settings,
  Bot,
  Zap,
  Layers,
  Target,
  Sliders,
  Coffee,
  Sunrise,
  Sun,
  Sunset,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  BarChart3,
  Eye,
  Volume2,
  VolumeX
} from 'lucide-react';

// ============================================================================
// 1. BUILT-IN STAPLE FOOD VAULT (30+ Whole Foods & Specialty Drinks)
// ============================================================================
const INITIAL_FOOD_VAULT = [
  // Proteins
  { id: 'f1', name: 'Chicken Breast (Cooked)', category: 'Protein', baseAmount: 100, unit: 'g', label: '100g', calories: 165, protein: 31, carbs: 0, fat: 3.6, emoji: '🍗' },
  { id: 'f2', name: 'Large Whole Egg', category: 'Protein', baseAmount: 1, unit: 'egg', label: '1 large egg (50g)', calories: 72, protein: 6.3, carbs: 0.4, fat: 4.8, emoji: '🥚' },
  { id: 'f3', name: 'Liquid Egg Whites', category: 'Protein', baseAmount: 100, unit: 'g', label: '100g', calories: 52, protein: 11, carbs: 0.7, fat: 0.2, emoji: '🥚' },
  { id: 'f4', name: 'Whey Protein Isolate', category: 'Protein', baseAmount: 1, unit: 'scoop', label: '1 scoop (30g)', calories: 120, protein: 25, carbs: 1.5, fat: 1, emoji: '🥤' },
  { id: 'f5', name: 'Greek Yogurt (0% Non-Fat)', category: 'Dairy', baseAmount: 170, unit: 'g', label: '1 bowl (170g)', calories: 100, protein: 17, carbs: 6, fat: 0, emoji: '🥣' },
  { id: 'f6', name: 'Atlantic Salmon (Grilled)', category: 'Protein', baseAmount: 100, unit: 'g', label: '100g', calories: 206, protein: 22, carbs: 0, fat: 12, emoji: '🍣' },
  { id: 'f7', name: 'Lean Ground Beef (93/7)', category: 'Protein', baseAmount: 100, unit: 'g', label: '100g', calories: 164, protein: 21, carbs: 0, fat: 8.5, emoji: '🥩' },
  { id: 'f8', name: 'Top Sirloin Steak', category: 'Protein', baseAmount: 100, unit: 'g', label: '100g', calories: 183, protein: 27, carbs: 0, fat: 8, emoji: '🥩' },
  { id: 'f9', name: 'Canned Tuna in Water', category: 'Protein', baseAmount: 1, unit: 'can', label: '1 can (120g)', calories: 130, protein: 29, carbs: 0, fat: 1, emoji: '🐟' },
  { id: 'f10', name: 'Firm Tofu', category: 'Protein', baseAmount: 100, unit: 'g', label: '100g', calories: 144, protein: 17, carbs: 3, fat: 9, emoji: '🍱' },
  // Carbs & Grains
  { id: 'f11', name: 'White Jasmine Rice (Cooked)', category: 'Carbs', baseAmount: 100, unit: 'g', label: '100g', calories: 130, protein: 2.7, carbs: 28, fat: 0.3, emoji: '🍚' },
  { id: 'f12', name: 'Brown Rice (Cooked)', category: 'Carbs', baseAmount: 100, unit: 'g', label: '100g', calories: 112, protein: 2.3, carbs: 24, fat: 0.8, emoji: '🍘' },
  { id: 'f13', name: 'Rolled Oats (Dry)', category: 'Carbs', baseAmount: 50, unit: 'g', label: '50g (1/2 cup)', calories: 190, protein: 6.5, carbs: 34, fat: 3.3, emoji: '🌾' },
  { id: 'f14', name: 'Baked Sweet Potato', category: 'Carbs', baseAmount: 150, unit: 'g', label: '150g medium', calories: 135, protein: 3, carbs: 31, fat: 0.2, emoji: '🍠' },
  { id: 'f15', name: 'Artisan Sourdough Bread', category: 'Carbs', baseAmount: 1, unit: 'slice', label: '1 slice (50g)', calories: 130, protein: 5, carbs: 25, fat: 0.8, emoji: '🍞' },
  { id: 'f16', name: 'Quinoa (Cooked)', category: 'Carbs', baseAmount: 100, unit: 'g', label: '100g', calories: 120, protein: 4.4, carbs: 21, fat: 1.9, emoji: '🥗' },
  { id: 'f17', name: 'Cream of Rice (Dry)', category: 'Carbs', baseAmount: 45, unit: 'g', label: '45g packet', calories: 160, protein: 3, carbs: 36, fat: 0, emoji: '🥣' },
  // Fats & Oils
  { id: 'f18', name: 'Extra Virgin Olive Oil', category: 'Fats', baseAmount: 1, unit: 'tbsp', label: '1 tbsp (14g)', calories: 119, protein: 0, carbs: 0, fat: 13.5, emoji: '🫒' },
  { id: 'f19', name: 'Hass Avocado', category: 'Fats', baseAmount: 100, unit: 'g', label: '100g (~1/2 med)', calories: 160, protein: 2, carbs: 8.5, fat: 14.7, emoji: '🥑' },
  { id: 'f20', name: 'Natural Peanut Butter', category: 'Fats', baseAmount: 1, unit: 'tbsp', label: '1 tbsp (16g)', calories: 95, protein: 4, carbs: 3, fat: 8, emoji: '🥜' },
  { id: 'f21', name: 'Raw Roasted Almonds', category: 'Fats', baseAmount: 28, unit: 'g', label: '28g (1 oz)', calories: 164, protein: 6, carbs: 6, fat: 14, emoji: '🌰' },
  { id: 'f22', name: 'Organic Chia Seeds', category: 'Fats', baseAmount: 15, unit: 'g', label: '1 tbsp (15g)', calories: 73, protein: 2.5, carbs: 6.3, fat: 4.6, emoji: '🌱' },
  // Produce
  { id: 'f23', name: 'Medium Ripe Banana', category: 'Produce', baseAmount: 1, unit: 'banana', label: '1 medium (118g)', calories: 105, protein: 1.3, carbs: 27, fat: 0.4, emoji: '🍌' },
  { id: 'f24', name: 'Fresh Blueberries', category: 'Produce', baseAmount: 100, unit: 'g', label: '100g', calories: 57, protein: 0.7, carbs: 14.5, fat: 0.3, emoji: '🫐' },
  { id: 'f25', name: 'Steamed Broccoli Florets', category: 'Produce', baseAmount: 100, unit: 'g', label: '100g', calories: 35, protein: 2.4, carbs: 7.2, fat: 0.4, emoji: '🥦' },
  { id: 'f26', name: 'Baby Spinach (Raw)', category: 'Produce', baseAmount: 100, unit: 'g', label: '100g', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, emoji: '🥬' },
  { id: 'f27', name: 'Honeycrisp Apple', category: 'Produce', baseAmount: 1, unit: 'apple', label: '1 medium (182g)', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, emoji: '🍎' },
  // Specialty Drinks
  { id: 'f28', name: 'Double Shot Espresso (Unpressurized)', category: 'Drinks', baseAmount: 1, unit: 'double', label: '1 double shot (36g)', calories: 5, protein: 0.3, carbs: 0.8, fat: 0.1, emoji: '☕' },
  { id: 'f29', name: 'Iced Caffe Latte (Whole Milk)', category: 'Drinks', baseAmount: 1, unit: 'cup', label: '12 oz glass', calories: 135, protein: 7, carbs: 11, fat: 7, emoji: '🧋' },
  { id: 'f30', name: 'Hand-Punched Fresh Lemonade', category: 'Drinks', baseAmount: 1, unit: 'shaker', label: '350ml shaker (Rock Sugar)', calories: 110, protein: 0.3, carbs: 28, fat: 0.1, emoji: '🍋' },
  { id: 'f31', name: 'Oat Milk Flat White', category: 'Drinks', baseAmount: 1, unit: 'cup', label: '8 oz cup', calories: 120, protein: 2, carbs: 15, fat: 5.5, emoji: '☕' }
];

// ============================================================================
// 2. BUILT-IN GYM EXERCISE VAULT & INITIAL ROUTINES
// ============================================================================
const INITIAL_EXERCISE_VAULT = [
  { id: 'ex1', name: 'Barbell Flat Bench Press', muscle: 'Chest', equipment: 'Barbell', defaultRest: 180, prevBest: '90kg × 8', pr1RM: 114, cue: 'Retract scapula, slight arch, touch lower chest.' },
  { id: 'ex2', name: 'Incline Dumbbell Press', muscle: 'Chest', equipment: 'Dumbbell', defaultRest: 120, prevBest: '36kg × 10', pr1RM: 48, cue: '30-degree bench angle, full stretch at bottom.' },
  { id: 'ex3', name: 'Seated Cable Flyes', muscle: 'Chest', equipment: 'Cable', defaultRest: 90, prevBest: '22.5kg × 12', pr1RM: 31.5, cue: 'Squeeze elbows together at peak contraction.' },
  { id: 'ex4', name: 'Seated Overhead DB Shoulder Press', muscle: 'Shoulders', equipment: 'Dumbbell', defaultRest: 120, prevBest: '28kg × 9', pr1RM: 36.4, cue: 'Keep core braced, press slightly in front of face.' },
  { id: 'ex5', name: 'Cable Lateral Raises', muscle: 'Shoulders', equipment: 'Cable', defaultRest: 60, prevBest: '12.5kg × 15', pr1RM: 18.8, cue: 'Lead with pinkies/elbows, pause at shoulder height.' },
  { id: 'ex6', name: 'Tricep Rope Pushdowns', muscle: 'Arms', equipment: 'Cable', defaultRest: 60, prevBest: '32kg × 12', pr1RM: 44.8, cue: 'Lock elbows at sides, spread rope at lockout.' },
  { id: 'ex7', name: 'Weighted Wide-Grip Pull-Ups', muscle: 'Back', equipment: 'Bodyweight', defaultRest: 150, prevBest: '85kg × 8', pr1RM: 107.7, cue: 'Drive elbows down to hips, chin cleanly over bar.' },
  { id: 'ex8', name: 'Barbell Bent-Over Row', muscle: 'Back', equipment: 'Barbell', defaultRest: 150, prevBest: '85kg × 10', pr1RM: 113.3, cue: 'Hinge to 45 degrees, pull to lower sternum.' },
  { id: 'ex9', name: 'Chest-Supported T-Bar Row', muscle: 'Back', equipment: 'Machine', defaultRest: 120, prevBest: '65kg × 10', pr1RM: 86.7, cue: 'Let protract at bottom, flare elbows slightly for upper back.' },
  { id: 'ex10', name: 'Incline Dumbbell Bicep Curls', muscle: 'Arms', equipment: 'Dumbbell', defaultRest: 75, prevBest: '16kg × 11', pr1RM: 21.9, cue: 'Keep shoulders pinned back, supinate wrists.' },
  { id: 'ex11', name: 'High-Bar Back Squat', muscle: 'Quads', equipment: 'Barbell', defaultRest: 180, prevBest: '120kg × 6', pr1RM: 144, cue: 'Knees track over toes, deep hip crease below parallel.' },
  { id: 'ex12', name: 'Romanian Deadlift (RDL)', muscle: 'Hamstrings', equipment: 'Barbell', defaultRest: 150, prevBest: '110kg × 8', pr1RM: 139.3, cue: 'Push hips straight back, shave the shins, stop mid-shin.' },
  { id: 'ex13', name: 'Seated Leg Extensions', muscle: 'Quads', equipment: 'Machine', defaultRest: 90, prevBest: '70kg × 14', pr1RM: 102.7, cue: '1-second hard quad squeeze at the top.' },
  { id: 'ex14', name: 'Lying Leg Curls', muscle: 'Hamstrings', equipment: 'Machine', defaultRest: 90, prevBest: '55kg × 12', pr1RM: 77, cue: 'Keep hips pressed into pad throughout.' },
  { id: 'ex15', name: 'Hanging Leg Raises', muscle: 'Core', equipment: 'Bodyweight', defaultRest: 60, prevBest: '20kg × 15', pr1RM: 30, cue: 'Posteriorly tilt pelvis to engage lower abs.' }
];

const INITIAL_SET_MEALS = [
  {
    id: 'preset_1',
    name: 'Espresso & High-Protein Berry Oats',
    defaultSlot: 'breakfast',
    notes: 'Dialed-in double shot espresso alongside warm whey oats and fresh blueberries.',
    photoType: 'oats',
    items: [
      { foodId: 'f13', name: 'Rolled Oats (Dry)', multiplier: 1.2, unitLabel: '60g', calories: 228, protein: 7.8, carbs: 40.8, fat: 4.0 },
      { foodId: 'f4', name: 'Whey Protein Isolate', multiplier: 1, unitLabel: '1 scoop (30g)', calories: 120, protein: 25, carbs: 1.5, fat: 1.0 },
      { foodId: 'f24', name: 'Fresh Blueberries', multiplier: 0.8, unitLabel: '80g', calories: 46, protein: 0.6, carbs: 11.6, fat: 0.2 },
      { foodId: 'f28', name: 'Double Shot Espresso (Unpressurized)', multiplier: 1, unitLabel: '1 double shot', calories: 5, protein: 0.3, carbs: 0.8, fat: 0.1 }
    ]
  },
  {
    id: 'preset_2',
    name: 'Anabolic Chicken, Jasmine Rice & Avocado Bowl',
    defaultSlot: 'lunch',
    notes: 'Post-training glycogen & protein reload with clean monounsaturated fats.',
    photoType: 'chicken_rice',
    items: [
      { foodId: 'f1', name: 'Chicken Breast (Cooked)', multiplier: 1.8, unitLabel: '180g', calories: 297, protein: 55.8, carbs: 0, fat: 6.5 },
      { foodId: 'f11', name: 'White Jasmine Rice (Cooked)', multiplier: 2.0, unitLabel: '200g', calories: 260, protein: 5.4, carbs: 56, fat: 0.6 },
      { foodId: 'f19', name: 'Hass Avocado', multiplier: 0.75, unitLabel: '75g', calories: 120, protein: 1.5, carbs: 6.4, fat: 11.0 },
      { foodId: 'f25', name: 'Steamed Broccoli Florets', multiplier: 1.0, unitLabel: '100g', calories: 35, protein: 2.4, carbs: 7.2, fat: 0.4 }
    ]
  },
  {
    id: 'preset_3',
    name: 'Grilled Salmon & Sweet Potato Mash',
    defaultSlot: 'dinner',
    notes: 'Omega-3 rich evening meal for recovery and deep sleep.',
    photoType: 'salmon',
    items: [
      { foodId: 'f6', name: 'Atlantic Salmon (Grilled)', multiplier: 1.6, unitLabel: '160g', calories: 330, protein: 35.2, carbs: 0, fat: 19.2 },
      { foodId: 'f14', name: 'Baked Sweet Potato', multiplier: 1.33, unitLabel: '200g', calories: 180, protein: 4.0, carbs: 41.3, fat: 0.3 },
      { foodId: 'f18', name: 'Extra Virgin Olive Oil', multiplier: 0.5, unitLabel: '0.5 tbsp', calories: 60, protein: 0, carbs: 0, fat: 6.8 }
    ]
  }
];

const INITIAL_ROUTINES = [
  {
    id: 'rt_push',
    name: 'Push Hypertrophy A (Chest, Shoulders, Triceps)',
    estBurnKcal: 280,
    targetDurationMin: 65,
    exercises: [
      { exId: 'ex1', targetSets: 3, repRange: '6-8', restSec: 180 },
      { exId: 'ex2', targetSets: 3, repRange: '8-10', restSec: 120 },
      { exId: 'ex4', targetSets: 3, repRange: '8-10', restSec: 120 },
      { exId: 'ex5', targetSets: 3, repRange: '12-15', restSec: 60 },
      { exId: 'ex6', targetSets: 3, repRange: '10-12', restSec: 60 }
    ]
  },
  {
    id: 'rt_pull',
    name: 'Pull Strength & Width (Back, Rear Delts, Biceps)',
    estBurnKcal: 295,
    targetDurationMin: 65,
    exercises: [
      { exId: 'ex7', targetSets: 3, repRange: '6-8', restSec: 150 },
      { exId: 'ex8', targetSets: 3, repRange: '8-10', restSec: 150 },
      { exId: 'ex9', targetSets: 3, repRange: '10-12', restSec: 120 },
      { exId: 'ex10', targetSets: 3, repRange: '10-12', restSec: 75 }
    ]
  },
  {
    id: 'rt_legs',
    name: 'Legs & Core Power (Quads, Hamstrings, Abs)',
    estBurnKcal: 360,
    targetDurationMin: 75,
    exercises: [
      { exId: 'ex11', targetSets: 3, repRange: '5-8', restSec: 180 },
      { exId: 'ex12', targetSets: 3, repRange: '8-10', restSec: 150 },
      { exId: 'ex13', targetSets: 3, repRange: '12-15', restSec: 90 },
      { exId: 'ex14', targetSets: 3, repRange: '10-12', restSec: 90 },
      { exId: 'ex15', targetSets: 3, repRange: '12-15', restSec: 60 }
    ]
  }
];

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const INITIAL_WEEKLY_SCHEDULE = {
  Monday: { gymRoutineId: 'rt_push', meals: { breakfast: 'preset_1', lunch: 'preset_2', dinner: 'preset_3' } },
  Tuesday: { gymRoutineId: 'rt_pull', meals: { breakfast: 'preset_1', lunch: 'preset_2', dinner: 'preset_3' } },
  Wednesday: { gymRoutineId: 'rt_push', meals: { breakfast: 'preset_1', lunch: 'preset_2', dinner: 'preset_3' } },
  Thursday: { gymRoutineId: 'rest', meals: { breakfast: 'preset_1', lunch: 'preset_2', dinner: 'preset_3' } },
  Friday: { gymRoutineId: 'rt_legs', meals: { breakfast: 'preset_1', lunch: 'preset_2', dinner: 'preset_3' } },
  Saturday: { gymRoutineId: 'rt_pull', meals: { breakfast: 'preset_1', lunch: 'preset_2', dinner: 'preset_3' } },
  Sunday: { gymRoutineId: 'rest', meals: { breakfast: 'preset_1', lunch: 'preset_2', dinner: 'preset_3' } }
};

const MEAL_SLOTS = [
  { key: 'breakfast', title: 'Breakfast', icon: Sunrise, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { key: 'lunch', title: 'Lunch', icon: Sun, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { key: 'dinner', title: 'Dinner', icon: Sunset, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
  { key: 'snacks', title: 'Snacks & Specialty Drinks', icon: Coffee, color: 'text-rose-400', bg: 'bg-rose-500/10' }
];

// Generate Stylized SVG Food/Physique Photo Data URLs for Instant Zero-Network Visuals
const createPresetSvgPhoto = (type) => {
  const configs = {
    oats: { bg1: '#1e1b4b', bg2: '#312e81', title: 'Espresso & Berry Protein Oats', sub: '399 kcal • 33.7g P • 54.7g C', icon: '☕🥣🫐' },
    chicken_rice: { bg1: '#064e3b', bg2: '#047857', title: 'Grilled Chicken & Jasmine Rice', sub: '712 kcal • 65.1g P • 69.6g C', icon: '🍗🍚🥑' },
    salmon: { bg1: '#7c2d12', bg2: '#9a3412', title: 'Atlantic Salmon & Sweet Potato', sub: '570 kcal • 39.2g P • 41.3g C', icon: '🍣🍠🫒' },
    physique: { bg1: '#2e1065', bg2: '#4c1d95', title: 'Bi-Weekly Physique Check-In', sub: 'Morning Fasted Lighting', icon: '🏋️‍♂️⚡📸' }
  };
  const c = configs[type] || configs.chicken_rice;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="320" viewBox="0 0 480 320">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${c.bg1}"/>
        <stop offset="100%" stop-color="${c.bg2}"/>
      </linearGradient>
    </defs>
    <rect width="480" height="320" rx="24" fill="url(#g)"/>
    <circle cx="390" cy="70" r="95" fill="rgba(255,255,255,0.06)"/>
    <circle cx="90" cy="260" r="110" fill="rgba(255,255,255,0.04)"/>
    <text x="240" y="135" font-size="54" text-anchor="middle" font-family="sans-serif">${c.icon}</text>
    <text x="240" y="205" font-size="20" font-weight="bold" fill="#ffffff" text-anchor="middle" font-family="sans-serif">${c.title}</text>
    <text x="240" y="238" font-size="14" fill="#a7f3d0" text-anchor="middle" font-family="monospace">${c.sub}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

// Client-Side HTML5 Canvas Image Compressor (for user file uploads)
const compressUploadedImage = (file) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 640;
        let { width, height } = img;
        if (width > height && width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/webp', 0.75));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });

// Web Audio API Synthesized Chime for Rest Timer Completion
const playTimerBeep = () => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.11);
      gain.gain.setValueAtTime(0.16, ctx.currentTime + idx * 0.11);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.11 + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.11);
      osc.stop(ctx.currentTime + idx * 0.11 + 0.24);
    });
  } catch {
    // Ignore audio errors if browser blocks autoplay
  }
};

// ============================================================================
// 3. REUSABLE SVG VISUALIZATION COMPONENTS
// ============================================================================
const ProgressRing = ({ radius = 52, stroke = 8, progress, strokeColor = '#10b981', children }) => {
  const normalizedRadius = radius - stroke;
  const circumference = normalizedRadius * 2 * Math.PI;
  const clamped = Math.min(Math.max(progress || 0, 0), 100);
  const strokeDashoffset = circumference - (clamped / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg height={radius * 2} width={radius * 2} className="-rotate-90 transform">
        <circle
          stroke="rgba(148, 163, 184, 0.14)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={strokeColor}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {children}
      </div>
    </div>
  );
};

const MacroDonutChart = ({ proteinG, carbsG, fatG, totalKcal }) => {
  const pCal = proteinG * 4;
  const cCal = carbsG * 4;
  const fCal = fatG * 9;
  const sumCal = pCal + cCal + fCal;
  const radius = 56;
  const stroke = 14;
  const norm = radius - stroke;
  const circ = norm * 2 * Math.PI;

  const pPct = sumCal > 0 ? (pCal / sumCal) * 100 : 33;
  const cPct = sumCal > 0 ? (cCal / sumCal) * 100 : 34;
  const fPct = sumCal > 0 ? (fCal / sumCal) * 100 : 33;

  const pLen = (pPct / 100) * circ;
  const cLen = (cPct / 100) * circ;
  const fLen = (fPct / 100) * circ;

  return (
    <div className="flex items-center gap-4">
      <div className="relative inline-flex items-center justify-center shrink-0">
        <svg height={radius * 2} width={radius * 2} className="-rotate-90 transform">
          <circle stroke="rgba(148,163,184,0.12)" fill="transparent" strokeWidth={stroke} r={norm} cx={radius} cy={radius} />
          {sumCal > 0 && (
            <>
              <circle stroke="#0ea5e9" fill="transparent" strokeWidth={stroke} strokeDasharray={`${pLen} ${circ}`} strokeDashoffset={0} r={norm} cx={radius} cy={radius} />
              <circle stroke="#f59e0b" fill="transparent" strokeWidth={stroke} strokeDasharray={`${cLen} ${circ}`} strokeDashoffset={-pLen} r={norm} cx={radius} cy={radius} />
              <circle stroke="#f43f5e" fill="transparent" strokeWidth={stroke} strokeDasharray={`${fLen} ${circ}`} strokeDashoffset={-(pLen + cLen)} r={norm} cx={radius} cy={radius} />
            </>
          )}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-sm font-extrabold text-white">{Math.round(totalKcal)}</span>
          <span className="text-[9px] uppercase tracking-wider text-slate-400">kcal</span>
        </div>
      </div>

      <div className="flex-1 space-y-1.5 text-xs">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>Protein
          </span>
          <span className="font-bold text-white">{Math.round(pPct)}%</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>Carbs
          </span>
          <span className="font-bold text-white">{Math.round(cPct)}%</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>Fat
          </span>
          <span className="font-bold text-white">{Math.round(fPct)}%</span>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 4. MAIN APPLICATION COMPONENT (OpenFit OS)
// ============================================================================
export default function App() {
  // --- Global Side & Sub-Tab Navigation ---
  const [activeSide, setActiveSide] = useState('nutrition'); // 'nutrition' | 'gym'
  const [nutritionTab, setNutritionTab] = useState('tracker'); // 'tracker' | 'planner' | 'vault'
  const [gymTab, setGymTab] = useState('workout'); // 'workout' | 'routines' | 'analytics'
  const [selectedDate, setSelectedDate] = useState('2026-10-14');

  // --- Shared Biometrics, Age-in-Days & Adaptive Kcal Profile ---
  const [profile, setProfile] = useState(() => {
    const fallback = {
      name: 'Athlete',
      dob: '2004-05-15',
      gender: 'male',
      heightCm: 178,
      heightUnit: 'cm',
      weightKg: 76.4,
      weightUnit: 'kg',
      activityMultiplier: 1.55,
      goalType: 'cut', // 'cut' (-500), 'maintain' (0), 'lean_bulk' (+300)
      macroSplit: { p: 35, c: 40, f: 25 },
      includeGymBonusKcal: true,
      manualKcalOverride: null,
      checkInIntervalDays: 14,
      lastCheckInDate: '2026-09-29',
      weightHistory: [
        { id: 'w1', date: '2026-09-01', weightKg: 78.0, appliedKcal: 2350, note: 'Start of Autumn Cut', photoUrl: null },
        { id: 'w2', date: '2026-09-15', weightKg: 77.1, appliedKcal: 2300, note: '2-Week Check-In (-0.9kg)', photoUrl: null },
        { id: 'w3', date: '2026-09-29', weightKg: 76.4, appliedKcal: 2220, note: 'Steady drop, strength up', photoUrl: createPresetSvgPhoto('physique') }
      ]
    };
    try {
      const saved = localStorage.getItem('openfit_profile_v2');
      return saved ? { ...fallback, ...JSON.parse(saved) } : fallback;
    } catch {
      return fallback;
    }
  });

  // --- Food Vault & Set Meals ---
  const [foodVault, setFoodVault] = useState(() => {
    try {
      const saved = localStorage.getItem('openfit_foods_v2');
      return saved ? JSON.parse(saved) : INITIAL_FOOD_VAULT;
    } catch {
      return INITIAL_FOOD_VAULT;
    }
  });

  const [setMeals, setSetMeals] = useState(() => {
    try {
      const saved = localStorage.getItem('openfit_setmeals_v2');
      return saved ? JSON.parse(saved) : INITIAL_SET_MEALS;
    } catch {
      return INITIAL_SET_MEALS;
    }
  });

  // --- Weekly Schedule (Meals & Gym Routines) ---
  const [weeklySchedule, setWeeklySchedule] = useState(() => {
    try {
      const saved = localStorage.getItem('openfit_schedule_v2');
      return saved ? JSON.parse(saved) : INITIAL_WEEKLY_SCHEDULE;
    } catch {
      return INITIAL_WEEKLY_SCHEDULE;
    }
  });

  // --- Daily Nutrition Logs by Date (YYYY-MM-DD) ---
  const [dailyNutritionLogs, setDailyNutritionLogs] = useState(() => {
    const initialDayLog = {
      '2026-10-14': {
        waterMl: 1750,
        meals: {
          breakfast: [
            { id: 'm1', name: 'Rolled Oats (Dry)', amountLabel: '60g', multiplier: 1.2, baseCal: 190, baseP: 6.5, baseC: 34, baseF: 3.3, photoUrl: createPresetSvgPhoto('oats') },
            { id: 'm2', name: 'Whey Protein Isolate', amountLabel: '1 scoop (30g)', multiplier: 1, baseCal: 120, baseP: 25, baseC: 1.5, baseF: 1, photoUrl: null },
            { id: 'm3', name: 'Double Shot Espresso (Unpressurized)', amountLabel: '1 double shot', multiplier: 1, baseCal: 5, baseP: 0.3, baseC: 0.8, baseF: 0.1, photoUrl: null }
          ],
          lunch: [
            { id: 'm4', name: 'Chicken Breast (Cooked)', amountLabel: '180g', multiplier: 1.8, baseCal: 165, baseP: 31, baseC: 0, baseF: 3.6, photoUrl: createPresetSvgPhoto('chicken_rice') },
            { id: 'm5', name: 'White Jasmine Rice (Cooked)', amountLabel: '200g', multiplier: 2, baseCal: 130, baseP: 2.7, baseC: 28, baseF: 0.3, photoUrl: null },
            { id: 'm6', name: 'Hass Avocado', amountLabel: '75g', multiplier: 0.75, baseCal: 160, baseP: 2, baseC: 8.5, baseF: 14.7, photoUrl: null }
          ],
          dinner: [],
          snacks: [
            { id: 'm7', name: 'Hand-Punched Fresh Lemonade', amountLabel: '350ml shaker', multiplier: 1, baseCal: 110, baseP: 0.3, baseC: 28, baseF: 0.1, photoUrl: null }
          ]
        }
      }
    };
    try {
      const saved = localStorage.getItem('openfit_nutrition_logs_v2');
      return saved ? JSON.parse(saved) : initialDayLog;
    } catch {
      return initialDayLog;
    }
  });

  // --- Gym Exercises, Routines & Daily Workout Sessions ---
  const [exerciseVault, setExerciseVault] = useState(() => {
    try {
      const saved = localStorage.getItem('openfit_exercises_v2');
      return saved ? JSON.parse(saved) : INITIAL_EXERCISE_VAULT;
    } catch {
      return INITIAL_EXERCISE_VAULT;
    }
  });

  const [routines, setRoutines] = useState(() => {
    try {
      const saved = localStorage.getItem('openfit_routines_v2');
      return saved ? JSON.parse(saved) : INITIAL_ROUTINES;
    } catch {
      return INITIAL_ROUTINES;
    }
  });

  const [workoutSessions, setWorkoutSessions] = useState(() => {
    const defaultSession = {
      '2026-10-14': {
        routineId: 'rt_push',
        title: 'Push Hypertrophy A (Chest, Shoulders, Triceps)',
        durationSec: 2480,
        pumpPhotoUrl: null,
        exercises: [
          {
            id: 'we1',
            exId: 'ex1',
            name: 'Barbell Flat Bench Press',
            muscle: 'Chest',
            restSec: 180,
            prevBest: '90kg × 8',
            pr1RM: 114,
            cue: 'Retract scapula, slight arch, touch lower chest.',
            sets: [
              { id: 's1', type: 'Warmup', weight: 60, reps: 10, rpe: 6, completed: true },
              { id: 's2', type: 'Working', weight: 92.5, reps: 8, rpe: 8.5, completed: true },
              { id: 's3', type: 'Working', weight: 92.5, reps: 8, rpe: 9, completed: false }
            ]
          },
          {
            id: 'we2',
            exId: 'ex2',
            name: 'Incline Dumbbell Press',
            muscle: 'Chest',
            restSec: 120,
            prevBest: '36kg × 10',
            pr1RM: 48,
            cue: '30-degree bench angle, full stretch at bottom.',
            sets: [
              { id: 's4', type: 'Working', weight: 38, reps: 10, rpe: 8.5, completed: true },
              { id: 's5', type: 'Working', weight: 38, reps: 9, rpe: 9, completed: false }
            ]
          },
          {
            id: 'we3',
            exId: 'ex5',
            name: 'Cable Lateral Raises',
            muscle: 'Shoulders',
            restSec: 60,
            prevBest: '12.5kg × 15',
            pr1RM: 18.8,
            cue: 'Lead with elbows, pause at shoulder height.',
            sets: [
              { id: 's6', type: 'Working', weight: 12.5, reps: 15, rpe: 8, completed: true },
              { id: 's7', type: 'Drop', weight: 10, reps: 15, rpe: 9.5, completed: false }
            ]
          }
        ]
      }
    };
    try {
      const saved = localStorage.getItem('openfit_workouts_v2');
      return saved ? JSON.parse(saved) : defaultSession;
    } catch {
      return defaultSession;
    }
  });

  // --- Rest Timer (Break Time) & Active Workout Stopwatch ---
  const [restTimer, setRestTimer] = useState({
    active: false,
    remainingSec: 90,
    totalSec: 90,
    exerciseName: 'Barbell Flat Bench Press',
    soundEnabled: true
  });
  const [workoutRunning, setWorkoutRunning] = useState(false);

  // --- Modals & UI Overlays ---
  const [showBiometricsModal, setShowBiometricsModal] = useState(false);
  const [showAddFoodModal, setShowAddFoodModal] = useState(false);
  const [activeMealSlot, setActiveMealSlot] = useState('breakfast');
  const [showAiDrawer, setShowAiDrawer] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [toast, setToast] = useState(null);

  // --- Local Storage Sync ---
  useEffect(() => {
    try {
      localStorage.setItem('openfit_profile_v2', JSON.stringify(profile));
      localStorage.setItem('openfit_foods_v2', JSON.stringify(foodVault));
      localStorage.setItem('openfit_setmeals_v2', JSON.stringify(setMeals));
      localStorage.setItem('openfit_schedule_v2', JSON.stringify(weeklySchedule));
      localStorage.setItem('openfit_nutrition_logs_v2', JSON.stringify(dailyNutritionLogs));
      localStorage.setItem('openfit_exercises_v2', JSON.stringify(exerciseVault));
      localStorage.setItem('openfit_routines_v2', JSON.stringify(routines));
      localStorage.setItem('openfit_workouts_v2', JSON.stringify(workoutSessions));
    } catch {
      // Ignore quota errors
    }
  }, [profile, foodVault, setMeals, weeklySchedule, dailyNutritionLogs, exerciseVault, routines, workoutSessions]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  // --- Rest Timer Countdown Effect ---
  useEffect(() => {
    if (!restTimer.active) return;
    const interval = setInterval(() => {
      setRestTimer((prev) => {
        if (prev.remainingSec <= 1) {
          if (prev.soundEnabled) playTimerBeep();
          showToast(`⏱️ Break time finished for ${prev.exerciseName}! Ready for next set.`);
          return { ...prev, active: false, remainingSec: 0 };
        }
        return { ...prev, remainingSec: prev.remainingSec - 1 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [restTimer.active]);

  // --- Workout Session Duration Stopwatch Effect ---
  useEffect(() => {
    if (!workoutRunning) return;
    const interval = setInterval(() => {
      setWorkoutSessions((prev) => {
        const current = prev[selectedDate] || {
          routineId: 'rt_push',
          title: 'Custom Training Session',
          durationSec: 0,
          exercises: []
        };
        return {
          ...prev,
          [selectedDate]: {
            ...current,
            durationSec: (current.durationSec || 0) + 1
          }
        };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [workoutRunning, selectedDate]);

  // ============================================================================
  // 5. DETERMINISTIC BIOMETRICS, AGE-IN-DAYS & ADAPTIVE TDEE ENGINE
  // ============================================================================
  const biometricMetrics = useMemo(() => {
    const dobDate = new Date(profile.dob || '2004-05-15');
    const refDate = new Date(selectedDate || '2026-10-14');
    const diffMs = Math.max(0, refDate.getTime() - dobDate.getTime());
    const exactDaysOld = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const exactYearsOld = exactDaysOld / 365.2425;

    // Check-In Due Calculation
    const lastCheckDate = new Date(profile.lastCheckInDate || '2026-09-29');
    const daysSinceCheckIn = Math.floor((refDate.getTime() - lastCheckDate.getTime()) / (1000 * 60 * 60 * 24));
    const isCheckInDue = daysSinceCheckIn >= (profile.checkInIntervalDays || 14);

    // Mifflin-St Jeor Equation using exact fractional age
    const weightKg = Number(profile.weightKg) || 75;
    const heightCm = Number(profile.heightCm) || 178;
    let bmr = 10 * weightKg + 6.25 * heightCm - 5 * exactYearsOld;
    bmr += profile.gender === 'male' ? 5 : -161;

    const baselineTdee = Math.round(bmr * (Number(profile.activityMultiplier) || 1.55));
    const goalAdjustment = profile.goalType === 'cut' ? -500 : profile.goalType === 'lean_bulk' ? 300 : 0;

    // Determine if selectedDate has a scheduled or logged workout burn bonus
    const dayOfWeekName = DAYS_OF_WEEK[(refDate.getDay() + 6) % 7];
    const scheduledRoutineId = weeklySchedule[dayOfWeekName]?.gymRoutineId;
    const scheduledRoutine = routines.find((r) => r.id === scheduledRoutineId);
    const gymBonusKcal = profile.includeGymBonusKcal && scheduledRoutine ? scheduledRoutine.estBurnKcal : 0;

    const baseTargetKcal = profile.manualKcalOverride
      ? Number(profile.manualKcalOverride)
      : Math.max(1200, baselineTdee + goalAdjustment);

    const effectiveTargetKcal = baseTargetKcal + gymBonusKcal;

    const { p, c, f } = profile.macroSplit;
    const proteinGrams = Math.round((effectiveTargetKcal * (p / 100)) / 4);
    const carbsGrams = Math.round((effectiveTargetKcal * (c / 100)) / 4);
    const fatGrams = Math.round((effectiveTargetKcal * (f / 100)) / 9);

    // Adaptive Kcal Empirical Engine from last 2 weight logs
    let adaptiveSuggestion = null;
    if (profile.weightHistory && profile.weightHistory.length >= 2) {
      const latest = profile.weightHistory[profile.weightHistory.length - 1];
      const prev = profile.weightHistory[profile.weightHistory.length - 2];
      const dDays = Math.max(1, Math.round((new Date(latest.date) - new Date(prev.date)) / 86400000));
      const dWeightKg = latest.weightKg - prev.weightKg;
      const actualDailyDeficitSurplus = Math.round((dWeightKg * 7700) / dDays);
      const expectedDailyBalance = goalAdjustment;
      const discrepancy = actualDailyDeficitSurplus - expectedDailyBalance;
      const recommendedNewKcal = Math.max(1300, Math.round(baseTargetKcal - discrepancy * 0.5));
      adaptiveSuggestion = {
        dDays,
        dWeightKg: Number(dWeightKg.toFixed(2)),
        actualDailyDeficitSurplus,
        expectedDailyBalance,
        recommendedNewKcal
      };
    }

    return {
      exactDaysOld,
      exactYearsOld: exactYearsOld.toFixed(2),
      daysSinceCheckIn,
      isCheckInDue,
      bmr: Math.round(bmr),
      baselineTdee,
      gymBonusKcal,
      dayOfWeekName,
      scheduledRoutine,
      targetCalories: effectiveTargetKcal,
      proteinGrams,
      carbsGrams,
      fatGrams,
      adaptiveSuggestion
    };
  }, [profile, selectedDate, weeklySchedule, routines]);

  // ============================================================================
  // 6. CURRENT DAY NUTRITION & GYM AGGREGATIONS
  // ============================================================================
  const currentDayLog = useMemo(() => {
    return (
      dailyNutritionLogs[selectedDate] || {
        waterMl: 0,
        meals: { breakfast: [], lunch: [], dinner: [], snacks: [] }
      }
    );
  }, [dailyNutritionLogs, selectedDate]);

  const consumedMacros = useMemo(() => {
    const slotTotals = {};
    let totalCal = 0;
    let totalP = 0;
    let totalC = 0;
    let totalF = 0;

    MEAL_SLOTS.forEach(({ key }) => {
      const items = currentDayLog.meals[key] || [];
      const sub = items.reduce(
        (acc, item) => {
          const m = Number(item.multiplier) || 1;
          return {
            calories: acc.calories + item.baseCal * m,
            protein: acc.protein + item.baseP * m,
            carbs: acc.carbs + item.baseC * m,
            fat: acc.fat + item.baseF * m
          };
        },
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      );
      slotTotals[key] = sub;
      totalCal += sub.calories;
      totalP += sub.protein;
      totalC += sub.carbs;
      totalF += sub.fat;
    });

    return {
      calories: Math.round(totalCal),
      protein: Number(totalP.toFixed(1)),
      carbs: Number(totalC.toFixed(1)),
      fat: Number(totalF.toFixed(1)),
      slotTotals
    };
  }, [currentDayLog]);

  const currentWorkout = useMemo(() => {
    if (workoutSessions[selectedDate]) return workoutSessions[selectedDate];
    const schedRoutine = biometricMetrics.scheduledRoutine || routines[0];
    return {
      routineId: schedRoutine.id,
      title: schedRoutine.name,
      durationSec: 0,
      pumpPhotoUrl: null,
      exercises: schedRoutine.exercises.map((re, idx) => {
        const vaultEx = exerciseVault.find((e) => e.id === re.exId) || INITIAL_EXERCISE_VAULT[0];
        return {
          id: `init_${idx}`,
          exId: vaultEx.id,
          name: vaultEx.name,
          muscle: vaultEx.muscle,
          restSec: re.restSec || vaultEx.defaultRest,
          prevBest: vaultEx.prevBest,
          pr1RM: vaultEx.pr1RM,
          cue: vaultEx.cue,
          sets: Array.from({ length: re.targetSets }).map((_, sIdx) => ({
            id: `set_${idx}_${sIdx}`,
            type: 'Working',
            weight: parseFloat(vaultEx.prevBest) || 60,
            reps: 8,
            rpe: 8,
            completed: false
          }))
        };
      })
    };
  }, [workoutSessions, selectedDate, biometricMetrics.scheduledRoutine, routines, exerciseVault]);

  const workoutSummary = useMemo(() => {
    let tonnageKg = 0;
    let completedSets = 0;
    let totalSets = 0;
    let prCount = 0;

    currentWorkout.exercises.forEach((ex) => {
      ex.sets.forEach((s) => {
        totalSets += 1;
        const w = Number(s.weight) || 0;
        const r = Number(s.reps) || 0;
        const est1RM = w * (1 + r / 30);
        if (est1RM > (ex.pr1RM || 0) && r > 0) {
          prCount += 1;
        }
        if (s.completed) {
          completedSets += 1;
          tonnageKg += w * r;
        }
      });
    });

    return {
      tonnageKg: Math.round(tonnageKg),
      completedSets,
      totalSets,
      prCount
    };
  }, [currentWorkout]);

  // Weekly Muscle Group Working Sets Aggregation
  const weeklyMuscleVolume = useMemo(() => {
    const counts = { Chest: 6, Back: 6, Shoulders: 4, Quads: 4, Hamstrings: 3, Arms: 5, Core: 3 };
    currentWorkout.exercises.forEach((ex) => {
      const done = ex.sets.filter((s) => s.completed && s.type !== 'Warmup').length;
      if (counts[ex.muscle] !== undefined) {
        counts[ex.muscle] += done;
      }
    });
    return counts;
  }, [currentWorkout]);

  // ============================================================================
  // 7. ACTION HANDLERS (NUTRITION, GYM, BIOMETRICS)
  // ============================================================================
  const changeDateByDays = (delta) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + delta);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const addWater = (ml) => {
    setDailyNutritionLogs((prev) => {
      const day = prev[selectedDate] || { waterMl: 0, meals: { breakfast: [], lunch: [], dinner: [], snacks: [] } };
      return {
        ...prev,
        [selectedDate]: { ...day, waterMl: Math.max(0, (day.waterMl || 0) + ml) }
      };
    });
  };

  const logFoodItemToSlot = (food, multiplier = 1, slotKey = activeMealSlot, customPhotoUrl = null) => {
    const m = Number(multiplier) || 1;
    const newEntry = {
      id: `entry_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      name: food.name,
      amountLabel: food.unit === 'g' ? `${Math.round(food.baseAmount * m)}g` : `${m} × ${food.label}`,
      multiplier: m,
      baseCal: food.calories,
      baseP: food.protein,
      baseC: food.carbs,
      baseF: food.fat,
      photoUrl: customPhotoUrl
    };

    setDailyNutritionLogs((prev) => {
      const day = prev[selectedDate] || { waterMl: 0, meals: { breakfast: [], lunch: [], dinner: [], snacks: [] } };
      return {
        ...prev,
        [selectedDate]: {
          ...day,
          meals: {
            ...day.meals,
            [slotKey]: [...(day.meals[slotKey] || []), newEntry]
          }
        }
      };
    });
    showToast(`🥗 Added ${food.name} to ${slotKey}`);
  };

  const logSetMealPreset = (preset, targetSlot = preset.defaultSlot) => {
    const newEntries = preset.items.map((item, idx) => ({
      id: `preset_entry_${Date.now()}_${idx}`,
      name: item.name,
      amountLabel: item.unitLabel,
      multiplier: 1,
      baseCal: item.calories,
      baseP: item.protein,
      baseC: item.carbs,
      baseF: item.fat,
      photoUrl: idx === 0 && preset.photoType ? createPresetSvgPhoto(preset.photoType) : null
    }));

    setDailyNutritionLogs((prev) => {
      const day = prev[selectedDate] || { waterMl: 0, meals: { breakfast: [], lunch: [], dinner: [], snacks: [] } };
      return {
        ...prev,
        [selectedDate]: {
          ...day,
          meals: {
            ...day.meals,
            [targetSlot]: [...(day.meals[targetSlot] || []), ...newEntries]
          }
        }
      };
    });
    showToast(`✨ Loaded Set Meal "${preset.name}" into ${targetSlot}!`);
  };

  const updateMealItemMultiplier = (slotKey, entryId, newMultiplier) => {
    const m = Math.max(0.25, Number(newMultiplier) || 1);
    setDailyNutritionLogs((prev) => {
      const day = prev[selectedDate];
      if (!day) return prev;
      return {
        ...prev,
        [selectedDate]: {
          ...day,
          meals: {
            ...day.meals,
            [slotKey]: day.meals[slotKey].map((item) =>
              item.id === entryId ? { ...item, multiplier: Number(m.toFixed(2)) } : item
            )
          }
        }
      };
    });
  };

  const attachPhotoToMealEntry = async (slotKey, entryId, fileOrPresetType) => {
    const photoUrl =
      typeof fileOrPresetType === 'string'
        ? createPresetSvgPhoto(fileOrPresetType)
        : await compressUploadedImage(fileOrPresetType);

    setDailyNutritionLogs((prev) => {
      const day = prev[selectedDate];
      if (!day) return prev;
      return {
        ...prev,
        [selectedDate]: {
          ...day,
          meals: {
            ...day.meals,
            [slotKey]: day.meals[slotKey].map((item) =>
              item.id === entryId ? { ...item, photoUrl } : item
            )
          }
        }
      };
    });
    showToast('📸 Attached compressed WebP photo to meal!');
  };

  const removeMealEntry = (slotKey, entryId) => {
    setDailyNutritionLogs((prev) => {
      const day = prev[selectedDate];
      if (!day) return prev;
      return {
        ...prev,
        [selectedDate]: {
          ...day,
          meals: {
            ...day.meals,
            [slotKey]: day.meals[slotKey].filter((i) => i.id !== entryId)
          }
        }
      };
    });
  };

  const applyScheduledMealsForToday = () => {
    const daySchedule = weeklySchedule[biometricMetrics.dayOfWeekName]?.meals;
    if (!daySchedule) return;
    Object.entries(daySchedule).forEach(([slot, presetId]) => {
      const found = setMeals.find((p) => p.id === presetId);
      if (found) logSetMealPreset(found, slot);
    });
  };

  // --- Gym Set Recorder Handlers ---
  const mutateCurrentWorkout = (updater) => {
    setWorkoutSessions((prev) => {
      const base = prev[selectedDate] || currentWorkout;
      return {
        ...prev,
        [selectedDate]: updater(base)
      };
    });
  };

  const toggleSetCompleted = (exIndex, setIndex) => {
    const targetEx = currentWorkout.exercises[exIndex];
    const targetSet = targetEx.sets[setIndex];
    const nextCompleted = !targetSet.completed;

    mutateCurrentWorkout((session) => {
      const updatedExercises = session.exercises.map((ex, eIdx) => {
        if (eIdx !== exIndex) return ex;
        return {
          ...ex,
          sets: ex.sets.map((s, sIdx) => (sIdx === setIndex ? { ...s, completed: nextCompleted } : s))
        };
      });
      return { ...session, exercises: updatedExercises };
    });

    if (nextCompleted) {
      // Automatically start Break Time Rest Countdown!
      setRestTimer((prev) => ({
        ...prev,
        active: true,
        remainingSec: targetEx.restSec || 90,
        totalSec: targetEx.restSec || 90,
        exerciseName: targetEx.name
      }));
      showToast(`⏱️ Set Complete! Auto-started ${targetEx.restSec}s break timer.`);
    }
  };

  const updateSetField = (exIndex, setIndex, field, value) => {
    mutateCurrentWorkout((session) => ({
      ...session,
      exercises: session.exercises.map((ex, eIdx) =>
        eIdx !== exIndex
          ? ex
          : {
              ...ex,
              sets: ex.sets.map((s, sIdx) => (sIdx === setIndex ? { ...s, [field]: value } : s))
            }
      )
    }));
  };

  const cycleSetType = (exIndex, setIndex) => {
    const order = ['Warmup', 'Working', 'Drop', 'Failure'];
    const currentType = currentWorkout.exercises[exIndex].sets[setIndex].type;
    const nextType = order[(order.indexOf(currentType) + 1) % order.length];
    updateSetField(exIndex, setIndex, 'type', nextType);
  };

  const addSetToExercise = (exIndex) => {
    mutateCurrentWorkout((session) => ({
      ...session,
      exercises: session.exercises.map((ex, eIdx) => {
        if (eIdx !== exIndex) return ex;
        const lastSet = ex.sets[ex.sets.length - 1] || { weight: 60, reps: 10, rpe: 8 };
        return {
          ...ex,
          sets: [
            ...ex.sets,
            {
              id: `set_${Date.now()}`,
              type: 'Working',
              weight: lastSet.weight,
              reps: lastSet.reps,
              rpe: lastSet.rpe,
              completed: false
            }
          ]
        };
      })
    }));
  };

  const addExerciseToSession = (vaultEx) => {
    mutateCurrentWorkout((session) => ({
      ...session,
      exercises: [
        ...session.exercises,
        {
          id: `we_${Date.now()}`,
          exId: vaultEx.id,
          name: vaultEx.name,
          muscle: vaultEx.muscle,
          restSec: vaultEx.defaultRest,
          prevBest: vaultEx.prevBest,
          pr1RM: vaultEx.pr1RM,
          cue: vaultEx.cue,
          sets: [
            { id: `s_${Date.now()}_1`, type: 'Working', weight: parseFloat(vaultEx.prevBest) || 50, reps: 10, rpe: 8, completed: false },
            { id: `s_${Date.now()}_2`, type: 'Working', weight: parseFloat(vaultEx.prevBest) || 50, reps: 10, rpe: 8.5, completed: false }
          ]
        }
      ]
    }));
    showToast(`🏋️ Added ${vaultEx.name} to workout!`);
  };

  // Coupled Macro Percentage Slider Handler
  const handleCoupledMacroChange = (key, rawVal) => {
    const val = Math.max(5, Math.min(80, Number(rawVal)));
    setProfile((prev) => {
      const others = ['p', 'c', 'f'].filter((k) => k !== key);
      const rem = 100 - val;
      const otherSum = prev.macroSplit[others[0]] + prev.macroSplit[others[1]];
      const next0 = otherSum > 0 ? Math.round((prev.macroSplit[others[0]] / otherSum) * rem) : Math.round(rem / 2);
      const next1 = rem - next0;
      return {
        ...prev,
        macroSplit: {
          ...prev.macroSplit,
          [key]: val,
          [others[0]]: next0,
          [others[1]]: next1
        }
      };
    });
  };

  // Format Seconds to MM:SS
  const formatTime = (sec) => {
    const m = Math.floor((sec || 0) / 60);
    const s = (sec || 0) % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // --- Sub-Component States for Forms ---
  const [foodSearch, setFoodSearch] = useState('');
  const [foodCatFilter, setFoodCatFilter] = useState('All');
  const [newSetMeal, setNewSetMeal] = useState({ name: '', defaultSlot: 'lunch', notes: '', selectedFoodIds: ['f1', 'f11'] });
  const [newWeightEntry, setNewWeightEntry] = useState({ weightKg: profile.weightKg, note: 'Bi-Weekly Morning Check-In', includePhoto: true });
  const [newCustomFood, setNewCustomFood] = useState({ name: '', category: 'Protein', label: '100g', calories: 150, protein: 20, carbs: 10, fat: 3 });
  const [oneRmCalcWeight, setOneRmCalcWeight] = useState(100);
  const [oneRmCalcReps, setOneRmCalcReps] = useState(5);
  const [aiApiKey, setAiApiKey] = useState('');
  const [aiModel, setAiModel] = useState('deepseek-v4-pro');

  const isNutrition = activeSide === 'nutrition';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500/30 pb-28">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-20 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900/95 border border-emerald-500/50 text-white shadow-2xl shadow-emerald-500/10 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{toast}</span>
        </div>
      )}

      {/* =====================================================================
          PERSISTENT GLOBAL HEADER & DUAL-SIDE MODE SWITCHER
      ===================================================================== */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/85 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-lg transition-all duration-300 ${
                isNutrition
                  ? 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/25'
                  : 'bg-gradient-to-br from-violet-600 to-cyan-500 shadow-violet-500/25'
              }`}
            >
              {isNutrition ? <Flame className="w-5 h-5" /> : <Dumbbell className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold tracking-tight text-white">OpenFit OS</h1>
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                    isNutrition
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-violet-500/10 text-violet-300 border-violet-500/30'
                  }`}
                >
                  {isNutrition ? 'Nutrition Side' : 'Gym Side'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Dual-Hemisphere Biometric, Macro & Hypertrophy Engine
              </p>
            </div>
          </div>

          {/* CENTERPIECE: Instant Dual-Side Mode Switcher */}
          <div className="flex items-center p-1 rounded-2xl bg-slate-900 border border-slate-800 shadow-inner">
            <button
              onClick={() => setActiveSide('nutrition')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isNutrition
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>🥗 Nutrition Side</span>
            </button>
            <button
              onClick={() => setActiveSide('gym')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                !isNutrition
                  ? 'bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-md shadow-violet-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Dumbbell className="w-3.5 h-3.5" />
              <span>🏋️ Gym Side</span>
              {restTimer.active && (
                <span className="ml-1 px-1.5 py-0.5 text-[10px] rounded-full bg-amber-500 text-slate-950 font-extrabold animate-pulse">
                  {formatTime(restTimer.remainingSec)}
                </span>
              )}
            </button>
          </div>

          {/* Right Global Controls: Date Scrubber, Live Age-in-Days Pill, AI & Backup */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Unified Date Scrubber */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl px-1.5 py-1 text-xs">
              <button
                onClick={() => changeDateByDays(-1)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
                title="Previous Day"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="px-2 flex items-center gap-1.5 font-semibold text-slate-200">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>{selectedDate}</span>
                <span className="text-[10px] text-slate-400 hidden md:inline">({biometricMetrics.dayOfWeekName.slice(0, 3)})</span>
              </div>
              <button
                onClick={() => changeDateByDays(1)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
                title="Next Day"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Live Age-in-Days & Biometric Check-In Pill */}
            <button
              onClick={() => setShowBiometricsModal(true)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
                biometricMetrics.isCheckInDue
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 hover:bg-amber-500/20'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
              title="Open Biometric Profile, Exact Age-in-Days & Adaptive Weight Check-In"
            >
              <Scale className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden xl:inline">{biometricMetrics.exactDaysOld.toLocaleString()} Days Old •</span>
              <span>{profile.weightKg}kg</span>
              {biometricMetrics.isCheckInDue && (
                <span className="px-1.5 py-0.5 text-[10px] rounded-md bg-amber-500 text-slate-950 font-extrabold">
                  Check-In Due
                </span>
              )}
            </button>

            {/* DeepSeek AI Coach Button */}
            <button
              onClick={() => setShowAiDrawer(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold transition"
            >
              <Bot className="w-4 h-4" />
              <span className="hidden sm:inline">AI Coach</span>
            </button>

            {/* JSON Backup / Export Modal Trigger */}
            <button
              onClick={() => setShowBackupModal(true)}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition"
              title="Local Storage & JSON Export/Import"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sub-Navigation Bar (Contextual to Active Side) */}
        <div className="bg-slate-900/60 border-t border-slate-800/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between overflow-x-auto">
            {isNutrition ? (
              <div className="flex items-center gap-1 py-1.5">
                {[
                  { id: 'tracker', label: 'Daily Macro Tracker', icon: Activity },
                  { id: 'planner', label: 'Set Meals & Weekly Planner', icon: Layers },
                  { id: 'vault', label: 'Food Vault (31+ Items)', icon: Utensils }
                ].map((t) => {
                  const Icon = t.icon;
                  const active = nutritionTab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setNutritionTab(t.id)}
                      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                        active
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center gap-1 py-1.5">
                {[
                  { id: 'workout', label: 'Active Workout & Set Recorder', icon: Dumbbell },
                  { id: 'routines', label: 'Routine Split & Weekly Schedule', icon: Calendar },
                  { id: 'analytics', label: 'Muscle Volume & 1RM Analytics', icon: BarChart3 }
                ].map((t) => {
                  const Icon = t.icon;
                  const active = gymTab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setGymTab(t.id)}
                      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                        active
                          ? 'bg-violet-500/15 text-violet-300 border border-violet-500/30'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="hidden md:flex items-center gap-3 text-[11px] text-slate-400">
              <span>
                Age: <strong className="text-slate-200">{biometricMetrics.exactDaysOld.toLocaleString()} days</strong> ({biometricMetrics.exactYearsOld} yrs)
              </span>
              <span>•</span>
              <span>
                Height: <strong className="text-slate-200">{profile.heightCm} cm</strong>
              </span>
              <span>•</span>
              <span>
                BMR: <strong className="text-slate-200">{biometricMetrics.bmr} kcal</strong>
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* =====================================================================
          MAIN WORKSPACE CONTENT
      ===================================================================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* ===================================================================
            SIDE A: 🥗 THE NUTRITION SIDE
        =================================================================== */}
        {isNutrition && (
          <>
            {/* TAB A1: DAILY MACRO TRACKER */}
            {nutritionTab === 'tracker' && (
              <div className="space-y-6">
                {/* Cross-Side Gym-to-Nutrition Sync Banner */}
                <div className="bg-gradient-to-r from-slate-900 via-emerald-950/30 to-slate-900 rounded-2xl p-4 border border-emerald-500/25 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-400">
                      <Dumbbell className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                          Gym ↔ Nutrition Sync ({biometricMetrics.dayOfWeekName})
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 font-semibold">
                          {biometricMetrics.scheduledRoutine ? biometricMetrics.scheduledRoutine.name : 'Rest & Recovery Day'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5">
                        {biometricMetrics.scheduledRoutine
                          ? `Scheduled gym session adds +${biometricMetrics.scheduledRoutine.estBurnKcal} kcal training expenditure to today's target.`
                          : 'Rest day scheduled — keeping baseline calorie target for optimal body recomposition.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer bg-slate-900/90 px-3 py-2 rounded-xl border border-slate-800">
                      <input
                        type="checkbox"
                        checked={profile.includeGymBonusKcal}
                        onChange={(e) => setProfile({ ...profile, includeGymBonusKcal: e.target.checked })}
                        className="rounded accent-emerald-500"
                      />
                      <span>Include Gym Burn (+{biometricMetrics.scheduledRoutine?.estBurnKcal || 0} kcal)</span>
                    </label>
                    <button
                      onClick={() => setActiveSide('gym')}
                      className="px-3 py-2 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 text-violet-300 text-xs font-bold transition"
                    >
                      Open Workout →
                    </button>
                  </div>
                </div>

                {/* Top Bento Analytics Row */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* 4 Circular Progress Rings */}
                  <div className="lg:col-span-7 bg-slate-900/90 rounded-2xl p-5 border border-slate-800/80">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-sm font-bold text-white flex items-center gap-2">
                          <Flame className="w-4 h-4 text-emerald-400" />
                          Daily Calorie & Macro Rings
                        </h2>
                        <p className="text-xs text-slate-400">
                          Target: {biometricMetrics.targetCalories} kcal ({profile.goalType.toUpperCase()} • {profile.macroSplit.p}% P / {profile.macroSplit.c}% C / {profile.macroSplit.f}% F)
                        </p>
                      </div>
                      <button
                        onClick={() => setShowBiometricsModal(true)}
                        className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                      >
                        <Sliders className="w-3.5 h-3.5" /> Adjust Targets
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {/* Calories */}
                      <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col items-center">
                        <ProgressRing
                          progress={(consumedMacros.calories / biometricMetrics.targetCalories) * 100}
                          strokeColor={consumedMacros.calories > biometricMetrics.targetCalories ? '#f43f5e' : '#10b981'}
                        >
                          <span className="text-sm font-extrabold text-white">{consumedMacros.calories}</span>
                          <span className="text-[10px] text-slate-400">/ {biometricMetrics.targetCalories}</span>
                        </ProgressRing>
                        <span className="mt-2 text-xs font-bold text-emerald-400">Calories</span>
                        <span className="text-[11px] text-slate-400">
                          {biometricMetrics.targetCalories - consumedMacros.calories >= 0
                            ? `${biometricMetrics.targetCalories - consumedMacros.calories} left`
                            : `${consumedMacros.calories - biometricMetrics.targetCalories} over`}
                        </span>
                      </div>

                      {/* Protein */}
                      <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col items-center">
                        <ProgressRing
                          progress={(consumedMacros.protein / biometricMetrics.proteinGrams) * 100}
                          strokeColor="#0ea5e9"
                        >
                          <span className="text-sm font-extrabold text-white">{Math.round(consumedMacros.protein)}g</span>
                          <span className="text-[10px] text-slate-400">/ {biometricMetrics.proteinGrams}g</span>
                        </ProgressRing>
                        <span className="mt-2 text-xs font-bold text-sky-400">Protein</span>
                        <span className="text-[11px] text-slate-400">
                          {Math.max(0, Math.round(biometricMetrics.proteinGrams - consumedMacros.protein))}g to go
                        </span>
                      </div>

                      {/* Carbs */}
                      <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col items-center">
                        <ProgressRing
                          progress={(consumedMacros.carbs / biometricMetrics.carbsGrams) * 100}
                          strokeColor="#f59e0b"
                        >
                          <span className="text-sm font-extrabold text-white">{Math.round(consumedMacros.carbs)}g</span>
                          <span className="text-[10px] text-slate-400">/ {biometricMetrics.carbsGrams}g</span>
                        </ProgressRing>
                        <span className="mt-2 text-xs font-bold text-amber-400">Carbs</span>
                        <span className="text-[11px] text-slate-400">
                          {Math.max(0, Math.round(biometricMetrics.carbsGrams - consumedMacros.carbs))}g to go
                        </span>
                      </div>

                      {/* Fat */}
                      <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col items-center">
                        <ProgressRing
                          progress={(consumedMacros.fat / biometricMetrics.fatGrams) * 100}
                          strokeColor="#f43f5e"
                        >
                          <span className="text-sm font-extrabold text-white">{Math.round(consumedMacros.fat)}g</span>
                          <span className="text-[10px] text-slate-400">/ {biometricMetrics.fatGrams}g</span>
                        </ProgressRing>
                        <span className="mt-2 text-xs font-bold text-rose-400">Dietary Fat</span>
                        <span className="text-[11px] text-slate-400">
                          {Math.max(0, Math.round(biometricMetrics.fatGrams - consumedMacros.fat))}g to go
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Donut Breakdown + Hydration Tracker */}
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
                            Hydration: {currentDayLog.waterMl} / 3,000 ml
                          </div>
                          <div className="w-36 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1.5">
                            <div
                              className="h-full bg-sky-400 transition-all"
                              style={{ width: `${Math.min(100, (currentDayLog.waterMl / 3000) * 100)}%` }}
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

                {/* Quick Action Bar for Meal Slots */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-white">Categorized Daily Meal Slots</h2>
                    <span className="text-xs text-slate-400">(Attach meal photos, scale portions, or load Set Meals)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={applyScheduledMealsForToday}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Auto-Load {biometricMetrics.dayOfWeekName}'s Assigned Set Meals
                    </button>
                    <button
                      onClick={() => setShowAddFoodModal(true)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold transition shadow-md shadow-emerald-500/20"
                    >
                      <Plus className="w-4 h-4" />
                      Add Food / Set Meal
                    </button>
                  </div>
                </div>

                {/* 4 Categorized Meal Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {MEAL_SLOTS.map(({ key, title, icon: Icon, color, bg }) => {
                    const items = currentDayLog.meals[key] || [];
                    const sub = consumedMacros.slotTotals[key] || { calories: 0, protein: 0, carbs: 0, fat: 0 };

                    return (
                      <div
                        key={key}
                        className="bg-slate-900/90 rounded-2xl border border-slate-800/80 overflow-hidden flex flex-col justify-between"
                      >
                        <div>
                          {/* Slot Header */}
                          <div className="p-4 bg-slate-950/50 border-b border-slate-800/80 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-xl ${bg} ${color} flex items-center justify-center`}>
                                <Icon className="w-5 h-5" />
                              </div>
                              <div>
                                <h3 className="text-sm font-bold text-white">{title}</h3>
                                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                                  <span className="font-bold text-emerald-400">{Math.round(sub.calories)} kcal</span>
                                  <span>•</span>
                                  <span className="text-sky-400">{sub.protein.toFixed(1)}g P</span>
                                  <span className="text-amber-400">{sub.carbs.toFixed(1)}g C</span>
                                  <span className="text-rose-400">{sub.fat.toFixed(1)}g F</span>
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                setActiveMealSlot(key);
                                setShowAddFoodModal(true);
                              }}
                              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 text-xs font-bold transition flex items-center gap-1"
                            >
                              <Plus className="w-3.5 h-3.5" /> Add
                            </button>
                          </div>

                          {/* Logged Items */}
                          <div className="divide-y divide-slate-800/60">
                            {items.length === 0 ? (
                              <div className="p-8 text-center text-xs text-slate-500">
                                No items logged in {title}. Click <strong>+ Add</strong> to log foods or a Set Meal combo.
                              </div>
                            ) : (
                              items.map((item) => {
                                const m = Number(item.multiplier) || 1;
                                const itemCal = Math.round(item.baseCal * m);
                                const itemP = (item.baseP * m).toFixed(1);
                                const itemC = (item.baseC * m).toFixed(1);
                                const itemF = (item.baseF * m).toFixed(1);

                                return (
                                  <div key={item.id} className="p-3.5 hover:bg-slate-800/30 transition flex items-center justify-between gap-3">
                                    {/* Left Photo Thumbnail or Camera Button */}
                                    <div className="shrink-0">
                                      {item.photoUrl ? (
                                        <button
                                          onClick={() => setLightboxImage({ url: item.photoUrl, title: item.name })}
                                          className="relative group w-12 h-12 rounded-xl overflow-hidden border border-emerald-500/40 block"
                                          title="Click to enlarge meal photo"
                                        >
                                          <img src={item.photoUrl} alt={item.name} className="w-full h-full object-cover" />
                                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                                            <Eye className="w-4 h-4 text-white" />
                                          </div>
                                        </button>
                                      ) : (
                                        <label
                                          className="w-12 h-12 rounded-xl bg-slate-950 border border-dashed border-slate-700 hover:border-emerald-500 flex flex-col items-center justify-center cursor-pointer text-slate-500 hover:text-emerald-400 transition"
                                          title="Upload Meal Photo (Auto-compressed WebP)"
                                        >
                                          <Camera className="w-4 h-4" />
                                          <span className="text-[9px] mt-0.5">Photo</span>
                                          <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                              if (e.target.files?.[0]) {
                                                attachPhotoToMealEntry(key, item.id, e.target.files[0]);
                                              }
                                            }}
                                          />
                                        </label>
                                      )}
                                    </div>

                                    {/* Center Food Info */}
                                    <div className="min-w-0 flex-1">
                                      <div className="text-xs font-bold text-white truncate">{item.name}</div>
                                      <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-x-2 mt-0.5">
                                        <span className="text-emerald-400 font-semibold">{itemCal} kcal</span>
                                        <span>•</span>
                                        <span className="text-sky-400">{itemP}g P</span>
                                        <span className="text-amber-400">{itemC}g C</span>
                                        <span className="text-rose-400">{itemF}g F</span>
                                      </div>
                                    </div>

                                    {/* Right Portion Scaling & Delete */}
                                    <div className="flex items-center gap-1.5 shrink-0">
                                      <button
                                        onClick={() => updateMealItemMultiplier(key, item.id, m - 0.25)}
                                        className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                                      >
                                        <Minus className="w-3 h-3" />
                                      </button>
                                      <span className="text-xs font-bold text-white min-w-[38px] text-center">
                                        {m}x
                                      </span>
                                      <button
                                        onClick={() => updateMealItemMultiplier(key, item.id, m + 0.25)}
                                        className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                                      >
                                        <Plus className="w-3 h-3" />
                                      </button>
                                      <button
                                        onClick={() => removeMealEntry(key, item.id)}
                                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 ml-1"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>

                        {/* Quick Set Meal Bar at Bottom of Card */}
                        <div className="px-4 py-2.5 bg-slate-950/40 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                          <span className="text-slate-400">Quick Set Meal:</span>
                          <div className="flex items-center gap-1.5 overflow-x-auto">
                            {setMeals.map((preset) => (
                              <button
                                key={preset.id}
                                onClick={() => logSetMealPreset(preset, key)}
                                className="px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-emerald-500/20 hover:text-emerald-300 text-slate-300 font-medium truncate max-w-[140px] transition"
                              >
                                + {preset.name.split(' ')[0]} {preset.name.split(' ')[1]}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB A2: SET MEALS BUILDER & WEEKLY MEAL ASSIGNMENT MATRIX */}
            {nutritionTab === 'planner' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Set Meal Builder */}
                <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl p-5 border border-slate-800/80 space-y-4">
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <Layers className="w-4 h-4 text-emerald-400" />
                      Create Reusable "Set Meal" Combo
                    </h2>
                    <p className="text-xs text-slate-400">
                      Bundle multiple foods + a cover photo to assign across your week.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Set Meal Name (e.g. Pre-Gym Espresso & Oats)"
                      value={newSetMeal.name}
                      onChange={(e) => setNewSetMeal({ ...newSetMeal, name: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={newSetMeal.defaultSlot}
                        onChange={(e) => setNewSetMeal({ ...newSetMeal, defaultSlot: e.target.value })}
                        className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                      >
                        {MEAL_SLOTS.map((s) => (
                          <option key={s.key} value={s.key}>
                            Default: {s.title}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        placeholder="Prep note / timing"
                        value={newSetMeal.notes}
                        onChange={(e) => setNewSetMeal({ ...newSetMeal, notes: e.target.value })}
                        className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                      />
                    </div>

                    <div className="text-xs font-semibold text-slate-300">Select Foods to Bundle:</div>
                    <div className="max-h-48 overflow-y-auto divide-y divide-slate-800/60 bg-slate-950 rounded-xl border border-slate-800 p-2">
                      {foodVault.slice(0, 15).map((f) => {
                        const checked = newSetMeal.selectedFoodIds.includes(f.id);
                        return (
                          <label key={f.id} className="flex items-center justify-between py-1.5 px-2 text-xs cursor-pointer hover:bg-slate-900 rounded-lg">
                            <span className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => {
                                  const exists = newSetMeal.selectedFoodIds.includes(f.id);
                                  setNewSetMeal({
                                    ...newSetMeal,
                                    selectedFoodIds: exists
                                      ? newSetMeal.selectedFoodIds.filter((id) => id !== f.id)
                                      : [...newSetMeal.selectedFoodIds, f.id]
                                  });
                                }}
                                className="accent-emerald-500"
                              />
                              <span>{f.emoji} {f.name}</span>
                            </span>
                            <span className="text-slate-400">{f.calories} kcal</span>
                          </label>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => {
                        if (!newSetMeal.name.trim() || newSetMeal.selectedFoodIds.length === 0) return;
                        const items = newSetMeal.selectedFoodIds.map((fid) => {
                          const found = foodVault.find((f) => f.id === fid) || foodVault[0];
                          return {
                            foodId: found.id,
                            name: found.name,
                            multiplier: 1,
                            unitLabel: found.label,
                            calories: found.calories,
                            protein: found.protein,
                            carbs: found.carbs,
                            fat: found.fat
                          };
                        });
                        setSetMeals([
                          ...setMeals,
                          {
                            id: `preset_${Date.now()}`,
                            name: newSetMeal.name.trim(),
                            defaultSlot: newSetMeal.defaultSlot,
                            notes: newSetMeal.notes || 'Custom macro bundle',
                            photoType: 'chicken_rice',
                            items
                          }
                        ]);
                        setNewSetMeal({ name: '', defaultSlot: 'lunch', notes: '', selectedFoodIds: [] });
                        showToast('✨ Saved new Set Meal preset!');
                      }}
                      className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition"
                    >
                      Save Set Meal Preset
                    </button>
                  </div>

                  {/* Saved Set Meals Gallery */}
                  <div className="pt-4 border-t border-slate-800 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Saved Set Meals ({setMeals.length})
                    </h3>
                    {setMeals.map((preset) => {
                      const totals = preset.items.reduce(
                        (a, b) => ({ cal: a.cal + b.calories, p: a.p + b.protein, c: a.c + b.carbs, f: a.f + b.fat }),
                        { cal: 0, p: 0, c: 0, f: 0 }
                      );
                      return (
                        <div key={preset.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                          <img
                            src={createPresetSvgPhoto(preset.photoType)}
                            alt={preset.name}
                            className="w-14 h-14 rounded-xl object-cover shrink-0"
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
                          <button
                            onClick={() => logSetMealPreset(preset)}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold shrink-0"
                          >
                            Log Now
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right: 7-Day Weekly Meal Assignment Matrix */}
                <div className="lg:col-span-7 bg-slate-900/90 rounded-2xl p-5 border border-slate-800/80">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-base font-bold text-white">7-Day Meal Assignment Matrix (Mon–Sun)</h2>
                      <p className="text-xs text-slate-400">
                        Assign Set Meals to any day of the week for 1-click daily logging.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {DAYS_OF_WEEK.map((day) => {
                      const dayPlan = weeklySchedule[day] || { gymRoutineId: 'rest', meals: {} };
                      return (
                        <div key={day} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="min-w-[120px]">
                            <div className="text-xs font-bold text-white">{day}</div>
                            <span className="text-[10px] text-violet-400">
                              Gym: {routines.find((r) => r.id === dayPlan.gymRoutineId)?.name.split(' ')[0] || 'Rest Day'}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1">
                            {['breakfast', 'lunch', 'dinner'].map((slot) => (
                              <div key={slot}>
                                <label className="block text-[10px] uppercase text-slate-500 mb-0.5">{slot}</label>
                                <select
                                  value={dayPlan.meals?.[slot] || ''}
                                  onChange={(e) =>
                                    setWeeklySchedule({
                                      ...weeklySchedule,
                                      [day]: {
                                        ...dayPlan,
                                        meals: { ...dayPlan.meals, [slot]: e.target.value }
                                      }
                                    })
                                  }
                                  className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-200"
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
              </div>
            )}

            {/* TAB A3: FOOD VAULT & CUSTOM FOOD CREATOR */}
            {nutritionTab === 'vault' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl p-5 border border-slate-800/80 space-y-4 h-fit">
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Plus className="w-4 h-4 text-emerald-400" />
                    Add Custom Food to Vault
                  </h2>
                  <div className="space-y-3 text-xs">
                    <input
                      type="text"
                      placeholder="Food or Drink Name"
                      value={newCustomFood.name}
                      onChange={(e) => setNewCustomFood({ ...newCustomFood, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={newCustomFood.category}
                        onChange={(e) => setNewCustomFood({ ...newCustomFood, category: e.target.value })}
                        className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                      >
                        {['Protein', 'Carbs', 'Fats', 'Dairy', 'Produce', 'Drinks'].map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        placeholder="Serving (e.g. 100g)"
                        value={newCustomFood.label}
                        onChange={(e) => setNewCustomFood({ ...newCustomFood, label: e.target.value })}
                        className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                      />
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-400">Kcal</label>
                        <input
                          type="number"
                          value={newCustomFood.calories}
                          onChange={(e) => setNewCustomFood({ ...newCustomFood, calories: Number(e.target.value) })}
                          className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-sky-400">Protein (g)</label>
                        <input
                          type="number"
                          value={newCustomFood.protein}
                          onChange={(e) => setNewCustomFood({ ...newCustomFood, protein: Number(e.target.value) })}
                          className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-amber-400">Carbs (g)</label>
                        <input
                          type="number"
                          value={newCustomFood.carbs}
                          onChange={(e) => setNewCustomFood({ ...newCustomFood, carbs: Number(e.target.value) })}
                          className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-rose-400">Fat (g)</label>
                        <input
                          type="number"
                          value={newCustomFood.fat}
                          onChange={(e) => setNewCustomFood({ ...newCustomFood, fat: Number(e.target.value) })}
                          className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (!newCustomFood.name.trim()) return;
                        setFoodVault([
                          {
                            id: `custom_${Date.now()}`,
                            name: newCustomFood.name.trim(),
                            category: newCustomFood.category,
                            baseAmount: 1,
                            unit: 'serving',
                            label: newCustomFood.label,
                            calories: Number(newCustomFood.calories),
                            protein: Number(newCustomFood.protein),
                            carbs: Number(newCustomFood.carbs),
                            fat: Number(newCustomFood.fat),
                            emoji: '🍽️'
                          },
                          ...foodVault
                        ]);
                        setNewCustomFood({ name: '', category: 'Protein', label: '100g', calories: 150, protein: 20, carbs: 10, fat: 3 });
                        showToast('🍽️ Added custom food to Vault!');
                      }}
                      className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold transition"
                    >
                      Save to Food Vault
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-8 bg-slate-900/90 rounded-2xl p-5 border border-slate-800/80 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="relative flex-1 min-w-[200px]">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="Search 30+ staple foods, espresso, lemonade..."
                        value={foodSearch}
                        onChange={(e) => setFoodSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                      />
                    </div>
                    <div className="flex gap-1 overflow-x-auto">
                      {['All', 'Protein', 'Carbs', 'Fats', 'Dairy', 'Produce', 'Drinks'].map((c) => (
                        <button
                          key={c}
                          onClick={() => setFoodCatFilter(c)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition ${
                            foodCatFilter === c ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[520px] overflow-y-auto pr-1">
                    {foodVault
                      .filter(
                        (f) =>
                          (foodCatFilter === 'All' || f.category === foodCatFilter) &&
                          f.name.toLowerCase().includes(foodSearch.toLowerCase())
                      )
                      .map((f) => (
                        <div key={f.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                          <div>
                            <div className="text-xs font-bold text-white">
                              {f.emoji} {f.name}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {f.label} • <strong className="text-emerald-400">{f.calories} kcal</strong> ({f.protein}P / {f.carbs}C / {f.fat}F)
                            </div>
                          </div>
                          <button
                            onClick={() => logFoodItemToSlot(f, 1, activeMealSlot)}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 text-xs font-bold transition shrink-0"
                          >
                            + Log
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ===================================================================
            SIDE B: 🏋️ THE GYM SIDE
        =================================================================== */}
        {!isNutrition && (
          <>
            {/* TAB B1: ACTIVE WORKOUT & SET RECORDER */}
            {gymTab === 'workout' && (
              <div className="space-y-6">
                {/* Top Session Control & Break Time Header */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left 8 Cols: Active Session Telemetry */}
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
                          onChange={(e) => {
                            const found = routines.find((r) => r.id === e.target.value);
                            if (!found) return;
                            setWorkoutSessions((prev) => ({
                              ...prev,
                              [selectedDate]: {
                                routineId: found.id,
                                title: found.name,
                                durationSec: 0,
                                pumpPhotoUrl: null,
                                exercises: found.exercises.map((re, idx) => {
                                  const vEx = exerciseVault.find((ex) => ex.id === re.exId) || INITIAL_EXERCISE_VAULT[0];
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
                                      completed: false
                                    }))
                                  };
                                })
                              }
                            }));
                            showToast(`🏋️ Loaded routine: ${found.name}`);
                          }}
                          className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-200"
                        >
                          {routines.map((r) => (
                            <option key={r.id} value={r.id}>
                              Switch Split: {r.name.split('(')[0]}
                            </option>
                          ))}
                        </select>

                        <button
                          onClick={() => setWorkoutRunning(!workoutRunning)}
                          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold transition ${
                            workoutRunning
                              ? 'bg-amber-500 text-slate-950'
                              : 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/25'
                          }`}
                        >
                          {workoutRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                          <span>{formatTime(currentWorkout.durationSec)}</span>
                        </button>
                      </div>
                    </div>

                    {/* 4 Gym Session KPIs */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                      <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                        <div className="text-[11px] text-slate-400">Total Tonnage Volume</div>
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
                        <div className="text-[11px] text-slate-400">New 1RM PRs Hit</div>
                        <div className="text-lg font-extrabold text-amber-400 mt-0.5 flex items-center gap-1.5">
                          <Trophy className="w-4 h-4" /> {workoutSummary.prCount} PRs
                        </div>
                      </div>
                      <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                        <div className="text-[11px] text-slate-400">Nutrition Sync Burn</div>
                        <div className="text-lg font-extrabold text-emerald-400 mt-0.5">
                          +{biometricMetrics.scheduledRoutine?.estBurnKcal || 280} kcal
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
                        onClick={() => setRestTimer((p) => ({ ...p, soundEnabled: !p.soundEnabled }))}
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
                                setRestTimer((p) => ({ ...p, active: true, remainingSec: sec, totalSec: sec }))
                              }
                              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-[11px] font-bold text-slate-300 transition"
                            >
                              {sec}s
                            </button>
                          ))}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() =>
                              setRestTimer((p) => ({ ...p, remainingSec: Math.max(0, p.remainingSec - 15) }))
                            }
                            className="px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300"
                          >
                            -15s
                          </button>
                          <button
                            onClick={() =>
                              setRestTimer((p) => ({
                                ...p,
                                remainingSec: p.remainingSec + 15,
                                totalSec: Math.max(p.totalSec, p.remainingSec + 15)
                              }))
                            }
                            className="px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300"
                          >
                            +15s
                          </button>
                          <button
                            onClick={() => setRestTimer((p) => ({ ...p, active: false, remainingSec: 0 }))}
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
                  {currentWorkout.exercises.map((ex, exIndex) => (
                    <div key={ex.id} className="bg-slate-900/90 rounded-2xl border border-slate-800/80 overflow-hidden">
                      {/* Exercise Header */}
                      <div className="p-4 bg-slate-950/60 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
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
                          <span className="text-xs text-slate-400">Break Timer:</span>
                          <select
                            value={ex.restSec}
                            onChange={(e) => {
                              const newRest = Number(e.target.value);
                              mutateCurrentWorkout((s) => ({
                                ...s,
                                exercises: s.exercises.map((item, idx) =>
                                  idx === exIndex ? { ...item, restSec: newRest } : item
                                )
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
                            className="px-3 py-1.5 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 text-violet-300 text-xs font-bold transition"
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
                                  className={`transition ${
                                    s.completed ? 'bg-emerald-500/10' : 'hover:bg-slate-800/30'
                                  }`}
                                >
                                  <td className="py-2.5 px-4">
                                    <button
                                      onClick={() => cycleSetType(exIndex, sIndex)}
                                      className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
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
                                        <span className="px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-extrabold flex items-center gap-0.5">
                                          <Trophy className="w-3 h-3" /> PR
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                  <td className="py-2.5 px-4 text-right">
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
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}

                  {/* Quick Add Exercise Bar */}
                  <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs font-bold text-slate-300">
                      + Add Exercise from Vault to Today's Session:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {exerciseVault.slice(0, 7).map((vEx) => (
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
            )}

            {/* TAB B2: ROUTINE SPLIT BUILDER & WEEKLY TRAINING SCHEDULE */}
            {gymTab === 'routines' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-6 bg-slate-900/90 rounded-2xl p-5 border border-slate-800/80 space-y-4">
                  <h2 className="text-base font-bold text-white">7-Day Gym Split Schedule (Mon–Sun)</h2>
                  <p className="text-xs text-slate-400">
                    Assigning a routine automatically updates your Training Day Calorie Bonus on the Nutrition Side.
                  </p>
                  <div className="space-y-2.5">
                    {DAYS_OF_WEEK.map((day) => {
                      const currentId = weeklySchedule[day]?.gymRoutineId || 'rest';
                      return (
                        <div key={day} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                          <span className="text-xs font-bold text-white w-28">{day}</span>
                          <select
                            value={currentId}
                            onChange={(e) =>
                              setWeeklySchedule({
                                ...weeklySchedule,
                                [day]: { ...weeklySchedule[day], gymRoutineId: e.target.value }
                              })
                            }
                            className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-violet-300 font-semibold"
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

                <div className="lg:col-span-6 bg-slate-900/90 rounded-2xl p-5 border border-slate-800/80 space-y-4">
                  <h2 className="text-base font-bold text-white">Pre-Configured Hypertrophy & Strength Routines</h2>
                  <div className="space-y-3">
                    {routines.map((rt) => (
                      <div key={rt.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-bold text-violet-300">{rt.name}</h3>
                          <span className="text-xs font-bold text-emerald-400">~{rt.estBurnKcal} kcal burn</span>
                        </div>
                        <div className="text-xs text-slate-400 space-y-1">
                          {rt.exercises.map((re, i) => {
                            const exObj = exerciseVault.find((e) => e.id === re.exId);
                            return (
                              <div key={i} className="flex justify-between">
                                <span>• {exObj?.name}</span>
                                <span className="text-slate-500">
                                  {re.targetSets} sets × {re.repRange} ({re.restSec}s break)
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB B3: MUSCLE VOLUME LANDMARKS & 1RM ANALYTICS */}
            {gymTab === 'analytics' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 bg-slate-900/90 rounded-2xl p-5 border border-slate-800/80 space-y-4">
                  <h2 className="text-base font-bold text-white">Weekly Working Sets Per Muscle Group</h2>
                  <p className="text-xs text-slate-400">
                    Optimal hypertrophy zone is <strong className="text-emerald-400">10–20 working sets/week</strong> per muscle group.
                  </p>
                  <div className="space-y-3">
                    {Object.entries(weeklyMuscleVolume).map(([muscle, sets]) => {
                      const pct = Math.min(100, (sets / 20) * 100);
                      const inZone = sets >= 10 && sets <= 20;
                      return (
                        <div key={muscle}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-bold text-white">{muscle}</span>
                            <span className={inZone ? 'text-emerald-400 font-bold' : 'text-amber-400 font-semibold'}>
                              {sets} / 20 sets {inZone ? '✓ Optimal Hypertrophy Zone' : '(Building Volume)'}
                            </span>
                          </div>
                          <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                            <div
                              className={`h-full transition-all ${
                                inZone ? 'bg-gradient-to-r from-violet-500 to-emerald-400' : 'bg-violet-500'
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl p-5 border border-slate-800/80 space-y-4">
                  <h2 className="text-base font-bold text-white">Interactive 1RM & Training Load Calculator</h2>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-slate-400 block mb-1">Weight Lifted (kg)</label>
                      <input
                        type="number"
                        value={oneRmCalcWeight}
                        onChange={(e) => setOneRmCalcWeight(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Reps Performed</label>
                      <input
                        type="number"
                        value={oneRmCalcReps}
                        onChange={(e) => setOneRmCalcReps(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
                      />
                    </div>
                  </div>

                  {(() => {
                    const estMax = Math.round(oneRmCalcWeight * (1 + oneRmCalcReps / 30));
                    return (
                      <div className="space-y-3 pt-2">
                        <div className="p-4 rounded-xl bg-violet-500/15 border border-violet-500/30 text-center">
                          <div className="text-xs text-violet-300">Estimated 1-Rep Max (Epley Formula)</div>
                          <div className="text-2xl font-extrabold text-white mt-0.5">{estMax} kg</div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center text-xs">
                          {[
                            { pct: 90, reps: '3-4 reps' },
                            { pct: 85, reps: '5-6 reps' },
                            { pct: 80, reps: '7-8 reps' },
                            { pct: 75, reps: '10 reps' },
                            { pct: 70, reps: '12 reps' },
                            { pct: 65, reps: '15 reps' }
                          ].map((row) => (
                            <div key={row.pct} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                              <div className="text-[10px] text-slate-400">{row.pct}% ({row.reps})</div>
                              <div className="font-bold text-cyan-400 mt-0.5">{Math.round(estMax * (row.pct / 100))} kg</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* =====================================================================
          PERSISTENT FLOATING REST TIMER & ACTIVE WORKOUT BAR (CROSS-SIDE)
      ===================================================================== */}
      {(restTimer.active || workoutRunning) && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-2xl bg-slate-900/95 backdrop-blur-xl border border-amber-500/40 rounded-2xl px-4 py-2.5 shadow-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-extrabold text-xs">
              {restTimer.active ? formatTime(restTimer.remainingSec) : 'LIVE'}
            </div>
            <div>
              <div className="text-xs font-bold text-white">
                {restTimer.active ? `Break Timer: ${restTimer.exerciseName}` : currentWorkout.title}
              </div>
              <div className="text-[10px] text-slate-400">
                Session Elapsed: {formatTime(currentWorkout.durationSec)} • Volume: {workoutSummary.tonnageKg} kg
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {restTimer.active && (
              <>
                <button
                  onClick={() => setRestTimer((p) => ({ ...p, remainingSec: Math.max(0, p.remainingSec - 15) }))}
                  className="px-2 py-1 rounded-lg bg-slate-800 text-xs text-slate-200"
                >
                  -15s
                </button>
                <button
                  onClick={() => setRestTimer((p) => ({ ...p, remainingSec: p.remainingSec + 15 }))}
                  className="px-2 py-1 rounded-lg bg-slate-800 text-xs text-slate-200"
                >
                  +15s
                </button>
                <button
                  onClick={() => setRestTimer((p) => ({ ...p, active: false, remainingSec: 0 }))}
                  className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 text-xs font-bold"
                >
                  Skip
                </button>
              </>
            )}
            <button
              onClick={() => setActiveSide(isNutrition ? 'gym' : 'nutrition')}
              className="px-3 py-1 rounded-lg bg-violet-600 text-white text-xs font-bold"
            >
              {isNutrition ? 'Go to Gym →' : 'Go to Nutrition →'}
            </button>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 1: BIOMETRICS, EXACT AGE-IN-DAYS & ADAPTIVE WEIGHT CHECK-IN
      ===================================================================== */}
      {showBiometricsModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <Scale className="w-5 h-5 text-emerald-400" />
                  Biometric Profile, Age-in-Days Ticker & Adaptive Kcal Coach
                </h2>
                <p className="text-xs text-slate-400">
                  Live chronological age in days powers your exact Mifflin-St Jeor BMR & bi-weekly weight calibration.
                </p>
              </div>
              <button onClick={() => setShowBiometricsModal(false)} className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Live Age-in-Days Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/60 border border-emerald-500/30 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-[10px] uppercase tracking-wider font-bold text-emerald-400">
                  Chronological Age-in-Days Ticker
                </div>
                <div className="text-xl font-extrabold text-white mt-0.5">
                  {biometricMetrics.exactDaysOld.toLocaleString()} Days Old{' '}
                  <span className="text-sm font-normal text-slate-300">({biometricMetrics.exactYearsOld} exact years)</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div>
                  <label className="block text-[10px] text-slate-400">Date of Birth</label>
                  <input
                    type="date"
                    value={profile.dob}
                    onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                    className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400">Fixed Height (cm)</label>
                  <input
                    type="number"
                    value={profile.heightCm}
                    onChange={(e) => setProfile({ ...profile, heightCm: Number(e.target.value) })}
                    className="w-24 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Bi-Weekly Weight Check-In & Adaptive Calorie Calibration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Scheduled Weight Check-In (Every {profile.checkInIntervalDays} Days)
                  </h3>
                  <span className="text-[11px] text-slate-400">{biometricMetrics.daysSinceCheckIn}d since last</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-400">New Morning Weight (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={newWeightEntry.weightKg}
                      onChange={(e) => setNewWeightEntry({ ...newWeightEntry, weightKg: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400">Check-In Note</label>
                    <input
                      type="text"
                      value={newWeightEntry.note}
                      onChange={(e) => setNewWeightEntry({ ...newWeightEntry, note: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>
                </div>

                <button
                  onClick={() => {
                    const w = Number(newWeightEntry.weightKg) || profile.weightKg;
                    const entry = {
                      id: `w_${Date.now()}`,
                      date: selectedDate,
                      weightKg: w,
                      appliedKcal: biometricMetrics.targetCalories,
                      note: newWeightEntry.note || 'Scheduled Check-In',
                      photoUrl: createPresetSvgPhoto('physique')
                    };
                    setProfile((prev) => ({
                      ...prev,
                      weightKg: w,
                      lastCheckInDate: selectedDate,
                      weightHistory: [...prev.weightHistory, entry]
                    }));
                    showToast(`⚖️ Logged weight check-in (${w}kg) and updated BMR!`);
                  }}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs transition"
                >
                  Log Weight Check-In & Recalibrate Progress
                </button>

                {/* Adaptive Calorie Recommendation Box */}
                {biometricMetrics.adaptiveSuggestion && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2 text-xs">
                    <div className="font-bold text-emerald-300 flex items-center justify-between">
                      <span>🧠 Adaptive Kcal Calibration</span>
                      <span>Δ {biometricMetrics.adaptiveSuggestion.dWeightKg} kg</span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Based on your weight change over {biometricMetrics.adaptiveSuggestion.dDays} days, your implied daily balance is{' '}
                      <strong>{biometricMetrics.adaptiveSuggestion.actualDailyDeficitSurplus} kcal/d</strong>. Recommended target:{' '}
                      <strong className="text-emerald-400">{biometricMetrics.adaptiveSuggestion.recommendedNewKcal} kcal</strong>.
                    </p>
                    <button
                      onClick={() => {
                        setProfile((prev) => ({
                          ...prev,
                          manualKcalOverride: biometricMetrics.adaptiveSuggestion.recommendedNewKcal
                        }));
                        showToast('🎯 Applied Adaptive Calorie Target!');
                      }}
                      className="w-full py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs"
                    >
                      Apply {biometricMetrics.adaptiveSuggestion.recommendedNewKcal} kcal Target
                    </button>
                  </div>
                )}
              </div>

              {/* Goal, Manual Kcal Override & Coupled Macro Sliders */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Goal, Calorie Override & Coupled Macro Sliders
                </h3>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {[
                    { id: 'cut', label: 'Cut (-500)' },
                    { id: 'maintain', label: 'Maintain' },
                    { id: 'lean_bulk', label: 'Bulk (+300)' }
                  ].map((g) => (
                    <button
                      key={g.id}
                      onClick={() => setProfile({ ...profile, goalType: g.id, manualKcalOverride: null })}
                      className={`py-2 rounded-xl font-bold border ${
                        profile.goalType === g.id
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 flex justify-between">
                    <span>Custom Base Kcal Override (optional):</span>
                    {profile.manualKcalOverride && (
                      <button
                        onClick={() => setProfile({ ...profile, manualKcalOverride: null })}
                        className="text-rose-400 underline"
                      >
                        Reset to Formula
                      </button>
                    )}
                  </label>
                  <input
                    type="number"
                    placeholder="Auto calculated from TDEE"
                    value={profile.manualKcalOverride || ''}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        manualKcalOverride: e.target.value ? Number(e.target.value) : null
                      })
                    }
                    className="w-full mt-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                  />
                </div>

                {/* Coupled Sliders */}
                <div className="space-y-2 pt-1 text-xs">
                  <div>
                    <div className="flex justify-between text-sky-400 font-bold">
                      <span>Protein: {profile.macroSplit.p}%</span>
                      <span>{biometricMetrics.proteinGrams}g</span>
                    </div>
                    <input
                      type="range"
                      min="15"
                      max="60"
                      value={profile.macroSplit.p}
                      onChange={(e) => handleCoupledMacroChange('p', e.target.value)}
                      className="w-full accent-sky-500"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-amber-400 font-bold">
                      <span>Carbs: {profile.macroSplit.c}%</span>
                      <span>{biometricMetrics.carbsGrams}g</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="70"
                      value={profile.macroSplit.c}
                      onChange={(e) => handleCoupledMacroChange('c', e.target.value)}
                      className="w-full accent-amber-500"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-rose-400 font-bold">
                      <span>Fat: {profile.macroSplit.f}%</span>
                      <span>{biometricMetrics.fatGrams}g</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="70"
                      value={profile.macroSplit.f}
                      onChange={(e) => handleCoupledMacroChange('f', e.target.value)}
                      className="w-full accent-rose-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Weight History Timeline */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Weight & Kcal Check-In Timeline</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {profile.weightHistory.map((wh) => (
                  <div key={wh.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2">
                    <div>
                      <div className="text-xs font-extrabold text-white">{wh.weightKg} kg</div>
                      <div className="text-[10px] text-slate-400">{wh.date} • {wh.appliedKcal} kcal</div>
                      <div className="text-[10px] text-emerald-400 truncate">{wh.note}</div>
                    </div>
                    {wh.photoUrl && (
                      <button
                        onClick={() => setLightboxImage({ url: wh.photoUrl, title: `Check-In ${wh.date} (${wh.weightKg}kg)` })}
                        className="w-10 h-10 rounded-lg overflow-hidden border border-slate-700 shrink-0"
                      >
                        <img src={wh.photoUrl} alt="Physique" className="w-full h-full object-cover" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 2: QUICK ADD FOOD OR SET MEAL TO SLOT
      ===================================================================== */}
      {showAddFoodModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-white">
                Add Food or Set Meal to <span className="text-emerald-400 capitalize">{activeMealSlot}</span>
              </h3>
              <button onClick={() => setShowAddFoodModal(false)} className="p-1.5 rounded-lg bg-slate-800 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <input
              type="text"
              placeholder="Search chicken, jasmine rice, espresso, oats, lemonade..."
              value={foodSearch}
              onChange={(e) => setFoodSearch(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
            />

            <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
              {foodVault
                .filter((f) => f.name.toLowerCase().includes(foodSearch.toLowerCase()))
                .map((f) => (
                  <div key={f.id} className="py-2.5 px-2 flex items-center justify-between gap-2 hover:bg-slate-800/40 rounded-lg">
                    <div>
                      <div className="text-xs font-bold text-white">{f.emoji} {f.name}</div>
                      <div className="text-[11px] text-slate-400">
                        {f.label} • {f.calories} kcal ({f.protein}g P / {f.carbs}g C / {f.fat}g F)
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          logFoodItemToSlot(f, 1, activeMealSlot, createPresetSvgPhoto('chicken_rice'));
                          setShowAddFoodModal(false);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-emerald-300 font-semibold"
                      >
                        + With Photo
                      </button>
                      <button
                        onClick={() => {
                          logFoodItemToSlot(f, 1, activeMealSlot);
                          setShowAddFoodModal(false);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 text-xs font-extrabold"
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 3: PLUGGABLE AI COACH DRAWER (DEEPSEEK V4 PRO / FLASH READY)
      ===================================================================== */}
      {showAiDrawer && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end">
          <div className="bg-slate-900 border-l border-slate-800 w-full max-w-md p-6 flex flex-col justify-between h-full overflow-y-auto">
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-white">OpenFit AI Performance Coach</h3>
                    <p className="text-[11px] text-indigo-300">DeepSeek V4 Pro / Flash Pluggable Harness</p>
                  </div>
                </div>
                <button onClick={() => setShowAiDrawer(false)} className="p-1.5 rounded-lg bg-slate-800 text-slate-400">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Live Cross-Hemisphere Context Audit */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-indigo-500/30 space-y-2.5 text-xs">
                <div className="font-bold text-indigo-300 uppercase tracking-wider text-[10px]">
                  Live Telemetry Audit ({selectedDate})
                </div>
                <p className="text-slate-300 leading-relaxed">
                  • <strong>Biometrics:</strong> {biometricMetrics.exactDaysOld.toLocaleString()} days old, {profile.weightKg}kg, {profile.heightCm}cm.
                  <br />• <strong>Nutrition Status:</strong> {consumedMacros.calories} / {biometricMetrics.targetCalories} kcal logged. Remaining:{' '}
                  <span className="text-sky-400 font-bold">
                    {Math.max(0, Math.round(biometricMetrics.proteinGrams - consumedMacros.protein))}g Protein
                  </span>
                  ,{' '}
                  <span className="text-amber-400 font-bold">
                    {Math.max(0, Math.round(biometricMetrics.carbsGrams - consumedMacros.carbs))}g Carbs
                  </span>
                  .
                  <br />• <strong>Gym Status:</strong> {workoutSummary.tonnageKg} kg volume lifted across {workoutSummary.completedSets} working sets ({workoutSummary.prCount} PRs).
                </p>
              </div>

              {/* Actionable AI Macro Finisher Recommendation */}
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-3 text-xs">
                <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Smart Post-Workout Meal Recommendation
                </div>
                <p className="text-slate-300 leading-relaxed">
                  To hit your remaining protein and glycogen target after <strong>{currentWorkout.title.split('(')[0]}</strong>, log the{' '}
                  <strong>Grilled Salmon & Sweet Potato Mash</strong> Set Meal (+570 kcal, 39.2g P, 41.3g C).
                </p>
                <button
                  onClick={() => {
                    logSetMealPreset(setMeals[2], 'dinner');
                    setShowAiDrawer(false);
                  }}
                  className="w-full py-2 rounded-xl bg-emerald-500 text-slate-950 font-extrabold"
                >
                  1-Click Log Recommended Dinner Set
                </button>
              </div>

              {/* Pluggable DeepSeek API Configuration */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                <div className="font-bold text-slate-300">Configure DeepSeek / OpenAI-Compatible Endpoint</div>
                <select
                  value={aiModel}
                  onChange={(e) => setAiModel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                >
                  <option value="deepseek-v4-pro">DeepSeek V4 Pro (Reasoning + Vision)</option>
                  <option value="deepseek-flash">DeepSeek Flash (Low-Latency Macro Parser)</option>
                  <option value="gemini-2.5-pro">Gemini Pro / Flash</option>
                </select>
                <input
                  type="password"
                  placeholder="Optional API Key (runs deterministic local coach if blank)"
                  value={aiApiKey}
                  onChange={(e) => setAiApiKey(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                />
              </div>
            </div>

            <div className="text-[11px] text-slate-500 pt-4 border-t border-slate-800">
              OpenFit OS AI Harness • Deterministic Zod Schema Contract v2.0
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 4: JSON BACKUP EXPORT / IMPORT & RESET
      ===================================================================== */}
      {showBackupModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-white">Local-First Storage & JSON Backup</h3>
              <button onClick={() => setShowBackupModal(false)} className="p-1.5 rounded-lg bg-slate-800 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-400">
              All your biometrics, meal photos, Set Meals, and gym sets are saved automatically to your browser's LocalStorage. You can export a full JSON snapshot anytime.
            </p>
            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => {
                  const payload = {
                    profile,
                    foodVault,
                    setMeals,
                    weeklySchedule,
                    dailyNutritionLogs,
                    workoutSessions
                  };
                  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `openfit-os-backup-${selectedDate}.json`;
                  a.click();
                  showToast('📦 Downloaded OpenFit OS JSON backup!');
                }}
                className="w-full py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" /> Download Full JSON Backup
              </button>

              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                className="w-full py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 font-bold text-xs flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Reset All Demo Data to Defaults
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 5: PHOTO LIGHTBOX VIEWER
      ===================================================================== */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div className="max-w-lg w-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            <img src={lightboxImage.url} alt={lightboxImage.title} className="w-full h-auto" />
            <div className="p-4 flex items-center justify-between">
              <span className="text-sm font-bold text-white">{lightboxImage.title}</span>
              <button className="px-3 py-1 rounded-lg bg-slate-800 text-xs text-slate-300">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}