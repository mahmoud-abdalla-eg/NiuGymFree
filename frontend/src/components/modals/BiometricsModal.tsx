import React from 'react';
import { X, Scale } from 'lucide-react';
import { UserProfile } from '../../types';
import { BiometricCalculations } from '../../lib/biometrics';
import { BiometricsView } from '../nutrition/BiometricsView';

interface BiometricsModalProps {
  onClose: () => void;
  profile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  biometricMetrics: BiometricCalculations;
  selectedDate: string;
  onOpenLightbox: (url: string, title: string) => void;
  onShowToast: (msg: string) => void;
}

export const BiometricsModal: React.FC<BiometricsModalProps> = ({
  onClose,
  profile,
  onUpdateProfile,
  biometricMetrics,
  selectedDate,
  onOpenLightbox,
  onShowToast,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full p-6 space-y-6 my-8 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">Biometric Profile & Adaptive Kcal Coach</h2>
              <p className="text-xs text-slate-400">
                Live chronological age in days powers your exact Mifflin-St Jeor BMR & bi-weekly weight check-in.
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

        <BiometricsView
          profile={profile}
          onUpdateProfile={onUpdateProfile}
          biometricMetrics={biometricMetrics}
          selectedDate={selectedDate}
          onOpenLightbox={onOpenLightbox}
          onShowToast={onShowToast}
        />
      </div>
    </div>
  );
};
