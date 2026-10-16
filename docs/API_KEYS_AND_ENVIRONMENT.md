# API Keys & Environment Configuration Guide

This document details all environment variables, API keys, credentials, and secrets required to operate **NiuGymFree** across development, staging, and production.

---

## 🔑 Quick Summary of Required vs Optional Keys

| Key | Scope | Default / Fallback | Required? |
|---|---|---|---|
| `VITE_SUPABASE_URL` | Frontend | `""` (runs local-first) | Optional |
| `VITE_SUPABASE_ANON_KEY` | Frontend | `""` (runs local-first) | Optional |
| `VITE_API_URL` | Frontend | `http://localhost:5000/api` | Optional |
| `PORT` | Backend | `5000` | Optional |
| `NODE_ENV` | Backend | `development` | Optional |
| `CORS_ORIGIN` | Backend | `http://localhost:5173` | Optional |
| `SUPABASE_URL` | Backend | In-memory fallback | Optional |
| `SUPABASE_ANON_KEY` | Backend | In-memory fallback | Optional |
| `SUPABASE_SERVICE_ROLE_KEY` | Backend | In-memory fallback | Optional |
| `JWT_SECRET` | Backend | Built-in dev secret | Optional |

> **Note**: NiuGymFree is built **$0-cost and zero-configuration by default**. If no Supabase credentials are provided, both the frontend and backend automatically run in local mode with zero crashes.

---

## 🌐 1. Frontend Configuration (`frontend/.env`)

Create a `.env` file in the `frontend/` directory based on `frontend/.env.example`:

```env
# URL of your backend REST service (defaults to localhost:5000 in dev)
VITE_API_URL=http://localhost:5000/api

# Supabase Project URL (found in Supabase Dashboard -> Project Settings -> API)
VITE_SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxx.supabase.co

# Supabase Anonymous Public Key (safe to expose in client-side bundles)
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxxxxxxxxxxxxxxxxx.yyyyyyyyyyyyyyyyyyyy
```

---

## ⚙️ 2. Backend Configuration (`backend/.env`)

Create a `.env` file in the `backend/` directory based on `backend/.env.example`:

```env
# Server Port
PORT=5000

# Environment Mode: 'development' | 'production' | 'test'
NODE_ENV=development

# Allowed CORS Origin for frontend client
CORS_ORIGIN=http://localhost:5173

# Supabase Cloud Database Configuration
SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
# Supabase Service Role Key (NEVER expose to frontend; used for server-side operations)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Local Session JWT Secret (Used for offline / guest tokens)
JWT_SECRET=super-secret-niugymfree-jwt-key-change-in-production
```

---

## 🛠️ 3. How to Obtain Supabase Credentials (Free Tier)

1. Sign up or log into [Supabase](https://supabase.com/).
2. Click **"New Project"**, select an organization, name it `niugymfree`, and set a database password.
3. Once the database is provisioned (approx. 2 minutes), go to **Project Settings** (gear icon on bottom left) $\rightarrow$ **API**.
4. Copy the following keys:
   - **Project URL**: Use for `SUPABASE_URL` and `VITE_SUPABASE_URL`.
   - **anon / public key**: Use for `SUPABASE_ANON_KEY` and `VITE_SUPABASE_ANON_KEY`.
   - **service_role key**: Use for `SUPABASE_SERVICE_ROLE_KEY` (Backend only).
5. Run the migration script located at `backend/supabase/migrations/001_niugymfree_init.sql` in the **Supabase SQL Editor** to create all tables and RLS policies.

---

## 🤖 4. GitHub Actions Keep-Alive Secret Configuration

Supabase automatically pauses free-tier projects if there are zero queries for 7 consecutive days. NiuGymFree includes a automated GitHub Action workflow (`.github/workflows/supabase-keepalive.yml`) that pings your Supabase database every 5 days to keep it permanently active.

To enable this:
1. In your GitHub repository (`https://github.com/mahmoud-abdalla-eg/NiuGymFree`), go to **Settings** $\rightarrow$ **Secrets and variables** $\rightarrow$ **Actions**.
2. Click **"New repository secret"** and add:
   - Name: `SUPABASE_URL` | Value: Your project URL (e.g. `https://xxxx.supabase.co`).
   - Name: `SUPABASE_ANON_KEY` | Value: Your public anonymous key.
3. The workflow will run automatically every 5 days at 00:00 UTC.
