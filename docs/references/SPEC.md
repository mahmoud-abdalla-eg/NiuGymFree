# Project Specification: NiuGymFree — Dual-Hemisphere Nutrition & Gym Performance Platform
## Role & Objective
Act as a Principal Full-Stack TypeScript Architect and UI/UX Designer. Build **NiuGymFree**, a \$0-cost, open-source, local-first and Supabase-synced web application built with **Vite + React + TypeScript + Tailwind CSS**.

The application consists of **Two Seamless Sides** (**🥗 Nutrition Side** and **🏋️ Gym Side**) connected by an instant **Top-Bar Mode Switcher** and backed by a **Shared Biometric, Calendar, PDF OCR & AI Core**.

You MUST preserve the exact visual design DNA of dark-slate glassmorphism (`slate-950` canvas, `slate-900/90` cards, `slate-800/80` subtle borders, and semantic neon accents):
- **🥗 Nutrition Side Theme:** Emerald (`#10b981`) primary glow, Sky (`#0ea5e9`) Protein, Amber (`#f59e0b`) Carbs, Rose (`#f43f5e`) Fat.
- **🏋️ Gym Side Theme:** Electric Violet (`#8b5cf6`) primary glow, Cyan (`#06b6d4`) Volume/PRs, Amber (`#f59e0b`) Rest Timer, Rose (`#f43f5e`) High RPE/Failure sets.

---

# 1. Core Tech Stack (\$0 Open-Source Architecture)
- **Frontend:** React 18+, Vite, TypeScript (strict), Tailwind CSS, `lucide-react` icons.
- **PDF & Normal OCR Pipeline (`100% Free Client-Side`):**
  - `pdfjs-dist`: Extracts native digital text layers and layout coordinates from uploaded PDF workout or nutrition plans.
  - `tesseract.js`: Runs client-side Optical Character Recognition (OCR) inside a non-blocking Web Worker whenever a user uploads a scanned PDF, coach's printed sheet, or image-based plan.
- **Exercise Video Engine:** Privacy-enhanced YouTube IFrame Embeds (`youtube-nocookie.com/embed/...`) with timestamp jump-to-execution, biomechanical setup cues, and custom YouTube URL / Shorts parsing.
- **Dual-Mode Storage Engine (`src/services/storageAdapter.ts`):**
  - **Local-First Mode:** Works 100% offline out of the box using `localStorage` + `IndexedDB` (for compressed WebP meal/physique photos) so anyone cloning from GitHub can use it with zero configuration.
  - **Supabase Cloud Mode:** Syncs profiles, weight history, meal templates, workout routines, weekly schedules, daily logs, and photos to Supabase PostgreSQL & Storage when `.env` credentials are present.
- **Validation:** `zod` schemas for all data models, OCR staging payloads, JSON exports/imports, and future AI outputs.

---

# 2. Global Header & Persistent Dual-Side Workspace
1. **App Title & Branding:** **NiuGymFree** displayed prominently in the top navigation bar.
2. **Centerpiece Segmented Mode Toggle:**
   - `[ 🥗 Nutrition Side | 🏋️ Gym Side ]` pill switcher in the top bar (also triggered via `Cmd/Ctrl + Shift + M`).
3. **Unified Date Scrubber:**
   - `< Prev Day | Today, Oct 14, 2026 | Next Day >` + Calendar popover (controls both the day's Meal Log and the day's Workout Log simultaneously).
4. **Quick Action Buttons:**
   - **`📄 Import PDF Plan (OCR)` Button:** Opens the universal PDF Plan Importer modal from anywhere in the app.
   - **Live Biometric & Age-in-Days Pill:** Displays exact chronological age in days from Date of Birth (e.g., `7,802 Days Old`), current weight (`kg`/`lbs`), fixed height (`cm`/`ft+in`), and a pulsing amber badge when the scheduled weight check-in is due.
5. **Floating Active Workout & Break Time HUD:**
   - If a workout or rest countdown is running while the user flips to the **Nutrition Side**, a persistent bottom bar displays the live **Break Time Countdown (`01:42`)**, `-15s / +15s / Skip` controls, and elapsed workout stopwatch.

---

# 3. Side A: 🥗 THE NUTRITION SIDE (4 Sub-Views)

### View A1: `Daily Macro Tracker`
- **Top Bento Analytics:** 4 SVG Circular Progress Rings (Calories, Protein `g`, Carbs `g`, Fat `g`) + Multi-Segment SVG Macro Donut Chart + Hydration (`ml`) tracker with `+250ml / +500ml` quick buttons.
- **Training-Day Calorie Sync Toggle:** Automatically detects if a workout is scheduled or logged today and optionally adds the Training Day Calorie Bonus (e.g., `+250 kcal`) to today's target.
- **4 Categorized Meal Slots (`Breakfast`, `Lunch`, `Dinner`, `Snacks & Drinks`):**
  - Inline portion multiplier controls (`-`, `+`, or direct numeric input), per-meal macro subtotals, **Meal Photo Thumbnails** (compressed client-side to WebP), and 1-click `"Load Assigned Set Meal"`.

### View A2: `Meal Studio & Weekly Planner`
- **Set Meal Builder:** Combine multiple staple/custom foods + cover photo + prep notes into reusable meal combos (e.g., *"Post-Workout Chicken & Jasmine Rice"*, *"Morning Double Espresso & Oats"*).
- **Unified 7-Day Schedule Matrix (`Mon–Sun`):** Assign both **Set Meals** (`Breakfast`, `Lunch`, `Dinner`) and **Gym Routines** (`Push`, `Pull`, `Legs`, `Rest`) across the week, with a `"1-Click Load Assigned Day"` button.

### View A3: `Biometrics, Age-in-Days & Adaptive Kcal Coach`
- **Exact Age-in-Days Engine (`src/lib/biometrics.ts`):**
  - $\text{Days Old} = \lfloor (\text{Current Date} - \text{DOB}) / 86400000 \rfloor$
  - $\text{Exact Fractional Age} = \text{Days Old} / 365.2425$
  - Uses `Exact Fractional Age` inside the **Mifflin-St Jeor Equation** alongside fixed height and current weight.
- **Bi-Weekly Weight Check-In & Adaptive Calorie Engine (`src/lib/adaptiveTdee.ts`):**
  - Configurable cadence (`Every 7, 14, 21, or 28 days`). Logs morning weight + optional physique photo.
  - Compares actual weight change velocity against target weekly rate ($1\text{ kg} \approx 7,700\text{ kcal}$) and offers a 1-click **Adaptive Kcal Adjustment** while preserving a **Manual Kcal Override Slider** and coupled 100%-locked Macro Split sliders.

### View A4: `Food Vault & AI Coach Hub`
- 35+ pre-seeded staple foods & specialty drinks (Chicken Breast, Lean Ground Beef, Whole Eggs, Salmon, Whey Isolate, Greek Yogurt, Jasmine Rice, Rolled Oats, Sweet Potato, Extra Virgin Olive Oil, Avocado, Double Shot Espresso, Iced Latte, Hand-Punched Lemon Drink) + Custom Food Creator with photo upload.

---

# 4. Side B: 🏋️ THE GYM SIDE (3 Sub-Views)

### View B1: `Active Workout & Set Recorder`
- **Session Header:** Active Routine selector, Live Workout Stopwatch (`Start / Pause / Reset`), Total Session Tonnage (`kg` lifted), Completed Working Sets, and PR counter.
- **Exercise Cards & Set-by-Set Matrix:**
  - Each exercise header features:
    1. **Muscle Group & Equipment Badges** (`Chest • Barbell`).
    2. **`🎥 Watch Form Video` Button:** Opens the in-app **YouTube Exercise Demonstration Modal** right inside the workout view without stopping the workout timer.
    3. **Target Break Time Selector:** (`60s`, `90s`, `120s`, `180s`, `240s`) + immediate `Rest Now` trigger.
  - **Set Row Columns:**
    - `Set # & Type` (Click to cycle: `W` Warmup $\rightarrow$ `1/2/3` Working $\rightarrow$ `D` Drop Set $\rightarrow$ `F` Failure).
    - `Previous Session` (Ghost text showing last session's performance, e.g., `80kg × 8 @ RPE 8.5`).
    - `Weight (kg/lbs)` numeric input.
    - `Reps` numeric input.
    - `RPE` (6.0–10.0 effort input).
    - `Est. 1RM` (Live Epley formula: $\text{Weight} \times (1 + \text{Reps} / 30)$) + automatic **🏆 PR Badge** when beating historical bests.
    - `Complete Button (✓)`: Marks set complete and **automatically starts the Circular SVG Break Time Countdown** with Web Audio API beep on completion.

### View B2: `Routine Split Builder & Schedule`
- Create and edit custom workout templates (e.g., *"Push Hypertrophy A"*, *"Pull Strength & Thickness"*, *"Legs & Core Power"*), configure target sets, rep ranges (`8-12`), and default rest intervals, or import routines directly from a PDF via the OCR Importer.

### View B3: `Strength Analytics, Muscle Volume & Video Exercise Vault`
- **Weekly Sets-Per-Muscle-Group Bar Tracker:** Tracks completed working sets per muscle group against the `10–20 sets/week` hypertrophy target zone.
- **Interactive 1RM & Rep-Max Percentage Table:** Calculates `100% (1RM)`, `90% (~3-4 reps)`, `85% (~5-6 reps)`, `80% (~7-8 reps)`, `75% (~10 reps)`, and `70% (~12 reps)`.
- **Video-Enabled Exercise Vault:** Browse all 45+ pre-seeded exercises or add custom exercises with custom YouTube demonstration URLs.

---

# 5. Client-Side PDF Plan Importer & Normal OCR Engine (`src/lib/pdfOcrEngine.ts`)
Allow users to upload any PDF file (a coach's workout routine PDF, a nutritionist's meal plan PDF, or a scanned gym sheet) and parse it into structured app data using **normal OCR and deterministic text parsing** (100% free, no paid API required):

1. **Two-Stage Extraction Pipeline:**
   - **Stage 1 — Fast Digital Text Extraction (`pdfjs-dist`):**
     - Reads each page's text items and reconstructs lines using Y-coordinate grouping so tables and multi-column layouts remain intact.
   - **Stage 2 — Normal OCR Fallback (`tesseract.js` Web Worker):**
     - If a page contains fewer than 30 extractable characters (indicating a scanned document or image-based PDF) or if the user toggles `"Force Optical OCR"`, render each PDF page onto an offscreen HTML5 `<canvas>` at `2.0` scale, apply high-contrast grayscale thresholding to sharpen text, and run `Tesseract.recognize(canvas, 'eng')` with a real-time progress bar.

2. **Rule-Based Heuristic Parser (`src/lib/planTextParser.ts`):**
   - **Workout Plan Detection & Extraction:**
     - Regex matches day/split headers (`/(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|Day\s*\d+|Push|Pull|Legs|Upper|Lower|Full\s*Body)/i`).
     - Extracts exercise lines and parses set/rep/rest notation (`/(?<sets>\d+)\s*[x×]\s*(?<reps>\d+(?:\s*-\s*\d+)?)\s*(?:@\s*(?<rest>\d+)\s*s)?/i`).
   - **Nutrition / Meal Plan Detection & Extraction:**
     - Regex matches meal headers (`/(Breakfast|Lunch|Dinner|Snack|Meal\s*\d+|Pre-Workout|Post-Workout)/i`).
     - Extracts food items, gram/oz/ml quantities, and explicit macro lines.

3. **Interactive OCR Staging & Review Modal (`src/components/modals/PdfImportModal.tsx`):**
   - Shows raw extracted OCR text on the left and structured **Editable Preview Cards** on the right.
   - User can edit any misread exercise name, set count, or gram weight and click **`"Save & Assign to Weekly Schedule"`**.

---

# 6. Exercise YouTube Video Player & Form Guide (`src/components/gym/ExerciseVideoModal.tsx`)
Every exercise in the app supports visual form demonstrations:
- Responsive 16:9 YouTube Embed (`https://www.youtube-nocookie.com/embed/${youtubeVideoId}?start=${videoStartSec || 0}&rel=0&modestbranding=1`).
- Editable video link input so users can paste custom YouTube or YouTube Shorts URLs on any exercise.
- Side-by-side Biomechanical Checklist (`formCues`, `commonMistakes`, primary/secondary muscles worked, and personal best `PR`).

---

# 7. Supabase SQL Schema & Keep-Alive (`supabase/migrations/001_niugymfree_init.sql`)
- Complete, idempotent SQL migration script with Row Level Security (`auth.uid() = user_id`) for profiles, weight logs, food items, meal presets, daily logs, exercises, workout routines, weekly schedule, workout sessions, and imported PDF plans.
- `.github/workflows/supabase-keepalive.yml` GitHub Action workflow to ping Supabase every 5 days so the free database tier never pauses.