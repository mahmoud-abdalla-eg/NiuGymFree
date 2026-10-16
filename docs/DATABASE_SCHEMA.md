# Database Schema & Data Models

NiuGymFree uses a relational PostgreSQL schema deployed on Supabase with Row Level Security (RLS) enabled on all tables.

---

## 📊 Entity Relationship Diagram

```mermaid
erDiagram
    PROFILES ||--o{ WEIGHT_HISTORY : "tracks"
    PROFILES ||--o{ DAILY_LOGS : "records"
    PROFILES ||--o{ WORKOUT_SESSIONS : "performs"
    PROFILES ||--o{ WORKOUT_ROUTINES : "authors"
    PROFILES ||--o{ SET_MEALS : "creates"
    PROFILES ||--o{ INBODY_SCANS : "logs"

    PROFILES {
        uuid id PK
        text name
        text dob
        text sex
        numeric height_cm
        numeric weight_kg
        text activity_level
        text goal
        integer target_kcal
        jsonb macro_split
        integer training_day_calorie_bonus
        integer check_in_cadence_days
        timestamp created_at
        timestamp updated_at
    }

    WEIGHT_HISTORY {
        text id PK
        uuid user_id FK
        date date
        numeric weight_kg
        text photo_url
        text notes
        numeric skeletal_muscle_mass_kg
        numeric body_fat_percent
        numeric bmi
        integer bmr_kcal
    }

    INBODY_SCANS {
        text id PK
        uuid user_id FK
        date scan_date
        text raw_ocr_text
        numeric weight_kg
        numeric skeletal_muscle_mass_kg
        numeric body_fat_mass_kg
        numeric body_fat_percent
        numeric bmi
        integer bmr_kcal
        numeric total_body_water_l
        integer visceral_fat_level
        integer inbody_score
        boolean has_issues
    }

    FOODS {
        text id PK
        uuid user_id FK
        text name
        text category
        text unit
        text label
        numeric calories
        numeric protein
        numeric carbs
        numeric fat
        text emoji
        boolean is_custom
    }

    SET_MEALS {
        text id PK
        uuid user_id FK
        text name
        text default_slot
        text notes
        text photo_type
        jsonb items
    }

    WORKOUT_ROUTINES {
        text id PK
        uuid user_id FK
        text name
        integer target_days_per_week
        jsonb exercises
    }

    WORKOUT_SESSIONS {
        text id PK
        uuid user_id FK
        date date
        text routine_name
        timestamp start_time
        timestamp end_time
        integer duration_sec
        jsonb exercises
        numeric total_tonnage_kg
    }
```

---

## 🔒 Row Level Security (RLS) Policies

All tables enforce tenant isolation where authenticated users can only query or mutate rows where `user_id = auth.uid()`:

```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view and edit own profile"
  ON profiles FOR ALL
  USING (auth.uid() = id);

ALTER TABLE weight_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own weight entries"
  ON weight_history FOR ALL
  USING (auth.uid() = user_id);

ALTER TABLE foods ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view public foods or manage own custom foods"
  ON foods FOR ALL
  USING (is_custom = false OR auth.uid() = user_id);
```

The idempotent SQL migration script is located at [`backend/supabase/migrations/001_niugymfree_init.sql`](../backend/supabase/migrations/001_niugymfree_init.sql).
