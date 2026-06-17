import { Profile } from '../types/profile';

const now = '2026-06-14T10:00:00.000Z';

export const sampleProfiles: Profile[] = [
  {
    id: 'profile-ray',
    userId: 'local-user',
    username: 'ray',
    displayName: 'Ray',
    bio: 'Toronto sparks, food walks, and places worth revisiting.',
    avatarType: 'initials',
    avatarInitials: 'RZ',
    avatarColor: '#2E5BAD',
    interests: ['food', 'outdoors', 'art'],
    onboardingCompleted: false,
    createdAt: now,
    updatedAt: now
  }
];
