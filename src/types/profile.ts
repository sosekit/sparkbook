export type AvatarType = 'initials' | 'photo';

export type Profile = {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  bio?: string;
  avatarType: AvatarType;
  avatarInitials: string;
  avatarColor: string;
  profilePhotoUrl?: string;
  interests?: string[];
  onboardingCompleted?: boolean;
  createdAt: string;
  updatedAt: string;
};
