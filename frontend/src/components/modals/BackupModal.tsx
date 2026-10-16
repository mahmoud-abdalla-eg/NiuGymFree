import React, { useRef } from 'react';
import { X, Download, Upload, Database, Cloud, HardDrive, CheckCircle2, AlertCircle } from 'lucide-react';
import { StorageAdapter } from '../../services/storageAdapter';
import { isSupabaseConfigured } from '../../services/supabaseClient';

interface BackupModalProps {
  onClose: () => void;
  onExport: () => void;
  onImport: (file: File) => void;
  onResetDatabase: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  onClose,
  onExport,
  onImport,
  onResetDatabase,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImport(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/30 flex items-center justify-center">
              <Database className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">Dual-Mode Storage & Data Engine</h3>
              <p className="text-[11px] text-slate-400">LocalStorage, IndexedDB & Supabase Sync</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dual Mode Status Badges */}
        <div className="space-y-3">
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <HardDrive className="w-5 h-5 text-emerald-400" />
              <div>
                <div className="text-xs font-bold text-white">Local-First Offline Engine</div>
                <div className="text-[10px] text-slate-400">LocalStorage + IndexedDB WebP Photo Cache</div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold text-[10px] border border-emerald-500/30">
              Active • 100% Offline
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Cloud className="w-5 h-5 text-cyan-400" />
              <div>
                <div className="text-xs font-bold text-white">Supabase Cloud Sync</div>
                <div className="text-[10px] text-slate-400">PostgreSQL Cloud Backup & Auth</div>
              </div>
            </div>
            {isSupabaseConfigured ? (
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-extrabold text-[10px] border border-cyan-500/30">
                Connected
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-semibold text-[10px]">
                Zero-Config Local Mode
              </span>
            )}
          </div>
        </div>

        {/* JSON Export and Import Actions */}
        <div className="space-y-3 pt-2">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            JSON Data Portability
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onExport}
              className="p-3 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 flex flex-col items-center justify-center gap-1.5 text-xs font-bold text-white transition group"
            >
              <Download className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>Export JSON Backup</span>
              <span className="text-[10px] text-slate-500 font-normal">All logs & routines</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-3 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 flex flex-col items-center justify-center gap-1.5 text-xs font-bold text-white transition group"
            >
              <Upload className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span>Import JSON Backup</span>
              <span className="text-[10px] text-slate-500 font-normal">Validated with Zod</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json,application/json"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Database Reset */}
        <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
          <span className="text-slate-500">Need a fresh start?</span>
          <button
            onClick={onResetDatabase}
            className="px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 font-bold transition"
          >
            Reset to Built-in Defaults
          </button>
        </div>
      </div>
    </div>
  );
};
