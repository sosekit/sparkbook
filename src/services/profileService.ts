import { Profile } from '../types/profile';
import { sampleProfiles } from '../data/sampleProfiles';
import { localStore } from '../utils/storage';
import { dataClient } from './dataClient';

export const defaultProfile: Profile = sampleProfiles[0];

export const profileService = {
  async getProfile(userId = 'local-user') {
    if (dataClient.isSupabase && dataClient.supabase) {
      const { data, error } = await dataClient.supabase.from('profiles').select('*').eq('user_id', userId).maybeSingle();
      if (!error && data) {
        return {
          id: data.id,
          userId: data.user_id,
          username: data.username,
          displayName: data.display_name,
          bio: data.bio || undefined,
          avatarType: data.profile_photo_url ? 'photo' : 'initials',
          avatarInitials: data.avatar_initials,
          avatarColor: data.avatar_color,
          profilePhotoUrl: data.profile_photo_url || undefined,
          createdAt: data.created_at,
          updatedAt: data.updated_at
        } as Profile;
      }
    }
    return localStore.loadProfile(defaultProfile);
  },
  async getProfileById(profileId: string) {
    if (profileId === defaultProfile.id) return localStore.loadProfile(defaultProfile);
    if (dataClient.isSupabase && dataClient.supabase) {
      const { data, error } = await dataClient.supabase.from('profiles').select('*').eq('id', profileId).maybeSingle();
      if (!error && data) return fromSupabaseProfile(data);
    }
    return sampleProfiles.find((profile) => profile.id === profileId) || null;
  },
  async getProfiles() {
    const localProfile = await localStore.loadProfile(defaultProfile);
    return [localProfile, ...sampleProfiles.filter((profile) => profile.id !== localProfile.id)];
  },
  updateProfile: async (profile: Profile) => {
    const updated = { ...profile, updatedAt: new Date().toISOString() };
    if (dataClient.isSupabase && dataClient.supabase) {
      await dataClient.supabase.from('profiles').upsert({
        id: updated.id,
        user_id: updated.userId,
        username: updated.username,
        display_name: updated.displayName,
        bio: updated.bio,
        avatar_initials: updated.avatarInitials,
        avatar_color: updated.avatarColor,
        profile_photo_url: updated.profilePhotoUrl,
        updated_at: updated.updatedAt
      });
    }
    await localStore.saveProfile(updated);
    return updated;
  }
};

function fromSupabaseProfile(data: any): Profile {
  return {
    id: data.id,
    userId: data.user_id,
    username: data.username,
    displayName: data.display_name,
    bio: data.bio || undefined,
    avatarType: data.profile_photo_url ? 'photo' : 'initials',
    avatarInitials: data.avatar_initials,
    avatarColor: data.avatar_color,
    profilePhotoUrl: data.profile_photo_url || undefined,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}
