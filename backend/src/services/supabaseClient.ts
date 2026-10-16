import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseUrl !== 'https://your-project.supabase.co' && 
  supabaseServiceKey && 
  !supabaseServiceKey.startsWith('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...')
);

let client: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  try {
    client = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    console.log('✅ Supabase Client initialized successfully');
  } catch (error) {
    console.warn('⚠️ Failed to initialize Supabase client:', error);
  }
} else {
  console.log('ℹ️ Supabase credentials not detected; running in Local Memory / Fallback Mode');
}

export const getSupabase = (): SupabaseClient | null => client;
