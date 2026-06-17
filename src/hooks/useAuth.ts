import { useEffect, useState } from 'react';
import { authService } from '../services/authService';
import { profileService } from '../services/profileService';
import { Profile } from '../types/profile';

export function useAuth() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  async function load() {
      try {
        const { user } = await authService.getCurrentUser();
        setProfile(await profileService.getProfile(user?.id || 'local-user'));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load profile');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function logoutAndResetDemo() {
    await authService.logoutAndResetDemo();
    setProfile(null);
  }

  return { profile, setProfile, loading, error, logoutAndResetDemo };
}
