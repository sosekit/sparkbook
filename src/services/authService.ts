import { defaultProfile, profileService } from './profileService';
import { dataClient } from './dataClient';

export const authService = {
  async getCurrentUser() {
    if (!dataClient.supabase) return { user: { id: 'local-user', email: 'raymond@example.com' }, error: null };
    const { data, error } = await dataClient.supabase.auth.getUser();
    return { user: data.user, error };
  },
  async signUp(email: string, password: string) {
    if (!dataClient.supabase) {
      await profileService.updateProfile({ ...defaultProfile, userId: 'local-user', updatedAt: new Date().toISOString() });
      return { user: { id: 'local-user', email }, error: null };
    }
    const { data, error } = await dataClient.supabase.auth.signUp({ email, password });
    return { user: data.user, error };
  },
  async signIn(email: string, password: string) {
    if (!dataClient.supabase) return { user: { id: 'local-user', email }, error: null };
    const { data, error } = await dataClient.supabase.auth.signInWithPassword({ email, password });
    return { user: data.user, error };
  },
  async signOut() {
    if (!dataClient.supabase) return { error: null };
    return dataClient.supabase.auth.signOut();
  }
};
