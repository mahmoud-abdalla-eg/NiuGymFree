import { ExerciseVaultItem } from '../types';

export const INITIAL_EXERCISE_VAULT: ExerciseVaultItem[] = [
  // CHEST
  {
    id: 'ex1',
    name: 'Barbell Flat Bench Press',
    muscle: 'Chest',
    equipment: 'Barbell',
    defaultRest: 180,
    prevBest: '90kg × 8',
    pr1RM: 114,
    cue: 'Retract scapula, slight arch, touch lower sternum.',
    formCues: [
      'Retract and depress shoulder blades into the bench',
      'Plant feet flat on the floor for strong leg drive',
      'Lower bar with control to lower chest/sternum',
      'Elbows tucked at ~45-70 degree angle to torso'
    ],
    commonMistakes: [
      'Flaring elbows out at 90 degrees (stresses rotator cuff)',
      'Bouncing the bar off ribs',
      'Lifting glutes off the bench'
    ],
    youtubeVideoId: 'vcBig73ojpE', // Jeff Nippard Bench Press Guide
    videoStartSec: 45
  },
  {
    id: 'ex2',
    name: 'Incline Dumbbell Press',
    muscle: 'Chest',
    equipment: 'Dumbbell',
    defaultRest: 120,
    prevBest: '36kg × 10',
    pr1RM: 48,
    cue: '30-degree bench angle, deep stretch at bottom.',
    formCues: [
      'Set bench to 30 degrees for clavicular head emphasis',
      'Drive dumbbells upward in a gentle inward arc',
      'Get a full, controlled stretch at the bottom'
    ],
    commonMistakes: [
      'Setting bench too steep (turns into front delt press)',
      'Shortcutting the range of motion'
    ],
    youtubeVideoId: '8iPEnn-ltC8',
    videoStartSec: 30
  },
  {
    id: 'ex3',
    name: 'Seated Cable Flyes',
    muscle: 'Chest',
    equipment: 'Cable',
    defaultRest: 90,
    prevBest: '22.5kg × 12',
    pr1RM: 31.5,
    cue: 'Squeeze elbows together at peak contraction.',
    formCues: [
      'Set cables slightly above or at shoulder height',
      'Maintain slight bend in elbows throughout',
      'Focus on bringing biceps together across the chest'
    ],
    commonMistakes: [
      'Turning the flye into a pressing motion',
      'Using excessive momentum or torso swinging'
    ],
    youtubeVideoId: 'Iwe6AmxVf7o',
    videoStartSec: 20
  },
  {
    id: 'ex16',
    name: 'Chest Dips (Weighted)',
    muscle: 'Chest',
    equipment: 'Bodyweight',
    defaultRest: 120,
    prevBest: '25kg × 8',
    pr1RM: 31.7,
    cue: 'Lean torso forward 30 degrees, flare elbows slightly.',
    formCues: [
      'Lean forward to shift stress onto lower pecs',
      'Descend until upper arms are parallel to floor',
      'Lock out with chest flexed at top'
    ],
    commonMistakes: [
      'Staying upright (shifts load to triceps)',
      'Descending past shoulder comfort limit'
    ],
    youtubeVideoId: '2z8JmcrW-As',
    videoStartSec: 15
  },
  {
    id: 'ex17',
    name: 'Incline Barbell Bench Press',
    muscle: 'Chest',
    equipment: 'Barbell',
    defaultRest: 150,
    prevBest: '80kg × 8',
    pr1RM: 101.3,
    cue: 'Touch upper chest near clavicles, keep wrists straight.',
    formCues: [
      'Bench angle 30 to 45 degrees',
      'Unrack over clavicles with firm grip',
      'Touch just below collarbone'
    ],
    commonMistakes: [
      'Pressing over neck instead of mid/upper chest'
    ],
    youtubeVideoId: 'jPLd2TrO4hs',
    videoStartSec: 30
  },

  // SHOULDERS
  {
    id: 'ex4',
    name: 'Seated Overhead DB Shoulder Press',
    muscle: 'Shoulders',
    equipment: 'Dumbbell',
    defaultRest: 120,
    prevBest: '28kg × 9',
    pr1RM: 36.4,
    cue: 'Keep core braced, press slightly in front of face in scapular plane.',
    formCues: [
      'Set bench to 75-80 degrees (not completely flat 90)',
      'Press dumbbells up and slightly inward',
      'Keep ribcage pinned down and core engaged'
    ],
    commonMistakes: [
      'Over-arching lumbar spine to compensate for weight',
      'Flaring elbows completely to sides'
    ],
    youtubeVideoId: 'qEwKCR5JCog',
    videoStartSec: 25
  },
  {
    id: 'ex5',
    name: 'Cable Lateral Raises',
    muscle: 'Shoulders',
    equipment: 'Cable',
    defaultRest: 60,
    prevBest: '12.5kg × 15',
    pr1RM: 18.8,
    cue: 'Lead with pinkies and elbows, pause at shoulder height.',
    formCues: [
      'Position cable cuff at wrist or low handle',
      'Raise arm in scapular plane (30 degrees forward of midline)',
      'Hold peak contraction for a split second'
    ],
    commonMistakes: [
      'Shrugging traps to initiate movement',
      'Using excessive body sway'
    ],
    youtubeVideoId: 'PPrzBWZDOhA',
    videoStartSec: 30
  },
  {
    id: 'ex18',
    name: 'Standing Barbell Overhead Press (OHP)',
    muscle: 'Shoulders',
    equipment: 'Barbell',
    defaultRest: 180,
    prevBest: '65kg × 6',
    pr1RM: 78,
    cue: 'Glutes squeezed, press bar in straight vertical line.',
    formCues: [
      'Grip just outside shoulders with vertical forearms',
      'Squeeze glutes and quads for solid standing base',
      'Pull chin back as bar passes face, push head through at top'
    ],
    commonMistakes: [
      'Hyperextending lower back',
      'Looping bar too far forward around face'
    ],
    youtubeVideoId: '_RlRDWO2jfg',
    videoStartSec: 40
  },
  {
    id: 'ex19',
    name: 'Reverse Pec Deck / Rear Delt Flye',
    muscle: 'Shoulders',
    equipment: 'Machine',
    defaultRest: 60,
    prevBest: '50kg × 14',
    pr1RM: 73.3,
    cue: 'Push handles outward rather than pulling backward.',
    formCues: [
      'Set seat so arms are parallel to floor',
      'Keep elbows softly bent and stationary',
      'Focus on rear deltoid contraction'
    ],
    commonMistakes: [
      'Retracting shoulder blades excessively with rhomboids'
    ],
    youtubeVideoId: '6yMdhi2DVao',
    videoStartSec: 20
  },
  {
    id: 'ex20',
    name: 'Dumbbell Lateral Raise',
    muscle: 'Shoulders',
    equipment: 'Dumbbell',
    defaultRest: 60,
    prevBest: '14kg × 12',
    pr1RM: 19.6,
    cue: 'Pour the water slightly, raise strictly to parallel.',
    formCues: [
      'Slight forward torso hinge',
      'Raise dumbbells out to 10 and 2 o\'clock angles'
    ],
    commonMistakes: [
      'Swinging hips or throwing weight up'
    ],
    youtubeVideoId: '3VcKaXpzqRo',
    videoStartSec: 20
  },

  // BACK
  {
    id: 'ex7',
    name: 'Weighted Wide-Grip Pull-Ups',
    muscle: 'Back',
    equipment: 'Bodyweight',
    defaultRest: 150,
    prevBest: '85kg × 8',
    pr1RM: 107.7,
    cue: 'Drive elbows down to hips, chin cleanly over bar.',
    formCues: [
      'Grip slightly wider than shoulder width',
      'Depress scapula before initiating the pull',
      'Think of pulling elbows into back pockets',
      'Full dead-hang stretch at bottom'
    ],
    commonMistakes: [
      'Kicking legs or kipping',
      'Cutting off the bottom stretch'
    ],
    youtubeVideoId: 'eGo4IYlbE5g',
    videoStartSec: 45
  },
  {
    id: 'ex8',
    name: 'Barbell Bent-Over Row',
    muscle: 'Back',
    equipment: 'Barbell',
    defaultRest: 150,
    prevBest: '85kg × 10',
    pr1RM: 113.3,
    cue: 'Hinge to 45 degrees, pull bar to lower sternum.',
    formCues: [
      'Maintain neutral spine with hips back',
      'Pull through elbows, keeping wrists straight',
      'Squeeze shoulder blades together at top'
    ],
    commonMistakes: [
      'Standing too upright (turns into shrug)',
      'Rounding lumbar spine under heavy load'
    ],
    youtubeVideoId: 'G8l_8chR5BE',
    videoStartSec: 30
  },
  {
    id: 'ex9',
    name: 'Chest-Supported T-Bar Row',
    muscle: 'Back',
    equipment: 'Machine',
    defaultRest: 120,
    prevBest: '65kg × 10',
    pr1RM: 86.7,
    cue: 'Let protract at bottom, flare elbows slightly for upper back.',
    formCues: [
      'Keep chest glued to pad throughout entire set',
      'Full protraction at bottom for deep upper back stretch',
      'Drive elbows back hard'
    ],
    commonMistakes: [
      'Lifting chest off pad to cheat reps'
    ],
    youtubeVideoId: 'jEy_czb3RKA',
    videoStartSec: 20
  },
  {
    id: 'ex21',
    name: 'Lat Pulldown (Neutral or Wide Grip)',
    muscle: 'Back',
    equipment: 'Cable',
    defaultRest: 90,
    prevBest: '75kg × 10',
    pr1RM: 100,
    cue: 'Slight lean back, pull bar to upper chest.',
    formCues: [
      'Lock thighs firmly under pads',
      'Pull bar smoothly down to upper chest',
      'Control the eccentric stretch all the way up'
    ],
    commonMistakes: [
      'Swinging torso excessively backward'
    ],
    youtubeVideoId: 'CAwf7n6Luuc',
    videoStartSec: 30
  },
  {
    id: 'ex22',
    name: 'Seated Cable Row',
    muscle: 'Back',
    equipment: 'Cable',
    defaultRest: 90,
    prevBest: '70kg × 11',
    pr1RM: 95.7,
    cue: 'Sit tall, pull handle to belly button, stretch forward.',
    formCues: [
      'Knees slightly bent, back straight',
      'Let shoulders reach forward on stretch',
      'Pull handle to naval while sitting tall'
    ],
    commonMistakes: [
      'Rocking back and forth like a rowing boat'
    ],
    youtubeVideoId: 'GZbfZ033f74',
    videoStartSec: 25
  },
  {
    id: 'ex23',
    name: 'Conventional Barbell Deadlift',
    muscle: 'Back',
    equipment: 'Barbell',
    defaultRest: 240,
    prevBest: '160kg × 5',
    pr1RM: 186.7,
    cue: 'Wedge hips, pull slack out of bar, push floor away.',
    formCues: [
      'Bar directly over midfoot',
      'Engage lats by bending the bar into shins',
      'Drive floor away with legs before locking hips'
    ],
    commonMistakes: [
      'Jerking the bar off the floor with slack in arms',
      'Hyperextending spine at lockout'
    ],
    youtubeVideoId: 'op9kVnSso6Q',
    videoStartSec: 45
  },

  // LEGS - QUADS & GLUTES
  {
    id: 'ex11',
    name: 'High-Bar Back Squat',
    muscle: 'Quads',
    equipment: 'Barbell',
    defaultRest: 180,
    prevBest: '120kg × 6',
    pr1RM: 144,
    cue: 'Knees track over toes, deep hip crease below parallel.',
    formCues: [
      'Bar resting high on traps',
      'Take deep diaphragmatic breath and brace 360 core',
      'Descend controlled until hip crease is below knee'
    ],
    commonMistakes: [
      'Knees collapsing inward (valgus collapse)',
      'Good-morning-ing the squat on the ascent'
    ],
    youtubeVideoId: 'bEv6CCg2BC8',
    videoStartSec: 60
  },
  {
    id: 'ex13',
    name: 'Seated Leg Extensions',
    muscle: 'Quads',
    equipment: 'Machine',
    defaultRest: 90,
    prevBest: '70kg × 14',
    pr1RM: 102.7,
    cue: '1-second hard quad squeeze at the top, slow negative.',
    formCues: [
      'Align knee joints directly with machine pivot axis',
      'Pad resting right above ankles',
      'Hold full extension for 1 count to maximize rectus femoris'
    ],
    commonMistakes: [
      'Kicking weight up with jerky speed'
    ],
    youtubeVideoId: 'YyvSfVjQeL0',
    videoStartSec: 20
  },
  {
    id: 'ex24',
    name: 'Leg Press (45 Degree)',
    muscle: 'Quads',
    equipment: 'Machine',
    defaultRest: 150,
    prevBest: '240kg × 10',
    pr1RM: 320,
    cue: 'Feet shoulder-width on lower platform, do not lift tailbone.',
    formCues: [
      'Keep lower back and pelvis pinned tight to back pad',
      'Bring sled down until knees reach ~90 degrees',
      'Do not lock out knees aggressively at top'
    ],
    commonMistakes: [
      'Allowing lower back to round off pad at bottom'
    ],
    youtubeVideoId: 'IZxyjW7MPJQ',
    videoStartSec: 35
  },
  {
    id: 'ex25',
    name: 'Bulgarian Split Squat',
    muscle: 'Quads',
    equipment: 'Dumbbell',
    defaultRest: 90,
    prevBest: '24kg × 10',
    pr1RM: 32,
    cue: 'Rear foot elevated on bench, drop back knee straight down.',
    formCues: [
      'Front foot positioned so knee stays over ankle/midfoot',
      'Descend until rear knee almost kisses the floor',
      'Drive up through front heel and midfoot'
    ],
    commonMistakes: [
      'Placing rear foot too high or front foot too close'
    ],
    youtubeVideoId: '2C-uNgKwPLE',
    videoStartSec: 30
  },
  {
    id: 'ex26',
    name: 'Barbell Hip Thrust',
    muscle: 'Glutes',
    equipment: 'Barbell',
    defaultRest: 120,
    prevBest: '140kg × 10',
    pr1RM: 186.7,
    cue: 'Chin tucked, full posterior pelvic tilt at peak lockout.',
    formCues: [
      'Shoulder blades against bench edge',
      'Shins vertical at top of thrust',
      'Full glute lockout with ribs pinned down'
    ],
    commonMistakes: [
      'Arching lumbar spine instead of driving hips'
    ],
    youtubeVideoId: 'LM8XHLYJoYs',
    videoStartSec: 40
  },

  // LEGS - HAMSTRINGS & CALVES
  {
    id: 'ex12',
    name: 'Romanian Deadlift (RDL)',
    muscle: 'Hamstrings',
    equipment: 'Barbell',
    defaultRest: 150,
    prevBest: '110kg × 8',
    pr1RM: 139.3,
    cue: 'Push hips straight back, shave the shins, stop mid-shin.',
    formCues: [
      'Soft knee bend locked in place throughout',
      'Hinge hips straight backward as if touching wall behind you',
      'Keep bar in constant contact with legs'
    ],
    commonMistakes: [
      'Bending knees more like a squat',
      'Rounding lower spine to touch the floor'
    ],
    youtubeVideoId: 'JCXUYuzwNrM',
    videoStartSec: 45
  },
  {
    id: 'ex14',
    name: 'Lying Leg Curls',
    muscle: 'Hamstrings',
    equipment: 'Machine',
    defaultRest: 90,
    prevBest: '55kg × 12',
    pr1RM: 77,
    cue: 'Keep hips pressed into pad throughout, toes neutral.',
    formCues: [
      'Align knee joints with pivot point',
      'Press hips firmly into pad to avoid pelvic lift',
      'Curl pad up until hamstrings are fully contracted'
    ],
    commonMistakes: [
      'Lifting hips off bench during contraction'
    ],
    youtubeVideoId: '1Tq3QdYUuHs',
    videoStartSec: 20
  },
  {
    id: 'ex27',
    name: 'Seated Hamstring Leg Curl',
    muscle: 'Hamstrings',
    equipment: 'Machine',
    defaultRest: 90,
    prevBest: '60kg × 12',
    pr1RM: 84,
    cue: 'Thigh pad locked tight, curl heels under seat with control.',
    formCues: [
      'Thigh pad firmly clamped down',
      'Full stretch at top without hyperextending knees',
      'Smooth, controlled return'
    ],
    commonMistakes: [
      'Allowing knees to hyperextend at top'
    ],
    youtubeVideoId: 'Orxowest56U',
    videoStartSec: 25
  },
  {
    id: 'ex28',
    name: 'Standing Calf Raises',
    muscle: 'Calves',
    equipment: 'Machine',
    defaultRest: 60,
    prevBest: '90kg × 15',
    pr1RM: 135,
    cue: '2-second dead stop stretch at bottom, press onto big toes.',
    formCues: [
      'Full deep stretch below platform level',
      'Pause for 2 seconds to dissipate Achilles tendon bounce',
      'Drive up high on balls of feet'
    ],
    commonMistakes: [
      'Bouncing rapidly using tendon reflex rather than muscle fibers'
    ],
    youtubeVideoId: 'gwLzBJYoWlI',
    videoStartSec: 20
  },

  // ARMS - TRICEPS & BICEPS
  {
    id: 'ex6',
    name: 'Tricep Rope Pushdowns',
    muscle: 'Arms',
    equipment: 'Cable',
    defaultRest: 60,
    prevBest: '32kg × 12',
    pr1RM: 44.8,
    cue: 'Lock elbows at sides, spread rope apart at lockout.',
    formCues: [
      'Pin elbows to sides of torso',
      'Extend forearms down and flare rope handles apart',
      'Squeeze triceps for 1 count at bottom'
    ],
    commonMistakes: [
      'Letting elbows drift forward and backward with momentum'
    ],
    youtubeVideoId: 'vB5OHsJ3EME',
    videoStartSec: 15
  },
  {
    id: 'ex10',
    name: 'Incline Dumbbell Bicep Curls',
    muscle: 'Arms',
    equipment: 'Dumbbell',
    defaultRest: 75,
    prevBest: '16kg × 11',
    pr1RM: 21.9,
    cue: 'Keep shoulders pinned back, supinate wrists at top.',
    formCues: [
      'Bench at 45-60 degree incline',
      'Let arms hang perpendicular to floor for long head stretch',
      'Supinate wrists as you curl upward'
    ],
    commonMistakes: [
      'Swinging shoulders forward to assist curl'
    ],
    youtubeVideoId: 'soxrZlIl35U',
    videoStartSec: 25
  },
  {
    id: 'ex29',
    name: 'EZ-Bar Skull Crushers (Lying Tricep Ext)',
    muscle: 'Arms',
    equipment: 'Barbell',
    defaultRest: 90,
    prevBest: '38kg × 10',
    pr1RM: 50.7,
    cue: 'Angled upper arms slightly backward, lower bar to forehead/crown.',
    formCues: [
      'Keep elbows angled slightly backward (towards wall behind head)',
      'Hinge strictly at elbow joints',
      'Full tricep lockout at top'
    ],
    commonMistakes: [
      'Flaring elbows out excessively wide'
    ],
    youtubeVideoId: 'd_KZxkY_0cM',
    videoStartSec: 30
  },
  {
    id: 'ex30',
    name: 'Barbell Standing Bicep Curl',
    muscle: 'Arms',
    equipment: 'Barbell',
    defaultRest: 90,
    prevBest: '40kg × 8',
    pr1RM: 50.7,
    cue: 'Shoulders locked, curl bar to chin level without back sway.',
    formCues: [
      'Grip shoulder-width',
      'Keep upper arms stationary by your ribs',
      'Lower bar with 2-second negative'
    ],
    commonMistakes: [
      'Swinging hips or throwing lower back into curl'
    ],
    youtubeVideoId: 'ykJmrZ5v0Oo',
    videoStartSec: 20
  },
  {
    id: 'ex31',
    name: 'Overhead Cable Tricep Extension',
    muscle: 'Arms',
    equipment: 'Cable',
    defaultRest: 60,
    prevBest: '27.5kg × 12',
    pr1RM: 38.5,
    cue: 'Get deep tricep long-head stretch behind neck, flare out.',
    formCues: [
      'Step forward with split stance',
      'Allow hands to drift behind head for maximal stretch',
      'Extend arms straight forward'
    ],
    commonMistakes: [
      'Over-extending spine'
    ],
    youtubeVideoId: 'ns-rg_mRhyA',
    videoStartSec: 20
  },
  {
    id: 'ex32',
    name: 'Hammer Curls (Dumbbell or Cable)',
    muscle: 'Arms',
    equipment: 'Dumbbell',
    defaultRest: 60,
    prevBest: '18kg × 10',
    pr1RM: 24,
    cue: 'Palms facing each other, targets brachialis and forearms.',
    formCues: [
      'Neutral grip throughout entire movement',
      'Squeeze forearm and bicep hard at peak'
    ],
    commonMistakes: [
      'Using momentum or torso rock'
    ],
    youtubeVideoId: 'zC3nLlEvin4',
    videoStartSec: 15
  },

  // CORE & ABS
  {
    id: 'ex15',
    name: 'Hanging Leg Raises',
    muscle: 'Core',
    equipment: 'Bodyweight',
    defaultRest: 60,
    prevBest: '20kg × 15',
    pr1RM: 30,
    cue: 'Posteriorly tilt pelvis to engage lower abs, do not swing.',
    formCues: [
      'Dead hang from bar with lats engaged',
      'Curl pelvis up towards ribs rather than just lifting legs',
      'Slow eccentric lower without swing'
    ],
    commonMistakes: [
      'Swinging body back and forth using hip flexors'
    ],
    youtubeVideoId: 'hdng3Nm1x_E',
    videoStartSec: 25
  },
  {
    id: 'ex33',
    name: 'Cable Kneeling Crunch',
    muscle: 'Core',
    equipment: 'Cable',
    defaultRest: 60,
    prevBest: '60kg × 15',
    pr1RM: 90,
    cue: 'Hips stationary, curl sternum towards pelvis like rolling carpet.',
    formCues: [
      'Kneel in front of cable stack with rope at ears',
      'Lock hips in place',
      'Curl torso downward by flexing spine'
    ],
    commonMistakes: [
      'Sitting back on heels (shifts work to hips)'
    ],
    youtubeVideoId: '2fORO_PXGPo',
    videoStartSec: 20
  },
  {
    id: 'ex34',
    name: 'Ab Wheel Rollout',
    muscle: 'Core',
    equipment: 'Bodyweight',
    defaultRest: 60,
    prevBest: 'Bodyweight × 12',
    pr1RM: 25,
    cue: 'Tuck pelvis under, roll out with braced core, pull back with abs.',
    formCues: [
      'Start on knees with rounded upper back',
      'Roll wheel out while maintaining pelvic posterior tilt',
      'Contract abs to pull wheel back'
    ],
    commonMistakes: [
      'Allowing lower back to sag into hyperextension'
    ],
    youtubeVideoId: 'rqiTPdK1cWg',
    videoStartSec: 20
  }
];
