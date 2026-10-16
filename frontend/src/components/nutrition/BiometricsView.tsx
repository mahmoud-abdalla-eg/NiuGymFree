import React, { useState } from 'react';
import {
  Scale,
  Sparkles,
  Camera,
  TrendingUp,
  Calendar,
  Trash2,
  CheckCircle2,
  Activity,
  FileText,
  Percent,
  Dumbbell
} from 'lucide-react';
import { UserProfile, WeightHistoryEntry } from '../../types';
import { BiometricCalculations } from '../../lib/biometrics';
import { analyzeAdaptiveTdee } from '../../lib/adaptiveTdee';
import { compressUploadedImage, createPresetSvgPhoto } from '../../lib/imageCompression';

interface BiometricsViewProps {
  profile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  biometricMetrics: BiometricCalculations;
  selectedDate: string;
  onOpenLightbox: (url: string, title: string) => void;
  onShowToast: (msg: string) => void;
  onOpenInBodyScan?: () => void;
}

export const BiometricsView: React.FC<BiometricsViewProps> = ({
  profile,
  onUpdateProfile,
  biometricMetrics,
  selectedDate,
  onOpenLightbox,
  onShowToast,
  onOpenInBodyScan,
}) => {
  const [newWeight, setNewWeight] = useState(profile.weightKg.toString());
  const [checkInNote, setCheckInNote] = useState('');
  const [physiquePhoto, setPhysiquePhoto] = useState<string | null>(null);

  const adaptiveAnalysis = analyzeAdaptiveTdee(
    profile,
    parseFloat(newWeight) || profile.weightKg,
    selectedDate
  );

  const handlePhysiqueUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressUploadedImage(file, 640, 0.75);
      setPhysiquePhoto(compressed);
      onShowToast('📸 Attached morning physique check-in photo!');
    } catch {
      onShowToast('❌ Image processing failed');
    }
  };

  const handleLogWeightCheckIn = () => {
    const w = parseFloat(newWeight) || profile.weightKg;
    const entry: WeightHistoryEntry = {
      id: `w_${Date.now()}`,
      date: selectedDate,
      weightKg: w,
      appliedKcal: biometricMetrics.effectiveTargetKcal,
      note: checkInNote.trim() || `Bi-Weekly Check-In (${w} kg)`,
      photoUrl: physiquePhoto || createPresetSvgPhoto('physique'),
    };

    onUpdateProfile({
      ...profile,
      weightKg: w,
      lastCheckInDate: selectedDate,
      weightHistory: [...profile.weightHistory, entry],
    });

    setCheckInNote('');
    setPhysiquePhoto(null);
    onShowToast(`⚖️ Logged weight check-in (${w}kg) & recalibrated BMR!`);
  };

  const handleDeleteWeightEntry = (id: string) => {
    onUpdateProfile({
      ...profile,
      weightHistory: profile.weightHistory.filter((e) => e.id !== id),
    });
    onShowToast('🗑️ Removed weight record');
  };

  const handleMacroSliderChange = (macro: 'p' | 'c' | 'f', val: number) => {
    const current = { ...profile.macroSplit };
    const remaining = 100 - val;
    if (macro === 'p') {
      const currentCF = current.c + current.f || 1;
      current.p = val;
      current.c = Math.round((current.c / currentCF) * remaining);
      current.f = 100 - current.p - current.c;
    } else if (macro === 'c') {
      const currentPF = current.p + current.f || 1;
      current.c = val;
      current.p = Math.round((current.p / currentPF) * remaining);
      current.f = 100 - current.p - current.c;
    } else {
      const currentPC = current.p + current.c || 1;
      current.f = val;
      current.p = Math.round((current.p / currentPC) * remaining);
      current.c = 100 - current.p - current.f;
    }
    onUpdateProfile({ ...profile, macroSplit: current });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Exact Age-in-Days & Mifflin-St Jeor Engine */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/60 border border-emerald-500/30 flex flex-wrap items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1.5">
          <div className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-400 flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5" />
            <span>Chronological Biometric Engine</span>
          </div>
          <div className="text-3xl font-black text-white tracking-tight flex items-baseline gap-2">
            <span>{biometricMetrics.exactDaysOld.toLocaleString()}</span>
            <span className="text-sm font-semibold text-emerald-400">Days Old</span>
            <span className="text-xs text-slate-400 font-mono">({biometricMetrics.exactYearsOld} yrs)</span>
          </div>
          <p className="text-xs text-slate-300 max-w-xl">
            Born on <strong className="text-white">{profile.dob}</strong>. Your exact fractional age powers the{' '}
            <strong className="text-emerald-400">Mifflin-St Jeor Equation</strong> alongside your current weight (
            {profile.weightKg}kg) and height ({profile.heightCm}cm).
          </p>
        </div>

        {/* Live Math Stats */}
        <div className="flex items-center gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center min-w-[95px]">
            <div className="text-[10px] text-slate-400 font-bold uppercase">BMR Base</div>
            <div className="text-lg font-extrabold text-white mt-0.5">{biometricMetrics.bmr}</div>
            <div className="text-[9px] text-slate-500">kcal / day</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center min-w-[95px]">
            <div className="text-[10px] text-slate-400 font-bold uppercase">TDEE (1.55x)</div>
            <div className="text-lg font-extrabold text-cyan-400 mt-0.5">{biometricMetrics.tdee}</div>
            <div className="text-[9px] text-slate-500">burn rate</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-emerald-500/40 text-center min-w-[110px]">
            <div className="text-[10px] text-emerald-400 font-bold uppercase">Target Budget</div>
            <div className="text-xl font-black text-emerald-400 mt-0.5">
              {biometricMetrics.effectiveTargetKcal}
            </div>
            <div className="text-[9px] text-slate-400">kcal today</div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Weight Check-In vs Goal & Macros */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 6 Cols: Scheduled Weight Check-In & Adaptive TDEE */}
        <div className="lg:col-span-6 bg-slate-900/90 rounded-2xl p-5 border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                Bi-Weekly Weight Check-In & Adaptive Engine
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Cadence: Every {profile.checkInIntervalDays} days ({biometricMetrics.daysSinceLastCheckIn}d since last)
              </p>
            </div>
            {biometricMetrics.isCheckInDue && (
              <span className="px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 font-extrabold text-[10px] animate-pulse">
                Check-In Due
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Morning Fasted Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold text-sm focus:border-amber-400 outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Check-In Notes</label>
              <input
                type="text"
                placeholder="Strength up, veins visible..."
                value={checkInNote}
                onChange={(e) => setCheckInNote(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-amber-400 outline-none"
              />
            </div>
          </div>

          {/* Physique Photo Upload */}
          <div>
            <label className="text-[10px] text-slate-400 block mb-1">Physique Check-In Photo (Optional)</label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-400 cursor-pointer text-slate-300 text-xs transition">
                <Camera className="w-4 h-4 text-amber-400" />
                <span>Upload Physique Photo</span>
                <input type="file" accept="image/*" onChange={handlePhysiqueUpload} className="hidden" />
              </label>
              {physiquePhoto && (
                <img
                  src={physiquePhoto}
                  alt="Physique"
                  onClick={() => onOpenLightbox(physiquePhoto, 'Physique Check-In')}
                  className="w-10 h-10 rounded-lg object-cover border border-amber-500 cursor-pointer"
                />
              )}
            </div>
          </div>

          <button
            onClick={handleLogWeightCheckIn}
            className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs transition shadow-md shadow-amber-500/20"
          >
            Log Weight Check-In & Calibrate BMR
          </button>

          {/* Adaptive Calorie Recommendation Card */}
          <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-2.5 text-xs">
            <div className="flex items-center justify-between font-bold text-emerald-400">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Adaptive Kcal Recommendation
              </span>
              <span className="font-mono">
                Δ {adaptiveAnalysis.weightDeltaKg > 0 ? '+' : ''}
                {adaptiveAnalysis.weightDeltaKg} kg ({adaptiveAnalysis.daysElapsed}d)
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {adaptiveAnalysis.reasoning}
            </p>
            <div className="flex items-center justify-between pt-1">
              <div className="text-slate-400 text-[11px]">
                Suggested Target: <strong className="text-white font-bold">{adaptiveAnalysis.suggestedNewDailyKcal} kcal/d</strong>
              </div>
              <button
                onClick={() => {
                  onUpdateProfile({
                    ...profile,
                    manualKcalOverride: adaptiveAnalysis.suggestedNewDailyKcal,
                  });
                  onShowToast(`🎯 Applied adaptive target: ${adaptiveAnalysis.suggestedNewDailyKcal} kcal!`);
                }}
                className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition"
              >
                Apply {adaptiveAnalysis.suggestedNewDailyKcal} kcal
              </button>
            </div>
          </div>
        </div>

        {/* Right 6 Cols: Goal, Manual Override & Coupled Macro Sliders */}
        <div className="lg:col-span-6 bg-slate-900/90 rounded-2xl p-5 border border-slate-800/80 space-y-5">
          <div>
            <h3 className="text-sm font-bold text-white">Target Goal & Macro Ratio Sliders</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Goal automatically sets caloric surplus/deficit. Sliders are coupled to lock exactly 100%.
            </p>
          </div>

          {/* Goal Selector */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            {[
              { id: 'cut' as const, label: 'Cut (-500 kcal)', desc: 'Fat Loss' },
              { id: 'maintain' as const, label: 'Maintain (0)', desc: 'Recomposition' },
              { id: 'lean_bulk' as const, label: 'Bulk (+300 kcal)', desc: 'Hypertrophy' },
            ].map((g) => (
              <button
                key={g.id}
                onClick={() => onUpdateProfile({ ...profile, goalType: g.id, manualKcalOverride: null })}
                className={`p-2.5 rounded-xl text-center border transition ${
                  profile.goalType === g.id
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="text-xs">{g.label}</div>
                <div className="text-[10px] text-slate-500">{g.desc}</div>
              </button>
            ))}
          </div>

          {/* Manual Kcal Override Slider */}
          <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-semibold">Manual Calorie Override Slider</span>
              <span className="font-mono font-bold text-emerald-400">
                {profile.manualKcalOverride || biometricMetrics.baseTargetKcal} kcal
              </span>
            </div>
            <input
              type="range"
              min={1200}
              max={4000}
              step={25}
              value={profile.manualKcalOverride || biometricMetrics.baseTargetKcal}
              onChange={(e) =>
                onUpdateProfile({ ...profile, manualKcalOverride: Number(e.target.value) })
              }
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>1,200 kcal</span>
              <button
                onClick={() => onUpdateProfile({ ...profile, manualKcalOverride: null })}
                className="text-emerald-400 hover:underline"
              >
                Reset to Auto Mifflin-St Jeor
              </button>
              <span>4,000 kcal</span>
            </div>
          </div>

          {/* Coupled 100%-Locked Macro Split Sliders */}
          <div className="space-y-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-white">Coupled Macro Split (Locks 100%)</span>
              <span className="text-slate-400 font-mono text-[11px]">
                {profile.macroSplit.p}% P • {profile.macroSplit.c}% C • {profile.macroSplit.f}% F
              </span>
            </div>

            {/* Protein Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-sky-400 font-medium">Protein: {profile.macroSplit.p}%</span>
                <span className="text-slate-400 font-mono">{biometricMetrics.macros.proteinGrams}g</span>
              </div>
              <input
                type="range"
                min={15}
                max={60}
                value={profile.macroSplit.p}
                onChange={(e) => handleMacroSliderChange('p', Number(e.target.value))}
                className="w-full accent-sky-400"
              />
            </div>

            {/* Carbs Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-amber-400 font-medium">Carbohydrates: {profile.macroSplit.c}%</span>
                <span className="text-slate-400 font-mono">{biometricMetrics.macros.carbsGrams}g</span>
              </div>
              <input
                type="range"
                min={15}
                max={70}
                value={profile.macroSplit.c}
                onChange={(e) => handleMacroSliderChange('c', Number(e.target.value))}
                className="w-full accent-amber-400"
              />
            </div>

            {/* Fat Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-rose-400 font-medium">Dietary Fat: {profile.macroSplit.f}%</span>
                <span className="text-slate-400 font-mono">{biometricMetrics.macros.fatGrams}g</span>
              </div>
              <input
                type="range"
                min={15}
                max={50}
                value={profile.macroSplit.f}
                onChange={(e) => handleMacroSliderChange('f', Number(e.target.value))}
                className="w-full accent-rose-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* InBody Body Composition Scan Center */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-cyan-500/30 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center font-bold">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">InBody Body Composition & Scan Center</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 font-extrabold border border-cyan-500/30">
                  OCR Engine
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Scan your InBody 270/570/770 printout to track Skeletal Muscle Mass (SMM), Body Fat %, BMR & Visceral Fat.
              </p>
            </div>
          </div>

          {onOpenInBodyScan && (
            <button
              onClick={onOpenInBodyScan}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-xs transition shadow-lg shadow-cyan-500/20 shrink-0"
            >
              <FileText className="w-4 h-4" />
              <span>Import InBody Scan (OCR)</span>
            </button>
          )}
        </div>

        {/* Current InBody Telemetry Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
              <Dumbbell className="w-3 h-3 text-cyan-400" /> SMM (Muscle)
            </span>
            <div className="text-base font-extrabold text-cyan-300 mt-1">
              {profile.skeletalMuscleMassKg ? `${profile.skeletalMuscleMassKg} kg` : '--'}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
              <Percent className="w-3 h-3 text-amber-400" /> Body Fat %
            </span>
            <div className="text-base font-extrabold text-amber-300 mt-1">
              {profile.bodyFatPercent ? `${profile.bodyFatPercent}%` : '--'}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Fat Mass (BFM)</span>
            <div className="text-base font-extrabold text-white mt-1">
              {profile.bodyFatPercent
                ? `${((profile.weightKg * profile.bodyFatPercent) / 100).toFixed(1)} kg`
                : '--'}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold">InBody BMR</span>
            <div className="text-base font-extrabold text-emerald-400 mt-1">
              {profile.inBodyScans?.[0]?.bmrKcal ? `${profile.inBodyScans[0].bmrKcal} kcal` : `${biometricMetrics.bmr} kcal`}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Visceral Fat</span>
            <div className="text-base font-extrabold text-indigo-300 mt-1">
              {profile.inBodyScans?.[0]?.visceralFatLevel ? `Level ${profile.inBodyScans[0].visceralFatLevel}` : '--'}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold">InBody Score</span>
            <div className="text-base font-extrabold text-violet-300 mt-1">
              {profile.inBodyScans?.[0]?.inBodyScore ? `${profile.inBodyScans[0].inBodyScore} / 100` : '--'}
            </div>
          </div>
        </div>

        {(!profile.inBodyScans || profile.inBodyScans.length === 0) && !profile.bodyFatPercent && (
          <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-xs text-cyan-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>
                No InBody scans recorded yet. Upload a mobile photo or PDF scan of your test sheet to calibrate muscle mass and fat %.
              </span>
            </div>
            {onOpenInBodyScan && (
              <button
                onClick={onOpenInBodyScan}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-bold underline shrink-0"
              >
                Start OCR Scan
              </button>
            )}
          </div>
        )}
      </div>

      {/* Historical Check-In Logs & Physique Gallery */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800/80 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-400" />
          Weight Check-In History ({profile.weightHistory.length} Recorded Check-Ins)
        </h3>

        {profile.weightHistory.length === 0 ? (
          <div className="p-8 rounded-xl bg-slate-950 border border-dashed border-slate-800 text-center space-y-2">
            <Scale className="w-8 h-8 text-slate-500 mx-auto" />
            <div className="text-xs font-semibold text-white">No Weigh-Ins Recorded Yet</div>
            <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
              Use the check-in form above to log your morning weight. The adaptive engine will track your rate of change every 14 days!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[...profile.weightHistory].reverse().map((entry) => (
              <div
                key={entry.id}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 hover:border-slate-700 transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {entry.photoUrl ? (
                    <img
                      src={entry.photoUrl}
                      alt="Physique"
                      onClick={() => onOpenLightbox(entry.photoUrl!, `Physique on ${entry.date}`)}
                      className="w-12 h-12 rounded-lg object-cover cursor-pointer border border-slate-700 shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-sm font-bold text-amber-400 shrink-0">
                      {entry.weightKg}k
                    </div>
                  )}
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white truncate">{entry.date}</span>
                      {entry.bodyFatPercent && (
                        <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 text-[9px] font-extrabold border border-cyan-500/30">
                          InBody
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-amber-400 font-bold">
                      {entry.weightKg} kg • {entry.appliedKcal} kcal
                    </div>
                    {entry.bodyFatPercent && (
                      <div className="text-[10px] text-cyan-300 font-semibold">
                        {entry.bodyFatPercent}% BF {entry.skeletalMuscleMassKg ? `• ${entry.skeletalMuscleMassKg}kg SMM` : ''}
                      </div>
                    )}
                    <div className="text-[10px] text-slate-400 truncate">{entry.note}</div>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteWeightEntry(entry.id)}
                  className="p-1.5 text-slate-600 hover:text-rose-400 transition shrink-0"
                  title="Delete check-in"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
