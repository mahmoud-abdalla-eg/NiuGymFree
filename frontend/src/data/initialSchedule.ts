import { SetMeal, WeeklySchedule } from '../types';

export const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

export const INITIAL_SET_MEALS: SetMeal[] = [
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

export const INITIAL_WEEKLY_SCHEDULE: WeeklySchedule = {
  Monday: { gymRoutineId: 'rt_push', meals: { breakfast: 'preset_1', lunch: 'preset_2', dinner: 'preset_3' } },
  Tuesday: { gymRoutineId: 'rt_pull', meals: { breakfast: 'preset_1', lunch: 'preset_2', dinner: 'preset_3' } },
  Wednesday: { gymRoutineId: 'rt_push', meals: { breakfast: 'preset_1', lunch: 'preset_2', dinner: 'preset_3' } },
  Thursday: { gymRoutineId: 'rest', meals: { breakfast: 'preset_1', lunch: 'preset_2', dinner: 'preset_3' } },
  Friday: { gymRoutineId: 'rt_legs', meals: { breakfast: 'preset_1', lunch: 'preset_2', dinner: 'preset_3' } },
  Saturday: { gymRoutineId: 'rt_pull', meals: { breakfast: 'preset_1', lunch: 'preset_2', dinner: 'preset_3' } },
  Sunday: { gymRoutineId: 'rest', meals: { breakfast: 'preset_1', lunch: 'preset_2', dinner: 'preset_3' } }
};
