import { useCallback, useEffect, useState } from 'react';
import { profileService } from '../services/profileService';
import { Profile } from '../types/profile';

export function useProfile(userId = 'local-user') {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setProfile(await profileService.getProfile(userId));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load profile');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function updateProfile(profileInput: Profile) {
    const updated = await profileService.updateProfile(profileInput);
    setProfile(updated);
    return updated;
  }

  return { profile, loading, error, refresh, updateProfile };
}
