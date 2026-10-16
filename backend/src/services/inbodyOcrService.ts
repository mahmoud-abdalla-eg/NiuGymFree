import { InBodyScanRecord } from '../types';

export interface InBodyParseResult {
  parsed: Partial<InBodyScanRecord>;
  hasIssues: boolean;
  issues: string[];
  rawText: string;
}

export function parseInBodyText(rawText: string): InBodyParseResult {
  const issues: string[] = [];
  const parsed: Partial<InBodyScanRecord> = {
    scanDate: new Date().toISOString().split('T')[0],
  };

  if (!rawText || rawText.trim().length < 20) {
    return {
      parsed,
      hasIssues: true,
      issues: ['Document text is too sparse or empty for reliable InBody extraction.'],
      rawText: rawText || '',
    };
  }

  // Weight regex
  const weightMatch = rawText.match(/(?:weight|body\s*weight|wt)\s*[:=]?\s*([0-9]{2,3}(?:\.[0-9]+)?)\s*(?:kg|lbs)?/i) ||
                      rawText.match(/([0-9]{2,3}(?:\.[0-9]+)?)\s*(?:kg)\s*(?:weight)/i);
  if (weightMatch) {
    parsed.weightKg = parseFloat(weightMatch[1]);
  }

  // Skeletal Muscle Mass (SMM)
  const smmMatch = rawText.match(/(?:skeletal\s*muscle\s*mass|smm)\s*[:=]?\s*([0-9]{2,3}(?:\.[0-9]+)?)\s*(?:kg)?/i) ||
                   rawText.match(/(?:muscle\s*mass)\s*[:=]?\s*([0-9]{2,3}(?:\.[0-9]+)?)\s*(?:kg)?/i);
  if (smmMatch) {
    parsed.skeletalMuscleMassKg = parseFloat(smmMatch[1]);
  }

  // Body Fat Mass (BFM)
  const bfmMatch = rawText.match(/(?:body\s*fat\s*mass|bfm)\s*[:=]?\s*([0-9]{1,3}(?:\.[0-9]+)?)\s*(?:kg)?/i) ||
                   rawText.match(/(?:fat\s*mass)\s*[:=]?\s*([0-9]{1,3}(?:\.[0-9]+)?)\s*(?:kg)?/i);
  if (bfmMatch) {
    parsed.bodyFatMassKg = parseFloat(bfmMatch[1]);
  }

  // Body Fat Percent (PBF)
  const pbfMatch = rawText.match(/(?:percent\s*body\s*fat|body\s*fat\s*%|pbf)\s*[:=]?\s*([0-9]{1,2}(?:\.[0-9]+)?)\s*%?/i) ||
                   rawText.match(/([0-9]{1,2}(?:\.[0-9]+)?)\s*%\s*(?:body\s*fat|pbf)/i);
  if (pbfMatch) {
    parsed.bodyFatPercent = parseFloat(pbfMatch[1]);
  }

  // BMI
  const bmiMatch = rawText.match(/(?:bmi|body\s*mass\s*index)\s*[:=]?\s*([0-9]{2}(?:\.[0-9]+)?)/i);
  if (bmiMatch) {
    parsed.bmi = parseFloat(bmiMatch[1]);
  }

  // BMR
  const bmrMatch = rawText.match(/(?:bmr|basal\s*metabolic\s*rate)\s*[:=]?\s*([0-9]{3,4})\s*(?:kcal)?/i);
  if (bmrMatch) {
    parsed.bmrKcal = parseInt(bmrMatch[1], 10);
  }

  // Total Body Water (TBW)
  const tbwMatch = rawText.match(/(?:total\s*body\s*water|tbw)\s*[:=]?\s*([0-9]{2}(?:\.[0-9]+)?)\s*(?:l|kg)?/i);
  if (tbwMatch) {
    parsed.totalBodyWaterL = parseFloat(tbwMatch[1]);
  }

  // Visceral Fat Level
  const visceralMatch = rawText.match(/(?:visceral\s*fat(?:\s*level)?|vfl)\s*[:=]?\s*([0-9]{1,2})/i);
  if (visceralMatch) {
    parsed.visceralFatLevel = parseInt(visceralMatch[1], 10);
  }

  // InBody Score
  const scoreMatch = rawText.match(/(?:inbody\s*score|fitness\s*score)\s*[:=]?\s*([0-9]{2,3})/i);
  if (scoreMatch) {
    parsed.inBodyScore = parseInt(scoreMatch[1], 10);
  }

  // Scan Date
  const dateMatch = rawText.match(/(?:date|test\s*date)\s*[:=]?\s*([0-9]{4}[-/][0-9]{2}[-/][0-9]{2}|[0-9]{2}[-/][0-9]{2}[-/][0-9]{4})/i);
  if (dateMatch) {
    try {
      const rawDate = dateMatch[1].replace(/\//g, '-');
      const d = new Date(rawDate);
      if (!isNaN(d.getTime())) {
        parsed.scanDate = d.toISOString().split('T')[0];
      }
    } catch {
      // Keep default
    }
  }

  // Physiological Consistency Diagnostics
  if (!parsed.weightKg) {
    issues.push('Could not detect total body weight (kg).');
  }
  if (!parsed.bodyFatPercent && !parsed.bodyFatMassKg) {
    issues.push('Neither Body Fat % nor Body Fat Mass (kg) could be detected.');
  }
  if (parsed.weightKg && parsed.skeletalMuscleMassKg && parsed.skeletalMuscleMassKg >= parsed.weightKg) {
    issues.push(`Detected Muscle Mass (${parsed.skeletalMuscleMassKg}kg) exceeds or matches Total Weight (${parsed.weightKg}kg).`);
  }
  if (parsed.weightKg && parsed.bodyFatMassKg && parsed.bodyFatMassKg >= parsed.weightKg) {
    issues.push(`Detected Fat Mass (${parsed.bodyFatMassKg}kg) exceeds Total Weight (${parsed.weightKg}kg).`);
  }
  if (parsed.bodyFatPercent && (parsed.bodyFatPercent < 3 || parsed.bodyFatPercent > 65)) {
    issues.push(`Detected Body Fat % (${parsed.bodyFatPercent}%) is outside the realistic physiological range (3% - 65%).`);
  }

  return {
    parsed,
    hasIssues: issues.length > 0,
    issues,
    rawText,
  };
}
