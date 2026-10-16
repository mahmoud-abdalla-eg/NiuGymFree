# NiuGymFree Backend Service

High-performance, zero-cost Node.js + Express + TypeScript REST API and data synchronization layer for **NiuGymFree** (Dual-Hemisphere Nutrition & Gym Platform).

---

## 🌟 Key Features

1. **Dual-Mode Persistence Architecture**:
   - **Local-First Zero Config**: Works immediately out-of-the-box in local development with in-memory stores and client-side offline syncing.
   - **Supabase Cloud Sync**: Effortlessly syncs with Supabase PostgreSQL, Authentication, and Storage when `.env` credentials are present.
2. **Adaptive TDEE & Age-in-Days Engine**:
   - Sports-science Mifflin-St Jeor equation powered by exact fractional age calculated in days.
   - Bi-weekly check-in velocity evaluation adjusting daily targets dynamically for cuts, bulks, and maintenance.
3. **InBody Scan OCR Analysis & Diagnostic Gate**:
   - Server-side heuristic parser extracting weight, SMM, BFM, body fat %, BMI, BMR, and InBody Score.
   - Physiological integrity validator flagging contradictions (e.g., muscle mass $\ge$ total weight).
4. **Workout & Nutrition Plan Parsing**:
   - Heuristic text extraction pipeline parsing multi-day workout splits, set/rep ranges, and macro meals from raw OCR text.
5. **Pre-Seeded Databases**:
   - 35+ staple foods & specialty beverages.
   - 45+ strength exercises with curated YouTube biomechanical video IDs, timestamps, and form cues.
   - Standard Push/Pull/Legs (PPL) workout splits.

---

## 🚀 Quickstart

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your Supabase credentials (optional for local development, required for cloud sync):
```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. Run Development Server
```bash
npm run dev
```
The server will boot on `http://localhost:5000`.

### 4. Seed Supabase Database (Optional)
```bash
npm run seed
```

### 5. Build for Production
```bash
npm run build
npm start
```

---

## 📡 API Overview

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status and platform metadata |
| `POST` | `/api/auth/signup` | Register new athlete account |
| `POST` | `/api/auth/signin` | Authenticate existing athlete |
| `POST` | `/api/auth/guest` | Instant guest session generation |
| `GET` | `/api/profile` | Retrieve athlete profile |
| `PUT` | `/api/profile` | Update profile biometrics & macro targets |
| `POST` | `/api/profile/calculate` | Compute Mifflin-St Jeor BMR, TDEE & macro grams |
| `GET` | `/api/biometrics/weight` | Retrieve weight history and check-in timeline |
| `POST` | `/api/biometrics/weight` | Log check-in weight & physique entry |
| `GET` | `/api/biometrics/inbody` | List historical InBody scan telemetry |
| `POST` | `/api/biometrics/inbody` | Save verified InBody composition scan |
| `POST` | `/api/biometrics/adaptive-evaluate` | Compute adaptive caloric adjustments |
| `GET` | `/api/nutrition/foods` | Fetch complete food vault |
| `POST` | `/api/nutrition/foods` | Create custom staple food |
| `GET` | `/api/nutrition/set-meals` | Retrieve saved Set Meal combos |
| `POST` | `/api/nutrition/set-meals` | Save reusable Set Meal combo |
| `GET` | `/api/nutrition/logs/:date` | Get daily meal log & macro subtotals |
| `POST` | `/api/nutrition/logs/:date/water` | Update hydration log |
| `GET` | `/api/gym/exercises` | List exercises with YouTube cues |
| `POST` | `/api/gym/exercises` | Create custom exercise with video embed |
| `GET` | `/api/gym/routines` | Get routine workout splits |
| `POST` | `/api/gym/routines/starters` | Load standard Push/Pull/Legs templates |
| `GET` | `/api/gym/sessions` | Fetch workout session history |
| `POST` | `/api/gym/sessions` | Log completed workout session |
| `POST` | `/api/gym/calculate-1rm` | Calculate Epley & Brzycki 1RM + rep table |
| `POST` | `/api/ocr/inbody` | Parse InBody scan text and flag issues |
| `POST` | `/api/ocr/plan` | Parse PDF workout split and meal plan text |
| `POST` | `/api/sync` | Full local-first to cloud synchronization |
