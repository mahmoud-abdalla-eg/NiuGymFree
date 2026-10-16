import React, { useState } from 'react';
import { X, Play, AlertTriangle, CheckCircle2, Trophy, Link, Youtube } from 'lucide-react';
import { ExerciseVaultItem } from '../../types';
import { parseYouTubeUrl, buildYouTubeEmbedUrl } from '../../lib/youtubeUtils';

interface ExerciseVideoModalProps {
  exercise: ExerciseVaultItem;
  onClose: () => void;
  onUpdateExerciseVideo?: (exerciseId: string, customUrl: string, newVideoId: string) => void;
}

export const ExerciseVideoModal: React.FC<ExerciseVideoModalProps> = ({
  exercise,
  onClose,
  onUpdateExerciseVideo,
}) => {
  const [customUrlInput, setCustomUrlInput] = useState(
    exercise.customYoutubeUrl || (exercise.youtubeVideoId ? `https://youtu.be/${exercise.youtubeVideoId}` : '')
  );
  const [currentVideoId, setCurrentVideoId] = useState(exercise.youtubeVideoId || 'vcBig73ojpE');
  const [startSec, setStartSec] = useState(exercise.videoStartSec || 0);
  const [urlError, setUrlError] = useState('');

  const handleApplyCustomUrl = () => {
    if (!customUrlInput.trim()) {
      setUrlError('Please enter a YouTube video URL');
      return;
    }
    const parsed = parseYouTubeUrl(customUrlInput);
    if (!parsed) {
      setUrlError('Invalid YouTube URL. Supports standard, youtu.be, shorts, and embed links.');
      return;
    }
    setUrlError('');
    setCurrentVideoId(parsed.videoId);
    if (parsed.startSec !== undefined) {
      setStartSec(parsed.startSec);
    }
    onUpdateExerciseVideo?.(exercise.id, customUrlInput.trim(), parsed.videoId);
  };

  const embedUrl = buildYouTubeEmbedUrl(currentVideoId, startSec);

  const defaultFormCues = exercise.formCues || [
    'Maintain a neutral spine and brace your abdominal wall 360 degrees',
    'Control the eccentric portion (2-3 seconds down)',
    'Drive with intent through the target muscle group',
    'Full range of motion without momentum or body sway',
  ];

  const defaultMistakes = exercise.commonMistakes || [
    'Rushing the negative portion of the repetition',
    'Using excessive load at the expense of joint alignment',
    'Incomplete lockout or cutting the stretch short',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full p-6 space-y-6 my-8 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-violet-600/20 text-violet-400 border border-violet-500/30 flex items-center justify-center">
              <Youtube className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-white">{exercise.name}</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 font-bold border border-violet-500/30">
                  {exercise.muscle} • {exercise.equipment}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Biomechanical Technique Guide & High-Definition Form Demonstration
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video & Cues Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 7 Cols: 16:9 Responsive YouTube Player */}
          <div className="lg:col-span-7 space-y-3">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
              <iframe
                src={embedUrl}
                title={`${exercise.name} Form Demonstration`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Custom YouTube URL Editor */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                <Link className="w-3.5 h-3.5 text-cyan-400" />
                <span>Customize YouTube Demonstration Link (Supports Shorts & Timestamps)</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="https://youtu.be/... or https://youtube.com/shorts/..."
                  value={customUrlInput}
                  onChange={(e) => {
                    setCustomUrlInput(e.target.value);
                    setUrlError('');
                  }}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-violet-500"
                />
                <button
                  onClick={handleApplyCustomUrl}
                  className="px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs transition shrink-0"
                >
                  Save Video
                </button>
              </div>
              {urlError && <p className="text-[11px] text-rose-400">{urlError}</p>}
            </div>
          </div>

          {/* Right 5 Cols: Biomechanical Cues, PR & Common Mistakes */}
          <div className="lg:col-span-5 space-y-4">
            {/* PR & Quick Telemetry Card */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Personal Best 1RM</div>
                <div className="text-xl font-black text-amber-400 flex items-center gap-1.5 mt-0.5">
                  <Trophy className="w-5 h-5" />
                  <span>{exercise.pr1RM} kg</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-slate-400">Previous Performance</div>
                <div className="text-xs font-bold text-slate-200 mt-1">{exercise.prevBest}</div>
              </div>
            </div>

            {/* Golden Execution Cues */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-2.5">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Biomechanical Setup Checklist
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {defaultFormCues.map((cue, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold shrink-0">•</span>
                    <span>{cue}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Common Mistakes to Avoid */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-rose-500/30 space-y-2.5">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                Critical Mistakes to Avoid
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {defaultMistakes.map((mistake, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold shrink-0">✕</span>
                    <span>{mistake}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
