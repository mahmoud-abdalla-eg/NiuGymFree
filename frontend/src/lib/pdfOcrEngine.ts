import * as pdfjsLib from 'pdfjs-dist';
import { createWorker } from 'tesseract.js';

// Configure pdfjs worker to reliable CDN matching pdfjs-dist version
if (typeof window !== 'undefined' && pdfjsLib.GlobalWorkerOptions) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '3.11.174'}/pdf.worker.min.js`;
}

export interface OcrProgressUpdate {
  stage: 'reading' | 'extracting_digital' | 'rendering_pages' | 'ocr_running' | 'parsing' | 'complete' | 'error';
  percent: number;
  currentPage: number;
  totalPages: number;
  message: string;
}

export interface ExtractedPageResult {
  pageNumber: number;
  text: string;
  source: 'digital' | 'ocr';
  confidence?: number;
}

export interface PdfOcrEngineResult {
  pages: ExtractedPageResult[];
  combinedText: string;
  totalPages: number;
  usedOcr: boolean;
}

/**
 * Reconstructs lines from pdfjs-dist TextItems using Y-coordinate grouping.
 * Preserves multi-column and tabular layout alignment.
 */
function reconstructLinesFromTextItems(items: Array<{ str: string; transform: number[] }>): string {
  if (!items || items.length === 0) return '';

  // Sort primarily by Y (descending: PDF 0 is bottom), then X (ascending: left to right)
  // transform: [scaleX, skewY, skewX, scaleY, transX, transY]
  const positioned = items.map((item) => ({
    text: item.str,
    x: item.transform[4] || 0,
    y: item.transform[5] || 0,
  }));

  // Group items that share approximately the same Y line (within 4px tolerance)
  const lineTolerance = 4.0;
  const lineGroups: Array<{ y: number; items: typeof positioned }> = [];

  for (const item of positioned) {
    if (!item.text.trim()) continue;
    let foundLine = lineGroups.find((g) => Math.abs(g.y - item.y) <= lineTolerance);
    if (!foundLine) {
      foundLine = { y: item.y, items: [] };
      lineGroups.push(foundLine);
    }
    foundLine.items.push(item);
  }

  // Sort lines from top of page to bottom (higher Y in PDF coordinate space is higher up)
  lineGroups.sort((a, b) => b.y - a.y);

  // Within each line, sort items from left to right (X ascending)
  const lines = lineGroups.map((group) => {
    group.items.sort((a, b) => a.x - b.x);
    return group.items.map((i) => i.text).join(' ');
  });

  return lines.join('\n');
}

/**
 * Preprocesses HTML5 canvas with grayscale and adaptive contrast thresholding
 * to optimize character edge sharpness for Tesseract OCR.
 */
function enhanceCanvasForOcr(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  try {
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
      // Luminance conversion
      const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      // High-contrast binary binarization with mid-threshold
      const val = gray > 135 ? 255 : 0;
      data[i] = val;
      data[i + 1] = val;
      data[i + 2] = val;
    }
    ctx.putImageData(imgData, 0, 0);
  } catch {
    // Canvas context reading fallback
  }
}

/**
 * Two-stage client-side PDF Extraction & Optical Character Recognition Engine.
 */
export async function extractTextFromPdfOrImage(
  file: File,
  forceOcr: boolean = false,
  onProgress?: (progress: OcrProgressUpdate) => void
): Promise<PdfOcrEngineResult> {
  const isImage = file.type.startsWith('image/');
  const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');

  // If user uploaded an image directly (coach photo/screenshot)
  if (isImage) {
    onProgress?.({
      stage: 'ocr_running',
      percent: 10,
      currentPage: 1,
      totalPages: 1,
      message: 'Initializing Tesseract Web Worker for image scan...'
    });

    const worker = await createWorker('eng', 1, {
      logger: (m) => {
        if (m.status === 'recognizing text' && m.progress) {
          onProgress?.({
            stage: 'ocr_running',
            percent: Math.round(10 + m.progress * 80),
            currentPage: 1,
            totalPages: 1,
            message: `Recognizing text: ${Math.round(m.progress * 100)}%`
          });
        }
      }
    });

    const imgUrl = URL.createObjectURL(file);
    const ret = await worker.recognize(imgUrl);
    URL.revokeObjectURL(imgUrl);
    await worker.terminate();

    onProgress?.({
      stage: 'complete',
      percent: 100,
      currentPage: 1,
      totalPages: 1,
      message: 'OCR extraction complete!'
    });

    return {
      pages: [{ pageNumber: 1, text: ret.data.text, source: 'ocr', confidence: ret.data.confidence }],
      combinedText: ret.data.text,
      totalPages: 1,
      usedOcr: true
    };
  }

  if (!isPdf) {
    throw new Error('Unsupported file format. Please upload a PDF or image file.');
  }

  // Load PDF ArrayBuffer
  onProgress?.({
    stage: 'reading',
    percent: 5,
    currentPage: 0,
    totalPages: 0,
    message: 'Reading PDF document...'
  });

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdfDoc = await loadingTask.promise;
  const totalPages = pdfDoc.numPages;

  const extractedPages: ExtractedPageResult[] = [];
  let usedOcr = false;
  let ocrWorker: Awaited<ReturnType<typeof createWorker>> | null = null;

  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    const page = await pdfDoc.getPage(pageNum);

    onProgress?.({
      stage: 'extracting_digital',
      percent: Math.round((pageNum / totalPages) * 30),
      currentPage: pageNum,
      totalPages,
      message: `Analyzing digital layer of page ${pageNum} / ${totalPages}...`
    });

    let digitalText = '';
    if (!forceOcr) {
      const textContent = await page.getTextContent();
      const items = textContent.items as Array<{ str: string; transform: number[] }>;
      digitalText = reconstructLinesFromTextItems(items);
    }

    // If digital text is sufficient (>= 30 non-whitespace chars) and OCR not forced
    const cleanChars = digitalText.replace(/\s+/g, '');
    if (!forceOcr && cleanChars.length >= 30) {
      extractedPages.push({
        pageNumber: pageNum,
        text: digitalText,
        source: 'digital'
      });
      continue;
    }

    // Fallback: Page is scanned or image-based, execute Stage 2 OCR
    usedOcr = true;
    onProgress?.({
      stage: 'rendering_pages',
      percent: Math.round(30 + (pageNum / totalPages) * 30),
      currentPage: pageNum,
      totalPages,
      message: `Scanned page detected on page ${pageNum}. Rendering offscreen canvas at 2.0x...`
    });

    // Render page to offscreen canvas at scale 2.0
    const scale = 2.0;
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      extractedPages.push({ pageNumber: pageNum, text: digitalText, source: 'digital' });
      continue;
    }

    await page.render({ canvasContext: ctx, viewport }).promise;
    enhanceCanvasForOcr(canvas);

    if (!ocrWorker) {
      onProgress?.({
        stage: 'ocr_running',
        percent: 65,
        currentPage: pageNum,
        totalPages,
        message: 'Spawning Tesseract OCR Web Worker...'
      });

      ocrWorker = await createWorker('eng', 1, {
        logger: (m) => {
          if (m.status === 'recognizing text' && m.progress) {
            onProgress?.({
              stage: 'ocr_running',
              percent: Math.round(65 + ((pageNum - 1 + m.progress) / totalPages) * 30),
              currentPage: pageNum,
              totalPages,
              message: `OCR Processing page ${pageNum}/${totalPages}: ${Math.round(m.progress * 100)}%`
            });
          }
        }
      });
    }

    const ocrResult = await ocrWorker.recognize(canvas);
    extractedPages.push({
      pageNumber: pageNum,
      text: ocrResult.data.text,
      source: 'ocr',
      confidence: ocrResult.data.confidence
    });
  }

  if (ocrWorker) {
    await ocrWorker.terminate();
  }

  const combinedText = extractedPages.map((p) => `--- Page ${p.pageNumber} (${p.source.toUpperCase()}) ---\n${p.text}`).join('\n\n');

  onProgress?.({
    stage: 'complete',
    percent: 100,
    currentPage: totalPages,
    totalPages,
    message: `Extracted ${totalPages} pages successfully!`
  });

  return {
    pages: extractedPages,
    combinedText,
    totalPages,
    usedOcr
  };
}
