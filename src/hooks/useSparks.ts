import { useCallback, useEffect, useState } from 'react';
import { sparkService } from '../services/sparkService';
import { Spark } from '../types/spark';

export function useSparks() {
  const [sparks, setSparks] = useState<Spark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const next = await sparkService.fetchFeedSparks();
      setSparks(next);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load sparks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    sparks,
    loading,
    error,
    refresh,
    setSparks,
    createSpark: sparkService.createSpark,
    updateSpark: sparkService.updateSpark,
    markRevisited: sparkService.markRevisited,
    fetchRevisitEvents: sparkService.fetchRevisitEvents,
    loadDraft: sparkService.loadDraft,
    saveDraft: sparkService.saveDraft,
    clearDraft: sparkService.clearDraft,
    softDeleteSpark: sparkService.softDeleteSpark,
    fetchNearbySparks: sparkService.fetchNearbySparks
  };
}
