import { ExerciseItem } from '../types';

export const SEED_EXERCISES: ExerciseItem[] = [
  {
    id: 'ex_bb_bench',
    name: 'Barbell Flat Bench Press',
    primaryMuscle: 'chest',
    secondaryMuscles: ['shoulders', 'arms'],
    equipment: 'barbell',
    defaultRestSec: 120,
    youtubeVideoId: 'rT7DgCr-3pg',
    videoStartSec: 45,
    formCues: ['Retract & depress scapulae into the bench', 'Drive through the floor with feet planted', 'Touch mid-sternum with elbows tucked at 45-75 degrees'],
    commonMistakes: ['Flaring elbows out at 90 degrees', 'Bouncing bar off the ribcage', 'Lifting hips off the bench during the press']
  },
  {
    id: 'ex_incline_db_press',
    name: 'Incline Dumbbell Bench Press',
    primaryMuscle: 'chest',
    secondaryMuscles: ['shoulders', 'arms'],
    equipment: 'dumbbell',
    defaultRestSec: 90,
    youtubeVideoId: '8iPEnn-ltC8',
    videoStartSec: 30,
    formCues: ['Set bench angle to 30 degrees to bias the clavicular head', 'Keep dumbbells in a slight arrow/semi-neutral path', 'Lower slowly until hands reach chest height'],
    commonMistakes: ['Setting bench too steep (over 45 degrees)', 'Collapsing shoulders at the bottom']
  },
  {
    id: 'ex_bb_squat',
    name: 'Barbell Back Squat',
    primaryMuscle: 'legs',
    secondaryMuscles: ['core'],
    equipment: 'barbell',
    defaultRestSec: 180,
    youtubeVideoId: 'bEv6CCg2BC8',
    videoStartSec: 60,
    formCues: ['Create upper back tension and pull the bar into your traps', 'Brace abdominal wall 360 degrees using the Valsalva maneuver', 'Hips back and knees track over toes to parallel or below'],
    commonMistakes: ['Knees caving inward (valgus collapse)', 'Rising onto toes due to tight ankles', 'Losing lumbar neutrality (butt wink)']
  },
  {
    id: 'ex_rdl_bb',
    name: 'Romanian Deadlift (Barbell)',
    primaryMuscle: 'legs',
    secondaryMuscles: ['back', 'core'],
    equipment: 'barbell',
    defaultRestSec: 120,
    youtubeVideoId: 'jEy_czb3RKA',
    videoStartSec: 25,
    formCues: ['Soft bend in the knees, initiate movement entirely by pushing hips backward', 'Shave the shins with the bar to minimize the moment arm', 'Stop once hips can no longer travel back'],
    commonMistakes: ['Squatting the weight down instead of hinging', 'Rounding the lower back', 'Looking straight up and hyperextending cervical spine']
  },
  {
    id: 'ex_lat_pulldown',
    name: 'Neutral Grip Lat Pulldown',
    primaryMuscle: 'back',
    secondaryMuscles: ['arms'],
    equipment: 'cable',
    defaultRestSec: 90,
    youtubeVideoId: 'CAwf7n6Luuc',
    videoStartSec: 20,
    formCues: ['Depress shoulder blades before pulling with the arms', 'Drive elbows straight down towards your back pockets', 'Maintain a slight 10-15 degree chest arch'],
    commonMistakes: ['Leaning back 45+ degrees turning it into a row', 'Yanking momentum with the lower back']
  },
  {
    id: 'ex_db_lat_raise',
    name: 'Dumbbell Lateral Raise',
    primaryMuscle: 'shoulders',
    secondaryMuscles: [],
    equipment: 'dumbbell',
    defaultRestSec: 60,
    youtubeVideoId: '3VcKaXpzqRo',
    videoStartSec: 15,
    formCues: ['Lean forward 10-15 degrees in the scapular plane', 'Lead with elbows and keep wrists neutral', 'Control the eccentric tempo down for 2-3 seconds'],
    commonMistakes: ['Swinging whole body for momentum', 'Shrugging with upper traps', 'Lifting too heavy with poor form']
  }
];
