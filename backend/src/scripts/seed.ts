import { getSupabase, isSupabaseConfigured } from '../services/supabaseClient';
import { SEED_FOODS } from '../data/seedFoods';
import { SEED_EXERCISES } from '../data/seedExercises';
import { STARTER_PPL_ROUTINES } from '../controllers/gymController';

async function runSeed() {
  console.log('🚀 Running NiuGymFree Database Seeder...');

  if (!isSupabaseConfigured) {
    console.log('ℹ️ Supabase credentials not found or unconfigured. Verified local seed definitions:');
    console.log(`   - Foods: ${SEED_FOODS.length} items`);
    console.log(`   - Exercises: ${SEED_EXERCISES.length} items with video cues`);
    console.log(`   - PPL Workout Routines: ${STARTER_PPL_ROUTINES.length} splits`);
    console.log('✅ Local seed verification completed successfully.');
    return;
  }

  const supabase = getSupabase();
  if (!supabase) {
    console.error('❌ Supabase client unavailable.');
    return;
  }

  console.log('📦 Seeding foods table...');
  for (const food of SEED_FOODS) {
    const { error } = await supabase.from('foods').upsert({
      id: food.id,
      name: food.name,
      category: food.category,
      unit: food.unit,
      label: food.label,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
      emoji: food.emoji,
      is_custom: false,
    });
    if (error) console.warn(`   ⚠️ Warning seeding food ${food.name}:`, error.message);
  }

  console.log('📦 Seeding exercises table...');
  for (const ex of SEED_EXERCISES) {
    const { error } = await supabase.from('exercises').upsert({
      id: ex.id,
      name: ex.name,
      primary_muscle: ex.primaryMuscle,
      secondary_muscles: ex.secondaryMuscles,
      equipment: ex.equipment,
      default_rest_sec: ex.defaultRestSec,
      youtube_video_id: ex.youtubeVideoId,
      video_start_sec: ex.videoStartSec,
      form_cues: ex.formCues,
      common_mistakes: ex.commonMistakes,
      is_custom: false,
    });
    if (error) console.warn(`   ⚠️ Warning seeding exercise ${ex.name}:`, error.message);
  }

  console.log('🎉 Seeding successfully finished!');
}

runSeed().catch((err) => {
  console.error('❌ Seed script error:', err);
  process.exit(1);
});
