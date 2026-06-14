import { Comment } from '../types/comment';
import { initialsForName } from '../utils/initials';

const rawComments = [
  {
    id: 'comment-1',
    targetType: 'spark' as const,
    targetId: 'spark-evergreen-brick-works',
    userId: 'profile-ray',
    userName: 'Raymond Zhang',
    body: 'Go early before the market gets busy.',
    createdAt: '2026-06-11T12:00:00.000Z'
  },
  {
    id: 'comment-2',
    targetType: 'spark' as const,
    targetId: 'spark-riverdale-park-east',
    userId: 'profile-ray',
    userName: 'Raymond Zhang',
    body: 'Best just before sunset.',
    createdAt: '2026-06-12T12:00:00.000Z'
  },
  {
    id: 'comment-3',
    targetType: 'list' as const,
    targetId: 'list-waterfront-reset-route',
    userId: 'profile-ray',
    userName: 'Raymond Zhang',
    body: 'Good route for a calm afternoon.',
    createdAt: '2026-06-13T12:00:00.000Z'
  }
];

export const sampleComments: Comment[] = rawComments.map((comment) => ({
  ...comment,
  userInitials: initialsForName(comment.userName)
}));
