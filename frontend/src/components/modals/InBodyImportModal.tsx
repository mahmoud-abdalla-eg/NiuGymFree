import React, { useState } from 'react';
import {
  Upload,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Sparkles,
  X,
  Eye,
  Edit3,
  Calendar,
  Flame,
  Activity,
  Layers,
  ArrowRight,
  Info
} from 'lucide-react';
import { extractTextFromPdfOrImage, OcrProgressUpdate } from '../../lib/pdfOcrEngine';
import { parseInBodyText, InBodyOcrParseResult, InBodyParsedData } from '../../lib/inbodyOcrParser';
import { InBodyScanRecord, UserProfile } from '../../types';

interface InBodyImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyInBodyScan: (scan: InBodyScanRecord, updatedProfileFields: Partial<UserProfile>) => void;
  profile: UserProfile;
  onShowToast: (msg: string) => void;
}

export const InBodyImportModal: React.FC<InBodyImportModalProps> = ({
  isOpen,
  onClose,
  onApplyInBodyScan,
  profile,
  onShowToast,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<OcrProgressUpdate | null>(null);
  const [parseResult, setParseResult] = useState<InBodyOcrParseResult | null>(null);
  const [activeTab, setActiveTab] = useState<'review' | 'rawText'>('review');

  // Editable Form State
  const [formData, setFormData] = useState<InBodyParsedData>({
    weightKg: profile.weightKg || 75,
    skeletalMuscleMassKg: profile.skeletalMuscleMassKg || 34,
    bodyFatMassKg: null,
    bodyFatPercent: profile.bodyFatPercent || 18,
    bmi: 23.5,
    bmrKcal: 1650,
    totalBodyWaterL: 44,
    visceralFatLevel: 5,
    inBodyScore: 80,
    heightCm: profile.heightCm || 178,
    testDate: new Date().toISOString().split('T')[0],
  });

  if (!isOpen) return null;

  const handleFileChange = async (selectedFile: File) => {
    setFile(selectedFile);
    if (selectedFile.type.startsWith('image/')) {
      const url = URL.createObjectURL(selectedFile);
      setFilePreviewUrl(url);
    } else {
      setFilePreviewUrl(null);
    }

    setIsProcessing(true);
    setProgress({
      stage: 'reading',
      percent: 5,
      currentPage: 1,
      totalPages: 1,
      message: 'Reading InBody scan document...',
    });

    try {
      const ocrResult = await extractTextFromPdfOrImage(selectedFile, false, (p) => {
        setProgress(p);
      });

      const parsed = parseInBodyText(ocrResult.combinedText, ocrResult.pages[0]?.confidence);
      setParseResult(parsed);

      // Populate form with parsed data or fallbacks
      setFormData({
        weightKg: parsed.data.weightKg ?? profile.weightKg ?? null,
        skeletalMuscleMassKg: parsed.data.skeletalMuscleMassKg ?? profile.skeletalMuscleMassKg ?? null,
        bodyFatMassKg: parsed.data.bodyFatMassKg ?? null,
        bodyFatPercent: parsed.data.bodyFatPercent ?? profile.bodyFatPercent ?? null,
        bmi: parsed.data.bmi ?? null,
        bmrKcal: parsed.data.bmrKcal ?? null,
        totalBodyWaterL: parsed.data.totalBodyWaterL ?? null,
        visceralFatLevel: parsed.data.visceralFatLevel ?? null,
        inBodyScore: parsed.data.inBodyScore ?? null,
        heightCm: parsed.data.heightCm ?? profile.heightCm ?? null,
        testDate: parsed.data.testDate || new Date().toISOString().split('T')[0],
      });

      if (parsed.hasIssues) {
        onShowToast('⚠️ OCR detected issues or missing values. Please review below.');
      } else {
        onShowToast('✨ InBody scan successfully recognized! Ready to confirm.');
      }
    } catch (err: any) {
      onShowToast(`❌ OCR Scan failed: ${err.message || 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Quick Demo / Sample InBody Sheet Loader
  const handleLoadSampleInBody = () => {
    const sampleRawText = `
=============================================
BODY COMPOSITION ANALYZER - InBody 770
=============================================
ID: ATHLETE_2026
Height: 180.0 cm      Gender: Male       Age: 26
Test Date / Time: 2026.10.14 08:45:12

[ Body Composition Analysis ]
Total Body Water (TBW) : 46.8 L   (Normal: 38.5 ~ 47.1)
Intracellular Water    : 29.2 L
Extracellular Water    : 17.6 L
Dry Lean Mass (Protein): 12.4 kg  (Normal: 10.3 ~ 12.6)
Minerals               : 4.12 kg  (Normal: 3.55 ~ 4.33)
Body Fat Mass (BFM)    : 11.8 kg  (Normal: 10.5 ~ 16.8)
Weight                 : 75.1 kg  (Normal: 63.2 ~ 78.4)

[ Muscle-Fat Analysis ]
Weight                 : 75.1 kg
Skeletal Muscle Mass   : 36.4 kg  (Normal: 30.5 ~ 37.3)
Body Fat Mass          : 11.8 kg

[ Obesity Analysis ]
Body Mass Index (BMI)  : 23.2 kg/m2
Percent Body Fat (PBF) : 15.7 %   (Normal: 10.0 ~ 20.0)

[ Body Composition History ]
Weight (kg)            : 75.1
SMM (kg)               : 36.4
PBF (%)                : 15.7

[ InBody Evaluation ]
InBody Score           : 84 / 100 Points
Visceral Fat Level     : Level 4  (Normal: 1 ~ 9)
Basal Metabolic Rate   : 1740 kcal
Recommended Calorie    : 2450 kcal
=============================================
    `.trim();

    const parsed = parseInBodyText(sampleRawText, 96);
    setParseResult(parsed);
    setFormData(parsed.data);
    onShowToast('📋 Loaded Sample InBody 770 Scan data!');
  };

  const handleApply = () => {
    if (!formData.weightKg || formData.weightKg <= 0) {
      onShowToast('⚠️ Please specify a valid Body Weight');
      return;
    }

    const scanRecord: InBodyScanRecord = {
      id: `ib_${Date.now()}`,
      date: formData.testDate || new Date().toISOString().split('T')[0],
      weightKg: Number(formData.weightKg),
      heightCm: formData.heightCm ? Number(formData.heightCm) : undefined,
      skeletalMuscleMassKg: formData.skeletalMuscleMassKg ? Number(formData.skeletalMuscleMassKg) : undefined,
      bodyFatMassKg: formData.bodyFatMassKg ? Number(formData.bodyFatMassKg) : undefined,
      bodyFatPercent: formData.bodyFatPercent ? Number(formData.bodyFatPercent) : undefined,
      bmi: formData.bmi ? Number(formData.bmi) : undefined,
      bmrKcal: formData.bmrKcal ? Number(formData.bmrKcal) : undefined,
      totalBodyWaterL: formData.totalBodyWaterL ? Number(formData.totalBodyWaterL) : undefined,
      visceralFatLevel: formData.visceralFatLevel ? Number(formData.visceralFatLevel) : undefined,
      inBodyScore: formData.inBodyScore ? Number(formData.inBodyScore) : undefined,
      rawText: parseResult?.rawText,
      scannedAt: new Date().toISOString(),
      photoUrl: filePreviewUrl,
    };

    const updatedProfileFields: Partial<UserProfile> = {
      weightKg: Number(formData.weightKg),
      bodyFatPercent: formData.bodyFatPercent ? Number(formData.bodyFatPercent) : profile.bodyFatPercent,
      skeletalMuscleMassKg: formData.skeletalMuscleMassKg ? Number(formData.skeletalMuscleMassKg) : profile.skeletalMuscleMassKg,
      heightCm: formData.heightCm ? Number(formData.heightCm) : profile.heightCm,
    };

    onApplyInBodyScan(scanRecord, updatedProfileFields);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 md:p-8 space-y-6 my-8 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center font-black shadow-lg shadow-cyan-500/20">
              📊
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white">InBody Scan Importer (OCR)</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 font-extrabold border border-cyan-500/30">
                  Body Composition
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Extract Weight, Skeletal Muscle Mass (SMM), Body Fat %, BMR & Visceral Fat from your InBody sheet.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Upload Zone */}
        {!parseResult && !isProcessing && (
          <div className="space-y-4">
            <label className="border-2 border-dashed border-slate-800 hover:border-cyan-500/50 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer bg-slate-950/40 hover:bg-slate-950 transition group">
              <Upload className="w-10 h-10 text-cyan-400 group-hover:scale-110 transition-transform mb-3" />
              <span className="text-sm font-bold text-white">Upload InBody Sheet (PDF or Photo)</span>
              <span className="text-xs text-slate-400 mt-1">
                Supports InBody 270, 570, 770 PDF scan or mobile camera photo (PNG, JPG, WebP)
              </span>
              <input
                type="file"
                accept="application/pdf,image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileChange(e.target.files[0]);
                  }
                }}
                className="hidden"
              />
            </label>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span>Don't have a file ready?</span>
              <button
                type="button"
                onClick={handleLoadSampleInBody}
                className="text-cyan-400 hover:text-cyan-300 font-bold hover:underline flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Test with Sample InBody 770 Scan Data</span>
              </button>
            </div>
          </div>
        )}

        {/* OCR Scanning Progress State */}
        {isProcessing && progress && (
          <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center animate-spin">
              <Activity className="w-7 h-7 text-cyan-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">{progress.message}</div>
              <div className="text-xs text-slate-400 mt-1">
                Stage: {progress.stage} ({progress.percent}%)
              </div>
            </div>
            <div className="w-full max-w-md mx-auto bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 transition-all duration-300"
                style={{ width: `${progress.percent}%` }}
              />
            </div>
          </div>
        )}

        {/* OCR Parsed Results & Interactive Fallback Interface */}
        {parseResult && !isProcessing && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* If there is an issue with OCR, prompt the user explicitly */}
            {parseResult.hasIssues ? (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-400">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>OCR Detected Ambiguities or Missing Fields — Please Verify Below</span>
                </div>
                <p className="text-[11px] text-amber-300/90">
                  The scanner extracted available metrics, but some values require your confirmation or manual entry.
                  Highlighted fields below need your attention:
                </p>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-amber-300/80 pl-1">
                  {parseResult.issues.map((iss, idx) => (
                    <li key={idx}>
                      <strong className="text-amber-200">{iss.field}:</strong> {iss.message}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between">
                <div className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    High-Confidence OCR Scan ({Math.round(parseResult.ocrConfidence || 95)}% confidence). All primary metrics extracted.
                  </span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                  Verified
                </span>
              </div>
            )}

            {/* Navigation Switcher: Review Form vs Raw OCR Text */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('review')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    activeTab === 'review'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Interactive Verification Form</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('rawText')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    activeTab === 'rawText'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Raw OCR Text & Preview</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setParseResult(null);
                  setFile(null);
                }}
                className="text-xs text-slate-400 hover:text-white underline"
              >
                Scan Another Sheet
              </button>
            </div>

            {/* Tab 1: Interactive Verification Form */}
            {activeTab === 'review' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 text-xs">
                  {/* Weight (kg) */}
                  <div
                    className={`p-3.5 rounded-2xl bg-slate-950 border ${
                      parseResult.fieldStatus.weightKg !== 'ok'
                        ? 'border-amber-500/60 ring-2 ring-amber-500/20'
                        : 'border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-slate-300">Body Weight (kg)</label>
                      {parseResult.fieldStatus.weightKg !== 'ok' && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-extrabold">
                          Needs Input
                        </span>
                      )}
                    </div>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.weightKg ?? ''}
                      onChange={(e) =>
                        setFormData({ ...formData, weightKg: parseFloat(e.target.value) || null })
                      }
                      placeholder="e.g. 75.0"
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-extrabold text-sm focus:border-cyan-500 outline-none"
                    />
                  </div>

                  {/* Skeletal Muscle Mass (SMM) */}
                  <div
                    className={`p-3.5 rounded-2xl bg-slate-950 border ${
                      parseResult.fieldStatus.skeletalMuscleMassKg !== 'ok'
                        ? 'border-amber-500/60 ring-2 ring-amber-500/20'
                        : 'border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-slate-300">Muscle Mass (SMM kg)</label>
                      {parseResult.fieldStatus.skeletalMuscleMassKg !== 'ok' && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-extrabold">
                          Verify
                        </span>
                      )}
                    </div>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.skeletalMuscleMassKg ?? ''}
                      onChange={(e) =>
                        setFormData({ ...formData, skeletalMuscleMassKg: parseFloat(e.target.value) || null })
                      }
                      placeholder="e.g. 35.4"
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-cyan-300 font-extrabold text-sm focus:border-cyan-500 outline-none"
                    />
                  </div>

                  {/* Body Fat Percentage (PBF %) */}
                  <div
                    className={`p-3.5 rounded-2xl bg-slate-950 border ${
                      parseResult.fieldStatus.bodyFatPercent !== 'ok'
                        ? 'border-amber-500/60 ring-2 ring-amber-500/20'
                        : 'border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-slate-300">Body Fat % (PBF)</label>
                      {parseResult.fieldStatus.bodyFatPercent !== 'ok' && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-extrabold">
                          Verify
                        </span>
                      )}
                    </div>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.bodyFatPercent ?? ''}
                      onChange={(e) =>
                        setFormData({ ...formData, bodyFatPercent: parseFloat(e.target.value) || null })
                      }
                      placeholder="e.g. 15.7"
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-amber-300 font-extrabold text-sm focus:border-cyan-500 outline-none"
                    />
                  </div>

                  {/* Body Fat Mass (BFM kg) */}
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                    <label className="block font-bold text-slate-300 mb-1">Fat Mass (BFM kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.bodyFatMassKg ?? ''}
                      onChange={(e) =>
                        setFormData({ ...formData, bodyFatMassKg: parseFloat(e.target.value) || null })
                      }
                      placeholder="e.g. 11.8"
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold outline-none"
                    />
                  </div>

                  {/* Basal Metabolic Rate (BMR kcal) */}
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                    <label className="block font-bold text-slate-300 mb-1">InBody BMR (kcal)</label>
                    <input
                      type="number"
                      value={formData.bmrKcal ?? ''}
                      onChange={(e) =>
                        setFormData({ ...formData, bmrKcal: parseInt(e.target.value) || null })
                      }
                      placeholder="e.g. 1740"
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-emerald-400 font-bold outline-none"
                    />
                  </div>

                  {/* InBody Score */}
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                    <label className="block font-bold text-slate-300 mb-1">InBody Score (/100)</label>
                    <input
                      type="number"
                      value={formData.inBodyScore ?? ''}
                      onChange={(e) =>
                        setFormData({ ...formData, inBodyScore: parseInt(e.target.value) || null })
                      }
                      placeholder="e.g. 84"
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-violet-300 font-bold outline-none"
                    />
                  </div>

                  {/* Visceral Fat Level */}
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                    <label className="block font-bold text-slate-300 mb-1">Visceral Fat Level</label>
                    <input
                      type="number"
                      value={formData.visceralFatLevel ?? ''}
                      onChange={(e) =>
                        setFormData({ ...formData, visceralFatLevel: parseInt(e.target.value) || null })
                      }
                      placeholder="e.g. 4"
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold outline-none"
                    />
                  </div>

                  {/* Total Body Water (TBW) */}
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                    <label className="block font-bold text-slate-300 mb-1">Body Water (TBW L)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.totalBodyWaterL ?? ''}
                      onChange={(e) =>
                        setFormData({ ...formData, totalBodyWaterL: parseFloat(e.target.value) || null })
                      }
                      placeholder="e.g. 46.8"
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-sky-400 font-bold outline-none"
                    />
                  </div>

                  {/* Scan Date */}
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                    <label className="block font-bold text-slate-300 mb-1">Scan Test Date</label>
                    <input
                      type="date"
                      value={formData.testDate || ''}
                      onChange={(e) => setFormData({ ...formData, testDate: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold outline-none"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
                  <Info className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>
                    Applying this scan will update your <strong>Current Body Weight ({formData.weightKg}kg)</strong>,
                    calibrate your Body Fat % & Muscle Mass, and record an InBody entry in your Biometrics history.
                  </span>
                </div>
              </div>
            )}

            {/* Tab 2: Raw OCR Text & Sheet Preview */}
            {activeTab === 'rawText' && (
              <div className="space-y-3">
                <div className="text-xs text-slate-400">
                  You can inspect the exact text lines parsed by the OCR engine below to cross-check any numbers against your physical printout:
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 max-h-72 overflow-y-auto font-mono text-[11px] text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {parseResult.rawText || 'No text extracted.'}
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-xs transition shadow-lg shadow-cyan-500/25 flex items-center gap-2"
              >
                <span>Confirm & Apply InBody Scan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
