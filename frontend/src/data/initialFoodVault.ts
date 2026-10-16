import { FoodItem } from '../types';

export const INITIAL_FOOD_VAULT: FoodItem[] = [
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
  { id: 'f32', name: 'Lean Ground Turkey (93/7)', category: 'Protein', baseAmount: 100, unit: 'g', label: '100g', calories: 150, protein: 22, carbs: 0, fat: 7, emoji: '🦃' },
  { id: 'f33', name: 'Low-Fat Cottage Cheese', category: 'Dairy', baseAmount: 110, unit: 'g', label: '1/2 cup (110g)', calories: 90, protein: 13, carbs: 5, fat: 2, emoji: '🧀' },
  { id: 'f34', name: 'Edamame Beans (Shelled)', category: 'Protein', baseAmount: 100, unit: 'g', label: '100g', calories: 122, protein: 11, carbs: 10, fat: 5, emoji: '🫘' },

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
  { id: 'f31', name: 'Oat Milk Flat White', category: 'Drinks', baseAmount: 1, unit: 'cup', label: '8 oz cup', calories: 120, protein: 2, carbs: 15, fat: 5.5, emoji: '☕' },
  { id: 'f35', name: 'Cold Brew Coffee (Black)', category: 'Drinks', baseAmount: 1, unit: 'cup', label: '16 oz cup', calories: 5, protein: 0.5, carbs: 0.5, fat: 0, emoji: '🧊' },
  { id: 'f36', name: 'Electrolyte Coconut Water', category: 'Drinks', baseAmount: 250, unit: 'ml', label: '250ml glass', calories: 45, protein: 0.5, carbs: 11, fat: 0, emoji: '🥥' }
];
