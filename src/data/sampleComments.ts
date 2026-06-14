import { Comment } from '../types/comment';
import { initialsForName } from '../utils/initials';

const rawComments = [
  { id: 'comment-1', targetType: 'spark' as const, targetId: 'spark-evergreen-brick-works', userId: 'profile-maya', userName: 'Maya C.', body: 'The Saturday market is worth going early for.', createdAt: '2026-06-01T12:00:00.000Z' },
  { id: 'comment-2', targetType: 'spark' as const, targetId: 'spark-riverdale-park-east', userId: 'profile-natalie', userName: 'Natalie R.', body: 'Sunset here is an easy win with friends.', createdAt: '2026-06-02T12:00:00.000Z' },
  { id: 'comment-3', targetType: 'spark' as const, targetId: 'spark-toronto-reference-library', userId: 'profile-evan', userName: 'Evan L.', body: 'The upper floors are quieter during exam season.', createdAt: '2026-06-03T12:00:00.000Z' },
  { id: 'comment-4', targetType: 'spark' as const, targetId: 'spark-graffiti-alley', userId: 'profile-ray', userName: 'Ray Z.', body: 'Best as a short walk before dinner nearby.', createdAt: '2026-06-04T12:00:00.000Z' },
  { id: 'comment-5', targetType: 'list' as const, targetId: 'list-waterfront-reset-route', userId: 'profile-maya', userName: 'Maya C.', body: 'This route feels calm without leaving downtown.', createdAt: '2026-06-05T12:00:00.000Z' },
  { id: 'comment-6', targetType: 'list' as const, targetId: 'list-first-toronto-weekend', userId: 'profile-natalie', userName: 'Natalie R.', body: 'Good first-weekend mix, especially for visitors.', createdAt: '2026-06-06T12:00:00.000Z' },
  { id: 'comment-7', targetType: 'list' as const, targetId: 'list-art-wandering-day', userId: 'profile-natalie', userName: 'Natalie R.', body: 'AGO into Kensington works better than expected.', createdAt: '2026-06-07T12:00:00.000Z' },
  { id: 'comment-8', targetType: 'spark' as const, targetId: 'spark-balzacs-distillery', userId: 'profile-evan', userName: 'Evan L.', body: 'A winter walk stop for sure.', createdAt: '2026-06-08T12:00:00.000Z' }
];

export const sampleComments: Comment[] = rawComments.map((comment) => ({
  ...comment,
  userInitials: initialsForName(comment.userName)
}));
