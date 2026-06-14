export type CommentTargetType = 'spark' | 'list';

export type Comment = {
  id: string;
  targetType: CommentTargetType;
  targetId: string;
  userId: string;
  userName: string;
  userInitials: string;
  body: string;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
};
