import { useCallback, useEffect, useState } from 'react';
import { followService } from '../services/followService';

export function useFollows() {
  const [following, setFollowing] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    setFollowing(await followService.fetchFollowing());
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function toggleFollow(profileId: string) {
    setFollowing(await followService.toggle(profileId));
  }

  return {
    following,
    loading,
    refresh,
    toggleFollow,
    isFollowing: (profileId: string) => following.includes(profileId)
  };
}
