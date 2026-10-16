# NiuGymFree Tech Stack Specification

NiuGymFree is built on a **$0-cost, modern open-source full-stack architecture** designed for local-first responsiveness, privacy, and optional cloud synchronization.

---

## 🎨 Frontend Stack

| Technology | Purpose | Version |
|---|---|---|
| **React** | Component-driven declarative UI library | `^18.3.1` |
| **Vite** | Next-generation ultra-fast frontend build tool and dev server | `^5.4.2` |
| **TypeScript** | Strict compile-time type safety across all domain models | `^5.5.3` |
| **Tailwind CSS** | Utility-first CSS styling for dark-slate glassmorphic aesthetics | `^3.4.1` |
| **Lucide React** | Consistent, modern iconography suite | `^0.344.0` |
| **Zod** | Runtime schema declaration and validation | `^3.24.2` |

---

## ⚙️ Backend Stack

| Technology | Purpose | Version |
|---|---|---|
| **Node.js** | JavaScript runtime environment | `v20+ LTS` |
| **Express.js** | Minimalist web application framework for REST APIs | `^4.21.2` |
| **TypeScript** | Typed backend runtime with `NodeNext` ESM module resolution | `^5.7.3` |
| **Helmet** | HTTP response header security | `^8.0.0` |
| **CORS** | Cross-Origin Resource Sharing middleware | `^2.8.5` |
| **Morgan** | HTTP request logger | `^1.10.0` |
| **Express Rate Limit** | IP-based request throttling against abuse | `^7.5.0` |
| **tsx** | Ultra-fast TypeScript execution and watch mode for dev | `^4.19.3` |

---

## 📄 OCR & Computer Vision Pipeline ($0 Cost / Client-Side)

1. **`pdfjs-dist` (`^3.11.174`)**:
   - Renders digital PDF pages and extracts text fragments with exact spatial layout coordinates ($X, Y$).
   - Groups text lines to preserve workout split tables and multi-column meal plans.
2. **`tesseract.js` (`^5.1.1`)**:
   - Web Worker-based optical character recognition running entirely on the user's machine.
   - Fallback engine when digital text is absent (e.g. scanned gym sheets or mobile camera photos of InBody printouts).
   - Canvas-based image pre-processing (grayscale thresholding, contrast enhancement) before recognition.

---

## 💾 Storage & Database Architecture

- **Local-First Tier**:
  - `localStorage`: Fast synchronous cache for athlete profile, active workout sets, day scrubber selection, and UI preferences.
  - `IndexedDB`: Asynchronous binary storage for client-side compressed WebP meal thumbnails and physique progress photos.
- **Cloud Tier (Optional Supabase Sync)**:
  - **PostgreSQL 15+**: Cloud relational database hosted on Supabase free tier.
  - **Row Level Security (RLS)**: Enforces strict data isolation where athletes can only read and write their own records (`auth.uid() = user_id`).
  - **Supabase Storage**: S3-compatible cloud object storage for physique photos and meal photos.
  - **Supabase Auth**: Email/password authentication, JWT verification, and guest session handling.

---

## 🎥 Media & Exercise Video System

- **Privacy-Enhanced YouTube IFrame Embeds**:
  - Routed through `https://www.youtube-nocookie.com/embed/{id}`.
  - Timestamp deep-linking (`start={seconds}`) jumping straight to exercise execution.
  - Inline overlay modal allowing athletes to review biomechanical cues while resting without interrupting active workout set timers.
