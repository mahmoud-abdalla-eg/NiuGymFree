import { ActiveSide, GymTab, RestTimerState, WorkoutSession } from '../../types';

interface RestTimerHUDProps {
  activeSide: ActiveSide;
  gymTab?: GymTab;
  onSideChange: (side: ActiveSide) => void;
  restTimer: RestTimerState;
  onAdjustTimer: (deltaSec: number) => void;
  onSkipTimer: () => void;
  workoutRunning: boolean;
  currentWorkout: WorkoutSession;
  workoutTonnage: number;
}

export const RestTimerHUD: React.FC<RestTimerHUDProps> = ({
  activeSide,
  gymTab,
  onSideChange,
  restTimer,
  onAdjustTimer,
  onSkipTimer,
  workoutRunning,
  currentWorkout,
  workoutTonnage,
}) => {
  if (!restTimer.active && !workoutRunning) return null;

  // Don't show duplicate floating HUD if the user is already on the Active Workout Recorder screen
  if (activeSide === 'gym' && gymTab === 'workout') return null;

  const isNutrition = activeSide === 'nutrition';

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-2xl bg-slate-900/95 backdrop-blur-xl border border-amber-500/40 rounded-2xl px-4 py-2.5 shadow-2xl shadow-amber-500/10 flex items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom duration-300">
      <div className="flex items-center gap-3">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-xs shrink-0 ${
            restTimer.active
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse'
              : 'bg-violet-500/20 text-violet-300 border border-violet-500/40'
          }`}
        >
          {restTimer.active ? formatTime(restTimer.remainingSec) : 'LIVE'}
        </div>
        <div className="min-w-0">
          <div className="text-xs font-bold text-white truncate">
            {restTimer.active ? `Rest Break: ${restTimer.exerciseName}` : currentWorkout.title}
          </div>
          <div className="text-[10px] text-slate-400">
            Session: {formatTime(currentWorkout.durationSec)} • Tonnage: {workoutTonnage.toLocaleString()} kg
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {restTimer.active && (
          <>
            <button
              onClick={() => onAdjustTimer(-15)}
              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition"
              title="Minus 15 seconds"
            >
              -15s
            </button>
            <button
              onClick={() => onAdjustTimer(15)}
              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition"
              title="Add 15 seconds"
            >
              +15s
            </button>
            <button
              onClick={onSkipTimer}
              className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold transition"
            >
              Skip
            </button>
          </>
        )}
        <button
          onClick={() => onSideChange(isNutrition ? 'gym' : 'nutrition')}
          className="px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition shadow-md shadow-violet-600/30"
        >
          {isNutrition ? 'Go to Gym →' : 'Go to Nutrition →'}
        </button>
      </div>
    </div>
  );
};
