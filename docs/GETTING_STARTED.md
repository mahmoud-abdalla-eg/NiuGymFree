# Getting Started with NiuGymFree

This guide covers setting up and running **NiuGymFree** locally on your workstation for development and testing.

---

## 🛠️ Prerequisites

- **Node.js**: v18.0.0 or higher (v20+ recommended).
- **npm** or **pnpm** or **yarn**.
- **Git** installed on your system.

---

## 🚀 Running the Project

### Option A: Running the Frontend Client Only ($0 Zero-Config)
The frontend functions 100% offline using `localStorage` and `IndexedDB` with zero backend or database required:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

Visit `http://localhost:5173` in your browser. You can immediately log meals, build splits, track sets, and test InBody OCR!

---

### Option B: Running the Full Stack (Frontend + Backend)

#### 1. Start the Backend API Service
In terminal 1:
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```
The backend API server boots up on `http://localhost:5000`.

#### 2. Start the Frontend Application
In terminal 2:
```bash
cd frontend
npm install
npm run dev
```
The frontend launches on `http://localhost:5173` and communicates with the backend on port `5000`.

---

## 🧪 Testing & Verification

- **TypeScript Typecheck & Build**:
  - Frontend: `npm run build` inside `frontend/`
  - Backend: `npm run build` inside `backend/`
- **Healthcheck**:
  - Open `http://localhost:5000/api/health` in your browser or run:
  ```bash
  curl http://localhost:5000/api/health
  ```
