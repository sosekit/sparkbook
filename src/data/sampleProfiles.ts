import { Profile } from '../types/profile';

const now = '2026-06-14T10:00:00.000Z';

export const sampleProfiles: Profile[] = [
  {
    id: 'profile-ray',
    userId: 'local-user',
    username: 'raymond',
    displayName: 'Raymond Zhang',
    bio: 'Saving meaningful places around Toronto.',
    avatarType: 'initials',
    avatarInitials: 'RZ',
    avatarColor: '#2E5BAD',
    createdAt: now,
    updatedAt: now
  }
];
