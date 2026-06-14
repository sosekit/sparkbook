import { useCallback, useEffect, useState } from 'react';
import { commentService } from '../services/commentService';
import { Comment, CommentTargetType } from '../types/comment';

export function useComments(targetType: CommentTargetType, targetId?: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(Boolean(targetId));
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!targetId) {
      setComments([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setComments(await commentService.fetchComments(targetType, targetId));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load comments');
    } finally {
      setLoading(false);
    }
  }, [targetId, targetType]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function addComment(body: string) {
    if (!targetId) return null;
    const comment = await commentService.addComment({ targetType, targetId, body });
    setComments((current) => [...current, comment]);
    return comment;
  }

  return { comments, loading, error, refresh, addComment };
}
