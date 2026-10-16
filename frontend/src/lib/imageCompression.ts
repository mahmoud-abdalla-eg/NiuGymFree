/**
 * Compresses any uploaded image file (JPEG, PNG, HEIC, etc.) to an optimized WebP Data URL
 * using an offscreen HTML5 canvas.
 */
export function compressUploadedImage(file: File, maxDim = 720, quality = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to decode image'));
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        if (width > height && width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Use webp if supported, falls back safely
        resolve(canvas.toDataURL('image/webp', quality));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Generates stylized SVG placeholder cards for instant zero-network visual delight.
 */
export function createPresetSvgPhoto(type: string): string {
  const configs: Record<string, { bg1: string; bg2: string; title: string; sub: string; icon: string }> = {
    oats: {
      bg1: '#1e1b4b',
      bg2: '#312e81',
      title: 'Espresso & Berry Protein Oats',
      sub: '399 kcal • 33.7g P • 54.7g C',
      icon: '☕🥣🫐'
    },
    chicken_rice: {
      bg1: '#064e3b',
      bg2: '#047857',
      title: 'Grilled Chicken & Jasmine Rice',
      sub: '712 kcal • 65.1g P • 69.6g C',
      icon: '🍗🍚🥑'
    },
    salmon: {
      bg1: '#7c2d12',
      bg2: '#9a3412',
      title: 'Atlantic Salmon & Sweet Potato',
      sub: '570 kcal • 39.2g P • 41.3g C',
      icon: '🍣🍠🫒'
    },
    physique: {
      bg1: '#2e1065',
      bg2: '#4c1d95',
      title: 'Bi-Weekly Physique Check-In',
      sub: 'Morning Fasted Lighting',
      icon: '🏋️‍♂️⚡📸'
    },
    generic_food: {
      bg1: '#0f172a',
      bg2: '#1e293b',
      title: 'Custom Clean Meal',
      sub: 'High Protein Fuel',
      icon: '🥗⚡'
    }
  };

  const c = configs[type] || configs.chicken_rice;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="320" viewBox="0 0 480 320">
    <defs>
      <linearGradient id="g_${type}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${c.bg1}"/>
        <stop offset="100%" stop-color="${c.bg2}"/>
      </linearGradient>
    </defs>
    <rect width="480" height="320" rx="24" fill="url(#g_${type})"/>
    <circle cx="390" cy="70" r="95" fill="rgba(255,255,255,0.06)"/>
    <circle cx="90" cy="260" r="110" fill="rgba(255,255,255,0.04)"/>
    <text x="240" y="135" font-size="54" text-anchor="middle" font-family="sans-serif">${c.icon}</text>
    <text x="240" y="205" font-size="20" font-weight="bold" fill="#ffffff" text-anchor="middle" font-family="sans-serif">${c.title}</text>
    <text x="240" y="238" font-size="14" fill="#a7f3d0" text-anchor="middle" font-family="monospace">${c.sub}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
