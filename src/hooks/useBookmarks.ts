import { useCallback, useEffect, useState } from 'react';
import { bookmarkService } from '../services/bookmarkService';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setBookmarks(await bookmarkService.fetchBookmarks());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load bookmarks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function toggleBookmark(sparkId: string) {
    let previous: string[] = [];
    setBookmarks((current) => {
      previous = current;
      return current.includes(sparkId) ? current.filter((id) => id !== sparkId) : [...current, sparkId];
    });
    try {
      setBookmarks(await bookmarkService.toggleBookmark(sparkId));
      setError(null);
    } catch (err) {
      setBookmarks(previous);
      setError(err instanceof Error ? err.message : 'Unable to update bookmark');
    }
  }

  return { bookmarks, toggleBookmark, refresh, loading, error };
}
