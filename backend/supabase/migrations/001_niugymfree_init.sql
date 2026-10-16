-- ============================================================================
-- NiuGymFree Database Migration: 001_niugymfree_init.sql
-- $0-Cost Dual-Hemisphere Nutrition & Gym Platform Schema with Row-Level Security
-- Idempotent initialization script for Supabase PostgreSQL
-- ============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE
create table if not exists public.profiles (
    id text primary key,
    user_id uuid references auth.users(id) on delete cascade,
    name text not null default 'Athlete',
    dob date not null default '2004-05-15',
    gender text not null check (gender in ('male', 'female')),
    height_cm numeric not null default 178,
    weight_kg numeric not null default 76.4,
    activity_multiplier numeric not null default 1.55,
    goal_type text not null default 'cut' check (goal_type in ('cut', 'maintain', 'lean_bulk')),
    macro_split jsonb not null default '{"p": 35, "c": 40, "f": 25}'::jsonb,
    include_gym_bonus_kcal boolean not null default true,
    manual_kcal_override numeric,
    check_in_interval_days integer not null default 14,
    last_check_in_date date not null default current_date,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- 2. WEIGHT LOGS (Bi-Weekly Check-Ins)
create table if not exists public.weight_logs (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) on delete cascade,
    date date not null default current_date,
    weight_kg numeric not null,
    applied_kcal integer not null,
    note text,
    photo_url text,
    created_at timestamptz not null default now()
);

-- 3. FOOD ITEMS (Staples & Custom Foods)
create table if not exists public.food_items (
    id text primary key,
    user_id uuid references auth.users(id) on delete cascade,
    name text not null,
    category text not null,
    base_amount numeric not null default 100,
    unit text not null default 'g',
    label text not null,
    calories numeric not null,
    protein numeric not null default 0,
    carbs numeric not null default 0,
    fat numeric not null default 0,
    emoji text not null default '🍽️',
    photo_url text,
    created_at timestamptz not null default now()
);

-- 4. MEAL PRESETS (Set Meals)
create table if not exists public.meal_presets (
    id text primary key,
    user_id uuid references auth.users(id) on delete cascade,
    name text not null,
    default_slot text not null default 'lunch',
    notes text,
    photo_type text default 'chicken_rice',
    photo_url text,
    items jsonb not null default '[]'::jsonb,
    created_at timestamptz not null default now()
);

-- 5. DAILY NUTRITION LOGS
create table if not exists public.daily_logs (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) on delete cascade,
    log_date date not null,
    water_ml integer not null default 0,
    meals jsonb not null default '{"breakfast":[],"lunch":[],"dinner":[],"snacks":[]}'::jsonb,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint unique_user_log_date unique (user_id, log_date)
);

-- 6. EXERCISES (Vault with Cues and YouTube Links)
create table if not exists public.exercises (
    id text primary key,
    user_id uuid references auth.users(id) on delete cascade,
    name text not null,
    muscle text not null,
    equipment text not null,
    default_rest integer not null default 90,
    prev_best text,
    pr_1rm numeric not null default 0,
    cue text,
    common_mistakes text[],
    form_cues text[],
    youtube_video_id text,
    video_start_sec integer default 0,
    custom_youtube_url text,
    created_at timestamptz not null default now()
);

-- 7. WORKOUT ROUTINES (Templates)
create table if not exists public.workout_routines (
    id text primary key,
    user_id uuid references auth.users(id) on delete cascade,
    name text not null,
    est_burn_kcal integer not null default 300,
    target_duration_min integer not null default 60,
    exercises jsonb not null default '[]'::jsonb,
    created_at timestamptz not null default now()
);

-- 8. WEEKLY SCHEDULES
create table if not exists public.weekly_schedules (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) on delete cascade unique,
    schedule jsonb not null default '{}'::jsonb,
    updated_at timestamptz not null default now()
);

-- 9. WORKOUT SESSIONS (Daily Gym Logs)
create table if not exists public.workout_sessions (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) on delete cascade,
    session_date date not null,
    routine_id text references public.workout_routines(id) on delete set null,
    title text not null,
    duration_sec integer not null default 0,
    pump_photo_url text,
    exercises jsonb not null default '[]'::jsonb,
    created_at timestamptz not null default now(),
    constraint unique_user_session_date unique (user_id, session_date)
);

-- 10. IMPORTED PLANS (OCR / PDF staging logs)
create table if not exists public.imported_plans (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) on delete cascade,
    file_name text not null,
    plan_type text not null,
    raw_text text,
    staged_payload jsonb not null,
    created_at timestamptz not null default now()
);

-- ============================================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

alter table public.profiles enable row level security;
alter table public.weight_logs enable row level security;
alter table public.food_items enable row level security;
alter table public.meal_presets enable row level security;
alter table public.daily_logs enable row level security;
alter table public.exercises enable row level security;
alter table public.workout_routines enable row level security;
alter table public.weekly_schedules enable row level security;
alter table public.workout_sessions enable row level security;
alter table public.imported_plans enable row level security;

-- Profiles: Authenticated users can read and modify their own row
create policy "Allow individual profile access" on public.profiles
    for all using (auth.uid() = user_id or user_id is null);

-- Weight Logs
create policy "Allow individual weight_logs access" on public.weight_logs
    for all using (auth.uid() = user_id or user_id is null);

-- Food Items
create policy "Allow individual food_items access" on public.food_items
    for all using (auth.uid() = user_id or user_id is null);

-- Meal Presets
create policy "Allow individual meal_presets access" on public.meal_presets
    for all using (auth.uid() = user_id or user_id is null);

-- Daily Nutrition Logs
create policy "Allow individual daily_logs access" on public.daily_logs
    for all using (auth.uid() = user_id or user_id is null);

-- Exercises
create policy "Allow individual exercises access" on public.exercises
    for all using (auth.uid() = user_id or user_id is null);

-- Workout Routines
create policy "Allow individual workout_routines access" on public.workout_routines
    for all using (auth.uid() = user_id or user_id is null);

-- Weekly Schedules
create policy "Allow individual weekly_schedules access" on public.weekly_schedules
    for all using (auth.uid() = user_id or user_id is null);

-- Workout Sessions
create policy "Allow individual workout_sessions access" on public.workout_sessions
    for all using (auth.uid() = user_id or user_id is null);

-- Imported Plans
create policy "Allow individual imported_plans access" on public.imported_plans
    for all using (auth.uid() = user_id or user_id is null);
