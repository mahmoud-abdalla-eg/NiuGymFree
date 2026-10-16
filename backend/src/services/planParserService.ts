export interface ParsedWorkoutExercise {
  name: string;
  sets: number;
  reps: string;
  restSec: number;
}

export interface ParsedWorkoutDay {
  dayName: string;
  splitName: string;
  exercises: ParsedWorkoutExercise[];
}

export interface ParsedMealItem {
  name: string;
  quantity: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

export interface ParsedMealSection {
  mealSlot: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
  mealTitle: string;
  items: ParsedMealItem[];
}

export interface ParsedPlanResult {
  workouts: ParsedWorkoutDay[];
  meals: ParsedMealSection[];
  rawText: string;
}

export function parsePlanText(rawText: string): ParsedPlanResult {
  const lines = rawText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const workouts: ParsedWorkoutDay[] = [];
  const meals: ParsedMealSection[] = [];

  let currentWorkout: ParsedWorkoutDay | null = null;
  let currentMeal: ParsedMealSection | null = null;

  const dayRegex = /^(?:Day\s*\d+|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|Push|Pull|Legs|Upper|Lower|Full\s*Body)\b/i;
  const mealRegex = /^(?:Breakfast|Lunch|Dinner|Snack(?:s)?|Meal\s*\d+|Pre-Workout|Post-Workout)\b/i;
  const setRepRegex = /(?:(\d+)\s*[x×]\s*(\d+(?:\s*-\s*\d+)?))(?:\s*@\s*(\d+)\s*s)?/i;

  for (const line of lines) {
    if (dayRegex.test(line)) {
      if (currentWorkout && currentWorkout.exercises.length > 0) {
        workouts.push(currentWorkout);
      }
      currentWorkout = {
        dayName: line,
        splitName: line,
        exercises: [],
      };
      continue;
    }

    if (mealRegex.test(line)) {
      if (currentMeal && currentMeal.items.length > 0) {
        meals.push(currentMeal);
      }
      let slot: 'breakfast' | 'lunch' | 'dinner' | 'snacks' = 'lunch';
      const lower = line.toLowerCase();
      if (lower.includes('breakfast')) slot = 'breakfast';
      else if (lower.includes('dinner')) slot = 'dinner';
      else if (lower.includes('snack') || lower.includes('pre') || lower.includes('post')) slot = 'snacks';

      currentMeal = {
        mealSlot: slot,
        mealTitle: line,
        items: [],
      };
      continue;
    }

    const setRepMatch = line.match(setRepRegex);
    if (setRepMatch && currentWorkout) {
      const exerciseName = line.replace(setRepRegex, '').replace(/[-–•:]/g, '').trim();
      currentWorkout.exercises.push({
        name: exerciseName || 'Exercise',
        sets: parseInt(setRepMatch[1], 10),
        reps: setRepMatch[2],
        restSec: setRepMatch[3] ? parseInt(setRepMatch[3], 10) : 90,
      });
      continue;
    }

    if (currentMeal) {
      const cleanItem = line.replace(/^[-*•]\s*/, '').trim();
      if (cleanItem.length > 2) {
        currentMeal.items.push({
          name: cleanItem,
          quantity: '1 serving',
        });
      }
    }
  }

  if (currentWorkout && currentWorkout.exercises.length > 0) {
    workouts.push(currentWorkout);
  }
  if (currentMeal && currentMeal.items.length > 0) {
    meals.push(currentMeal);
  }

  return {
    workouts,
    meals,
    rawText,
  };
}
