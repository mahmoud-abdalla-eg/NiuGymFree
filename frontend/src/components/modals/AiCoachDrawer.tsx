import React, { useState } from 'react';
import { X, Bot, Sparkles, Send, CheckCircle2 } from 'lucide-react';
import { UserProfile, SetMeal } from '../../types';
import { BiometricCalculations } from '../../lib/biometrics';

interface AiCoachDrawerProps {
  onClose: () => void;
  profile: UserProfile;
  biometricMetrics: BiometricCalculations;
  selectedDate: string;
  consumedCalories: number;
  consumedProtein: number;
  consumedCarbs: number;
  consumedFat: number;
  workoutTitle: string;
  workoutTonnage: number;
  completedSets: number;
  prCount: number;
  recommendedSetMeal?: SetMeal;
  onLogRecommendedMeal?: (meal: SetMeal) => void;
  onShowToast: (msg: string) => void;
}

export const AiCoachDrawer: React.FC<AiCoachDrawerProps> = ({
  onClose,
  profile,
  biometricMetrics,
  selectedDate,
  consumedCalories,
  consumedProtein,
  consumedCarbs,
  consumedFat,
  workoutTitle,
  workoutTonnage,
  completedSets,
  prCount,
  recommendedSetMeal,
  onLogRecommendedMeal,
  onShowToast,
}) => {
  const [aiModel, setAiModel] = useState('deepseek-v4-pro');
  const [aiApiKey, setAiApiKey] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([
    {
      sender: 'ai',
      text: `Hello ${profile.name}! I am analyzing your live biometrics (${biometricMetrics.exactDaysOld.toLocaleString()} days old, ${profile.weightKg}kg) and ${selectedDate}'s session logs. How can I assist with your hypertrophy programming or macro targets today?`,
    },
  ]);

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const userText = chatInput.trim();
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setChatInput('');

    // Responsive intelligent coaching response
    setTimeout(() => {
      let aiReply = '';
      const lower = userText.toLowerCase();

      if (lower.includes('protein') || lower.includes('eat') || lower.includes('macro')) {
        const remainingP = Math.max(0, biometricMetrics.macros.proteinGrams - consumedProtein);
        aiReply = `You currently have ${remainingP}g protein left in your daily budget of ${biometricMetrics.macros.proteinGrams}g. To hit this without exceeding fats, consider 180g of cooked Chicken Breast or a scoop of Whey Isolate + egg whites.`;
      } else if (lower.includes('workout') || lower.includes('hypertrophy') || lower.includes('volume') || lower.includes('gym')) {
        aiReply = `Great work on today's session (${workoutTitle}). You've accumulated ${workoutTonnage.toLocaleString()} kg total tonnage across ${completedSets} working sets. Keep resting between 90-180s on compound lifts to maximize mechanical tension.`;
      } else if (lower.includes('cut') || lower.includes('weight') || lower.includes('fat')) {
        aiReply = `Your current goal is set to ${profile.goalType.toUpperCase()} with a daily budget of ${biometricMetrics.effectiveTargetKcal} kcal. Make sure to complete your morning weigh-in on schedule to allow the Adaptive Engine to calibrate your metabolic rate.`;
      } else {
        aiReply = `Your Mifflin-St Jeor BMR is ${biometricMetrics.bmr} kcal with a TDEE of ${biometricMetrics.tdee} kcal. For optimal recovery, aim for 7-9 hours of sleep and prioritize whole food micronutrients.`;
      }

      setMessages((prev) => [...prev, { sender: 'ai', text: aiReply }]);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-md p-6 flex flex-col justify-between h-full overflow-y-auto animate-in slide-in-from-right duration-250">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                <Bot className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-white">NiuGymFree AI Performance Coach</h3>
                <p className="text-[11px] text-indigo-300">DeepSeek / OpenAI-Compatible Engine</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Live Cross-Hemisphere Context Audit */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-indigo-500/30 space-y-2 text-xs">
            <div className="font-bold text-indigo-300 uppercase tracking-wider text-[10px]">
              Live Telemetry Audit ({selectedDate})
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              • <strong>Biometrics:</strong> {biometricMetrics.exactDaysOld.toLocaleString()} days old, {profile.weightKg}kg, {profile.heightCm}cm.
              <br />• <strong>Nutrition Status:</strong> {consumedCalories} / {biometricMetrics.effectiveTargetKcal} kcal logged. Remaining:{' '}
              <span className="text-sky-400 font-bold">
                {Math.max(0, biometricMetrics.macros.proteinGrams - consumedProtein)}g P
              </span>
              ,{' '}
              <span className="text-amber-400 font-bold">
                {Math.max(0, biometricMetrics.macros.carbsGrams - consumedCarbs)}g C
              </span>
              .
              <br />• <strong>Gym Status:</strong> {workoutTonnage.toLocaleString()} kg tonnage across {completedSets} working sets ({prCount} PRs).
            </p>
          </div>

          {/* Actionable Smart Recommendation */}
          {recommendedSetMeal && onLogRecommendedMeal && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-2 text-xs">
              <div className="font-bold text-emerald-300 flex items-center gap-1.5 text-xs">
                <Sparkles className="w-3.5 h-3.5" /> Smart Macro Finisher Recommendation
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                To fulfill your remaining protein and carbohydrate quota for today's session, log the{' '}
                <strong>{recommendedSetMeal.name}</strong>.
              </p>
              <button
                onClick={() => {
                  onLogRecommendedMeal(recommendedSetMeal);
                  onClose();
                }}
                className="w-full py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition"
              >
                1-Click Log Recommended Set Meal
              </button>
            </div>
          )}

          {/* Interactive Chat Messages */}
          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-2xl text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-violet-600 text-white ml-6 rounded-tr-none'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 mr-6 rounded-tl-none'
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ask AI Coach for diet advice or cues..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-indigo-500"
            />
            <button
              onClick={handleSendMessage}
              className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          {/* Pluggable API Endpoint Config */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
            <div className="font-bold text-slate-400 text-[11px]">Pluggable AI Model Configuration</div>
            <select
              value={aiModel}
              onChange={(e) => setAiModel(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-[11px]"
            >
              <option value="deepseek-v4-pro">DeepSeek V4 Pro (High-Reasoning Hypertrophy)</option>
              <option value="deepseek-flash">DeepSeek Flash (Low-Latency Macro Parser)</option>
              <option value="gemini-2.5-flash">Gemini Flash</option>
            </select>
            <input
              type="password"
              placeholder="API Key (Local heuristic coach active when empty)"
              value={aiApiKey}
              onChange={(e) => setAiApiKey(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-[11px]"
            />
          </div>
        </div>

        <div className="text-[10px] text-slate-500 pt-3 border-t border-slate-800 text-center">
          NiuGymFree AI Core • $0 Open-Source Architecture
        </div>
      </div>
    </div>
  );
};
