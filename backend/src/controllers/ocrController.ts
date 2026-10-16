import { Request, Response } from 'express';
import { parseInBodyText } from '../services/inbodyOcrService';
import { parsePlanText } from '../services/planParserService';

export async function processInBodyOcr(req: Request, res: Response): Promise<void> {
  const { rawText } = req.body;

  if (!rawText || typeof rawText !== 'string') {
    res.status(400).json({
      success: false,
      error: 'rawText string is required for InBody OCR analysis',
    });
    return;
  }

  const result = parseInBodyText(rawText);

  res.status(200).json({
    success: true,
    data: result,
  });
}

export async function processPlanOcr(req: Request, res: Response): Promise<void> {
  const { rawText } = req.body;

  if (!rawText || typeof rawText !== 'string') {
    res.status(400).json({
      success: false,
      error: 'rawText string is required for PDF/image plan parsing',
    });
    return;
  }

  const result = parsePlanText(rawText);

  res.status(200).json({
    success: true,
    data: result,
  });
}
