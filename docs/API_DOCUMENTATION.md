# NiuGymFree REST API Specification

Comprehensive documentation for all endpoints in the NiuGymFree Backend Service (`/api/*`).

---

## 🔒 Authentication & Headers

Protected routes accept standard Bearer tokens in the `Authorization` header:

```http
Authorization: Bearer <supabase_jwt_or_guest_token>
Content-Type: application/json
```

If no token is supplied, requests automatically default to an anonymous guest user scope with local fallback.

---

## 🚀 1. Authentication Endpoints (`/api/auth`)

### `POST /api/auth/signup`
Creates a new athlete account in Supabase (or local fallback).

**Request Body:**
```json
{
  "email": "athlete@example.com",
  "password": "SecurePassword123!",
  "name": "Alex"
}
```

**Response (`201 Created`):**
```json
{
  "success": true,
  "user": { "id": "uuid", "email": "athlete@example.com" },
  "session": { "access_token": "jwt..." }
}
```

### `POST /api/auth/signin`
Logs in an athlete and issues a session token.

**Request Body:**
```json
{
  "email": "athlete@example.com",
  "password": "SecurePassword123!"
}
```

### `POST /api/auth/guest`
Instantly generates a frictionless guest session without requiring credentials.

**Response (`200 OK`):**
```json
{
  "success": true,
  "user": {
    "id": "guest_1729000000_abc123",
    "name": "Guest Athlete",
    "isGuest": true,
    "onboardingCompleted": false
  },
  "token": "guest_1729000000_abc123"
}
```

---

## 👤 2. Athlete Profile Endpoints (`/api/profile`)

### `GET /api/profile`
Fetches the current user's athlete profile, target calories, macro splits, and biometrics.

### `PUT /api/profile`
Updates profile biometrics, goal, or target calories.

**Request Body (Partial or Full):**
```json
{
  "weightKg": 74.8,
  "heightCm": 178,
  "goal": "cut",
  "targetKcal": 2100,
  "macroSplit": { "proteinPct": 35, "carbsPct": 40, "fatPct": 25 }
}
```

### `POST /api/profile/calculate`
Calculates Mifflin-St Jeor BMR, TDEE, exact chronological age in days, and target macros in grams without persisting changes.

**Request Body:**
```json
{
  "weightKg": 75,
  "heightCm": 178,
  "dob": "2001-05-15",
  "sex": "male",
  "activityLevel": "moderate",
  "goal": "cut"
}
```

**Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "bmr": 1716,
    "tdee": 2660,
    "targetKcal": 2160,
    "daysOld": 9285,
    "exactYears": 25.42,
    "macros": {
      "proteinGrams": 189,
      "carbsGrams": 216,
      "fatGrams": 60
    }
  }
}
```

---

## ⚖️ 3. Biometrics & Check-Ins (`/api/biometrics`)

### `GET /api/biometrics/weight`
Returns weight check-in history sorted by date descending.

### `POST /api/biometrics/weight`
Logs a new weight check-in with optional physique photo and body composition metrics.

### `GET /api/biometrics/inbody`
Returns historical InBody scan telemetry records.

### `POST /api/biometrics/inbody`
Stores an InBody scan record.

### `POST /api/biometrics/adaptive-evaluate`
Evaluates weight change rate over check-in cadence and calculates adaptive caloric adjustments.

**Request Body:**
```json
{
  "previousWeightKg": 76.5,
  "currentWeightKg": 75.0,
  "daysElapsed": 14,
  "goal": "cut",
  "currentTargetKcal": 2150
}
```

---

## 🥗 4. Nutrition Endpoints (`/api/nutrition`)

### `GET /api/nutrition/foods`
Retrieves all staple foods in the food vault plus user's custom foods.

### `POST /api/nutrition/foods`
Creates a custom food item with custom macro profile.

### `GET /api/nutrition/set-meals`
Lists saved reusable Set Meal combos.

### `POST /api/nutrition/set-meals`
Saves or updates a Set Meal combo.

### `GET /api/nutrition/logs/:date`
Retrieves meal entries for Breakfast, Lunch, Dinner, Snacks, and water intake for a specific date (`YYYY-MM-DD`).

### `POST /api/nutrition/logs/:date/water`
Logs water hydration increment in milliliters (`amountMl: 250`).

---

## 🏋️ 5. Gym Endpoints (`/api/gym`)

### `GET /api/gym/exercises`
Returns all 45+ exercises complete with YouTube video IDs, start timestamps, primary/secondary muscles, and biomechanical setup cues.

### `POST /api/gym/exercises`
Creates a custom exercise with custom YouTube demonstration URL.

### `GET /api/gym/routines`
Returns workout routine templates.

### `POST /api/gym/routines/starters`
Loads standard Push/Pull/Legs starter split routines.

### `GET /api/gym/sessions`
Returns history of logged workout sessions.

### `POST /api/gym/sessions`
Logs a completed workout session with set-by-set weight, reps, RPE, and total tonnage lifted.

### `POST /api/gym/calculate-1rm`
Computes 1-Rep Max using the Epley and Brzycki equations, plus percentage load breakdowns ($70\% - 100\%$).

---

## 🔍 6. OCR & Plan Extraction Endpoints (`/api/ocr`)

### `POST /api/ocr/inbody`
Parses raw OCR text from an InBody scan, extracts 9 body composition parameters, and flags potential anomalies.

**Request Body:**
```json
{
  "rawText": "InBody 770\nWeight: 75.0kg\nSkeletal Muscle Mass: 36.4kg\nPercent Body Fat: 14.2%\nBMI: 23.7\nBMR: 1720 kcal\nTotal Body Water: 47.1 L\nVisceral Fat Level: 4"
}
```

**Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "parsed": {
      "weightKg": 75.0,
      "skeletalMuscleMassKg": 36.4,
      "bodyFatPercent": 14.2,
      "bmi": 23.7,
      "bmrKcal": 1720,
      "totalBodyWaterL": 47.1,
      "visceralFatLevel": 4
    },
    "hasIssues": false,
    "issues": []
  }
}
```

### `POST /api/ocr/plan`
Parses raw OCR text of a coach's PDF workout or meal plan into structured days, splits, exercises, sets, and rep ranges.

---

## 🔄 7. Full Synchronization (`/api/sync`)

### `POST /api/sync`
Performs bidirectional batch synchronization between client-side offline storage and the backend/Supabase database.
