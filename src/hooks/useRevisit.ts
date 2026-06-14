import { useCallback, useEffect, useState } from 'react';
import { revisitService } from '../services/revisitService';
import { RevisitEvent } from '../types/spark';

export function useRevisit(sparkId?: string) {
  const [events, setEvents] = useState<RevisitEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const next = await revisitService.fetchRevisitEvents(sparkId);
    setEvents(next.sort((a, b) => b.visitedAt.localeCompare(a.visitedAt)));
    setLoading(false);
  }, [sparkId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function markRevisited(note?: string) {
    if (!sparkId) return null;
    const spark = await revisitService.markRevisited(sparkId, note);
    await refresh();
    return spark;
  }

  return { events, loading, refresh, markRevisited };
}
