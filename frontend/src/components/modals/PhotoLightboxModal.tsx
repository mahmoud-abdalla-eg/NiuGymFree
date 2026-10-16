import React from 'react';
import { X } from 'lucide-react';

interface PhotoLightboxModalProps {
  photoUrl: string | null;
  title: string;
  onClose: () => void;
}

export const PhotoLightboxModal: React.FC<PhotoLightboxModalProps> = ({
  photoUrl,
  title,
  onClose,
}) => {
  if (!photoUrl) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl"
      >
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <span className="text-sm font-bold text-white">{title}</span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-3 bg-slate-950 flex items-center justify-center">
          <img
            src={photoUrl}
            alt={title}
            className="max-h-[75vh] w-auto max-w-full rounded-2xl object-contain shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};
