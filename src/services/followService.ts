import { localStore } from '../utils/storage';
import { dataClient } from './dataClient';

export const followService = {
  async fetchFollowing() {
    if (dataClient.supabase) {
      const { data, error } = await dataClient.supabase.from('follows').select('following_id');
      if (!error && data) return data.map((item) => item.following_id as string);
    }
    return localStore.loadFollows(['profile-natalie']);
  },

  async follow(profileId: string) {
    const current = await this.fetchFollowing();
    const next = current.includes(profileId) ? current : [profileId, ...current];
    await localStore.saveFollows(next);
    if (dataClient.supabase) {
      await dataClient.supabase.from('follows').upsert({ follower_id: 'profile-ray', following_id: profileId });
    }
    return next;
  },

  async unfollow(profileId: string) {
    const current = await this.fetchFollowing();
    const next = current.filter((id) => id !== profileId);
    await localStore.saveFollows(next);
    if (dataClient.supabase) {
      await dataClient.supabase.from('follows').delete().eq('following_id', profileId);
    }
    return next;
  },

  async toggle(profileId: string) {
    const current = await this.fetchFollowing();
    return current.includes(profileId) ? this.unfollow(profileId) : this.follow(profileId);
  }
};
