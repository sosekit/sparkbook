import { Profile } from '../types/profile';

const now = '2026-06-01T00:00:00.000Z';

export const sampleProfiles: Profile[] = [
  {
    id: 'profile-ray',
    userId: 'local-user',
    username: 'raymond',
    displayName: 'Raymond Zhang',
    bio: 'Saving sparks around Toronto.',
    avatarType: 'initials',
    avatarInitials: 'RZ',
    avatarColor: '#2E5BAD',
    createdAt: now,
    updatedAt: now
  },
  {
    id: 'profile-natalie',
    userId: 'profile-natalie',
    username: 'natalier',
    displayName: 'Natalie R.',
    bio: 'Weekend routes, quiet views, and places worth revisiting.',
    avatarType: 'initials',
    avatarInitials: 'NR',
    avatarColor: '#7BA3E0',
    createdAt: now,
    updatedAt: now
  },
  {
    id: 'profile-maya',
    userId: 'profile-maya',
    username: 'mayac',
    displayName: 'Maya C.',
    bio: 'Collecting calm city breaks and small food stops.',
    avatarType: 'initials',
    avatarInitials: 'MC',
    avatarColor: '#4E6585',
    createdAt: now,
    updatedAt: now
  },
  {
    id: 'profile-evan',
    userId: 'profile-evan',
    username: 'evanl',
    displayName: 'Evan L.',
    bio: 'Coffee, art walks, skyline views, and practical city routes.',
    avatarType: 'initials',
    avatarInitials: 'EL',
    avatarColor: '#0F1A2E',
    createdAt: now,
    updatedAt: now
  }
];
