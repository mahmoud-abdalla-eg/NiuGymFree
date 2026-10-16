# NiuGymFree Frontend Client

Client-side single page web application for **NiuGymFree** (Dual-Hemisphere Nutrition & Gym Platform), built with **React 18 + Vite + TypeScript + Tailwind CSS**.

---

## 🌟 Key Capabilities

1. **Dual-Hemisphere Architecture**:
   - Seamless top-bar toggle between **🥗 Nutrition Side** and **🏋️ Gym Side** (also accessible via `Cmd/Ctrl + Shift + M`).
   - Unified persistent date scrubber driving both meal logs and workout logs concurrently.
   - Non-intrusive floating **Rest Timer HUD** that persists across all nutrition tabs.
2. **Zero-Cost Client-Side OCR Pipeline**:
   - `pdfjs-dist`: Extracts native digital text layers from PDF workout and nutrition plans.
   - `tesseract.js`: Client-side OCR in a non-blocking Web Worker for scanned plans or images.
   - InBody Scan OCR detection with interactive user verification when anomalies are detected.
3. **Biomechanical Video Cues & Vault**:
   - Privacy-enhanced YouTube IFrame embeds (`youtube-nocookie.com/embed/...`) with direct timestamp jump-to-execution.
   - Setup cues and common mistakes for all default exercises.
4. **Local-First Storage Adapter**:
   - `localStorage` + `IndexedDB` (for compressed WebP meal/physique photos) ensures 100% offline usability with zero cloud configuration required.
   - Automatic sync with Supabase when credentials are provided in `.env`.

---

## 🚀 Quickstart

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional)
```bash
cp .env.example .env
```

### 3. Run Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 4. Build for Production
```bash
npm run build
```
Outputs minified assets to the `dist/` directory.
