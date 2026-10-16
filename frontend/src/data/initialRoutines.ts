import { RoutineTemplate } from '../types';

export const INITIAL_ROUTINES: RoutineTemplate[] = [
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
  },
  {
    id: 'rt_upper',
    name: 'Upper Body Hypertrophy (Chest, Back, Arms)',
    estBurnKcal: 310,
    targetDurationMin: 70,
    exercises: [
      { exId: 'ex17', targetSets: 3, repRange: '6-8', restSec: 150 },
      { exId: 'ex21', targetSets: 3, repRange: '8-10', restSec: 90 },
      { exId: 'ex16', targetSets: 3, repRange: '8-12', restSec: 90 },
      { exId: 'ex22', targetSets: 3, repRange: '10-12', restSec: 90 },
      { exId: 'ex29', targetSets: 3, repRange: '10-12', restSec: 90 },
      { exId: 'ex30', targetSets: 3, repRange: '10-12', restSec: 90 }
    ]
  }
];
