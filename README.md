# NiuGymFree — Dual-Hemisphere Nutrition & Gym Platform

> **$0-cost, open-source, local-first and Supabase-synced performance system for elite nutrition tracking and progressive overload gym training.**

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Frontend](https://img.shields.io/badge/Frontend-React_18_%7C_Vite_%7C_TypeScript_%7C_Tailwind-sky.svg)](frontend/)
[![Backend](https://img.shields.io/badge/Backend-Express_%7C_Node.js_%7C_TypeScript-violet.svg)](backend/)
[![Database](https://img.shields.io/badge/Database-Supabase_%7C_PostgreSQL_15-emerald.svg)](backend/supabase/)
[![OCR Engine](https://img.shields.io/badge/OCR-pdfjs--dist_%7C_tesseract.js-amber.svg)](frontend/src/lib/)

---

## 🧭 Repository Structure

```
NiuGymFree/
├── frontend/               # React 18 + Vite + TypeScript + Tailwind SPA
│   ├── src/
│   │   ├── components/     # Glassmorphic UI bento views & interactive modals
│   │   ├── data/           # Pre-seeded foods, exercises, PPL splits
│   │   ├── lib/            # InBody OCR parser, PDF engine, adaptive TDEE
│   │   ├── services/       # Dual-Mode Storage Adapter (Local + Supabase)
│   │   └── types/          # Domain TypeScript schemas & interfaces
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
│
├── backend/                # Node.js + Express + TypeScript REST API
│   ├── src/
│   │   ├── controllers/    # Auth, biometrics, nutrition, gym, OCR, sync
│   │   ├── middleware/     # Auth token verification & error formatting
│   │   ├── routes/         # Centralized modular API routes (/api/*)
│   │   ├── services/       # Adaptive TDEE math, InBody diagnostic engine
│   │   └── server.ts       # Server bootstrap with Helmet, CORS, Rate Limit
│   ├── supabase/
│   │   └── migrations/     # Idempotent PostgreSQL DDL & RLS policies
│   └── package.json
│
├── docs/                   # Exhaustive project documentation
│   ├── ARCHITECTURE.md     # System design & cross-hemisphere workflows
│   ├── TECH_STACK.md       # Comprehensive technology stack details
│   ├── API_DOCUMENTATION.md# Full REST API endpoint reference
│   ├── API_KEYS_AND_ENVIRONMENT.md # Env configs, Supabase credentials guide
│   ├── DATABASE_SCHEMA.md  # Entity-relationship diagrams & security policies
│   └── GETTING_STARTED.md  # Developer setup guide
│
├── .github/
│   └── workflows/
│       └── supabase-keepalive.yml # Automated 5-day Supabase ping workflow
└── README.md
```

---

## 🌟 Core Highlights

### 1. Dual-Hemisphere Design
- Instant top-bar toggle between **🥗 Nutrition Side** and **🏋️ Gym Side** (`Cmd/Ctrl + Shift + M`).
- **Synchronized Date Scrubber**: One central scrubber simultaneously drives daily meal logs and active workout sessions.
- **Persistent Floating Rest Timer HUD**: Never lose track of rest countdowns while planning meals or reviewing biometrics.

### 2. Scientific Biometrics & Adaptive Kcal Engine
- **Exact Age-in-Days**: Calculates fractional chronological age ($\text{Days Old} / 365.2425$) fed directly into the **Mifflin-St Jeor equation**.
- **Bi-Weekly Check-In Velocity**: Dynamically adapts daily calorie targets ($\pm 150\text{ kcal}$) based on actual weight velocity against your cut/bulk targets.
- **InBody OCR Scanner & Diagnostic Gate**: Detects 9 body composition parameters from scans, verifies physiological sanity, and flags discrepancies for interactive user confirmation.

### 3. Strength Training & Video Biomechanics
- **Active Workout Set-by-Set Matrix**: Real-time **Epley 1RM formula** ($\text{Weight} \times (1 + \text{Reps} / 30)$) and automatic personal record (**🏆 PR**) badges.
- **YouTube Exercise Form Player**: Integrated privacy-enhanced embeds (`youtube-nocookie.com/embed/...`) with direct timestamp jump-to-execution and biomechanical setup cues.
- **Pre-Seeded Push/Pull/Legs Splits**: 1-click starter template loader.

### 4. $0-Cost Client-Side OCR Pipeline
- Client-side digital extraction via `pdfjs-dist` + `tesseract.js` Web Worker OCR.
- Heuristic regex parser extracts multi-day workout splits and meal plans with editable staging review.

### 5. Local-First & Supabase Cloud Sync
- Works 100% offline using `localStorage` + `IndexedDB` with zero cloud setup required.
- Effortlessly syncs to Supabase PostgreSQL when credentials are provided in `.env`.

---

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/mahmoud-abdalla-eg/NiuGymFree.git
cd NiuGymFree
```

### 2. Run Frontend
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173).

### 3. Run Backend (Optional)
```bash
cd ../backend
npm install
cp .env.example .env
npm run dev
```
Server runs on [http://localhost:5000](http://localhost:5000).

---

## 📚 Documentation

- [System Architecture](docs/ARCHITECTURE.md)
- [Tech Stack Details](docs/TECH_STACK.md)
- [REST API Documentation](docs/API_DOCUMENTATION.md)
- [Environment Variables & API Keys](docs/API_KEYS_AND_ENVIRONMENT.md)
- [Database Schema & Migrations](docs/DATABASE_SCHEMA.md)
- [Getting Started Guide](docs/GETTING_STARTED.md)

---

## 📄 License

MIT License. Open-source and free for all fitness enthusiasts and developers.
