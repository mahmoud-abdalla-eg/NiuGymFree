import { InBodyScanRecord } from '../types';

export interface InBodyOcrIssue {
  field: keyof InBodyParsedData | 'general';
  severity: 'warning' | 'error';
  message: string;
}

export interface InBodyParsedData {
  weightKg: number | null;
  skeletalMuscleMassKg: number | null;
  bodyFatMassKg: number | null;
  bodyFatPercent: number | null;
  bmi: number | null;
  bmrKcal: number | null;
  totalBodyWaterL: number | null;
  visceralFatLevel: number | null;
  inBodyScore: number | null;
  heightCm: number | null;
  testDate: string | null;
}

export type FieldVerificationStatus = 'ok' | 'needs_attention' | 'missing';

export interface InBodyOcrParseResult {
  data: InBodyParsedData;
  rawText: string;
  ocrConfidence?: number;
  hasIssues: boolean;
  issues: InBodyOcrIssue[];
  fieldStatus: Record<keyof InBodyParsedData, FieldVerificationStatus>;
}

/**
 * Normalizes text lines and trims noisy OCR artifacts.
 */
function cleanText(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/[—–]/g, '-')
    .replace(/[“”]/g, '"')
    .replace(/\t/g, ' ');
}

/**
 * Safely parses a float string, handling European commas and trailing noise.
 */
function parseSafeFloat(val: string): number | null {
  if (!val) return null;
  const cleaned = val.replace(',', '.').replace(/[^0-9.]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

/**
 * Searches text for regex matches and returns first valid parsed number.
 */
function matchFirstNumber(text: string, patterns: RegExp[]): number | null {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const parsed = parseSafeFloat(match[1]);
      if (parsed !== null) return parsed;
    }
  }
  return null;
}

/**
 * Comprehensive parser for InBody 270, 570, 770, and standard body composition sheets.
 */
export function parseInBodyText(rawText: string, ocrConfidence?: number): InBodyOcrParseResult {
  const text = cleanText(rawText);
  const issues: InBodyOcrIssue[] = [];

  // 1. Weight Extraction (kg)
  const weightKg = matchFirstNumber(text, [
    /(?:Body\s*Weight|Weight|Wt\.?)\s*[:=-]?\s*([0-9]{2,3}(?:[.,][0-9]{1,2})?)\s*(?:kg|lbs)?/i,
    /Weight\s*\n\s*([0-9]{2,3}(?:[.,][0-9]{1,2})?)/i,
    /(?:Weight|Wt)\s+([0-9]{2,3}\.[0-9]{1,2})/i,
    /([0-9]{2,3}\.[0-9])\s*kg\b/i,
  ]);

  // 2. Skeletal Muscle Mass (SMM) (kg)
  const skeletalMuscleMassKg = matchFirstNumber(text, [
    /(?:Skeletal\s*Muscle\s*Mass|SMM)\s*[:=-]?\s*([0-9]{1,3}(?:[.,][0-9]{1,2})?)\s*(?:kg)?/i,
    /SMM\s*\n\s*([0-9]{1,3}(?:[.,][0-9]{1,2})?)/i,
    /Muscle\s*Mass\s*[:=-]?\s*([0-9]{1,3}(?:[.,][0-9]{1,2})?)/i,
  ]);

  // 3. Body Fat Mass (BFM) (kg)
  const bodyFatMassKg = matchFirstNumber(text, [
    /(?:Body\s*Fat\s*Mass|BFM)\s*[:=-]?\s*([0-9]{1,3}(?:[.,][0-9]{1,2})?)\s*(?:kg)?/i,
    /BFM\s*\n\s*([0-9]{1,3}(?:[.,][0-9]{1,2})?)/i,
    /Fat\s*Mass\s*[:=-]?\s*([0-9]{1,3}(?:[.,][0-9]{1,2})?)/i,
  ]);

  // 4. Percent Body Fat (PBF / BF %)
  let bodyFatPercent = matchFirstNumber(text, [
    /(?:Percent\s*Body\s*Fat|PBF|Body\s*Fat\s*%?|Fat\s*Percentage)\s*[:=-]?\s*([0-9]{1,2}(?:[.,][0-9]{1,2})?)\s*%?/i,
    /PBF\s*\n\s*([0-9]{1,2}(?:[.,][0-9]{1,2})?)/i,
    /Body\s*Fat\s*([0-9]{1,2}\.[0-9])\s*%/i,
    /([0-9]{1,2}\.[0-9])\s*%\s*(?:PBF|Body\s*Fat)/i,
  ]);

  // Cross-calculation fallback for Body Fat % if not directly parsed but BFM and Weight exist
  if (bodyFatPercent === null && bodyFatMassKg !== null && weightKg !== null && weightKg > 0) {
    const calculatedPbf = Number(((bodyFatMassKg / weightKg) * 100).toFixed(1));
    if (calculatedPbf >= 3 && calculatedPbf <= 60) {
      bodyFatPercent = calculatedPbf;
    }
  }

  // 5. Basal Metabolic Rate (BMR) (kcal)
  const bmrKcal = matchFirstNumber(text, [
    /(?:Basal\s*Metabolic\s*Rate|BMR)\s*[:=-]?\s*([0-9]{3,4})\s*(?:kcal)?/i,
    /BMR\s*\n\s*([0-9]{3,4})/i,
    /([0-9]{4})\s*kcal\b/i,
  ]);

  // 6. Body Mass Index (BMI)
  const bmi = matchFirstNumber(text, [
    /(?:Body\s*Mass\s*Index|BMI)\s*[:=-]?\s*([0-9]{1,2}(?:[.,][0-9]{1,2})?)/i,
    /BMI\s*\n\s*([0-9]{1,2}(?:[.,][0-9]{1,2})?)/i,
  ]);

  // 7. Total Body Water (TBW) (L / kg)
  const totalBodyWaterL = matchFirstNumber(text, [
    /(?:Total\s*Body\s*Water|TBW)\s*[:=-]?\s*([0-9]{1,3}(?:[.,][0-9]{1,2})?)\s*(?:L|kg)?/i,
    /TBW\s*\n\s*([0-9]{1,3}(?:[.,][0-9]{1,2})?)/i,
  ]);

  // 8. Visceral Fat Level
  const visceralFatLevel = matchFirstNumber(text, [
    /(?:Visceral\s*Fat\s*Level|Visceral\s*Fat|VFL)\s*[:=-]?\s*(?:Level\s*)?([0-9]{1,2})/i,
    /VFL\s*\n\s*([0-9]{1,2})/i,
  ]);

  // 9. InBody Score
  const inBodyScore = matchFirstNumber(text, [
    /(?:InBody\s*Score|Fitness\s*Score|Total\s*Score)\s*[:=-]?\s*([0-9]{1,3})\s*(?:\/\s*100)?/i,
    /Score\s*\n\s*([0-9]{2,3})/i,
  ]);

  // 10. Height (cm)
  const heightCm = matchFirstNumber(text, [
    /(?:Height|Ht\.?)\s*[:=-]?\s*([0-9]{2,3}(?:[.,][0-9]{1,2})?)\s*(?:cm)?/i,
    /Height\s*\n\s*([0-9]{2,3})/i,
    /([0-9]{3})\s*cm\b/i,
  ]);

  // 11. Test Date
  let testDate: string | null = null;
  const dateMatch =
    text.match(/(?:Date|Test\s*Date|Time)\s*[:=-]?\s*([0-9]{4}[./-][0-9]{1,2}[./-][0-9]{1,2})/i) ||
    text.match(/\b([0-9]{4}[./-][0-9]{2}[./-][0-9]{2})\b/) ||
    text.match(/\b([0-9]{2}[./-][0-9]{2}[0-9]{4})\b/);

  if (dateMatch && dateMatch[1]) {
    const rawDate = dateMatch[1].replace(/[./]/g, '-');
    const parts = rawDate.split('-');
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        // YYYY-MM-DD
        const y = parts[0];
        const m = parts[1].padStart(2, '0');
        const d = parts[2].padStart(2, '0');
        testDate = `${y}-${m}-${d}`;
      } else if (parts[2].length === 4) {
        // DD-MM-YYYY
        const d = parts[0].padStart(2, '0');
        const m = parts[1].padStart(2, '0');
        const y = parts[2];
        testDate = `${y}-${m}-${d}`;
      }
    }
  }

  // --- Field Status & Issue Diagnostics ---
  const fieldStatus: Record<keyof InBodyParsedData, FieldVerificationStatus> = {
    weightKg: 'ok',
    skeletalMuscleMassKg: 'ok',
    bodyFatMassKg: 'ok',
    bodyFatPercent: 'ok',
    bmi: 'ok',
    bmrKcal: 'ok',
    totalBodyWaterL: 'ok',
    visceralFatLevel: 'ok',
    inBodyScore: 'ok',
    heightCm: 'ok',
    testDate: 'ok',
  };

  // General OCR Quality Check
  if (ocrConfidence !== undefined && ocrConfidence < 65) {
    issues.push({
      field: 'general',
      severity: 'warning',
      message: `OCR recognition confidence is low (${Math.round(ocrConfidence)}%). Please verify all parsed fields carefully.`,
    });
  }

  if (text.trim().length < 40) {
    issues.push({
      field: 'general',
      severity: 'error',
      message: 'Extracted very little text from the scan. The image may be blurry, cropped, or in low resolution.',
    });
  }

  // Weight Verification
  if (weightKg === null) {
    fieldStatus.weightKg = 'missing';
    issues.push({
      field: 'weightKg',
      severity: 'error',
      message: 'Could not detect Body Weight (kg). Please enter your weight from the InBody sheet.',
    });
  } else if (weightKg < 35 || weightKg > 260) {
    fieldStatus.weightKg = 'needs_attention';
    issues.push({
      field: 'weightKg',
      severity: 'warning',
      message: `Detected weight (${weightKg} kg) appears outside standard physiological range. Please confirm.`,
    });
  }

  // Body Fat % Verification
  if (bodyFatPercent === null) {
    fieldStatus.bodyFatPercent = 'missing';
    issues.push({
      field: 'bodyFatPercent',
      severity: 'error',
      message: 'Percent Body Fat (PBF / BF%) was not detected. Please verify or input manually.',
    });
  } else if (bodyFatPercent < 3 || bodyFatPercent > 60) {
    fieldStatus.bodyFatPercent = 'needs_attention';
    issues.push({
      field: 'bodyFatPercent',
      severity: 'warning',
      message: `Body Fat % (${bodyFatPercent}%) is unusual. Please confirm.`,
    });
  }

  // Muscle Mass Verification
  if (skeletalMuscleMassKg === null) {
    fieldStatus.skeletalMuscleMassKg = 'missing';
    issues.push({
      field: 'skeletalMuscleMassKg',
      severity: 'warning',
      message: 'Skeletal Muscle Mass (SMM) was not detected.',
    });
  } else if (weightKg !== null && skeletalMuscleMassKg >= weightKg) {
    fieldStatus.skeletalMuscleMassKg = 'needs_attention';
    issues.push({
      field: 'skeletalMuscleMassKg',
      severity: 'error',
      message: `Skeletal Muscle Mass (${skeletalMuscleMassKg} kg) cannot be greater than or equal to Total Weight (${weightKg} kg).`,
    });
  }

  // Body Fat Mass Verification
  if (bodyFatMassKg === null) {
    fieldStatus.bodyFatMassKg = 'missing';
  } else if (weightKg !== null && bodyFatMassKg >= weightKg) {
    fieldStatus.bodyFatMassKg = 'needs_attention';
    issues.push({
      field: 'bodyFatMassKg',
      severity: 'error',
      message: `Body Fat Mass (${bodyFatMassKg} kg) cannot exceed Total Weight (${weightKg} kg).`,
    });
  }

  // BMR Check
  if (bmrKcal === null) {
    fieldStatus.bmrKcal = 'missing';
  } else if (bmrKcal < 800 || bmrKcal > 3500) {
    fieldStatus.bmrKcal = 'needs_attention';
  }

  // Date Check
  if (!testDate) {
    fieldStatus.testDate = 'missing';
    issues.push({
      field: 'testDate',
      severity: 'warning',
      message: 'Test Date was not found. Defaulting to today; feel free to change it.',
    });
  }

  return {
    data: {
      weightKg,
      skeletalMuscleMassKg,
      bodyFatMassKg,
      bodyFatPercent,
      bmi,
      bmrKcal,
      totalBodyWaterL,
      visceralFatLevel,
      inBodyScore,
      heightCm,
      testDate: testDate || new Date().toISOString().split('T')[0],
    },
    rawText,
    ocrConfidence,
    hasIssues: issues.length > 0,
    issues,
    fieldStatus,
  };
}
