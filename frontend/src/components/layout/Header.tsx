import React, { useState, useRef, useEffect } from 'react';
import {
  Flame,
  Dumbbell,
  Utensils,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Scale,
  Bot,
  Download,
  FileText,
  User,
  Sparkles,
  ChevronDown,
  Wrench,
  Activity
} from 'lucide-react';
import { ActiveSide, UserProfile, RestTimerState, AuthUser } from '../../types';
import { BiometricCalculations } from '../../lib/biometrics';

interface HeaderProps {
  activeSide: ActiveSide;
  onSideChange: (side: ActiveSide) => void;
  selectedDate: string;
  onDateChange: (delta: number) => void;
  onJumpToToday?: () => void;
  isToday?: boolean;
  profile: UserProfile;
  biometricMetrics: BiometricCalculations;
  restTimer: RestTimerState;
  onOpenBiometrics: () => void;
  onOpenPdfImport: () => void;
  onOpenInBodyImport?: () => void;
  onOpenAiDrawer: () => void;
  onOpenBackup: () => void;
  currentUser: AuthUser | null;
  onOpenAuth: () => void;
  onOpenOnboarding: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeSide,
  onSideChange,
  selectedDate,
  onDateChange,
  onJumpToToday,
  isToday,
  profile,
  biometricMetrics,
  restTimer,
  onOpenBiometrics,
  onOpenPdfImport,
  onOpenInBodyImport,
  onOpenAiDrawer,
  onOpenBackup,
  currentUser,
  onOpenAuth,
  onOpenOnboarding,
}) => {
  const isNutrition = activeSide === 'nutrition';
  const [toolsOpen, setToolsOpen] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toolsRef.current && !toolsRef.current.contains(event.target as Node)) {
        setToolsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatRestTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/90 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3 shrink-0">
          <div
            className={`w-9 h-9 rounded-2xl flex items-center justify-center text-white shadow-md transition-all duration-300 ${
              isNutrition
                ? 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/20'
                : 'bg-gradient-to-br from-violet-600 to-cyan-500 shadow-violet-500/20'
            }`}
          >
            {isNutrition ? <Flame className="w-4 h-4" /> : <Dumbbell className="w-4 h-4" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold tracking-tight text-white">NiuGymFree</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700/80">
                $0 Free
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden md:block">
              Dual-Hemisphere Platform
            </p>
          </div>
        </div>

        {/* Center Primary Hemisphere Segmented Switcher */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-900 border border-slate-800 shadow-inner">
          <button
            onClick={() => onSideChange('nutrition')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              isNutrition
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Nutrition</span>
          </button>
          <button
            onClick={() => onSideChange('gym')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              !isNutrition
                ? 'bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-md shadow-violet-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Dumbbell className="w-3.5 h-3.5" />
            <span>Gym</span>
            {restTimer.active && (
              <span className="ml-1 px-1.5 py-0.2 text-[9px] rounded-full bg-amber-500 text-slate-950 font-black animate-pulse">
                {formatRestTime(restTimer.remainingSec)}
              </span>
            )}
          </button>
        </div>

        {/* Right Consolidated Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Compact Date Scrubber */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl px-1.5 py-1 text-xs">
            <button
              onClick={() => onDateChange(-1)}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
              title="Previous Day"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <div className="px-2 flex items-center gap-1.5 font-semibold text-slate-200">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>{selectedDate}</span>
              {isToday ? (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  Today
                </span>
              ) : onJumpToToday ? (
                <button
                  onClick={onJumpToToday}
                  className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold border border-cyan-500/30 transition"
                  title="Jump back to today"
                >
                  Return to Today
                </button>
              ) : null}
            </div>
            <button
              onClick={() => onDateChange(1)}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
              title="Next Day"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Biometrics Weight Quick Pill */}
          <button
            onClick={onOpenBiometrics}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition ${
              biometricMetrics.isCheckInDue
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 hover:bg-amber-500/20'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
            title="Weight Check-In & Adaptive TDEE"
          >
            <Scale className="w-3.5 h-3.5 text-emerald-400" />
            <span>{profile.weightKg ? `${profile.weightKg}kg` : 'Log Weight'}</span>
            {biometricMetrics.isCheckInDue && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            )}
          </button>

          {/* Quick Tools Dropdown (Consolidates OCR, AI, Backup, Onboarding into 1 clean menu) */}
          <div className="relative" ref={toolsRef}>
            <button
              onClick={() => setToolsOpen(!toolsOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition"
              title="Quick Tools & Actions"
            >
              <Wrench className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline">Tools</span>
              <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${toolsOpen ? 'rotate-180' : ''}`} />
            </button>

            {toolsOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-2xl backdrop-blur-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2.5 py-1.5">
                  Platform Tools
                </div>

                <button
                  onClick={() => {
                    setToolsOpen(false);
                    onOpenPdfImport();
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-slate-800/80 text-left text-xs font-medium text-slate-200 hover:text-white transition"
                >
                  <div className="w-7 h-7 rounded-lg bg-violet-600/20 text-cyan-400 flex items-center justify-center shrink-0">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold">Import Plan (OCR)</div>
                    <div className="text-[10px] text-slate-400">Scan workout PDF or photo</div>
                  </div>
                </button>

                {onOpenInBodyImport && (
                  <button
                    onClick={() => {
                      setToolsOpen(false);
                      onOpenInBodyImport();
                    }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-slate-800/80 text-left text-xs font-medium text-slate-200 hover:text-white transition"
                  >
                    <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                      <Activity className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-bold">Import InBody Scan (OCR)</div>
                      <div className="text-[10px] text-slate-400">Scan InBody 270/570/770 sheet</div>
                    </div>
                  </button>
                )}

                <button
                  onClick={() => {
                    setToolsOpen(false);
                    onOpenAiDrawer();
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-slate-800/80 text-left text-xs font-medium text-slate-200 hover:text-white transition"
                >
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold">AI Coach Drawer</div>
                    <div className="text-[10px] text-slate-400">Nutritional & training advice</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setToolsOpen(false);
                    onOpenOnboarding();
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-slate-800/80 text-left text-xs font-medium text-slate-200 hover:text-white transition"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold">Setup Questionnaire</div>
                    <div className="text-[10px] text-slate-400">Recalibrate height, weight, BMR</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setToolsOpen(false);
                    onOpenBackup();
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-slate-800/80 text-left text-xs font-medium text-slate-200 hover:text-white transition"
                >
                  <div className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center shrink-0">
                    <Download className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold">Backup & Sync</div>
                    <div className="text-[10px] text-slate-400">Export or restore JSON data</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* User Auth Profile Pill / Login Trigger */}
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700 text-xs font-semibold text-white transition shadow-sm"
            title={currentUser ? `Signed in as ${currentUser.name}` : 'Sign In or Create Account'}
          >
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-[10px] font-black text-slate-950 shrink-0">
              {currentUser ? currentUser.name.charAt(0).toUpperCase() : <User className="w-3 h-3 text-slate-950" />}
            </div>
            <span className="max-w-[75px] truncate hidden sm:inline">
              {currentUser ? currentUser.name : 'Sign In'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
