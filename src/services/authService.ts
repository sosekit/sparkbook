import { defaultProfile, profileService } from './profileService';
import { dataClient } from './dataClient';
import { storageService } from './storageService';
import { logoutAndResetDemo } from './demoDataService';

type Provider = 'apple' | 'google' | 'email' | 'demo';

const localUser = { id: 'local-user', email: 'raymond@example.com' };

async function ensureLocalUser(provider: Provider = 'demo') {
  const user = { ...localUser, provider };
  await storageService.saveLocalAuthUser(user);
  await profileService.updateProfile({
    ...defaultProfile,
    userId: user.id,
    updatedAt: new Date().toISOString()
  });
  return user;
}

export const authService = {
  async getCurrentUser() {
    if (!dataClient.supabase) return { user: await storageService.getLocalAuthUser(), error: null };
    const { data, error } = await dataClient.supabase.auth.getUser();
    return { user: data.user, error };
  },
  async continueAsDemoUser() {
    const user = await ensureLocalUser('demo');
    return { user, error: null };
  },
  async signInWithProvider(provider: Exclude<Provider, 'email' | 'demo'>) {
    if (!dataClient.supabase) {
      const user = await ensureLocalUser(provider);
      return { user, error: null, fallback: true };
    }
    const { data, error } = await dataClient.supabase.auth.signInWithOAuth({ provider });
    if (error) {
      const user = await ensureLocalUser(provider);
      return { user, error: null, fallback: true };
    }
    return { user: data, error: null, fallback: false };
  },
  async signUp(email: string, password: string) {
    if (!dataClient.supabase) {
      const user = await ensureLocalUser('email');
      return { user: { ...user, email }, error: null };
    }
    const { data, error } = await dataClient.supabase.auth.signUp({ email, password });
    return { user: data.user, error };
  },
  async signIn(email: string, password: string) {
    if (!dataClient.supabase) {
      const user = await ensureLocalUser('email');
      return { user: { ...user, email }, error: null };
    }
    const { data, error } = await dataClient.supabase.auth.signInWithPassword({ email, password });
    return { user: data.user, error };
  },
  async signOut() {
    if (!dataClient.supabase) {
      await storageService.clearLocalAuthUser();
      return { error: null };
    }
    return dataClient.supabase.auth.signOut();
  },
  async logoutAndResetDemo() {
    if (dataClient.supabase) {
      await dataClient.supabase.auth.signOut();
      await storageService.resetOnboarding();
      return { error: null };
    }
    await logoutAndResetDemo();
    return { error: null };
  }
};
