import React from 'react';
import {
  Activity,
  Layers,
  Utensils,
  Dumbbell,
  Calendar,
  BarChart3,
  Scale,
  Sparkles
} from 'lucide-react';
import { ActiveSide, NutritionTab, GymTab, UserProfile } from '../../types';
import { BiometricCalculations } from '../../lib/biometrics';

interface SubNavProps {
  activeSide: ActiveSide;
  nutritionTab: NutritionTab;
  onNutritionTabChange: (tab: NutritionTab) => void;
  gymTab: GymTab;
  onGymTabChange: (tab: GymTab) => void;
  profile: UserProfile;
  biometricMetrics: BiometricCalculations;
}

export const SubNav: React.FC<SubNavProps> = ({
  activeSide,
  nutritionTab,
  onNutritionTabChange,
  gymTab,
  onGymTabChange,
  profile,
  biometricMetrics,
}) => {
  const isNutrition = activeSide === 'nutrition';

  const nutritionTabs = [
    { id: 'tracker' as NutritionTab, label: 'Daily Macro Tracker', icon: Activity },
    { id: 'planner' as NutritionTab, label: 'Set Meals & Matrix', icon: Layers },
    { id: 'vault' as NutritionTab, label: 'Food Vault (36+)', icon: Utensils },
    { id: 'biometrics' as NutritionTab, label: 'Biometrics & Kcal Engine', icon: Scale },
  ];

  const gymTabs = [
    { id: 'workout' as GymTab, label: 'Active Workout Recorder', icon: Dumbbell },
    { id: 'routines' as GymTab, label: 'Routine Splits & Weekly Plan', icon: Calendar },
    { id: 'analytics' as GymTab, label: 'Strength & 1RM Analytics', icon: BarChart3 },
  ];

  return (
    <div className="bg-slate-950/80 border-b border-slate-800/80 sticky top-[57px] z-30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
        {/* Centered Segmented Navigation Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900/90 border border-slate-800">
          {isNutrition ? (
            nutritionTabs.map((t) => {
              const Icon = t.icon;
              const active = nutritionTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => onNutritionTabChange(t.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    active
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <span>{t.label}</span>
                </button>
              );
            })
          ) : (
            gymTabs.map((t) => {
              const Icon = t.icon;
              const active = gymTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => onGymTabChange(t.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    active
                      ? 'bg-violet-500/15 text-violet-200 border border-violet-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-violet-400' : 'text-slate-500'}`} />
                  <span>{t.label}</span>
                </button>
              );
            })
          )}
        </div>

        {/* Clean Context Indicator Badge */}
        <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-slate-400 shrink-0">
          <span className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px]">
            Goal: <strong className="text-emerald-400 uppercase font-bold">{profile.goalType.replace('_', ' ')}</strong>
          </span>
          <span className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px]">
            Target: <strong className="text-white font-bold">{biometricMetrics.effectiveTargetKcal} kcal</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
