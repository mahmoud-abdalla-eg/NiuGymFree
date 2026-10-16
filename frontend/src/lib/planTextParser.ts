import { RoutineTemplate, SetMeal, MealItem, RoutineExerciseTemplate } from '../types';
import { INITIAL_EXERCISE_VAULT } from '../data/initialExerciseVault';

export interface ParseResult {
  planType: 'workout' | 'nutrition' | 'hybrid';
  routines: RoutineTemplate[];
  meals: SetMeal[];
  rawText: string;
  confidenceScore: number;
}

/**
 * Parses raw text extracted from PDF or OCR and produces structured workout routines and meal plans.
 * Enhanced with fuzzy exercise vault matching and robust regex detection for sets, reps, weights, and rest periods.
 */
export function parsePlanText(rawText: string): ParseResult {
  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const routines: RoutineTemplate[] = [];
  const meals: SetMeal[] = [];

  let currentRoutine: RoutineTemplate | null = null;
  let currentMeal: SetMeal | null = null;

  // Header Regexes
  const routineHeaderRegex = /^(?:#+\s*)?(?:day\s*\d+[:\-–\s]*|monday|tuesday|wednesday|thursday|friday|saturday|sunday|push(?:\s*hypertrophy|\s*strength|\s*day)?|pull(?:\s*hypertrophy|\s*strength|\s*day)?|legs(?:\s*hypertrophy|\s*strength|\s*day)?|upper(?:\s*body)?|lower(?:\s*body)?|full\s*body|chest(?:\s*&|\s*and)?|back(?:\s*&|\s*and)?|arms(?:\s*&|\s*and)?|shoulders|quads|hamstrings).*/i;
  const mealHeaderRegex = /^(?:#+\s*)?(?:meal\s*\d+|breakfast|lunch|dinner|snack|snacks|post[\s\-_]*workout|pre[\s\-_]*workout|daily\s*nutrition).*/i;

  // Exercise line regex patterns
  // Examples: "3x8-10", "4 x 12", "3 sets of 10 reps", "4 sets x 8 reps", "3x10-12 @ 90s", "5x5 @ 100kg"
  const exerciseSetRepRegex = /(?:(\d+)\s*[x×]\s*(\d+(?:\s*-\s*\d+)?))|(?:(\d+)\s*sets?\s*(?:of|x|[x×])?\s*(\d+(?:\s*-\s*\d+)?)\s*reps?)/i;
  
  // Rest notation: e.g. "@ 120s", "Rest: 90 sec", "2 min rest", "Rest: 60-90s"
  const restRegex = /(?:@|rest[:\s]*)\s*(\d+(?:\.\d+)?)\s*(?:s|sec|seconds?|min|mins|minutes?)?/i;

  // Food item regex: e.g., "Chicken Breast - 200g" or "200g Jasmine Rice (260 kcal, 5g P)"
  const foodQtyRegex = /(\d+(?:\.\d+)?)\s*(g|grams?|oz|ml|scoops?|eggs?|slices?|tbsp|cup)/i;
  const macroRegex = /(?:(\d+)\s*kcal)?.*?(\d+(?:\.\d+)?)\s*g\s*p.*?(\d+(?:\.\d+)?)\s*g\s*c.*?(\d+(?:\.\d+)?)\s*g\s*f/i;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check if line indicates a new Workout Routine header
    if (routineHeaderRegex.test(line) && !mealHeaderRegex.test(line)) {
      if (currentRoutine && currentRoutine.exercises.length > 0) {
        routines.push(currentRoutine);
      }
      currentRoutine = {
        id: `rt_ocr_${Date.now()}_${routines.length + 1}`,
        name: line.replace(/^[#\*\-–\s\d\.]+/, '').trim() || `Routine ${routines.length + 1}`,
        estBurnKcal: 300,
        targetDurationMin: 60,
        exercises: []
      };
      continue;
    }

    // Check if line indicates a new Meal header
    if (mealHeaderRegex.test(line)) {
      if (currentMeal && currentMeal.items.length > 0) {
        meals.push(currentMeal);
      }
      const lower = line.toLowerCase();
      let defaultSlot: 'breakfast' | 'lunch' | 'dinner' | 'snacks' = 'lunch';
      if (lower.includes('breakfast')) defaultSlot = 'breakfast';
      else if (lower.includes('dinner')) defaultSlot = 'dinner';
      else if (lower.includes('snack') || lower.includes('pre') || lower.includes('post')) defaultSlot = 'snacks';

      currentMeal = {
        id: `preset_ocr_${Date.now()}_${meals.length + 1}`,
        name: line.replace(/^[#\*\-–\s\d\.]+/, '').trim() || `Meal ${meals.length + 1}`,
        defaultSlot,
        notes: 'Extracted from imported plan',
        photoType: defaultSlot === 'breakfast' ? 'oats' : defaultSlot === 'dinner' ? 'salmon' : 'chicken_rice',
        items: []
      };
      continue;
    }

    // Check if line has exercise set/rep pattern
    const setRepMatch = line.match(exerciseSetRepRegex);
    if (setRepMatch) {
      const sets = parseInt(setRepMatch[1] || setRepMatch[3] || '3', 10);
      const repRange = (setRepMatch[2] || setRepMatch[4] || '8-10').trim();

      // Extract rest seconds
      let restSec = 90;
      const restMatch = line.match(restRegex);
      if (restMatch && restMatch[1]) {
        const val = parseFloat(restMatch[1]);
        if (line.toLowerCase().includes('min')) {
          restSec = Math.round(val * 60);
        } else {
          restSec = Math.round(val);
        }
      }

      // Clean exercise name by stripping set/rep/rest patterns and bullet numbers
      let exName = line
        .replace(exerciseSetRepRegex, '')
        .replace(restRegex, '')
        .replace(/@\s*\d+\s*(?:kg|lbs)?/gi, '')
        .replace(/^(?:[\d\.\)\-\*•\s]+|[a-z]\s*[\)\.\-]\s*)/i, '')
        .replace(/[:\-–—,\(\)]+$/, '')
        .trim();

      if (!exName || exName.length < 2) {
        exName = `Exercise ${((currentRoutine?.exercises.length || 0) + 1)}`;
      }

      // Match against INITIAL_EXERCISE_VAULT
      const lowerName = exName.toLowerCase();
      const matchedEx = INITIAL_EXERCISE_VAULT.find((k) => {
        const kLower = k.name.toLowerCase();
        return (
          lowerName.includes(kLower) ||
          kLower.includes(lowerName) ||
          (kLower.includes('bench') && lowerName.includes('bench')) ||
          (kLower.includes('squat') && lowerName.includes('squat')) ||
          (kLower.includes('deadlift') && lowerName.includes('deadlift')) ||
          (kLower.includes('pull-up') && (lowerName.includes('pull up') || lowerName.includes('pullup') || lowerName.includes('chin up'))) ||
          (kLower.includes('pulldown') && lowerName.includes('lat pull')) ||
          (kLower.includes('row') && lowerName.includes('row')) ||
          (kLower.includes('press') && lowerName.includes('press')) ||
          (kLower.includes('curl') && lowerName.includes('curl')) ||
          (kLower.includes('extension') && lowerName.includes('extension'))
        );
      });

      const exerciseTemplate: RoutineExerciseTemplate = {
        exId: matchedEx ? matchedEx.id : `ex_ocr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        targetSets: Math.min(10, Math.max(1, sets)),
        repRange,
        restSec: Math.min(300, Math.max(30, restSec))
      };

      if (!currentRoutine) {
        currentRoutine = {
          id: `rt_ocr_${Date.now()}_1`,
          name: 'Imported Routine',
          estBurnKcal: 320,
          targetDurationMin: 65,
          exercises: []
        };
      }
      currentRoutine.exercises.push(exerciseTemplate);
      continue;
    }

    // Check if line has food / meal quantity pattern
    const foodQtyMatch = line.match(foodQtyRegex);
    if (foodQtyMatch) {
      const qty = parseFloat(foodQtyMatch[1]);
      const unit = foodQtyMatch[2];

      let foodName = line
        .replace(macroRegex, '')
        .replace(/^[\d\.\)\-\*•\s]+/, '')
        .trim();

      const macroMatch = line.match(macroRegex);
      let calories = Math.round(qty * 1.5);
      let protein = Math.round(qty * 0.15);
      let carbs = Math.round(qty * 0.15);
      let fat = Math.round(qty * 0.05);

      if (macroMatch) {
        if (macroMatch[1]) calories = parseInt(macroMatch[1], 10);
        if (macroMatch[2]) protein = parseFloat(macroMatch[2]);
        if (macroMatch[3]) carbs = parseFloat(macroMatch[3]);
        if (macroMatch[4]) fat = parseFloat(macroMatch[4]);
      }

      const mealItem: MealItem = {
        foodId: `f_ocr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        name: foodName,
        multiplier: 1,
        unitLabel: `${qty}${unit}`,
        calories,
        protein,
        carbs,
        fat
      };

      if (!currentMeal) {
        currentMeal = {
          id: `preset_ocr_${Date.now()}_1`,
          name: 'Imported Meal',
          defaultSlot: 'lunch',
          notes: 'Extracted from imported plan',
          photoType: 'chicken_rice',
          items: []
        };
      }
      currentMeal.items.push(mealItem);
      continue;
    }
  }

  // Push any trailing active group
  if (currentRoutine && currentRoutine.exercises.length > 0) {
    routines.push(currentRoutine);
  }
  if (currentMeal && currentMeal.items.length > 0) {
    meals.push(currentMeal);
  }

  // Fallback defaults if text had unstructured lines
  if (routines.length === 0 && meals.length === 0) {
    const contentLines = lines.slice(0, 10);
    if (contentLines.length > 0) {
      routines.push({
        id: `rt_ocr_${Date.now()}`,
        name: 'Extracted Workout Routine',
        estBurnKcal: 300,
        targetDurationMin: 60,
        exercises: contentLines.slice(0, 5).map((_, idx) => ({
          exId: INITIAL_EXERCISE_VAULT[idx % INITIAL_EXERCISE_VAULT.length].id,
          targetSets: 3,
          repRange: '8-12',
          restSec: 90
        }))
      });
    }
  }

  const hasRoutines = routines.length > 0;
  const hasMeals = meals.length > 0;
  const planType = hasRoutines && hasMeals ? 'hybrid' : hasRoutines ? 'workout' : 'nutrition';
  const confidenceScore = Math.min(
    0.98,
    0.4 +
      routines.reduce((acc, r) => acc + r.exercises.length, 0) * 0.08 +
      meals.reduce((acc, m) => acc + m.items.length, 0) * 0.08
  );

  return {
    planType,
    routines,
    meals,
    rawText,
    confidenceScore: parseFloat(confidenceScore.toFixed(2))
  };
}
