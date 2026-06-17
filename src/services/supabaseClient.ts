import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { DEMO_MODE } from '../config/demoMode';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';
const requestedDataMode = process.env.EXPO_PUBLIC_DATA_MODE || '';

export const hasSupabaseCredentials = Boolean(supabaseUrl && supabaseAnonKey);
export const dataMode = !DEMO_MODE && requestedDataMode === 'supabase' && hasSupabaseCredentials
  ? 'supabase'
  : 'local';

if (!DEMO_MODE && requestedDataMode === 'supabase' && !hasSupabaseCredentials) {
  console.warn('sparks: EXPO_PUBLIC_DATA_MODE=supabase was requested, but Supabase credentials are missing. Falling back to local preview mode.');
}

export const supabase = !DEMO_MODE && hasSupabaseCredentials
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false
      }
    })
  : null;
