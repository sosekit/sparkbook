import { dataMode, hasSupabaseCredentials, supabase } from './supabaseClient';

export type DataMode = 'local' | 'supabase';

export const dataClient = {
  mode: dataMode as DataMode,
  supabase,
  hasSupabaseCredentials,
  isLocal: dataMode === 'local',
  isSupabase: dataMode === 'supabase' && Boolean(supabase)
};
