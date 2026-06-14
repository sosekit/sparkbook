import { sampleComments } from '../data/sampleComments';
import { Comment, CommentTargetType } from '../types/comment';
import { localStore } from '../utils/storage';
import { dataClient } from './dataClient';

export const commentService = {
  async fetchComments(targetType: CommentTargetType, targetId: string) {
    if (dataClient.isSupabase && dataClient.supabase) {
      const { data, error } = await dataClient.supabase
        .from('comments')
        .select('*')
        .eq('target_type', targetType)
        .eq('target_id', targetId)
        .is('deleted_at', null)
        .order('created_at', { ascending: true });
      if (!error && data) return data.map(fromSupabaseComment);
    }
    const comments = await localStore.loadComments(sampleComments);
    return comments
      .filter((comment) => !comment.deletedAt && comment.targetType === targetType && comment.targetId === targetId)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  },

  async addComment(input: Pick<Comment, 'targetType' | 'targetId' | 'body'>) {
    const body = input.body.trim();
    if (!body) throw new Error('Comment cannot be empty');
    const comments = await localStore.loadComments(sampleComments);
    const now = new Date().toISOString();
    const comment: Comment = {
      id: `comment-${Date.now()}`,
      targetType: input.targetType,
      targetId: input.targetId,
      userId: 'profile-ray',
      userName: 'Raymond Zhang',
      userInitials: 'RZ',
      body,
      createdAt: now,
      updatedAt: now
    };
    await localStore.saveComments([...comments, comment]);
    if (dataClient.isSupabase && dataClient.supabase) {
      await dataClient.supabase.from('comments').insert(toSupabaseComment(comment));
    }
    return comment;
  }
};

function fromSupabaseComment(row: any): Comment {
  return {
    id: row.id,
    targetType: row.target_type,
    targetId: row.target_id,
    userId: row.user_id,
    userName: row.user_name || 'Sparkbook user',
    userInitials: row.user_initials || 'SU',
    body: row.body,
    createdAt: row.created_at,
    updatedAt: row.updated_at || undefined,
    deletedAt: row.deleted_at || undefined
  };
}

function toSupabaseComment(comment: Comment) {
  return {
    id: comment.id,
    target_type: comment.targetType,
    target_id: comment.targetId,
    user_id: comment.userId,
    user_name: comment.userName,
    user_initials: comment.userInitials,
    body: comment.body,
    created_at: comment.createdAt,
    updated_at: comment.updatedAt,
    deleted_at: comment.deletedAt
  };
}
