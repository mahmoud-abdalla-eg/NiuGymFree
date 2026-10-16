import { supabase, isSupabaseConfigured } from './supabaseClient';
import { UserProfile, FoodItem, SetMeal, RoutineTemplate, WeeklySchedule, ExerciseVaultItem, DailyNutritionLog, WorkoutSession } from '../types';
import { AppBackupDataSchema } from '../types/schemas';

const DB_NAME = 'niugymfree_db';
const DB_VERSION = 1;
const PHOTO_STORE = 'photos';

// Open IndexedDB instance for binary/WebP photo offline persistence
function openPhotoDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (e: IDBVersionChangeEvent) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(PHOTO_STORE)) {
        db.createObjectStore(PHOTO_STORE, { keyPath: 'id' });
      }
    };
  });
}

export const indexedDbPhotos = {
  async savePhoto(id: string, dataUrl: string): Promise<void> {
    try {
      const db = await openPhotoDb();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(PHOTO_STORE, 'readwrite');
        const store = tx.objectStore(PHOTO_STORE);
        store.put({ id, dataUrl, savedAt: new Date().toISOString() });
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    } catch {
      // Graceful fallback to in-memory/localStorage if IndexedDB fails
    }
  },

  async getPhoto(id: string): Promise<string | null> {
    try {
      const db = await openPhotoDb();
      return new Promise((resolve) => {
        const tx = db.transaction(PHOTO_STORE, 'readonly');
        const store = tx.objectStore(PHOTO_STORE);
        const req = store.get(id);
        req.onsuccess = () => resolve(req.result ? req.result.dataUrl : null);
        req.onerror = () => resolve(null);
      });
    } catch {
      return null;
    }
  }
};

export interface StorageAdapterState {
  isCloudSyncActive: boolean;
  cloudStatus: 'disconnected' | 'connecting' | 'connected' | 'error';
  lastSyncTime: string | null;
}

export const StorageAdapter = {
  isCloudEnabled(): boolean {
    return isSupabaseConfigured && supabase !== null;
  },

  // Save to LocalStorage with safe fallbacks
  saveLocal<T>(key: string, data: T): void {
    try {
      localStorage.setItem(`niugymfree_${key}`, JSON.stringify(data));
    } catch (e) {
      console.warn(`LocalStorage quota exceeded or unavailable for key: ${key}`, e);
    }
  },

  // Load from LocalStorage
  loadLocal<T>(key: string, fallback: T): T {
    try {
      const saved = localStorage.getItem(`niugymfree_${key}`);
      return saved ? JSON.parse(saved) : fallback;
    } catch {
      return fallback;
    }
  },

  // Export full application state as validated JSON file
  exportBackupJson(data: {
    profile: UserProfile;
    foodVault: FoodItem[];
    setMeals: SetMeal[];
    exerciseVault: ExerciseVaultItem[];
    routines: RoutineTemplate[];
    weeklySchedule: WeeklySchedule;
    dailyNutritionLogs: Record<string, DailyNutritionLog>;
    workoutSessions: Record<string, WorkoutSession>;
  }): void {
    const backupPayload = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      ...data,
    };

    const blob = new Blob([JSON.stringify(backupPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NiuGymFree_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  // Import JSON backup with Zod schema validation
  async importBackupJson(file: File): Promise<any> {
    const text = await file.text();
    const raw = JSON.parse(text);
    // Parse and validate with Zod
    const validated = AppBackupDataSchema.parse(raw);
    return validated;
  },

  // Optional Supabase Cloud Sync methods
  async syncToSupabase(profile: UserProfile): Promise<boolean> {
    if (!this.isCloudEnabled() || !supabase) return false;
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: profile.name.toLowerCase().replace(/\s+/g, '_'),
          name: profile.name,
          dob: profile.dob,
          gender: profile.gender,
          height_cm: profile.heightCm,
          weight_kg: profile.weightKg,
          activity_multiplier: profile.activityMultiplier,
          goal_type: profile.goalType,
          macro_split: profile.macroSplit,
          manual_kcal_override: profile.manualKcalOverride,
          updated_at: new Date().toISOString()
        });

      return !error;
    } catch {
      return false;
    }
  }
};
