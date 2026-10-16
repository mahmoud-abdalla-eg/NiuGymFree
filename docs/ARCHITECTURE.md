# System Architecture & Engineering Principles

NiuGymFree is engineered around a **Dual-Hemisphere, Local-First, and Cloud-Synchronized** paradigm designed for maximum responsiveness, privacy, and long-term data resilience.

---

## 🧭 The Dual-Hemisphere Paradigm

Traditional fitness software fractures nutrition tracking and strength training into disparate applications or disjointed silos. NiuGymFree unifies them into two distinct operational hemispheres anchored by a shared core:

```mermaid
flowchart TD
    Core[Shared Core Engine: Auth, Biometrics, Calendar, Storage Adapter]
    
    subgraph Nutrition_Side [🥗 Nutrition Hemisphere]
        N1[Daily Macro Tracker & Bento Rings]
        N2[Meal Studio & Reusable Set Meals]
        N3[Biometrics, Age-in-Days & Adaptive Coach]
        N4[Food Vault & Custom Recipes]
    end
    
    subgraph Gym_Side [🏋️ Gym Hemisphere]
        G1[Active Workout & Live Set Matrix]
        G2[Routine Split Builder & PPL Starters]
        G3[Exercise Vault & YouTube Video Form Cues]
        G4[Strength Analytics & Epley 1RM Tracker]
    end

    Core --> Nutrition_Side
    Core --> Gym_Side
    Nutrition_Side <-->|Top-Bar Switcher Cmd/Ctrl+Shift+M| Gym_Side
```

### Persistent Cross-Hemisphere HUD
When a rest timer or workout is active in the Gym hemisphere and the athlete switches to the Nutrition hemisphere, the **Floating Rest Timer HUD** automatically docks to the bottom-right, allowing continuous rest interval tracking without having to stay on the workout screen.

---

## 🔄 Dual-Tier Storage Architecture

```mermaid
sequenceDiagram
    autonumber
    actor Athlete as Athlete (Browser)
    participant ClientStore as Local Storage & IndexedDB
    participant Adapter as StorageAdapter (Dual-Mode)
    participant Cloud as Supabase / Express Backend

    Athlete->>Adapter: Perform Action (e.g. Log Set / Check-in)
    Adapter->>ClientStore: Instantly persist (0ms latency, 100% offline)
    
    alt Supabase Credentials Present & Online
        Adapter->>Cloud: Background asynchronous sync
        Cloud-->>Adapter: 200 OK (Cloud Updated)
    else Offline or Zero-Config Dev
        Adapter-->>ClientStore: Queue sync or maintain local state
    end
    
    Adapter-->>Athlete: UI reflects updated state immediately
```

---

## 🔍 InBody OCR Detection & Interactive Verification Gate

```mermaid
flowchart TD
    Upload[User uploads InBody Scan Photo / PDF] --> PreProcess[Canvas Grayscale Thresholding & Contrast]
    PreProcess --> OCR[Tesseract.js Web Worker Recognition]
    OCR --> Parser[InBody Heuristic Regex Parser]
    
    Parser --> HealthCheck{Diagnostic Validation Check}
    
    HealthCheck -->|High Confidence & Biometrics Valid| DirectImport[Directly Populate InBody Scan & Profile]
    HealthCheck -->|Confidence < 65% OR Missing Fields OR Muscle > Weight| VerificationGate[Interactive Verification Gate Modal]
    
    VerificationGate --> UserReview[User Inspects Raw OCR & Corrects Highlighted Badges]
    UserReview --> Confirm[Confirm & Sync to Biometrics Center]
```
