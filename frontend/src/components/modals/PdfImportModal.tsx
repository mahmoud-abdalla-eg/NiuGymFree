import React, { useState } from 'react';
import {
  X,
  FileText,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Layers,
  Dumbbell,
  RefreshCw,
  Plus,
  Trash2,
  Eye,
  Sliders
} from 'lucide-react';
import { extractTextFromPdfOrImage, OcrProgressUpdate, PdfOcrEngineResult } from '../../lib/pdfOcrEngine';
import { parsePlanText, ParseResult } from '../../lib/planTextParser';
import { RoutineTemplate, SetMeal, WeeklySchedule } from '../../types';

interface PdfImportModalProps {
  onClose: () => void;
  onImportSuccess: (parsed: {
    routines: RoutineTemplate[];
    meals: SetMeal[];
    assignToSchedule: boolean;
  }) => void;
  onShowToast: (msg: string) => void;
}

export const PdfImportModal: React.FC<PdfImportModalProps> = ({
  onClose,
  onImportSuccess,
  onShowToast,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [forceOcr, setForceOcr] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<OcrProgressUpdate | null>(null);

  // Staged Extracted State
  const [ocrResult, setOcrResult] = useState<PdfOcrEngineResult | null>(null);
  const [rawText, setRawText] = useState('');
  const [parsedData, setParsedData] = useState<ParseResult | null>(null);

  // Editable Staging State
  const [editableRoutines, setEditableRoutines] = useState<RoutineTemplate[]>([]);
  const [editableMeals, setEditableMeals] = useState<SetMeal[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setSelectedFile(f);
      setOcrResult(null);
      setParsedData(null);
      setProgress(null);
    }
  };

  const handleProcessFile = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    setProgress({
      stage: 'reading',
      percent: 5,
      currentPage: 1,
      totalPages: 1,
      message: 'Initializing client-side PDF OCR engine...',
    });

    try {
      const result = await extractTextFromPdfOrImage(selectedFile, forceOcr, (prog) => {
        setProgress(prog);
      });

      setOcrResult(result);
      setRawText(result.combinedText);

      // Parse with heuristic rule-based regex parser
      const parsed = parsePlanText(result.combinedText);
      setParsedData(parsed);
      setEditableRoutines(parsed.routines);
      setEditableMeals(parsed.meals);

      onShowToast(`📄 Successfully extracted plan! Detected ${parsed.routines.length} routines & ${parsed.meals.length} meals.`);
    } catch (err: any) {
      onShowToast(`❌ Extraction failed: ${err.message || 'Error processing file'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReparseFromRawText = () => {
    const parsed = parsePlanText(rawText);
    setParsedData(parsed);
    setEditableRoutines(parsed.routines);
    setEditableMeals(parsed.meals);
    onShowToast('🔄 Re-parsed structured cards from text editor');
  };

  const handleSaveAndAssign = (assignToSchedule: boolean) => {
    onImportSuccess({
      routines: editableRoutines,
      meals: editableMeals,
      assignToSchedule,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-5xl w-full p-6 space-y-6 my-8 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-violet-600/20 text-violet-400 border border-violet-500/30 flex items-center justify-center">
              <FileText className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-white">Client-Side PDF Plan Importer & Normal OCR</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold border border-emerald-500/30">
                  100% Free • Zero Cloud API Cost
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Upload any coach's workout routine PDF, meal plan sheet, or scanned photo to extract into structured app data.
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

        {/* Step 1: Upload & Pipeline Configuration */}
        {!parsedData && (
          <div className="space-y-4">
            <div className="p-8 border-2 border-dashed border-slate-800 rounded-3xl bg-slate-950/60 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-violet-500/10 text-violet-400 flex items-center justify-center border border-violet-500/20">
                <Upload className="w-8 h-8 text-cyan-400" />
              </div>

              <div>
                <h3 className="text-sm font-extrabold text-white">
                  {selectedFile ? selectedFile.name : 'Choose a PDF Plan or Scanned Image'}
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  Accepts PDF files, scanned coach workout sheets, nutritionist meal plans, or photos (PNG, JPG).
                </p>
              </div>

              <div className="flex justify-center items-center gap-4">
                <label className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-extrabold text-xs cursor-pointer transition shadow-lg shadow-violet-600/30">
                  <span>Browse File</span>
                  <input
                    type="file"
                    accept=".pdf,application/pdf,image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              {selectedFile && (
                <div className="pt-2 flex items-center justify-center gap-6 text-xs text-slate-400">
                  <span>File: <strong className="text-white">{selectedFile.name}</strong></span>
                  <span>Size: <strong className="text-white">{(selectedFile.size / 1024).toFixed(1)} KB</strong></span>
                </div>
              )}
            </div>

            {/* Stage Options */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-white block">Extraction Pipeline Settings</span>
                <span className="text-[11px] text-slate-400">
                  Fast digital text extraction via pdfjs-dist. Scanned pages automatically fallback to Tesseract Web Worker OCR.
                </span>
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={forceOcr}
                  onChange={(e) => setForceOcr(e.target.checked)}
                  className="rounded accent-violet-500"
                />
                <span>Force Optical OCR (Canvas 2.0x High Contrast)</span>
              </label>
            </div>

            {/* Progress Bar & Status */}
            {isProcessing && progress && (
              <div className="p-4 rounded-2xl bg-violet-950/40 border border-violet-500/30 space-y-2">
                <div className="flex justify-between text-xs font-semibold text-violet-300">
                  <span>{progress.message}</span>
                  <span>{progress.percent}%</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-300"
                    style={{ width: `${progress.percent}%` }}
                  />
                </div>
              </div>
            )}

            {selectedFile && !isProcessing && (
              <button
                onClick={handleProcessFile}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-extrabold text-sm transition shadow-xl shadow-violet-600/25 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Run Two-Stage Client-Side OCR & Parse Plan</span>
              </button>
            )}
          </div>
        )}

        {/* Step 2: Interactive Staging & Review Workspace */}
        {parsedData && (
          <div className="space-y-6">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                Plan Extracted ({ocrResult?.totalPages || 1} pages, {ocrResult?.usedOcr ? 'Optical OCR' : 'Digital Layer'}). Review and edit below before assigning.
              </span>
              <button
                onClick={() => {
                  setParsedData(null);
                  setSelectedFile(null);
                }}
                className="text-slate-400 hover:text-white underline text-[11px]"
              >
                Upload Different File
              </button>
            </div>

            {/* Split Screen Workspace: Raw Extracted Text vs Structured Editable Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left 5 Cols: Raw OCR Text Editor */}
              <div className="lg:col-span-5 bg-slate-950 rounded-2xl p-4 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">Raw Extracted OCR Text</span>
                  <button
                    onClick={handleReparseFromRawText}
                    className="flex items-center gap-1 text-[11px] text-cyan-400 hover:underline"
                    title="Re-run regex parser on your manual edits in this text area"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Re-parse</span>
                  </button>
                </div>
                <textarea
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  className="w-full h-96 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 font-mono resize-none focus:border-cyan-500 outline-none"
                  placeholder="Extracted raw text will appear here..."
                />
                <p className="text-[10px] text-slate-500">
                  Tip: You can edit or paste raw workout or meal text directly and click Re-parse.
                </p>
              </div>

              {/* Right 7 Cols: Structured Editable Preview Cards */}
              <div className="lg:col-span-7 space-y-4 max-h-[480px] overflow-y-auto pr-1">
                {/* Detected Routines */}
                {editableRoutines.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-violet-400 flex items-center gap-1.5">
                      <Dumbbell className="w-4 h-4" />
                      Detected Workout Routines ({editableRoutines.length})
                    </h3>

                    {editableRoutines.map((routine, rIdx) => (
                      <div key={routine.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type="text"
                            value={routine.name}
                            onChange={(e) => {
                              const newName = e.target.value;
                              setEditableRoutines((prev) =>
                                prev.map((r, idx) => (idx === rIdx ? { ...r, name: newName } : r))
                              );
                            }}
                            className="font-bold text-sm text-white bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-700 flex-1"
                          />
                          <button
                            onClick={() =>
                              setEditableRoutines((prev) => prev.filter((_, idx) => idx !== rIdx))
                            }
                            className="p-1 text-slate-500 hover:text-rose-400"
                            title="Remove Routine"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Exercise Items */}
                        <div className="space-y-1.5 text-xs">
                          {routine.exercises.map((ex, exIdx) => (
                            <div
                              key={exIdx}
                              className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-2"
                            >
                              <span className="font-semibold text-slate-300">
                                {exIdx + 1}. Exercise ID: {ex.exId}
                              </span>
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  value={ex.targetSets}
                                  onChange={(e) => {
                                    const val = Number(e.target.value);
                                    setEditableRoutines((prev) =>
                                      prev.map((r, idx) =>
                                        idx === rIdx
                                          ? {
                                              ...r,
                                              exercises: r.exercises.map((eItem, i) =>
                                                i === exIdx ? { ...eItem, targetSets: val } : eItem
                                              ),
                                            }
                                          : r
                                      )
                                    );
                                  }}
                                  className="w-12 px-1.5 py-0.5 rounded bg-slate-950 border border-slate-700 text-center text-white"
                                />
                                <span className="text-slate-500">sets ×</span>
                                <input
                                  type="text"
                                  value={ex.repRange}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setEditableRoutines((prev) =>
                                      prev.map((r, idx) =>
                                        idx === rIdx
                                          ? {
                                              ...r,
                                              exercises: r.exercises.map((eItem, i) =>
                                                i === exIdx ? { ...eItem, repRange: val } : eItem
                                              ),
                                            }
                                          : r
                                      )
                                    );
                                  }}
                                  className="w-16 px-1.5 py-0.5 rounded bg-slate-950 border border-slate-700 text-center text-white"
                                />
                                <span className="text-slate-500">reps</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Detected Meals */}
                {editableMeals.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <Layers className="w-4 h-4" />
                      Detected Meal Presets ({editableMeals.length})
                    </h3>

                    {editableMeals.map((meal, mIdx) => (
                      <div key={meal.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type="text"
                            value={meal.name}
                            onChange={(e) => {
                              const newName = e.target.value;
                              setEditableMeals((prev) =>
                                prev.map((m, idx) => (idx === mIdx ? { ...m, name: newName } : m))
                              );
                            }}
                            className="font-bold text-sm text-white bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-700 flex-1"
                          />
                          <select
                            value={meal.defaultSlot}
                            onChange={(e) => {
                              const val = e.target.value as any;
                              setEditableMeals((prev) =>
                                prev.map((m, idx) => (idx === mIdx ? { ...m, defaultSlot: val } : m))
                              );
                            }}
                            className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-emerald-300"
                          >
                            <option value="breakfast">Breakfast</option>
                            <option value="lunch">Lunch</option>
                            <option value="dinner">Dinner</option>
                            <option value="snacks">Snacks</option>
                          </select>
                        </div>

                        {/* Meal Items */}
                        <div className="space-y-1.5 text-xs">
                          {meal.items.map((item, itemIdx) => (
                            <div
                              key={itemIdx}
                              className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-2"
                            >
                              <span className="font-semibold text-slate-300">{item.name}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-slate-400">{item.unitLabel}</span>
                                <span className="font-bold text-emerald-400">{item.calories} kcal</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-end gap-3">
              <button
                onClick={() => handleSaveAndAssign(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition"
              >
                Save to Vaults Only
              </button>
              <button
                onClick={() => handleSaveAndAssign(true)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs transition shadow-lg shadow-emerald-500/25 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Save & Assign to 7-Day Weekly Schedule</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
