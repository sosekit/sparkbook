import { DEMO_MODE } from '../config/demoMode';
import { dataMode, hasSupabaseCredentials, supabase } from './supabaseClient';

export type DataMode = 'local' | 'supabase';

export const dataClient = {
  mode: dataMode as DataMode,
  supabase: DEMO_MODE ? null : supabase,
  hasSupabaseCredentials: DEMO_MODE ? false : hasSupabaseCredentials,
  isLocal: dataMode === 'local',
  isSupabase: !DEMO_MODE && dataMode === 'supabase' && Boolean(supabase)
};
