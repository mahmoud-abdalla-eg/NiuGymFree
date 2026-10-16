/**
 * YouTube Utility Functions for NiuGymFree Exercise Video Engine.
 * Extracts video ID and start time from various YouTube URL formats
 * and constructs privacy-enhanced embeds using youtube-nocookie.com.
 */

export interface ParsedYouTubeInfo {
  videoId: string;
  startSec?: number;
}

/**
 * Extracts the 11-character YouTube video ID and optional timestamp from any YouTube link:
 * - https://www.youtube.com/watch?v=dQw4w9WgXcQ
 * - https://youtu.be/dQw4w9WgXcQ?t=42
 * - https://www.youtube.com/shorts/dQw4w9WgXcQ
 * - https://www.youtube.com/embed/dQw4w9WgXcQ
 */
export function parseYouTubeUrl(urlOrId: string): ParsedYouTubeInfo | null {
  if (!urlOrId || typeof urlOrId !== 'string') return null;

  const trimmed = urlOrId.trim();

  // If already a clean 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return { videoId: trimmed, startSec: 0 };
  }

  // Parse timestamp if present (e.g., t=90s, t=1m30s, start=90)
  let startSec = 0;
  const timeMatch = trimmed.match(/[?&](?:t|start)=([0-9msh]+)/i);
  if (timeMatch && timeMatch[1]) {
    const timeStr = timeMatch[1];
    if (/^\d+$/.test(timeStr)) {
      startSec = parseInt(timeStr, 10);
    } else {
      let total = 0;
      const m = timeStr.match(/(\d+)m/);
      const s = timeStr.match(/(\d+)s/);
      const h = timeStr.match(/(\d+)h/);
      if (h) total += parseInt(h[1], 10) * 3600;
      if (m) total += parseInt(m[1], 10) * 60;
      if (s) total += parseInt(s[1], 10);
      if (total > 0) startSec = total;
    }
  }

  // Regex patterns
  const patterns = [
    /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/i,
    /^([a-zA-Z0-9_-]{11})$/
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match && match[1]) {
      return {
        videoId: match[1],
        startSec: startSec || undefined,
      };
    }
  }

  return null;
}

/**
 * Builds a privacy-friendly YouTube embed URL using youtube-nocookie.com
 */
export function buildYouTubeEmbedUrl(videoId: string, startSec: number = 0): string {
  const cleanId = videoId.replace(/[^a-zA-Z0-9_-]/g, '');
  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
  });

  if (startSec > 0) {
    params.set('start', startSec.toString());
  }

  return `https://www.youtube-nocookie.com/embed/${cleanId}?${params.toString()}`;
}

/**
 * Gets high-resolution YouTube video thumbnail URL
 */
export function getYouTubeThumbnailUrl(videoId: string): string {
  const cleanId = videoId.replace(/[^a-zA-Z0-9_-]/g, '');
  return `https://img.youtube.com/vi/${cleanId}/hqdefault.jpg`;
}
